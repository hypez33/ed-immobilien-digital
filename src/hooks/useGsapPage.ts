import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function useGsapPage() {
  const location = useLocation();
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrapper = document.querySelector('#smooth-wrapper');
    const content = document.querySelector('#smooth-content');

    let cancelled = false;
    let rafId = 0;

    if (prefersReducedMotion) {
      smootherRef.current?.kill();
      smootherRef.current = null;
    } else if (wrapper && content) {
      const waitForImages = () => {
        const images = Array.from(content.querySelectorAll('img'));
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

      const initSmoother = async () => {
        await Promise.all([waitForImages(), waitForFonts()]);
        if (cancelled) return;
        rafId = window.requestAnimationFrame(() => {
          smootherRef.current?.kill();
          smootherRef.current = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: true,
          });
          ScrollTrigger.refresh(true);
        });
      };

      void initSmoother();
    }

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

      if (prefersReducedMotion) return;

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

    ScrollTrigger.refresh();
    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      ctx.revert();
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, [location.pathname]);
}
