import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Definir rutas donde queremos preservar el scroll (listados y detalles)
    // Usamos startsWith para preservar scroll en /taxa y /taxa/:id
    const preserveScrollPaths = ['/explorer', '/taxa', '/sightings', '/map'];

    // Verificar si el pathname empieza con alguna ruta preservada
    const shouldPreserveScroll = preserveScrollPaths.some(path => pathname.startsWith(path));

    // Solo hacer scroll top si NO es una ruta preservada
    if (!shouldPreserveScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;