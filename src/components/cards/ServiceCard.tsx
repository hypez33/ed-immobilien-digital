import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export function ServiceCard({ icon: Icon, title, description, features, ctaText, ctaHref }: ServiceCardProps) {
  return (
    <article className="ui-interactive-card relative bg-card border border-border/40 p-8 md:p-10 flex flex-col h-full group hover:border-gold/40 overflow-hidden" data-stagger-item>
      {/* Gold top line - animates on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/0 via-gold to-gold/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

      {/* Gold corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-10 bg-gold/30 group-hover:bg-gold/50 transition-colors" />
        <div className="absolute top-0 right-0 h-px w-10 bg-gold/30 group-hover:bg-gold/50 transition-colors" />
      </div>

      {/* Subtle background glow on hover */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon with gold ring + filled bg */}
      <div className="relative w-16 h-16 rounded-full border-2 border-gold/30 bg-gold/5 flex items-center justify-center mb-8 group-hover:border-gold/60 group-hover:bg-gold/10 transition-all duration-300">
        <Icon className="w-7 h-7 text-gold transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* Content */}
      <h3 className="font-serif text-2xl md:text-[1.75rem] mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">{description}</p>

      {/* Features with gold bullets */}
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Elegant CTA */}
      <Button
        variant="outline"
        className="w-full justify-between rounded-none border-gold/35 bg-gold/5 text-foreground hover:bg-gold hover:text-cream hover:border-gold shadow-card"
        asChild
      >
        <Link to={ctaHref}>
          <span className="font-medium">{ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </Link>
      </Button>
    </article>
  );
}
