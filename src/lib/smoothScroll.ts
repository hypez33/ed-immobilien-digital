import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisOptions = ConstructorParameters<typeof Lenis>[0];

const defaultOptions: LenisOptions = {
  // Keep wheel feel crisp (no floaty lag)
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  // Preserve native momentum on touch (iOS Safari feels natural)
  smoothTouch: false,
  touchMultiplier: 1,
  // Avoid diagonal gesture interference
  gestureOrientation: 'vertical',
  syncTouch: false,
};

export interface SmoothScrollController {
  start: () => void;
  stop: () => void;
  refresh: (immediate?: boolean) => void;
  destroy: () => void;
  get instance(): Lenis | null;
}

export function createSmoothScrollController(options: LenisOptions = {}): SmoothScrollController {
  let lenis: Lenis | null = null;
  let rafCallback: ((time: number) => void) | null = null;
  let scrollCallback: (() => void) | null = null;
  let resizeCallback: (() => void) | null = null;
  let refreshTimeout: number | null = null;

  const refresh = (immediate = false) => {
    if (refreshTimeout) {
      window.clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }

    const run = () => {
      ScrollTrigger.refresh(true);
    };

    if (immediate) {
      run();
    } else {
      refreshTimeout = window.setTimeout(run, 120);
    }
  };

  const start = () => {
    if (lenis) {
      lenis.start();
      return;
    }

    lenis = new Lenis({
      ...defaultOptions,
      ...options,
      autoRaf: false,
    });

    scrollCallback = () => ScrollTrigger.update();
    lenis.on('scroll', scrollCallback);

    rafCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    resizeCallback = () => refresh();
    window.addEventListener('resize', resizeCallback, { passive: true });
    window.addEventListener('orientationchange', resizeCallback);
    window.visualViewport?.addEventListener('resize', resizeCallback);

    refresh(true);
  };

  const stop = () => {
    lenis?.stop();
  };

  const destroy = () => {
    if (!lenis) return;

    if (scrollCallback) {
      lenis.off('scroll', scrollCallback);
    }
    if (rafCallback) {
      gsap.ticker.remove(rafCallback);
    }
    if (resizeCallback) {
      window.removeEventListener('resize', resizeCallback);
      window.removeEventListener('orientationchange', resizeCallback);
      window.visualViewport?.removeEventListener('resize', resizeCallback);
    }
    if (refreshTimeout) {
      window.clearTimeout(refreshTimeout);
      refreshTimeout = null;
    }

    lenis.destroy();
    lenis = null;
  };

  return {
    start,
    stop,
    refresh,
    destroy,
    get instance() {
      return lenis;
    },
  };
}
