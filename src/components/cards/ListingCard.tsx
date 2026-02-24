import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Maximize, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Listing } from '@/data/listings';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const formatPrice = (price: number, type: 'kauf' | 'miete') => {
    const formatted = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'miete' ? `${formatted}/Monat` : formatted;
  };
  const detailHref = `/immobilien/${listing.id}`;
  const inquiryHref = `/kontakt?anliegen=besichtigung&objekt=${listing.id}&titel=${encodeURIComponent(listing.title)}&ort=${encodeURIComponent(listing.location)}`;

  return (
    <article className="group relative ui-interactive-card" data-stagger-item>
      {/* Image with parallax effect */}
      <div className="relative z-10 aspect-[4/3] ui-visual-frame ui-depth-hover bg-surface border-border/35">
        <div className="absolute inset-0 overflow-hidden">
          <ProgressiveImage
            src={listing.image}
            alt={`${listing.title} in ${listing.location}`}
            containerClassName="absolute inset-0"
            className="transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transform-none"
          />
          <div className="ui-visual-overlay absolute inset-0" />
          <div className="ui-visual-blur-rim absolute inset-0 pointer-events-none" />

          {/* Featured badge */}
          {listing.featured && (
            <div className="absolute top-4 left-4 bg-gold text-cream px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
              Empfohlen
            </div>
          )}
        </div>

        {/* Overlapping price tag */}
        <div className="absolute -bottom-4 sm:-bottom-6 right-4 sm:right-6 bg-card px-4 sm:px-5 py-2.5 sm:py-3 shadow-luxe z-10">
          <span className="block text-2xs uppercase tracking-[0.15em] text-muted-foreground mb-1 whitespace-nowrap">
            {listing.priceType === 'kauf' ? 'Kaufpreis' : 'Monatlich'}
          </span>
          <span className="text-xl sm:text-2xl font-serif font-semibold text-foreground whitespace-nowrap">
            {formatPrice(listing.price, listing.priceType)}
          </span>
        </div>
      </div>

      {/* Content with extra top padding for overlap */}
      <div className="relative z-0 p-5 sm:p-6 pt-8 sm:pt-10 bg-card border border-t-0 border-border/40">
        {/* Location with gold icon */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 text-gold" />
          <span>{listing.location}</span>
        </div>

        {/* Serif title */}
        <h3 className="font-serif text-lg sm:text-xl md:text-2xl leading-tight mb-4 min-h-[2.75rem] sm:min-h-[3.5rem] text-foreground">
          {listing.title}
        </h3>

        {/* Elegant meta row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground pb-5 border-b border-border/40">
          {listing.rooms > 0 && (
            <>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <BedDouble className="w-4 h-4" />
                <span>{listing.rooms} Zimmer</span>
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gold" />
            </>
          )}
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Maximize className="w-4 h-4" />
            <span>{listing.area} m²</span>
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <Button className="w-full rounded-none" asChild>
            <Link to={detailHref}>
              Mehr erfahren
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </Link>
          </Button>
          <Button className="w-full rounded-none" variant="outline" asChild>
            <Link to={inquiryHref}>
              Besichtigung anfragen
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden" data-stagger-item>
      <div className="aspect-[4/3] bg-surface animate-pulse" />
      <div className="p-6 pt-10 bg-card border border-t-0 border-border/40 space-y-4">
        <div className="h-4 bg-surface rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-surface rounded w-full animate-pulse" />
          <div className="h-6 bg-surface rounded w-2/3 animate-pulse" />
        </div>
        <div className="h-4 bg-surface rounded w-1/2 animate-pulse" />
        <div className="h-12 bg-surface rounded animate-pulse mt-5" />
      </div>
    </div>
  );
}
