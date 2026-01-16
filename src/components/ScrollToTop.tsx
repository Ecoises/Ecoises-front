import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const isPop = navType === 'POP';

  useEffect(() => {
    // Solo configurar esto una vez o cuando sea necesario, pero 'auto' es el default generalmente.
    // Lo forzamos para asegurar que el navegador sepa que puede restaurar.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
  }, []);

  useEffect(() => {
    // Si la navegación es POP (Atrás/Adelante), TERMINANTEMENTE PROHIBIDO tocar el scroll.
    if (isPop) return;

    // Solo si es PUSH (Nueva navegación) o REPLACE explícito, vamos arriba.
    window.scrollTo(0, 0);
  }, [pathname, isPop]);

  return null;
}

export default ScrollToTop;