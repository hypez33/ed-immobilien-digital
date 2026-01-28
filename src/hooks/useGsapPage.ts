import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createSmoothScrollController, SmoothScrollController } from '@/lib/smoothScroll';

gsap.registerPlugin(ScrollTrigger);

export function useGsapPage() {
  const location = useLocation();
  const controllerRef = useRef<SmoothScrollController | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    controllerRef.current = createSmoothScrollController();

    const syncMotionPreference = () => {
      if (media.matches) {
        controllerRef.current?.destroy();
        controllerRef.current = null;
      } else {
        controllerRef.current ??= createSmoothScrollController();
        controllerRef.current.start();
      }
    };

    syncMotionPreference();
    media.addEventListener('change', syncMotionPreference);

    const ctx = gsap.context(() => {
      const indicator = document.querySelector<HTMLElement>('[data-scroll-indicator]');
      if (indicator) {
        gsap.set(indicator, { scaleX: 0, transformOrigin: 'left center' });
        ScrollTrigger.create({
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          onUpdate: (self) => {
            gsap.set(indicator, { scaleX: self.progress });
          },
        });
      }

      if (media.matches) return;

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      media.removeEventListener('change', syncMotionPreference);
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const waitForImages = (container: Element | null) => {
      if (!container) return Promise.resolve();
      const images = Array.from(container.querySelectorAll('img'));
      if (!images.length) return Promise.resolve();
      return Promise.all(
        images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  const done = () => resolve();
                  img.addEventListener('load', done, { once: true });
                  img.addEventListener('error', done, { once: true });
                })
        )
      );
    };

    const waitForFonts = () => {
      if (!('fonts' in document)) return Promise.resolve();
      return (document as Document & { fonts: FontFaceSet }).fonts.ready;
    };

    const refreshAfterAssets = async () => {
      await Promise.all([waitForFonts(), waitForImages(document.querySelector('#smooth-content'))]);
      controllerRef.current?.refresh(true);
    };

    void refreshAfterAssets();
  }, [location.pathname]);
}
