import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/#inicio' },
    { name: 'Nosotros', href: '/#nosotros' },
    { name: 'Internet Hogar', href: '/#internet-hogar' },
    { name: 'Televisión', href: '/#tv' },
    { name: 'Empresas', href: '/#empresas' },
    { name: 'PQRS', href: '/pqrs' },
  ];

  const logoSizeClass = scrolled ? 'h-10 md:h-16' : 'h-10 md:h-16';
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={scrolled || !isHome ? '/recursos/HEADER PNG.png' : '/recursos/LOGO RAPILINK S BLANCO.png'} 
                alt="Rapilink Logo" 
                className={`transition-all duration-300 object-contain ${logoSizeClass}`} 
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.href.startsWith('/#') && isHome ? (
                <a
                  key={link.name}
                  href={link.href.substring(1)}
                  className={`font-medium transition-colors hover:text-brand-action ${scrolled || !isHome ? 'text-brand-dark' : 'text-white'}`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`font-medium transition-colors hover:text-brand-action ${scrolled || !isHome ? 'text-brand-dark' : 'text-white'}`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <a 
              href="https://clientes.portalinternet.io/saldo/rapilink-sas/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-action text-white px-6 py-2 rounded-brand font-bold hover:bg-brand-hover transition-colors shadow-lg shadow-brand-action/20"
            >
              Pagar en línea
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled || !isHome ? 'text-brand-dark' : 'text-white'}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden overflow-y-auto pb-12"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-2xl font-display font-semibold text-brand-dark py-4 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-8 space-y-4">
              <a 
                href="https://clientes.portalinternet.io/saldo/rapilink-sas/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full btn-primary text-xl py-4"
              >
                Pagar en línea
              </a>
              <a href="tel:+573009121245" className="flex items-center justify-center space-x-4 text-brand-dark pt-8 hover:text-brand-blue transition-colors">
                <Phone size={20} /> <span className="font-semibold">300 912 1245</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
