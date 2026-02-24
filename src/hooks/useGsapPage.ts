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
      const revealDuration = 0.66;
      const revealEase = 'power2.out';
      const staggerDuration = {
        fast: 0.52,
        base: 0.64,
      };
      const staggerAmount = {
        fast: 0.07,
        base: 0.08,
      };

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

      // Section reveal animations
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const variant = el.dataset.revealVariant || 'up';
        const once = el.dataset.revealOnce === 'true';
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
          duration: variant === 'scale' ? 0.58 : revealDuration,
          ease: revealEase,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once,
          },
        });
      });

      // Conservative parallax only for explicitly marked assets
      const applyParallax = (
        selector: string,
        config: { min: number; max: number; multiplier: number; scrub: number; defaultSpeed: number }
      ) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
          const speedRaw = parseFloat(el.dataset.parallaxSpeed || String(config.defaultSpeed));
          const speed = Math.max(config.min, Math.min(speedRaw, config.max));
          gsap.to(el, {
            yPercent: speed * config.multiplier,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: config.scrub,
            },
          });
        });
      };

      applyParallax('[data-parallax]', {
        min: 0.04,
        max: 0.12,
        multiplier: 42,
        scrub: 0.5,
        defaultSpeed: 0.08,
      });

      applyParallax('[data-parallax-soft]', {
        min: 0.02,
        max: 0.06,
        multiplier: 26,
        scrub: 0.45,
        defaultSpeed: 0.03,
      });

      // Fade-in from sides for split layouts
      gsap.utils.toArray<HTMLElement>('[data-split-reveal]').forEach((group) => {
        const left = group.querySelector('[data-split-left]');
        const right = group.querySelector('[data-split-right]');
        const once = group.dataset.splitOnce === 'true';
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once,
          },
        });

        if (left) {
          tl.fromTo(left, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: revealDuration, ease: revealEase }, 0);
        }
        if (right) {
          tl.fromTo(right, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: revealDuration, ease: revealEase }, 0.08);
        }
      });

      // Process timeline with alternating directions
      gsap.utils.toArray<HTMLElement>('[data-process]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-process-item]');
        if (!items.length) return;
        const once = group.dataset.processOnce !== 'false';

        gsap.fromTo(
          items,
          {
            opacity: 0,
            x: (index, target) =>
              (target as HTMLElement).dataset.direction === 'right' ? 42 : -42,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.72,
            ease: revealEase,
            stagger: 0.08,
            scrollTrigger: {
              trigger: group,
              start: 'top 86%',
              toggleActions: 'play none none none',
              once,
            },
          }
        );
      });

      // Staggered children animations
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-stagger-item]');
        if (!items.length) return;
        const speed = group.dataset.staggerSpeed;
        const isFast = speed === 'fast';
        const once = group.dataset.staggerOnce === 'true';
        gsap.fromTo(
          items,
          { opacity: 0, y: isFast ? 16 : 28 },
          {
            opacity: 1,
            y: 0,
            duration: isFast ? staggerDuration.fast : staggerDuration.base,
            ease: revealEase,
            stagger: isFast ? staggerAmount.fast : staggerAmount.base,
            scrollTrigger: {
              trigger: group,
              start: isFast ? 'top 92%' : 'top 88%',
              toggleActions: 'play none none none',
              once,
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
