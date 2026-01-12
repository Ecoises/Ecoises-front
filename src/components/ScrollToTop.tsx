import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Rutas donde NO queremos hacer scroll al inicio
    const excludedPaths = ['/explorer', '/species'];
    
    // Verificar si la ruta actual está excluida
    const isExcluded = excludedPaths.some(path => pathname.startsWith(path));
    
    // Solo hacer scroll si NO está en las rutas excluidas
    if (!isExcluded) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;