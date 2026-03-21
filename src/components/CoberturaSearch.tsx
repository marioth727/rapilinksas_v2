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
    <section id="cobertura" className="py-24 bg-brand-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tarjeta de Búsqueda Principal */}
        <div
          className={`
            relative bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border transition-all duration-500 z-20
            ${match ? 'border-green-500/30 shadow-green-500/10' : 'border-gray-100'}
          `}
          ref={dropdownRef}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Superior */}
            <div className={`
              inline-flex items-center space-x-2 px-5 py-2 rounded-full mb-8 font-bold text-xs uppercase tracking-widest transition-colors
              ${match ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-brand-blue'}
            `}>
              {match ? <CheckCircle2 size={14} /> : null}
              <span>{match ? 'Viabilidad Confirmada' : 'Cerca de ti'}</span>
            </div>

            {/* Título Principal */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark mb-6 tracking-tight">
              {match ? (
                <>¡Llegamos a <span className="text-green-600">{match.nombre}!</span></>
              ) : (
                <>¿Llegamos a tu <span className="text-brand-blue">barrio?</span></>
              )}
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Consulta disponibilidad de nuestra red de Fibra Óptica en Soledad.
            </p>

            {/* Formulario de Búsqueda */}
            <div className="max-w-2xl mx-auto relative mb-12">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50/50 p-2 border border-gray-200 rounded-2xl relative z-20 focus-within:ring-4 focus-within:ring-brand-blue/10 focus-within:border-brand-blue/30 transition-all">
                <div className="relative flex-grow w-full flex items-center px-4">
                  <MapPin className={`transition-colors ${match ? 'text-green-500' : 'text-gray-400'}`} size={22} />
                  <input
                    type="text"
                    placeholder="Escribe tu barrio aquí..."
                    value={query}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="w-full bg-transparent text-brand-dark py-4 pl-4 pr-4 focus:outline-none placeholder:text-gray-400 font-medium text-lg"
                  />
                  {match && (
                    <CheckCircle2 className="text-green-500 animate-pulse ml-2" size={24} />
                  )}
                </div>

                <button
                  type="submit"
                  className={`
                    w-full sm:w-auto flex items-center justify-center space-x-2 px-10 py-4 rounded-xl font-bold transition-all text-white shadow-lg
                    ${match
                      ? 'bg-green-600 shadow-green-600/20 hover:bg-green-700'
                      : 'bg-brand-blue shadow-brand-blue/20 hover:bg-blue-700'
                    }
                  `}
                >
                  <span>{match ? 'SOLICITAR AHORA' : 'CONSULTAR'}</span>
                </button>
              </form>

              {/* Sugerencias Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-30"
                  >
                    {suggestions.map((b, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelect(b.nombre);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-3 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <MapPin size={18} className="text-gray-400" />
                        <span className="font-semibold text-lg">{b.nombre}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pill Inferior */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-gray-100/80 px-5 py-2.5 rounded-full text-[11px] font-black tracking-widest text-gray-500 uppercase">
                <CheckCircle2 size={16} className="text-brand-blue" />
                <span>100% Fibra Óptica</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Inferior Adicional: Conectividad de Alto Nivel */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Texto */}
          <div className="bg-gray-50 rounded-[2rem] p-10 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">
              Conectividad de Alto Nivel
            </h3>
            <p className="text-gray-500 leading-relaxed text-lg">
              Nuestra infraestructura está diseñada para soportar el crecimiento digital de Soledad, brindando estabilidad sin precedentes para gaming, streaming y teletrabajo.
            </p>
          </div>

          {/* Imagen Servidores */}
          <div className="relative rounded-[2rem] overflow-hidden min-h-[250px] shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Infraestructura de Servidores"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-brand-dark/40 mix-blend-multiply"></div>

            {/* Pill Flotante en la imagen */}
            <div className="absolute bottom-6 left-6">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold text-brand-dark uppercase tracking-widest shadow-lg">
                Infraestructura Propia
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoberturaSearch;
