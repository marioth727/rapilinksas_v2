import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, Send, MicOff, RefreshCw, Volume2, CheckCircle2 } from 'lucide-react';
import { useGeminiLive } from '../lib/useGeminiLive';

export const GeminiLiveWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isConnected,
    isVoiceActive,
    connect,
    disconnect,
    toggleVoice,
    sendTextMessage,
    sendTurnComplete,
    clearChat
  } = useGeminiLive();

  // Scroll to bottom on default
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Connect is now handled by the user toggling the Voice button.
  // We don't auto-connect the WebSocket on chat open anymore.
  // Instead, the user talks via text (REST) by default, and switches to Live if they click the mic.
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendTextMessage(inputText);
    setInputText("");
  };

  const widgetVariants: any = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-brand-action text-white shadow-xl flex items-center justify-center hover:bg-brand-hover transition-colors focus:outline-none"
          >
            <MessageCircle size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[550px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-brand-dark p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-action flex items-center justify-center">
                  <span className="font-bold font-display text-sm">R</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Soporte Rapilink</h3>
                  <div className="flex items-center text-xs text-gray-300">
                    <span className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                    {isConnected ? 'Live Voice' : 'Asistente Chat'}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 items-center">
                <button
                  type="button"
                  onClick={toggleVoice}
                  title={isVoiceActive ? "Desactivar Voz" : "Hablar por voz (Live)"}
                  className={`p-1.5 rounded-full text-white transition-all mr-1 ${
                    isVoiceActive ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'hover:bg-white/10'
                  }`}
                >
                  {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <div className="w-px h-4 bg-gray-500/50 mx-1"></div>
                <button 
                  onClick={clearChat} 
                  title="Nueva Conversación"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-brand-light flex flex-col space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10 text-sm">
                  Hola, soy el asistente de Rapilink. ¿En qué te puedo ayudar hoy con tu conexión de internet?
                </div>
              )}
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                      ${msg.role === 'user' 
                        ? 'bg-brand-action text-white rounded-br-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 border-b-2 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Panel de voz activa — Gemini 3.1 detecta silencio automáticamente (VAD) */}
              {isVoiceActive && (
                  <div className="flex justify-center items-center gap-3 py-3 px-4 bg-brand-action/10 rounded-2xl border border-brand-action/20">
                    <div className="flex items-end gap-0.5 h-5">
                      {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-brand-action rounded-full"
                          animate={{ height: ['4px', '18px', '4px'] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-brand-action font-medium">
                      Escuchando... habla ahora
                    </span>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <form onSubmit={handleSendText} className="flex relative items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Mensaje de texto..."
                  className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-action/50 focus:border-brand-action text-sm"
                />
                
                {inputText.length > 0 && (
                  <button 
                    type="submit"
                    className="p-2.5 bg-brand-action text-white rounded-full hover:bg-brand-hover transition-colors shrink-0"
                  >
                    <Send size={18} />
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
