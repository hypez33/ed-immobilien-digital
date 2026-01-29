import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenisInstance } from '@/lib/smoothScroll';

const scrollTopImmediate = () => {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
};

const scrollToAnchor = (target: HTMLElement, reduceMotion: boolean) => {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(target, { duration: reduceMotion ? 0 : 0.6, immediate: reduceMotion });
    return;
  }
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
};

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hash = location.hash;

    const run = () => {
      if (hash && hash.length > 1) {
        const id = decodeURIComponent(hash.slice(1));
        const target =
          document.getElementById(id) ||
          (document.querySelector(`[name="${id.replace(/"/g, '\\"')}"]`) as HTMLElement | null);
        if (target) {
          scrollToAnchor(target, reduceMotion);
          return;
        }
      }
      scrollTopImmediate();
    };

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

  return null;
}
