import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Definir rutas exactas donde queremos preservar el scroll (listados)
    // No usamos startsWith para permitir que /species/123 sí haga scroll top
    const preserveScrollPaths = ['/explorer', '/species', '/sightings', '/map'];

    // Verificar si el pathname exacto está en la lista (ignorando query params que router extrae)
    const shouldPreserveScroll = preserveScrollPaths.includes(pathname);

    // Solo hacer scroll top si NO es una ruta de listado
    if (!shouldPreserveScroll) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;