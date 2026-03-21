import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Cpu, BarChart3, Infinity as InfinityIcon, Users } from 'lucide-react';

const valores = [
  {
    icon: <Lightbulb className="text-[#0072CE]" size={28} />,
    titulo: "Innovación",
    descripcion: "Buscamos constantemente nuevas formas de mejorar tu experiencia digital."
  },
  {
    icon: <Cpu className="text-[#0072CE]" size={28} />,
    titulo: "Tecnología",
    descripcion: "Equipamiento de vanguardia para garantizar una conexión estable y veloz."
  },
  {
    icon: <BarChart3 className="text-[#0072CE]" size={28} />,
    titulo: "Escalabilidad",
    descripcion: "Soluciones que crecen al ritmo de tus necesidades y las de tu negocio."
  },
  {
    icon: <InfinityIcon className="text-[#0072CE]" size={28} />,
    titulo: "Convergencia",
    descripcion: "Integramos múltiples servicios en una sola red robusta y confiable."
  }
];

const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-24 bg-[#F8FBFF] overflow-hidden border-y border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Lado Texto */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 text-[#0072CE] mb-8 font-bold text-xs uppercase tracking-[0.25em]"
            >
              <Users size={16} />
              <span>Nuestra Propuesta de Valor</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#1A3A5C] mb-8 leading-[1.15] tracking-tight"
            >
              Impulsando el futuro <br />
              <span className="text-[#0072CE]">de tu conexión</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#1A1A2E] leading-relaxed mb-8 opacity-80"
            >
              RAPILINK SAS es una empresa de telecomunicaciones que apuesta a la tecnología para mejorar y simplificar la manera en que nuestros clientes interactúan y hacen negocios, con el fin de obtener Innovación Tecnológica, Escalabilidad y Convergencia.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-white border-l-4 border-[#0072CE] rounded-r-lg mb-10 shadow-sm"
            >
              <p className="text-[#1A1A2E] font-medium italic">
                "Desde nuestros inicios brindamos un excelente servicio con el fin de hacer sentir conforme al usuario final."
              </p>
            </motion.div>

            {/* Valores Integrados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {valores.map((valor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="flex items-start space-x-3"
                >
                  <div className="mt-1 flex-shrink-0">
                    {React.cloneElement(valor.icon as React.ReactElement<any>, { size: 18 })}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A3A5C] uppercase tracking-wider">{valor.titulo}</h4>
                    <p className="text-[11px] text-[#1A1A2E] leading-tight opacity-60 mt-1 uppercase font-medium">{valor.descripcion.split('.')[0]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lado Visual / Imagen Real */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <img 
                src="/recursos/rapilink_team.png" 
                alt="Equipo Rapilink - Soledad" 
                className="w-full h-auto rounded-lg shadow-inner grayscale-[30%] hover:grayscale-0 transition-all duration-700"
              />
              {/* Badge sutil */}
              <div className="absolute -bottom-6 -right-6 bg-[#1A3A5C] text-white px-8 py-5 rounded-lg shadow-xl hidden md:block border border-white/10">
                <div className="text-xl font-bold">100% Fibra</div>
                <div className="text-xs opacity-70 uppercase tracking-widest mt-1">Óptica Real</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
