import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
  onStart: (service: Service) => void;
}

export function ServiceCard({ service, onStart }: ServiceCardProps) {
  return (
    <article className="ui-interactive-card group relative bg-card border border-border/40 p-8 md:p-10 flex flex-col h-full" data-stagger-item>
      {service.popular && (
        <Badge className="absolute top-4 right-4 bg-gold/10 text-gold border-gold/20">
          Beliebt
        </Badge>
      )}

      <h3 className="font-serif text-2xl md:text-[1.75rem] mb-3 text-foreground">
        {service.title}
      </h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

      <ul className="space-y-3 mb-8 flex-grow">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-foreground/80">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full justify-between"
        onClick={() => onStart(service)}
      >
        Anfrage starten
        <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
      </Button>
    </article>
  );
}
