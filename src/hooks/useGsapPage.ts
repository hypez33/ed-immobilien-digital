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

      // Enhanced reveal animations with subtle parallax
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const variant = el.dataset.revealVariant || 'up';
        const fromProps: gsap.TweenVars = { opacity: 0 };
        
        switch (variant) {
          case 'left':
            fromProps.x = -30;
            break;
          case 'right':
            fromProps.x = 30;
            break;
          case 'scale':
            fromProps.scale = 0.95;
            break;
          default:
            fromProps.y = 24;
        }

        gsap.fromTo(el, fromProps, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Section parallax effect for images
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed || '0.15');
        gsap.to(el, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });

      // Fade-in from sides for split layouts
      gsap.utils.toArray<HTMLElement>('[data-split-reveal]').forEach((group) => {
        const left = group.querySelector('[data-split-left]');
        const right = group.querySelector('[data-split-right]');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        if (left) {
          tl.fromTo(left, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0);
        }
        if (right) {
          tl.fromTo(right, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.1);
        }
      });

      // Process timeline with alternating directions
      gsap.utils.toArray<HTMLElement>('[data-process]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-process-item]');
        if (!items.length) return;
        
        items.forEach((item, index) => {
          const direction = item.dataset.direction === 'right' ? 1 : -1;
          gsap.fromTo(
            item,
            { opacity: 0, x: direction * 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      });

      // Staggered children animations
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
        if (!items.length) return;
        const speed = group.dataset.staggerSpeed;
        const isFast = speed === 'fast';
        gsap.fromTo(
          items,
          { opacity: 0, y: isFast ? 16 : 28 },
          {
            opacity: 1,
            y: 0,
            duration: isFast ? 0.45 : 0.8,
            ease: 'power3.out',
            stagger: isFast ? 0.08 : 0.12,
            scrollTrigger: {
              trigger: group,
              start: isFast ? 'top 92%' : 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Counter animation for stats
      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
        const target = parseFloat(el.dataset.counterTarget || el.textContent || '0');
        const suffix = el.dataset.counterSuffix || '';
        const duration = parseFloat(el.dataset.counterDuration || '2');
        
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              { val: 0 },
              { val: target, duration, ease: 'power2.out' },
              {
                onUpdate() {
                  el.textContent = Math.round(this.targets()[0].val) + suffix;
                },
              }
            );
          },
        });
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
