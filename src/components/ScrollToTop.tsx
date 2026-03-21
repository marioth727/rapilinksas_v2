import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que resetea la posición del scroll al inicio (0,0)
 * cada vez que cambia la ruta de navegación.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'instant' para que el usuario aparezca arriba sin demora
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
