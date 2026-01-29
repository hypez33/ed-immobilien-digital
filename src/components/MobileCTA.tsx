import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLenisInstance } from '@/lib/smoothScroll';

export function MobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SHOW_AFTER_PX = 600;
    let rafId = 0;

    const checkScroll = (scrollY: number) => {
      if (isDismissed) return;
      setIsVisible(scrollY > SHOW_AFTER_PX);
    };

    const onLenisScroll = (event: { scroll: number }) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        checkScroll(event.scroll);
        rafId = 0;
      });
    };

    const onWindowScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        checkScroll(window.scrollY);
        rafId = 0;
      });
    };

    const lenis = getLenisInstance();

    if (lenis) {
      lenis.on('scroll', onLenisScroll);
      checkScroll(lenis.scroll ?? window.scrollY);
    } else {
      window.addEventListener('scroll', onWindowScroll, { passive: true });
      checkScroll(window.scrollY);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.off('scroll', onLenisScroll);
      } else {
        window.removeEventListener('scroll', onWindowScroll);
      }
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-4 right-4 z-40 lg:hidden',
        'transform transition-all duration-300 ease-out',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative bg-primary text-primary-foreground rounded-xl p-4 shadow-luxe">
        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-7 h-7 bg-background rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream truncate">
              Kostenlose Erstberatung
            </p>
            <p className="text-xs text-cream/60 mt-0.5">
              Antwort in 24h garantiert
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="bg-cream text-primary hover:bg-gold-light shrink-0"
          >
            <Link to="/kontakt">
              <Phone className="w-4 h-4 mr-2" />
              Termin
            </Link>
          </Button>
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-gold-light/50 to-transparent" />
      </div>
    </div>
  );
}
