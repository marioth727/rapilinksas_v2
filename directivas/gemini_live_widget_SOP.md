# Directiva: Implementación de Widget Gemini Live

## Objetivo
Implementar un widget de chat nativo (texto y voz bidireccional) en la esquina inferior derecha para la página web de Rapilink, integrando la API de Gemini Multimodal Live de forma directa desde el cliente React utilizando WebSockets y JavaScript puro para el manejo de audio.

## Entradas y Configuración
*   **API Key**: Variable de entorno `VITE_GEMINI_API_KEY` (debe agregarse al `.env`).
*   **Modelo**: `models/gemini-2.0-flash-exp` (modelo más actual enfocado a realtime multimodality).
*   **Prompt del Sistema (Instrucciones)**: Información detallada de Rapilink inyectada de forma estática en el `setup` del WebSocket inicial de Gemini.
*   **UI/UX**: Componente React interactivo utilizando la dependencia existente de TailwindCSS (colores `brand-dark`, `brand-action`) y empleando `framer-motion` para transiciones y estados (idle, listening, speaking).

## Lógica y Pasos Recomendados
1.  **Capa de IA y WebSocket (`src/lib/audioWorklet.ts` y `src/lib/geminiLive.ts`)**: 
    *   Gestionar la conexión WebSocket apuntando al endpoint interactivo: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`.
    *   Enviar un `setup` message al conectar con la key y el System Instruction.
2.  **Manejo del Audio Nivel Cliente**:
    *   Captura (In): Utilizar `navigator.mediaDevices.getUserMedia` para abrir el micrófono a 16kHz, capturar paquetes en formato PCM (int16), convertirlos a base64 y enviarlos a través del socket tipo `RealtimeInput`.
    *   Reproducción (Out): Leer el objeto devuelto `serverContent.modelTurn.parts` del socket, el cual contiene PCM en base64 de 24kHz. Utilizar un buffer gestionado para reproducir continuamente el Data del audio recibido usando el API Nativo de Web Audio de Javascript.
3.  **UI Component (`src/components/GeminiLiveWidget.tsx`)**:
    *   Botón circular o píldora flotante que funciona como toggle.
    *   Popover modal principal del chat con lista de mensajes de texto, scroll down.
    *   Sección inferior para entrada de texto tradicional y un botón dominante y dinámico para "Conectar Voz".
    *   Integrar lógicas de interrupción: Si el usuario presiona "Push to Talk" o interrumpe, enviar una señal de interrupción al socket.

## Restricciones y Casos Borde (Trampas Conocidas)
*   **Audio Queue Stuttering**: El websocket a veces devuelve muchos pedazos de PCM de forma acelerada, se requiere encadenar los buffers (`AudioBufferSourceNode`) de web audio según el tiempo `audioContext.currentTime` para evitar cortes robóticos u over-lapping.
*   **Exposición de API Key**: Aceptar la exposición en el entorno Frontend ya que es requerimiento explícito para el prototipo/App con "Javascript Puro", omitiendo la intermediación de backend.
*   **Sample Rate**: Gemini requiere explícitamente input raw PCM a 16kHz. Reproduce a 24kHz. Se debe forzar el Web Audio context a estos rates usando `{ sampleRate: 16000 }` en el input y decodificar el buffer a 24kHz.
