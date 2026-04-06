import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioRecorder } from './audioRecorder';
import { AudioPlayer } from './audioPlayer';
import { WISPHUB_TOOLS, ejecutarFuncionGemini } from './wispHubFunctions';

// @ts-ignore
import systemPromptText from '../../directivas/system_prompt_rapilink.md?raw';

export type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export function useGeminiLive() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTextLoading, setIsTextLoading] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const isVoiceActiveRef = useRef(false);
  const onConnectedCallbackRef = useRef<(() => void) | null>(null);
  const sessionHandleRef = useRef<string | null>(
    localStorage.getItem('gemini_session_handle')
  );
  const intentionalDisconnectRef = useRef(false); // Evitar auto-reconexión en cierre manual

  // Hidratar historial
  useEffect(() => {
    const saved = localStorage.getItem('gemini_chat_messages');
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // Guardar historial a cada cambio
  useEffect(() => {
    localStorage.setItem('gemini_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // ------------------------------------------------------------------
  // AUDIO PLAYER
  // ------------------------------------------------------------------
  const getOrCreatePlayer = useCallback((): AudioPlayer => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
    }
    return audioPlayerRef.current;
  }, []);

  // ------------------------------------------------------------------
  // FUNCTION CALLING - Responder a toolCall del WS de Gemini Live
  // ------------------------------------------------------------------
  const handleToolCall = useCallback(async (ws: WebSocket, toolCall: any) => {
    const functionCalls = toolCall.functionCalls ?? [];
    const responses: any[] = [];

    for (const fc of functionCalls) {
      console.log('[FC] Función llamada por Gemini:', fc.name, fc.args);
      const result = await ejecutarFuncionGemini(fc.name, fc.args ?? {});
      responses.push({
        id: fc.id,
        name: fc.name,
        response: { output: result },
      });
    }

    // Enviar respuestas al WebSocket de Gemini
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        toolResponse: { functionResponses: responses }
      }));
      console.log('[FC] Respuestas enviadas a Gemini:', responses);
    }
  }, []);

  // ------------------------------------------------------------------
  // WEBSOCKET
  // ------------------------------------------------------------------
  const connect = useCallback(async (afterConnectFn?: () => void) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("LA API KEY NO FUE CARGADA. Reinicia npm run dev.");
      return;
    }

    if (afterConnectFn) {
      onConnectedCallbackRef.current = afterConnectFn;
    }

    const sysPrompt = systemPromptText || "Eres un asistente virtual de Rapilink.";
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onerror = (error) => {
      console.error("[WS ERROR]", error);
    };

    ws.onopen = () => {
      console.log("[WS] Conectado, enviando setup...");
      intentionalDisconnectRef.current = false;
      setIsConnected(true);

      const setupPayload: any = {
        setup: {
          model: 'models/gemini-3.1-flash-live-preview',
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Puck"
                }
              }
            }
          },
          systemInstruction: {
            parts: [{ text: sysPrompt }]
          },
          // Declarar herramientas de WispHub para Function Calling
          tools: WISPHUB_TOOLS,
        }
      };

      // Si tenemos un handle de sesión previo, intentar reanudar
      if (sessionHandleRef.current) {
        console.log("[WS] Reanudando sesión con handle:", sessionHandleRef.current.slice(0, 8) + '...');
        setupPayload.setup.sessionResumption = { handle: sessionHandleRef.current };
      }

      ws.send(JSON.stringify(setupPayload));

      // Fallback: si setupComplete no llega en 2s, arrancamos igualmente
      const fallbackTimer = setTimeout(() => {
        const cb = onConnectedCallbackRef.current;
        if (cb) {
          console.log("[WS] Timeout fallback: arrancando sin setupComplete...");
          onConnectedCallbackRef.current = null;
          cb();
        }
      }, 2000);

      (ws as any).__setupTimer = fallbackTimer;
    };

    ws.onmessage = async (event) => {
      let text: string;

      if (typeof event.data === 'string') {
        text = event.data;
      } else if (event.data instanceof Blob) {
        text = await event.data.text();
        console.log("[WS RECV] Dato recibido como Blob, convertido a texto");
      } else {
        console.warn("[WS RECV] Tipo de dato desconocido:", typeof event.data);
        return;
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('[WS] Error parseando JSON. Raw:', text.slice(0, 200));
        return;
      }

      console.log("[WS RECV]", JSON.stringify(data).slice(0, 400));

      // Setup confirmado por el servidor
      if (data.setupComplete !== undefined) {
        console.log("[WS] Setup confirmado explícitamente.");
        clearTimeout((ws as any).__setupTimer);
        const cb = onConnectedCallbackRef.current;
        onConnectedCallbackRef.current = null;
        cb?.();
        return;
      }

      // ─── FUNCTION CALLING (voz) ────────────────────────────────
      if (data.toolCall) {
        console.log("[WS] toolCall recibido:", JSON.stringify(data.toolCall).slice(0, 300));
        await handleToolCall(ws, data.toolCall);
        return;
      }

      // Audio / texto del modelo
      if (data.serverContent) {
        const sc = data.serverContent;

        if (sc.modelTurn?.parts) {
          for (const part of sc.modelTurn.parts) {
            if (part.text) {
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'model') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + part.text }];
                }
                return [...prev, { id: crypto.randomUUID(), role: 'model', text: part.text }];
              });
            }

            if (part.inlineData?.data) {
              console.log("[WS] Audio recibido:", part.inlineData.mimeType);
              getOrCreatePlayer().playBase64(part.inlineData.data).catch(console.error);
            }
          }
        }

        if (sc.inlineData?.data) {
          console.log("[WS] Audio en serverContent.inlineData");
          getOrCreatePlayer().playBase64(sc.inlineData.data).catch(console.error);
        }

        // Guardar handle de sesión
        if (data.sessionResumptionUpdate?.newHandle) {
          const handle = data.sessionResumptionUpdate.newHandle;
          sessionHandleRef.current = handle;
          localStorage.setItem('gemini_session_handle', handle);
        }
      }
    };

    ws.onclose = (event) => {
      console.warn("[WS] Desconectado. Código:", event.code, "Razón:", event.reason);
      setIsConnected(false);
      if (isVoiceActiveRef.current) {
        audioRecorderRef.current?.stop();
        audioRecorderRef.current = null;
        setIsVoiceActive(false);
        isVoiceActiveRef.current = false;
      }

      const unexpectedCodes = [1006, 1011, 1012, 1013, 1014];
      if (!intentionalDisconnectRef.current && unexpectedCodes.includes(event.code)) {
        console.log("[WS] Drop inesperado. Reconectando en 2s...");
        setTimeout(() => {
          connect(isVoiceActiveRef.current ? startVoice : undefined);
        }, 2000);
      }
    };
  }, [getOrCreatePlayer, handleToolCall]);

  const disconnect = useCallback(() => {
    intentionalDisconnectRef.current = true;
    wsRef.current?.close(1000, 'user_disconnect');
    wsRef.current = null;
  }, []);

  // ------------------------------------------------------------------
  // SEÑAL turn complete
  // ------------------------------------------------------------------
  const sendTurnComplete = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] Enviando turnComplete...");
      wsRef.current.send(JSON.stringify({
        clientContent: { turnComplete: true }
      }));
    }
  }, []);

  // ------------------------------------------------------------------
  // VOZ
  // ------------------------------------------------------------------
  const startVoice = useCallback(async () => {
    console.log("[VOICE] Iniciando micrófono...");

    audioRecorderRef.current = new AudioRecorder((base64: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            audio: {
              data: base64,
              mimeType: "audio/pcm;rate=16000"
            }
          }
        }));
      }
    });

    try {
      await audioRecorderRef.current.start();
      setIsVoiceActive(true);
      isVoiceActiveRef.current = true;
      console.log("[VOICE] Micrófono activo.");
    } catch (e) {
      console.error("[VOICE] No se pudo iniciar el micrófono:", e);
    }
  }, []);

  const stopVoice = useCallback(() => {
    audioRecorderRef.current?.stop();
    audioRecorderRef.current = null;
    audioPlayerRef.current?.stop();
    setIsVoiceActive(false);
    isVoiceActiveRef.current = false;
    console.log("[VOICE] Detenido.");
  }, []);

  // ------------------------------------------------------------------
  // TOGGLE — se llama en el click del usuario
  // ------------------------------------------------------------------
  const toggleVoice = useCallback(() => {
    if (isVoiceActiveRef.current) {
      sendTurnComplete();
      stopVoice();
      disconnect();
    } else {
      const player = getOrCreatePlayer();
      player.initialize().catch(console.error);
      connect(startVoice);
    }
  }, [connect, startVoice, stopVoice, disconnect, getOrCreatePlayer, sendTurnComplete]);

  // ------------------------------------------------------------------
  // CHAT DE TEXTO (REST con gemini-2.0-flash-lite + Function Calling)
  // ------------------------------------------------------------------
  const sendRESTMessage = useCallback(async (text: string, history: Message[]) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return;

    const sysPrompt = systemPromptText || "Eres un asistente virtual de Rapilink.";
    
    // Construir historial para la API
    const buildContents = (msgs: Message[], userText: string) => {
      const contents = msgs.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: userText }] });
      return contents;
    };

    let contents = buildContents(history, text);
    setIsTextLoading(true);

    try {
      // Ciclo para manejar múltiples rondas de Function Calling
      let maxIterations = 5;
      while (maxIterations-- > 0) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,

          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: sysPrompt }] },
              tools: WISPHUB_TOOLS,
            })
          }
        );

        const data = await res.json();

        // Manejo de errores HTTP (429, 500, etc.) — fetch NO lanza excepciones para estos
        if (!res.ok) {
          const errMsg = res.status === 429
            ? 'Estoy recibiendo muchas consultas a la vez. ¡Dame 10 segundos y vuelve a intentarlo! 🙏'
            : `Error del servidor (${res.status}). Por favor intenta de nuevo.`;
          setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: errMsg }]);
          break;
        }

        const candidate = data.candidates?.[0];
        if (!candidate) break;

        const parts = candidate.content?.parts ?? [];
        const functionCallParts = parts.filter((p: any) => p.functionCall);
        const textParts = parts.filter((p: any) => p.text);

        // Si hay function calls, ejecutarlas y continuar el ciclo
        if (functionCallParts.length > 0) {
          // Agregar la respuesta del modelo con los function calls al historial
          contents.push({ role: 'model', parts });

          const functionResponses: any[] = [];
          for (const part of functionCallParts) {
            const fc = part.functionCall;
            console.log('[REST FC] Función llamada:', fc.name, fc.args);
            const result = await ejecutarFuncionGemini(fc.name, fc.args ?? {});
            functionResponses.push({
              functionResponse: {
                name: fc.name,
                response: { output: result }
              }
            });
          }

          // Agregar las respuestas al historial para continuar
          contents.push({ role: 'user', parts: functionResponses });
          continue; // Re-invocar la API con las respuestas
        }

        // Si hay texto, mostrar la respuesta final
        if (textParts.length > 0) {
          const modelText = textParts.map((p: any) => p.text ?? '').join('');
          setMessages(prev => [
            ...prev,
            { id: crypto.randomUUID(), role: 'model', text: modelText }
          ]);
        }
        break; // Salir del ciclo si no hay más function calls
      }
    } catch (e: any) {
      console.error("[REST] Error:", e);
      // Manejo de error 429: informar al usuario de forma amigable
      const status = e?.status || 0;
      const errMsg = status === 429
        ? 'Estoy recibiendo muchas consultas a la vez. ¡Dame 10 segundos y vuelve a intentarlo! 🙏'
        : 'Tuve un problema al conectarme. Por favor intenta de nuevo.';
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'model', text: errMsg }
      ]);
    } finally {
      setIsTextLoading(false);
    }
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    
    // Side effects should NEVER be inside setMessages updater.
    // Use the messages from the scope to send the request.
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ realtimeInput: { text } }));
    } else {
      sendRESTMessage(text, messages);
    }
    
    // Pure state update
    setMessages(prev => [...prev, userMsg]);
  }, [messages, sendRESTMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('gemini_chat_messages');
  }, []);

  return {
    messages,
    isConnected,
    isVoiceActive,
    isTextLoading,
    connect,
    disconnect,
    toggleVoice,
    sendTextMessage,
    sendTurnComplete,
    clearChat
  };
}
