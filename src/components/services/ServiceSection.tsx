import { useCallback, useRef, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Service, services } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { ServiceInquiryForm } from './ServiceInquiryForm';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';

interface ServiceSectionProps {
  showHeader?: boolean;
  backgroundImage?: string;
  backgroundAlt?: string;
}

export function ServiceSection({
  showHeader = true,
  backgroundImage,
  backgroundAlt = 'Hintergrundbild für den Leistungsbereich',
}: ServiceSectionProps) {
  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [expanded, setExpanded] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const handleStart = (service: Service) => {
    setActiveService(service);
    setOpen(true);
  };

  const primaryServices = services.slice(0, 3);
  const extraServices = services.slice(3);
  const canToggle = extraServices.length > 0;

  const toggleExpand = useCallback(() => {
    const container = moreRef.current;
    if (!container || isAnimating.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!expanded) {
      // Expand
      isAnimating.current = true;
      setExpanded(true);
      container.style.display = 'block';
      const items = container.querySelectorAll<HTMLElement>('[data-stagger-item]');

      if (reduceMotion) {
        container.style.height = 'auto';
        container.style.opacity = '1';
        gsap.set(items, { opacity: 1, y: 0 });
        isAnimating.current = false;
        return;
      }

      // Measure natural height
      container.style.height = 'auto';
      const naturalHeight = container.scrollHeight;
      container.style.height = '0px';
      container.style.opacity = '0';

      gsap.set(items, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        onComplete: () => {
          container.style.height = 'auto';
          isAnimating.current = false;
        },
      });

      tl.to(container, {
        height: naturalHeight,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
      });

      tl.to(
        items,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.09,
          ease: 'power2.out',
        },
        '-=0.25'
      );
    } else {
      // Collapse
      isAnimating.current = true;
      const items = container.querySelectorAll<HTMLElement>('[data-stagger-item]');

      if (reduceMotion) {
        container.style.height = '0px';
        container.style.opacity = '0';
        container.style.display = 'none';
        setExpanded(false);
        isAnimating.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          container.style.display = 'none';
          setExpanded(false);
          isAnimating.current = false;
        },
      });

      tl.to(items, {
        opacity: 0,
        y: -16,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power2.in',
      });

      tl.to(
        container,
        {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
        },
        '-=0.15'
      );
    }
  }, [expanded]);

  return (
    <Section
      size="lg"
      variant="surface"
      id="angebotene-leistungen"
      className={cn('relative overflow-hidden', backgroundImage && 'isolate')}
    >
      {backgroundImage && (
        <>
          {/* Background image with parallax */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <ProgressiveImage
              src={backgroundImage}
              alt={backgroundAlt}
              containerClassName="absolute inset-x-0 -top-[10%] h-[120%] w-full"
              className="will-change-transform"
              imgProps={{
                'data-parallax-soft': true,
                'data-parallax-speed': '0.04',
              }}
            />
            <div className="absolute inset-0 bg-background/72" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/58 via-background/70 to-background/82" />
            <div className="absolute inset-0 ui-noise-soft" />
          </div>
          {/* Outer frame flush with section edges */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
            <div className="absolute inset-0 border-2 border-gold/25" />
            <div className="absolute -top-px -left-px w-10 h-10 border-t-[3px] border-l-[3px] border-gold/50" />
            <div className="absolute -top-px -right-px w-10 h-10 border-t-[3px] border-r-[3px] border-gold/50" />
            <div className="absolute -bottom-px -left-px w-10 h-10 border-b-[3px] border-l-[3px] border-gold/50" />
            <div className="absolute -bottom-px -right-px w-10 h-10 border-b-[3px] border-r-[3px] border-gold/50" />
          </div>
        </>
      )}

      <div className="relative z-[1]">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" data-reveal data-reveal-once="true">
            <div className="max-w-2xl border border-border/40 bg-background/75 px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-gold" />
                <span className="text-primary text-sm uppercase tracking-[0.15em]">Services</span>
              </div>
              <h2 className="font-serif text-foreground">Angebotene Leistungen</h2>
              <p className="text-foreground/80 mt-3">
                Wählen Sie den passenden Service und senden Sie Ihre Anfrage in weniger als 2 Minuten.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger data-stagger-once="true">
          {primaryServices.map((service) => (
            <ServiceCard key={service.id} service={service} onStart={handleStart} />
          ))}
        </div>

        {canToggle && (
          <div
            ref={moreRef}
            id="services-more"
            aria-hidden={!expanded}
            className="overflow-hidden mt-6"
            style={{ display: 'none', height: 0, opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {extraServices.map((service) => (
                <ServiceCard key={service.id} service={service} onStart={handleStart} />
              ))}
            </div>
          </div>
        )}

        {canToggle && (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={toggleExpand}
              className="group rounded-none border-gold/40 text-gold hover:bg-gold/10 hover:border-gold gap-2"
              aria-expanded={expanded}
              aria-controls="services-more"
            >
              {expanded ? 'Weniger anzeigen' : 'Mehr Leistungen'}
              <ChevronDown className={cn(
                'w-4 h-4 transition-transform duration-300 ease-out',
                expanded && 'rotate-180'
              )} />
            </Button>
          </div>
        )}

        <ServiceInquiryForm open={open} onOpenChange={setOpen} activeService={activeService} />
      </div>
    </Section>
  );
}
