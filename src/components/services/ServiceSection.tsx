import { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Service, services } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { ServiceInquiryForm } from './ServiceInquiryForm';
import { cn } from '@/lib/utils';

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

  const handleStart = (service: Service) => {
    setActiveService(service);
    setOpen(true);
  };

  const primaryServices = services.slice(0, 3);
  const extraServices = services.slice(3);
  const canToggle = extraServices.length > 0;

  return (
    <Section
      size="lg"
      variant="surface"
      id="angebotene-leistungen"
      className={cn('relative overflow-hidden', backgroundImage && 'isolate')}
    >
      {backgroundImage && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <ProgressiveImage
            src={backgroundImage}
            alt={backgroundAlt}
            containerClassName="absolute inset-x-0 -top-[6%] h-[112%] w-full"
            className="ui-parallax-soft will-change-transform"
            imgProps={{
              'data-parallax-soft': true,
              'data-parallax-speed': '0.035',
            }}
          />
          <div className="absolute inset-0 bg-background/74" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/62 via-background/72 to-background/84" />
          <div className="absolute inset-0 ui-noise-soft" />
        </div>
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
            id="services-more"
            aria-hidden={!expanded}
            className={cn(
              'overflow-hidden transition-[max-height,opacity,transform] transition-duration-[420ms] transition-ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
              expanded ? 'max-h-[2000px] opacity-100 translate-y-0 mt-6' : 'max-h-0 opacity-0 -translate-y-2'
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger data-stagger-once="true">
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
              onClick={() => setExpanded((prev) => !prev)}
              className="rounded-none border-gold/40 text-gold hover:bg-gold/10 hover:border-gold"
              aria-expanded={expanded}
              aria-controls="services-more"
            >
              {expanded ? 'Weniger anzeigen' : 'Mehr Leistungen'}
            </Button>
          </div>
        )}

        <ServiceInquiryForm open={open} onOpenChange={setOpen} activeService={activeService} />
      </div>
    </Section>
  );
}
