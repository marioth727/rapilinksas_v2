import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import logoWhite from '../assets/logo-white.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-charcoal text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 border-b border-white/5 pb-16">

          {/* Brand Panel */}
          <div className="lg:col-span-2">
            <Link to="/">
              <img src={logoWhite} alt="Rapilink Logo Blanco" className="h-12 md:h-16 mb-8 object-contain" />
            </Link>
            <p className="text-gray-400 mb-8 max-w-sm text-base md:text-lg leading-relaxed">
              Llevando la mejor experiencia de conectividad y entretenimiento a los hogares y empresas con fibra óptica simétrica de última generación.
            </p>
            <div className="flex space-x-4">
              <Facebook className="hover:text-brand-action cursor-pointer transition-colors" />
              <Instagram className="hover:text-brand-action cursor-pointer transition-colors" />
              <Twitter className="hover:text-brand-action cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-white border-b-2 border-brand-tech w-fit pb-1">Servicios</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/#internet-hogar" className="hover:text-brand-tech transition-colors">Internet Fibra Óptica</Link></li>
              <li><Link to="/#tv" className="hover:text-brand-tech transition-colors">Televisión HD</Link></li>
              <li><Link to="/#internet-hogar" className="hover:text-brand-tech transition-colors">Planes Combo</Link></li>
              <li><Link to="/#empresas" className="hover:text-brand-tech transition-colors">Soluciones Empresariales</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-white border-b-2 border-brand-tech w-fit pb-1">Legal</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/legal/datos-personales" className="hover:text-brand-tech transition-colors">Protección de Datos</Link></li>
              <li><Link to="/legal/aviso-privacidad" className="hover:text-brand-tech transition-colors">Aviso de Privacidad</Link></li>
              <li><Link to="/legal/politica-cookies" className="hover:text-brand-tech transition-colors">Política de Cookies</Link></li>
              <li><Link to="/legal/neutralidad-red" className="hover:text-brand-tech transition-colors">Neutralidad en la Red</Link></li>
              <li><Link to="/legal/explotacion-infantil" className="hover:text-brand-tech transition-colors font-semibold text-brand-tech/80">Prevención Explotación Infantil</Link></li>
            </ul>
          </div>

          {/* Columna 4: Recursos */}
          <div>
            <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-white border-b-2 border-brand-tech w-fit pb-1">Recursos</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/legal/test-velocidad" className="hover:text-brand-tech transition-colors">Test de Velocidad</Link></li>
              <li><Link to="/legal/control-parental" className="hover:text-brand-tech transition-colors">Control Parental</Link></li>
              <li><Link to="/legal/seguridad-red" className="hover:text-brand-tech transition-colors">Seguridad en la Red</Link></li>
              <li><Link to="/pqrs" className="hover:text-brand-tech transition-colors">PQRS Digital</Link></li>
              <li><Link to="/cobertura" className="hover:text-brand-tech transition-colors">Consultar Cobertura</Link></li>
            </ul>
          </div>

          {/* Columna 5: Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b-2 border-brand-action w-fit">Contacto</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-brand-action shrink-0" />
                <span>Calle 45 #7C - 33, Soledad - Atlántico</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone size={20} className="text-brand-action shrink-0" />
                <a href="tel:+573009121245" className="hover:text-white transition-colors">
                  +57 300 912 1245 (Llamadas)
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <MessageSquare size={20} className="text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/573008255091?text=${encodeURIComponent('Hola Rapilink! 👋 Deseo recibir información personalizada sobre sus planes de Fibra Óptica.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +57 300 825 5091 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-brand-action shrink-0" />
                <a href="mailto:info.rapilinksas@gmail.com" className="hover:text-white transition-colors">
                  info.rapilinksas@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <div>© {new Date().getFullYear()} Rapilink SAS. Todos los derechos reservados.</div>
          <div className="flex items-center space-x-4">
            <a href="http://clientes.portalinternet.io/saldo/rapilink-sas/" target="_blank" rel="noopener noreferrer" className="bg-brand-action/10 px-4 py-2 rounded-lg text-brand-action hover:bg-brand-action/20 transition-all font-bold">
              Portal de Pagos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
