import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import PlanesGrid from '../components/PlanesGrid';
import TVBanner from '../components/TVBanner';
import FAQSection from '../components/FAQSection';
import CoberturaSearch from '../components/CoberturaSearch';
import Diferenciadores from '../components/Diferenciadores';
import ContactoForm from '../components/ContactoForm';
import PlanesEmpresariales from '../components/PlanesEmpresariales';
import AboutSection from '../components/AboutSection';

import heroBg from '../assets/hero-bg.png';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section - Estilo Premium ISP */}
      <section id="inicio" className="relative h-screen flex items-center justify-center bg-brand-dark overflow-hidden pt-16 md:pt-0">
        {/* Imagen de Fondo con Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-60"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            imageRendering: 'crisp-edges',
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/60 to-brand-dark" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center pt-20 md:pt-0">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-3 py-1 rounded-full bg-brand-action/20 text-brand-action border border-brand-action/30 font-bold text-[10px] md:text-sm mb-6 uppercase tracking-[0.3em]"
            >
              Conectividad de Última Generación
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-7xl text-white mb-4 font-display font-black leading-[1.1] tracking-tighter"
            >
              Internet Fibra Óptica <br />
              <span className="text-brand-action text-glow">Simétrica Real</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed opacity-90"
            >
              Navega, juega y trabaja sin interrupciones con la red más estable de tu región. 
              Hasta 1000 MB de pura potencia para tu hogar y empresa.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a href="#internet-hogar" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-brand-action/25">Ver Planes Hogar</a>
              <a href="/solicitud" className="btn-outline text-lg px-10 py-4 !text-white !border-white/40 hover:!bg-white hover:!text-brand-dark transition-all">Solicitar Servicio</a>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Diferenciadores Clave (Extracción de Stitch) */}
      <Diferenciadores />

      {/* Sobre Rapilink */}
      <AboutSection />

      {/* Planes Residenciales */}
      <PlanesGrid />

      {/* Banner TV */}
      <TVBanner />

      {/* Planes Empresariales */}
      <PlanesEmpresariales />

      {/* Buscador de Cobertura */}
      <CoberturaSearch />

      {/* FAQ */}
      <FAQSection />

      {/* Contacto y PQRS */}
      <ContactoForm />
    </Layout>
  );
};

export default Home;
