import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone, MessageCircle, ExternalLink } from 'lucide-react';

interface FAQ {
  q: string;
  a: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    q: "¿Cómo escoger el mejor plan de internet hogar?",
    a: (
      <div className="space-y-4">
        <p>El plan ideal depende de cuántos dispositivos se conectan al mismo tiempo y para qué los usas. Te orientamos así:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border font-bold">Plan</th>
                <th className="p-2 border font-bold">Velocidad</th>
                <th className="p-2 border font-bold">Precio</th>
                <th className="p-2 border font-bold">Ideal para</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border font-bold text-brand-dark">Hogar</td>
                <td className="p-2 border">100 Mbps</td>
                <td className="p-2 border">$69.900/mes</td>
                <td className="p-2 border text-xs">1 a 2 pers., uso básico (redes sociales, WhatsApp, correo)</td>
              </tr>
              <tr className="bg-brand-action/5">
                <td className="p-2 border font-bold text-brand-dark">Familia ⭐</td>
                <td className="p-2 border">200 Mbps</td>
                <td className="p-2 border">$89.900/mes</td>
                <td className="p-2 border text-xs">3 a 4 pers., streaming, videollamadas y trabajo remoto</td>
              </tr>
              <tr>
                <td className="p-2 border font-bold text-brand-dark">Ultra</td>
                <td className="p-2 border">500 Mbps</td>
                <td className="p-2 border">$159.900/mes</td>
                <td className="p-2 border text-xs">Múltiples disp., gaming y streaming en 4K</td>
              </tr>
              <tr>
                <td className="p-2 border font-bold text-brand-dark">Elite</td>
                <td className="p-2 border">700 Mbps</td>
                <td className="p-2 border">$199.900/mes</td>
                <td className="p-2 border text-xs">Máximo rendimiento, trabajadores exigentes y gamers</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs italic text-gray-500">⭐ Plan más recomendado para un hogar promedio</p>
        <div className="flex flex-col space-y-2 text-sm pt-2">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-brand-action" />
            <span>+57 300 912 1245</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className="text-[#25D366]" />
            <span>WhatsApp: +57 300 825 5091</span>
          </div>
        </div>
      </div>
    )
  },
  {
    q: "¿Cuántos canales de TV incluye?",
    a: (
      <div className="space-y-4">
        <p>Rapilink ofrece un paquete de <strong>más de 90 canales</strong> que incluye canales nacionales básicos, internacionales, HD, infantiles y deportivos.</p>
        <p>Para conocer la lista completa, contáctanos al +57 300 912 1245 o escríbenos por WhatsApp.</p>
      </div>
    )
  },
  {
    q: "¿Cuáles son los requisitos para solicitar el servicio?",
    a: (
      <div className="space-y-3">
        <p>Para instalar el servicio de Rapilink en tu hogar necesitas:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Cédula de ciudadanía</strong> vigente del titular del contrato</li>
          <li><strong>Recibo de servicios públicos</strong> del inmueble de instalación</li>
          <li><strong>Pago del costo de instalación</strong> ($50.000 COP, pagaderos en la visita técnica)</li>
        </ul>
        <p className="text-sm font-semibold text-brand-action">Instalación en 24 a 48 horas hábiles.</p>
      </div>
    )
  },
  {
    q: "¿Cuál es el tiempo de instalación?",
    a: "Una vez confirmada tu solicitud y verificada la cobertura, nuestro equipo técnico realiza la instalación en un plazo de 24 a 48 horas hábiles. Te notificaremos con anticipación el día y la hora exacta."
  },
  {
    q: "¿Cómo consulto mi factura?",
    a: (
      <div className="space-y-3">
        <p>Puedes consultar tu factura en cualquier momento desde nuestro portal de clientes:</p>
        <a
          href="http://clientes.rapilinksas.co/saldo/rapilinksas"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand-action font-bold hover:underline"
        >
          clientes.rapilinksas.co/saldo/rapilinksas
          <ExternalLink size={14} />
        </a>
        <p>También la enviamos a tu correo electrónico y por mensaje de texto.</p>
      </div>
    )
  },
  {
    q: "¿Cómo pago mi factura?",
    a: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Portal Cliente:</strong> Ingresa a www.rapilinksas.co y haz clic en "Pagar en línea"</li>
          <li><strong>Link de pago:</strong> Enviado directamente a tu correo o WhatsApp</li>
          <li><strong>Efecty:</strong> Convenio 112578 a nivel nacional</li>
        </ul>
      </div>
    )
  },
  {
    q: "¿Qué hago si se cae el servicio?",
    a: (
      <div className="space-y-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="font-bold mb-1">Paso 1 — Reinicia la ONU WiFi:</p>
          <p className="text-sm italic">Apágala, espera 1 minuto y vuelve a encenderla.</p>
        </div>
        <p>Paso 2 — Si el problema persiste, reporta al +57 300 912 1245 o WhatsApp +57 300 825 5091.</p>
        <p className="text-xs text-gray-500">Horario: Lunes-Viernes 8am-5pm, Sábados 8am-12pm. Atención en 24-48h hábiles.</p>
      </div>
    )
  },
  {
    q: "¿Cómo verifico mi cobertura?",
    a: (
      <div className="space-y-3">
        <p>Consulta disponibilidad en:</p>
        <a
          href="https://www.rapilinksas.co/COBERTURA.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand-action font-bold hover:underline"
        >
          rapilinksas.co/COBERTURA.html
          <ExternalLink size={14} />
        </a>
        <p>O envíanos tu dirección por WhatsApp al +57 300 825 5091.</p>
      </div>
    )
  },
  {
    q: "¿Tienen servicio técnico a domicilio?",
    a: (
      <div className="space-y-3">
        <p>Sí, en todos los municipios donde operamos (atención en 24-48h hábiles).</p>
        <div className="text-xs space-y-1 text-gray-600">
          <p>✅ <strong>Gratuita:</strong> Falla de nuestra red.</p>
          <p>⚠️ <strong>$20.000:</strong> Falla ocasionada por el cliente.</p>
          <p>⚠️ Materiales adicionales se cobran según el caso.</p>
        </div>
      </div>
    )
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, sin costo adicional (mínimo 6 meses de permanencia). El cambio aplica desde el siguiente ciclo de facturación. Solicítalo por WhatsApp o nuestra línea de soporte."
  },
  {
    q: "¿Qué equipos incluye la instalación?",
    a: (
      <div className="space-y-3">
        <p>Equipos en comodato:</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><strong>ONU WiFi</strong> (Módem + Router)</li>
          <li><strong>Fibra óptica de alta calidad</strong></li>
          <li><strong>Decodificador de TV</strong> (solo si aplica)</li>
        </ul>
        <p className="text-xs italic text-gray-500">Costo de instalación: $50.000 COP.</p>
      </div>
    )
  }
];

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-brand-action mb-4">
            <HelpCircle size={24} />
            <span className="font-bold uppercase tracking-widest text-sm">Preguntas Frecuentes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">Despeja tus dudas</h2>
          <p className="text-gray-500">Todo lo que necesitas saber sobre Rapilink</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={activeIndex === index}
              >
                <span className={`text-lg font-bold transition-colors ${activeIndex === index ? 'text-brand-action' : 'text-brand-dark'}`}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`text-brand-action ${activeIndex === index ? 'opacity-100' : 'opacity-40'}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/20">
                      <div className="text-base">
                        {faq.a}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

