import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ChevronRight, Download } from 'lucide-react';
import Layout from '../components/Layout';
import { legalContent } from '../data/legalContent';

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? legalContent[slug as keyof typeof legalContent] : null;

  if (!content) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center min-h-screen">
          <h1 className="text-xl font-bold text-brand-dark">Contenido no disponible</h1>
          <Link to="/" className="text-brand-blue hover:underline mt-4 block italic text-sm">Volver al inicio</Link>
        </div>
      </Layout>
    );
  }

  const Icon = content.icon;

  return (
    <Layout>
      <section className="pt-24 pb-20 bg-gray-50/30 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs - Minimalistas */}
          <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">
            <Link to="/" className="hover:text-brand-blue transition-colors">Inicio</Link>
            <ChevronRight size={10} />
            <span className="text-gray-300">Legal</span>
            <ChevronRight size={10} />
            <span className="text-brand-blue/70">{content.titulo}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar - Compacto y Elegante */}
            <aside className="lg:col-span-4 lg:block">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-4 mb-5">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="text-brand-blue" size={24} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-brand-dark tracking-tighter leading-none">
                      {content.titulo}
                    </h1>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {content.descripcion}
                  </p>
                </div>

                <div className="hidden lg:block space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-4 mb-3">Contenido del documento</p>
                  {content.secciones.map((seccion, idx) => (
                    <a 
                      key={idx}
                      href={`#seccion-${idx}`}
                      className="block px-5 py-3 rounded-xl text-gray-500 font-bold hover:bg-white hover:text-brand-blue transition-all border border-transparent hover:border-gray-100/50 text-xs"
                    >
                      {seccion.subtitulo}
                    </a>
                  ))}
                </div>

                <div className="pt-4">
                  <button className="flex items-center space-x-2 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:opacity-70 transition-opacity">
                    <Download size={14} />
                    <span>DESCARGAR VERSIÓN PDF</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Contenido Principal - Aireado y Legible */}
            <main className="lg:col-span-8">
              <div className="space-y-10">
                {content.secciones.map((seccion, i) => (
                  <motion.div
                    key={i}
                    id={`seccion-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="scroll-mt-28"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {seccion.icon ? (
                        <seccion.icon size={18} className="text-brand-tech shrink-0" />
                      ) : (
                        <div className="w-0.5 h-5 bg-brand-tech rounded-full" />
                      )}
                      <h2 className="text-sm md:text-base font-black text-brand-dark uppercase tracking-widest">
                        {seccion.subtitulo}:
                      </h2>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm-light">
                      <div className="prose prose-sm prose-slate text-gray-500 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {seccion.contenido}
                      </div>
                      
                      {seccion.links && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-8 border-t border-gray-50">
                          {seccion.links.map((link, j) => (
                            <a
                              key={j}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-brand-blue hover:text-white transition-all group border border-gray-100/50"
                            >
                              <span className="font-bold text-[11px] tracking-wide">{link.texto}</span>
                              <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Caso Especial: Test de Velocidad */}
                {content.isSpeedTest && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100"
                  >
                    <iframe
                      src="https://fast.com"
                      title="Test de Velocidad"
                      className="w-full h-full min-h-[450px]"
                    />
                  </motion.div>
                )}
              </div>

              {/* Pie de Página de la página legal */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <Link to="/" className="flex items-center space-x-2 text-gray-400 font-bold hover:text-brand-blue transition-colors group text-[11px] uppercase tracking-widest">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>REGRESAR AL INICIO</span>
                </Link>
                <div className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em]">Rapilink SAS • 2024</div>
              </div>
            </main>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;
