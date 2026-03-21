import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const PQRS: React.FC = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">PQRS</h1>
            <p className="text-xl text-gray-600">Peticiones, Quejas, Reclamos y Sugerencias</p>
            <div className="h-1.5 w-20 bg-brand-action mx-auto mt-6 rounded-full" />
          </motion.div>

          <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 p-8 md:p-12 border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-8 text-center italic">
              "En Rapilink SAS, tu opinión es fundamental para mejorar nuestra conectividad. 
              Utiliza este canal oficial para radicar cualquier solicitud."
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Número de Documento</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 outline-none transition-all"
                    placeholder="C.C / NIT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 outline-none transition-all"
                    placeholder="nombre@correo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Tipo de Solicitud</label>
                  <select className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 outline-none transition-all bg-white">
                    <option>Petición</option>
                    <option>Queja</option>
                    <option>Reclamo</option>
                    <option>Sugerencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Descripción de la Solicitud</label>
                <textarea 
                  rows={5}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-brand-action focus:ring-2 focus:ring-brand-action/20 outline-none transition-all resize-none"
                  placeholder="Describe detalladamente tu solicitud..."
                ></textarea>
              </div>

              <button className="w-full btn-primary py-4 text-lg font-bold rounded-xl shadow-lg shadow-brand-action/20">
                Radicar Solicitud
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PQRS;
