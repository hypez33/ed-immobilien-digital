import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLenisInstance } from '@/lib/smoothScroll';

const SHOW_AFTER_PX = 420;

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        rafId = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleClick = () => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(0, reduceMotion ? { immediate: true } : { duration: 0.9 });
      return;
    }

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div
      className={`fixed right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <Button
        size="icon"
        onClick={handleClick}
        aria-label="Nach oben"
        className="rounded-full"
      >
        <ArrowUp className={reduceMotion ? '' : 'animate-gentle-float'} />
      </Button>
    </div>
  );
}
