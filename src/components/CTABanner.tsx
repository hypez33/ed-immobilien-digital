import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { footerVisuals, visualAltTextByKey } from '@/data/visuals';

interface CTABannerProps {
  headline?: string;
  subline?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  showRightVisual?: boolean;
}

export function CTABanner({
  headline = 'Sichern Sie sich Ihre kostenfreie Erstberatung.',
  subline = 'Wir beraten Sie persönlich zu Verkauf, Vermietung oder Bewertung Ihrer Immobilie.',
  primaryText = 'Termin vereinbaren',
  primaryHref = '/kontakt',
  secondaryText = 'Kontakt aufnehmen',
  secondaryHref = '/kontakt',
  showRightVisual = false,
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0">
        <div className={cn('absolute inset-y-0 left-0 bg-primary', showRightVisual ? 'w-full lg:w-3/4' : 'w-full')} />
        {showRightVisual && <div className="absolute inset-y-0 right-0 w-1/4 bg-gold-light hidden lg:block" />}
      </div>

      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative py-16 md:py-20 lg:py-24">
        <div className={cn(showRightVisual && 'grid lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem] gap-10 xl:gap-14 items-stretch')}>
          <div className="max-w-2xl" data-stagger data-stagger-once="true">
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
                className="group bg-gold-light text-primary hover:bg-gold hover:text-cream rounded-none"
              >
                <Link to={primaryHref}>
                  <Phone className="w-4 h-4 mr-2" />
                  {primaryText}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group bg-transparent border-cream/40 text-cream hover:bg-cream/10 hover:text-cream rounded-none"
              >
                <Link to={secondaryHref}>
                  <Mail className="w-4 h-4 mr-2" />
                  {secondaryText}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </Button>
            </div>
          </div>

          {showRightVisual && (
            <aside className="hidden lg:block">
              <div className="group relative h-full min-h-[260px] ui-visual-frame ui-depth-hover border border-cream/25 bg-card/10">
                <img
                  src={footerVisuals.homeRight}
                  alt={visualAltTextByKey['footer-home-right']}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  data-parallax-soft
                  data-parallax-speed="0.03"
                />
                <div className="ui-visual-overlay absolute inset-0" />
                <div className="ui-visual-blur-rim absolute inset-0 pointer-events-none" />
                <div className="absolute left-4 right-4 bottom-4 border border-cream/25 bg-primary/70 px-4 py-3 backdrop-blur-md">
                  <span className="block text-2xs uppercase tracking-[0.16em] text-cream/70">Exklusive Betreuung</span>
                  <span className="font-serif text-lg text-cream leading-tight">Persoenlich. Nah. Verlaesslich.</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
