import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactoForm: React.FC = () => {
  return (
    <section id="contacto" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Info Side */}
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-bold text-brand-dark mb-6 tracking-tight">Estamos para <span className="text-brand-action">ayudarte</span></h2>
            <p className="text-gray-500 mb-10 text-lg">
              Solicita tu servicio, reporta una novedad o simplemente saluda. Nuestro equipo te responderá en tiempo récord.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-light text-brand-action rounded-brand">
                  <Phone size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-brand-dark">Llámanos</h5>
                  <p className="text-gray-500">+57 3009121245</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-light text-brand-action rounded-brand">
                  <Mail size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-brand-dark">Escríbenos</h5>
                  <p className="text-gray-500">info.rapilinksas@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-brand-light text-brand-action rounded-brand">
                  <MapPin size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-brand-dark">Visítanos</h5>
                  <p className="text-gray-500">Calle 45 #7C - 33, Soledad - Atlántico</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-light rounded-3xl p-8 md:p-12 shadow-sm"
            >
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark">Nombre Completo</label>
                  <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-brand focus:outline-none focus:border-brand-action transition-all" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-dark">WhatsApp o Celular</label>
                  <input type="tel" className="w-full p-4 bg-white border border-gray-200 rounded-brand focus:outline-none focus:border-brand-action transition-all" placeholder="+57 321..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-brand-dark">Correo Electrónico</label>
                  <input type="email" className="w-full p-4 bg-white border border-gray-200 rounded-brand focus:outline-none focus:border-brand-action transition-all" placeholder="ejemplo@correo.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-brand-dark">Motivo de Contacto</label>
                  <select className="w-full p-4 bg-white border border-gray-200 rounded-brand focus:outline-none focus:border-brand-action transition-all appearance-none cursor-pointer">
                    <option>Suscripción a nuevo plan</option>
                    <option>Soporte Técnico</option>
                    <option>PQRS / Reclamaciones</option>
                    <option>Información Empresarial</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-brand-dark">Mensaje</label>
                  <textarea rows={4} className="w-full p-4 bg-white border border-gray-200 rounded-brand focus:outline-none focus:border-brand-action transition-all" placeholder="Escribe aquí tu consulta..."></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="btn-primary w-full flex items-center justify-center space-x-3 text-lg py-5">
                    <Send size={20} />
                    <span>Enviar Solicitud</span>
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-6">
                    Al enviar este formulario, aceptas nuestra Política de Tratamiento de Datos Personales.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactoForm;
