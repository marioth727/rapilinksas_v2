import React from 'react';
import { motion } from 'framer-motion';
import { Home, Tv, Building2, CheckCircle2 } from 'lucide-react';

const servicios = [
  {
    icon: <Home size={28} className="text-brand-dark" />,
    title: "Internet Residencial (FTTH)",
    desc: "Conexión de fibra hasta el hogar para streaming 4K, juegos en línea y teletrabajo sin interrupciones.",
    beneficios: ["Simetría disponible", "Sin límites de descarga"]
  },
  {
    icon: <Tv size={28} className="text-brand-dark" />,
    title: "Internet + TV (Combo)",
    desc: "El entretenimiento más completo con una amplia parrilla de canales digitales y la velocidad que necesitas.",
    beneficios: ["Canales HD incluidos", "Paquetes premium"]
  },
  {
    icon: <Building2 size={28} className="text-brand-dark" />,
    title: "Soluciones Corporativas",
    desc: "Servicios especializados para empresas con soporte prioritario y acuerdos de nivel de servicio (SLA).",
    beneficios: ["Canales Dedicados", "Monitorea 24/7"]
  }
];

const Diferenciadores: React.FC = () => {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left"
            >
              <div className="mb-8 w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                {servicio.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-4 leading-tight">
                {servicio.title}
              </h3>
              
              <p className="text-gray-500 mb-8 text-base leading-relaxed">
                {servicio.desc}
              </p>
              
              <ul className="space-y-4 mt-auto">
                {servicio.beneficios.map((beneficio, i) => (
                  <li key={i} className="flex items-center space-x-3 group">
                    <CheckCircle2 size={18} className="text-brand-dark opacity-100 group-hover:text-brand-action transition-colors" />
                    <span className="text-sm font-bold text-brand-dark/90 tracking-tight">
                      {beneficio}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diferenciadores;
