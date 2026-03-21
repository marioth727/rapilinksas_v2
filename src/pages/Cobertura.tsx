import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, CheckCircle2, Navigation, MessageCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { BarriosRapilink, Barrio } from '../data/barrios';

const Cobertura: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedBarrio, setMatchedBarrio] = useState<Barrio | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar sugerencias
  const suggestions = searchTerm.length > 1 
    ? BarriosRapilink.filter(b => 
        b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && 
        b.nombre.toLowerCase() !== searchTerm.toLowerCase()
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const match = BarriosRapilink.find(
      b => b.nombre.toLowerCase() === searchTerm.trim().toLowerCase()
    );
    setMatchedBarrio(match || null);
    if (match) setShowSuggestions(false);
  }, [searchTerm]);

  const handleSelect = (barrio: string) => {
    setSearchTerm(barrio);
    setShowSuggestions(false);
  };

  const handleContact = () => {
    const barrio = matchedBarrio?.nombre || searchTerm;
    const message = encodeURIComponent(`Hola Rapilink, he verificado que hay viabilidad en ${barrio}. ¡Me gustaría contratar fibra óptica!`);
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
    <Layout>
      <section className="pt-32 pb-24 bg-brand-light min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-brand-blue/10">
              <Navigation size={14} />
              <span>Verificar disponibilidad de red</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-brand-dark mb-6 leading-tight">
              ¿Llegamos a tu <span className="text-brand-blue italic">barrio?</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Escribe el nombre de tu sector debajo. Nuestro sistema te confirmará si ya contamos con fibra óptica en tu zona.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto relative px-4" ref={dropdownRef}>
            
            {/* Input de Búsqueda */}
            <motion.div
              animate={{
                borderColor: matchedBarrio ? '#10B981' : '#E5E7EB',
                scale: matchedBarrio ? 1.02 : 1
              }}
              className="bg-white p-2 rounded-[2rem] shadow-2xl transition-all border-4 flex items-center relative z-20"
            >
              <div className="flex-1 w-full px-6 flex items-center space-x-4">
                <Search className={matchedBarrio ? 'text-emerald-500' : 'text-brand-blue'} size={24} />
                <input 
                  type="text"
                  placeholder="Ej: Villa Adela..."
                  className="w-full py-5 text-xl text-brand-dark font-bold outline-none placeholder:text-gray-300"
                  value={searchTerm}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                />
              </div>
            </motion.div>

            {/* Listado de Sugerencias (Dropdown Pro) */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30 mx-4"
                >
                  {suggestions.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(b.nombre)}
                      className="w-full px-6 py-4 text-left hover:bg-brand-light flex items-center space-x-3 group transition-colors"
                    >
                      <MapPin size={16} className="text-gray-400 group-hover:text-brand-blue" />
                      <span className="font-bold text-brand-dark">{b.nombre}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Panel de Resultado Dinámico */}
            <AnimatePresence mode="wait">
              {matchedBarrio ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-10 text-center shadow-lg"
                >
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                    <CheckCircle2 color="white" size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-emerald-700 mb-2 italic">¡SÍ HAY VIABILIDAD!</h2>
                  <p className="text-emerald-600/80 font-bold mb-8 text-lg uppercase tracking-widest underline decoration-emerald-500 decoration-3 underline-offset-8">
                    {matchedBarrio.nombre}
                  </p>
                  
                  <button 
                    onClick={handleContact}
                    className="w-full md:w-auto px-12 py-6 bg-brand-dark text-white rounded-[1.8rem] font-bold text-lg uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl flex items-center justify-center mx-auto space-x-3 group"
                  >
                    <MessageCircle size={24} />
                    <span>Contactar ahora</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              ) : searchTerm.length > 3 && !showSuggestions ? (
                <motion.div
                  key="notfound"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 bg-white/50 border border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center"
                >
                  <AlertCircle size={40} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg italic">
                    Estamos trabajando para llegar a <b>{searchTerm}</b>. 
                    <br />¿Quieres que verifiquemos un punto cercano manualmente?
                  </p>
                  <button 
                    onClick={handleContact}
                    className="mt-8 px-8 py-4 border-2 border-brand-dark text-brand-dark rounded-xl font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all"
                  >
                    Consultar con un asesor
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default Cobertura;
