import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowRight } from 'lucide-react';

interface CTABannerProps {
  headline?: string;
  subline?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
}

export function CTABanner({
  headline = 'Sichern Sie sich Ihre kostenfreie Erstberatung.',
  subline = 'Wir beraten Sie persönlich zu Verkauf, Vermietung oder Bewertung Ihrer Immobilie.',
  primaryText = 'Termin vereinbaren',
  primaryHref = '/kontakt',
  secondaryText = 'Kontakt aufnehmen',
  secondaryHref = '/kontakt',
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-full lg:w-3/4 bg-primary" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gold-light hidden lg:block" />
      </div>

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl" data-stagger>
          {/* Gold decorative line */}
          <div className="w-16 h-px bg-gold-light mb-8" data-stagger-item />

          {/* Serif headline */}
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream mb-6 leading-tight" data-stagger-item>
            {headline}
          </h2>

          {/* Subline */}
          {subline && (
            <p className="text-cream/70 text-lg mb-10 max-w-xl leading-relaxed" data-stagger-item>
              {subline}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4" data-stagger-item>
            <Button
              size="lg"
              asChild
              className="bg-gold-light text-primary hover:bg-gold hover:text-cream rounded-none"
            >
              <Link to={primaryHref}>
                <Phone className="w-4 h-4 mr-2" />
                {primaryText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-cream/30 text-cream hover:bg-cream/10 rounded-none"
            >
              <Link to={secondaryHref}>
                <Mail className="w-4 h-4 mr-2" />
                {secondaryText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
