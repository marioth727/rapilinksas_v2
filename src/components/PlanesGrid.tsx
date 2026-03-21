import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  Wifi, 
  Globe, 
  Tv, 
  ShieldCheck, 
  PlayCircle,
  PlusCircle,
  Zap
} from 'lucide-react';

interface Plan {
  nombre: string;
  velocidad: string;
  precio: string;
  popular: boolean;
  beneficios: {
    texto: string;
    icon: React.ElementType;
  }[];
}

const planes: Plan[] = [
  { 
    nombre: "HOGAR", 
    velocidad: "100MB", 
    precio: "69.900", 
    popular: false, 
    beneficios: [
      { texto: "Televisión Incluida", icon: Tv },
      { texto: "Descarga ilimitada", icon: Gauge },
      { texto: "Router Wifi", icon: Wifi },
      { texto: "Ideal p/ Navegación y RRSS", icon: Globe }
    ] 
  },
  { 
    nombre: "FAMILIA", 
    velocidad: "200MB", 
    precio: "89.900", 
    popular: true, 
    beneficios: [
      { texto: "Televisión Incluida", icon: Tv },
      { texto: "Descarga ilimitada", icon: Gauge },
      { texto: "Router Wifi", icon: Wifi },
      { texto: "Ideal para Streaming HD", icon: PlayCircle }
    ] 
  },
  { 
    nombre: "ULTRA", 
    velocidad: "500MB", 
    precio: "159.900", 
    popular: false, 
    beneficios: [
      { texto: "Televisión Incluida", icon: Tv },
      { texto: "Descarga ilimitada", icon: Gauge },
      { texto: "Wi-Fi 6", icon: Wifi },
      { texto: "Ideal para Gaming 4K", icon: Zap }
    ] 
  },
  { 
    nombre: "ELITE", 
    velocidad: "700MB", 
    precio: "199.900", 
    popular: false, 
    beneficios: [
      { texto: "Televisión Incluida", icon: Tv },
      { texto: "Descarga ilimitada", icon: Gauge },
      { texto: "Wi-Fi 6", icon: Wifi },
      { texto: "Máxima Velocidad Multi-dispositivo", icon: Zap }
    ] 
  },
];




const PlanesGrid: React.FC = () => {
  return (
    <section id="internet-hogar" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A3A5C] mb-3 tracking-tight">
            Planes diseñados para tu vida
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            Sin letras pequeñas, solo velocidad real.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className={`relative p-8 rounded-[1.5rem] shadow-sm transition-all duration-300 min-h-[480px] flex flex-col ${
                plan.popular 
                ? 'bg-[#1A3A5C] text-white ring-4 ring-[#0066CC]/10 md:scale-105 z-10 shadow-2xl' 
                : 'bg-[#F8FAFC] border border-gray-100 text-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066CC] text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  MÁS POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-black tracking-tight mb-1 ${plan.popular ? 'text-white' : 'text-[#1A3A5C]'}`}>
                  {plan.nombre}
                </h3>
                <div className={`text-lg font-bold mb-4 opacity-80 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.velocidad}
                </div>
                
                <div className="flex items-baseline justify-center">
                  <span className={`text-3xl font-extrabold ${plan.popular ? 'text-white' : 'text-brand-dark'}`}>
                    ${plan.precio}
                  </span>
                  <span className={`ml-1 text-xs font-medium ${plan.popular ? 'text-[#00B4D8]' : 'text-gray-400'}`}>
                    /mes
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-10">
                  {plan.beneficios.map((beneficio, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <div className={`p-1.5 rounded-lg ${plan.popular ? 'bg-white/5' : 'bg-gray-200/50'}`}>
                        <beneficio.icon size={16} className={plan.popular ? 'text-[#00B4D8]' : 'text-[#0066CC]'} />
                      </div>
                      <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                        {beneficio.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/573008255091?text=${encodeURIComponent(`Hola Rapilink, deseo contratar el Plan ${plan.nombre} de ${plan.velocidad}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all duration-300 text-center block ${
                  plan.popular 
                  ? 'bg-brand-blue text-white hover:bg-brand-tech hover:text-brand-dark shadow-lg shadow-brand-blue/20 hover:shadow-brand-tech/30 transform hover:-translate-y-0.5' 
                  : 'bg-gray-100 text-brand-dark hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/20 transform hover:-translate-y-0.5'
                }`}
              >
                {plan.popular ? 'Solicitar Ahora' : 'Solicitar'}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanesGrid;

