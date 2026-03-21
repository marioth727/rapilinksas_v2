import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const Legal: React.FC = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 text-center">Aspectos Legales</h1>
            <p className="text-xl text-gray-600 text-center">Transparencia y compromiso con nuestros usuarios.</p>
            <div className="h-1.5 w-20 bg-brand-action mx-auto mt-6 rounded-full" />
          </motion.div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Tratamiento de Datos Personales</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En cumplimiento de la Ley 1581 de 2012, Rapilink SAS se compromete a proteger la privacidad de sus clientes. 
                Los datos recolectados se utilizan exclusivamente para la prestación del servicio y comunicaciones oficiales.
              </p>
              <a href="#" className="text-brand-action font-bold hover:underline">Descargar Política Completa (PDF)</a>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Neutralidad de Red</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Garantizamos que no existe discriminación, interferencia, degradación ni restricción del tráfico basada en el 
                tipo de contenido, aplicación o servicio que el usuario decida utilizar.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Contrato de Condiciones Uniformes</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Consulta los términos y condiciones que rigen la relación contractual entre Rapilink SAS y el usuario final 
                para la prestación de servicios de valor agregado.
              </p>
              <a href="#" className="text-brand-action font-bold hover:underline">Ver Contrato</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
