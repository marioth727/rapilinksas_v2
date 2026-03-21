import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, CheckCircle2, MessageCircle, Navigation, ArrowRight } from 'lucide-react';
import { BarriosRapilink, Barrio } from '../data/barrios';
import { motion, AnimatePresence } from 'framer-motion';

const CoberturaSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [match, setMatch] = useState<Barrio | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar sugerencias (máximo 5)
  const suggestions = query.length > 1 && !match
    ? BarriosRapilink.filter(b => 
        b.nombre.toLowerCase().includes(query.toLowerCase()) && 
        b.nombre.toLowerCase() !== query.toLowerCase()
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const found = BarriosRapilink.find(
      b => b.nombre.toLowerCase() === query.trim().toLowerCase()
    );
    setMatch(found || null);
    if (found) setShowSuggestions(false);
  }, [query]);

  const handleSelect = (barrio: string) => {
    setQuery(barrio);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sector = match?.nombre || query;
    if (!sector.trim()) return;

    const message = encodeURIComponent(`Hola Rapilink, he verificado que hay viabilidad en ${sector}. ¡Me gustaría contratar fibra óptica!`);
    window.open(`https://wa.me/573008255091?text=${message}`, '_blank');
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section id="cobertura" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`
            relative bg-brand-dark rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl transition-all duration-700
            ${match ? 'shadow-emerald-500/10 border-4 border-emerald-500/30' : 'border border-white/5'}
          `}
          ref={dropdownRef}
        >
          {/* Decoración dinámica */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <AnimatePresence>
            {match && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-emerald-500/5 blur-3xl animate-pulse"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className={`
              inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border transition-all
              ${match ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-brand-tech border-white/5'}
            `}>
              <Navigation size={14} />
              <span>{match ? 'Viabilidad Confirmada' : 'Cerca de ti'}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight italic">
              {match ? (
                <>¡Llegamos a <span className="text-emerald-400">{match.nombre}!</span></>
              ) : (
                <>¿Llegamos a tu <span className="text-brand-tech">barrio?</span></>
              )}
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Consulta disponibilidad de nuestra de Fibra Óptica simétrica 
              en <span className="text-white font-bold italic underline decoration-brand-tech underline-offset-8">Soledad.</span>
            </p>

            <div className="max-w-xl mx-auto relative mb-10">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-20">
                <div className="relative flex-grow group">
                  <MapPin className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all ${match ? 'text-emerald-400 scale-110' : 'text-brand-tech'}`} size={20} />
                  <input
                    type="text"
                    placeholder="Escribe tu barrio aquí..."
                    value={query}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className={`
                      w-full bg-white/10 text-white border rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:bg-white/15 transition-all placeholder:text-gray-500 font-black text-lg
                      ${match ? 'border-emerald-500/50 ring-emerald-500/20' : 'border-white/10 focus:ring-brand-tech/20'}
                    `}
                  />
                  {match && (
                    <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 animate-bounce" size={24} />
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className={`
                    flex items-center justify-center space-x-3 whitespace-nowrap px-10 py-5 rounded-2xl font-black transition-all shadow-xl text-sm uppercase tracking-widest group
                    ${match 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600 scale-105' 
                      : 'bg-brand-tech text-brand-dark shadow-brand-tech/10 hover:bg-brand-blue hover:text-white'
                    }
                  `}
                >
                  <span>{match ? 'Solicitar Ahora' : 'Consultar'}</span>
                  {match ? <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" /> : <Search size={18} />}
                </button>
              </form>

              {/* Sugerencias Dropdown Home */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute left-0 right-0 mt-2 bg-brand-charcoal border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-30 flex flex-col items-stretch"
                  >
                    {suggestions.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(b.nombre)}
                        className="px-6 py-4 text-left hover:bg-brand-blue text-gray-300 hover:text-white flex items-center space-x-3 transition-colors group"
                      >
                        <MapPin size={14} className="group-hover:text-brand-tech" />
                        <span className="font-bold">{b.nombre}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {['Fibra 100% Simétrica'].map((text, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest px-4 py-2 border border-white/5 rounded-lg bg-white/5">
                  <CheckCircle2 size={14} className="text-brand-tech" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoberturaSearch;
