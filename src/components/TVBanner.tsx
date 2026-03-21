import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Play, Sparkles, CheckCircle2 } from 'lucide-react';

const TV_CHANNELS = [
  {
    id: 'sports',
    name: 'DEPORTES EN VIVO',
    img: '/recursos/tv_sports.png',
    overlay: 'from-[#1A3A5C] via-[#1A3A5C]/90 to-transparent',
    accent: '#00D1FF'
  },
  {
    id: 'movie',
    name: 'CINE PREMIUM',
    img: '/recursos/tv_movie.png',
    overlay: 'from-[#1A3A5C] via-[#1A3A5C]/85 to-transparent',
    accent: '#FFD700'
  },
  {
    id: 'nature',
    name: 'VIDA SALVAJE 4K',
    img: '/recursos/tv_nature.png',
    overlay: 'from-[#1A3A5C] via-[#1A3A5C]/85 to-transparent',
    accent: '#22c55e'
  }
];

const TVBanner: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TV_CHANNELS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentChannel = TV_CHANNELS[activeIdx];

  return (
    <section id="tv" className="relative min-h-[600px] flex items-center overflow-hidden bg-brand-dark">
      
      {/* CAPA 1: FONDO CINEMÁTICO (Zapping Inmersivo) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChannel.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={currentChannel.img} 
              alt={currentChannel.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay de Brillo Dinámico Atmosférico */}
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1A3A5C_100%)] opacity-40`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CAPA 2: GRADIENTE DE LEGIBILIDAD (Sombra Ejecutiva) */}
      <div className={`absolute inset-0 z-10 bg-gradient-to-r ${currentChannel.overlay}`} />

      {/* CAPA 3: CONTENIDO (Texto e Interacción) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="lg:w-3/5 text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-2xl mb-8"
            >
              <Sparkles size={16} className="text-[#00D1FF]" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-[0.3em] uppercase text-[#00D1FF]">Rapilink Experience</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={currentChannel.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-[9px] font-bold text-gray-300 tracking-widest uppercase mt-0.5"
                  >
                    Estás viendo: {currentChannel.name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tighter"
            >
              Lleva la TV <br />
              <span className="text-[#00D1FF] drop-shadow-[0_0_20px_rgba(0,209,255,0.4)]">
                a otro nivel
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed max-w-xl opacity-90 drop-shadow-lg"
            >
              Más de 90 canales con calidad HD real, acceso a tus deportes favoritos y programación exclusiva. Todo integrado en la mejor red de fibra óptica.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
            >
              {[
                "90+ Canales HD",
                "Deportes en Vivo",
                "Estrenos 24/7"
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <CheckCircle2 size={18} className="text-[#00D1FF]" />
                  <span className="text-sm font-black text-white tracking-wide">{item}</span>
                </div>
              ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href={`https://wa.me/573008255091?text=${encodeURIComponent('Hola Rapilink, deseo contratar el servicio de Internet y Televisión.')}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="group flex items-center justify-between w-full sm:w-80 px-10 py-6 bg-[#00D1FF] hover:bg-white text-[#1A3A5C] rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all transform hover:scale-[1.03] shadow-[0_25px_50px_-15px_rgba(0,209,255,0.4)]"
              >
                <span>CONTRATAR AHORA</span>
                <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-colors">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
              </a>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center">
             {/* Badge flotante elegante - Punto 3 MANTENGO PERO ELEVO */}
             <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-[3rem] shadow-2xl relative group"
            >
              {/* Resplandor decorativo */}
              <div className={`absolute -inset-2 bg-[#00D1FF]/20 blur-xl rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="p-6 bg-[#00D1FF]/20 rounded-3xl">
                  <Tv className="text-[#00D1FF]" size={48} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[11px] font-black text-[#00D1FF] uppercase tracking-[0.3em] mb-2">Tecnología</div>
                  <div className="text-4xl font-black text-white leading-none tracking-tighter">HD</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                    <span className="w-8 h-[1px] bg-gray-600" />
                    Experiencia Premium
                    <span className="w-8 h-[1px] bg-gray-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Indicadores de Canal Minimalistas */}
      <div className="absolute bottom-10 right-10 z-30 flex items-center space-x-3">
        {TV_CHANNELS.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 transition-all duration-500 rounded-full ${i === activeIdx ? 'w-8 bg-[#00D1FF]' : 'w-2 bg-white/20'}`} 
          />
        ))}
      </div>
    </section>
  );
};

export default TVBanner;
