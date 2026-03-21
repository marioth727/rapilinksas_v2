import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Headphones, Globe } from 'lucide-react';

const planesEmpresariales = [
  {
    nombre: "Empresarial",
    velocidad: "200MB",
    precio: "[PENDIENTE]",
    icon: <Building2 className="text-brand-action" size={32} />,
    beneficios: ["IP Fija Pública", "Fibra Óptica Simétrica", "Soporte Técnico 8x5", "Ideal para PYMES"]
  },
  {
    nombre: "Pro",
    velocidad: "500MB",
    precio: "[PENDIENTE]",
    icon: <ShieldCheck className="text-brand-action" size={32} />,
    popular: true,
    beneficios: ["IP Fija Pública", "Canal Dedicado", "SLA 92.6% Dispo.", "Soporte Prioritario 24/7"]
  },
  {
    nombre: "Corporativo",
    velocidad: "1000MB",
    precio: "[PENDIENTE]",
    icon: <Globe className="text-brand-action" size={32} />,
    beneficios: ["IP Fija Pública", "Canal Dedicado", "SLA Premium 99.9%", "Soporte Prioritario 24/7"]
  }
];

const PlanesEmpresariales: React.FC = () => {
  return (
    <section id="empresas" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">Soluciones para tu Empresa</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Potencia tu negocio con conectividad dedicada, soporte especializado y la red más robusta de la región.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planesEmpresariales.map((plan, index) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-10 rounded-brand border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-2xl ${plan.popular ? 'bg-brand-light ring-2 ring-brand-action' : 'bg-white'}`}
            >
              <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm">
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold text-brand-dark mb-2">{plan.nombre}</h3>
              <div className="text-4xl font-black text-brand-action mb-6">{plan.velocidad}</div>

              <ul className="space-y-4 mb-10 w-full">
                {plan.beneficios.map((b, i) => (
                  <li key={i} className="flex items-center justify-center text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-brand-action rounded-full mr-2" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-auto w-full">
                <a 
                  href={`https://wa.me/573008255091?text=${encodeURIComponent(`Hola Rapilink, deseo cotizar el Plan Empresarial ${plan.nombre} de ${plan.velocidad}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-charcoal transition-all shadow-lg block text-center uppercase tracking-widest text-xs"
                >
                  Cotizar Ahora
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanesEmpresariales;
