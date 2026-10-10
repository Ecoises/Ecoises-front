import { useEffect, useRef, useState } from "react";

/**
 * Scroll infinito: devuelve un ref para un elemento centinela al final de la
 * lista y llama a `onReach` cuando ese elemento se acerca a la vista.
 */
export const useInfiniteScroll = (onReach: () => void, enabled: boolean) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const callback = useRef(onReach);
  callback.current = onReach;

  useEffect(() => {
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => entries.some((entry) => entry.isIntersecting) && callback.current(),
      { rootMargin: "600px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, enabled]);

  return setNode;
};
