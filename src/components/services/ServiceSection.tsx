import { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Service, services } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { ServiceInquiryForm } from './ServiceInquiryForm';

export function ServiceSection() {
  const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);

  const handleStart = (service: Service) => {
    setActiveService(service);
    setOpen(true);
  };

  return (
    <Section size="lg" variant="surface">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" data-reveal>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Services</span>
          </div>
          <h2 className="font-serif">Angebotene Leistungen</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Wählen Sie den passenden Service und senden Sie Ihre Anfrage in weniger als 2 Minuten.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onStart={handleStart} />
        ))}
      </div>

      <ServiceInquiryForm open={open} onOpenChange={setOpen} activeService={activeService} />
    </Section>
  );
}
