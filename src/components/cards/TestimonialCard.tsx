import { Testimonial } from '@/data/testimonials';
import { Badge } from '@/components/ui/badge';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="relative bg-surface p-8 md:p-12 flex flex-col h-full" data-stagger-item>
      {/* Decorative gold quote */}
      <div className="absolute top-6 left-6 font-serif text-6xl sm:text-7xl md:text-8xl text-gold/15 leading-none select-none pointer-events-none">
        "
      </div>

      {/* Quote text */}
      <blockquote className="relative z-10 font-serif text-xl md:text-2xl text-foreground leading-relaxed italic mb-8 pt-8 flex-grow">
        {testimonial.text}
      </blockquote>

      {/* Gold divider */}
      <div className="w-12 h-px bg-gold mb-6" />

      {/* Author */}
      <footer className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{testimonial.location}</p>
        </div>
        <Badge className="bg-gold/10 text-gold border-gold/20 hover:bg-gold/15 shrink-0">
          {testimonial.type}
        </Badge>
      </footer>
    </article>
  );
}
