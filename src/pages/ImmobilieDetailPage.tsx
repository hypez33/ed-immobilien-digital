import { Link, useParams } from 'react-router-dom';
import {
  MapPin,
  BedDouble,
  Maximize,
  Home,
  CalendarClock,
  CheckCircle2,
  MapPinned,
  Phone,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Listing } from '@/data/listings';
import { usePublishedListings } from '@/hooks/usePublishedListings';
import { getSiteUrl } from '@/lib/siteConfig';
import NotFound from '@/pages/NotFound';
import type { PublicListing } from '@/lib/listingsService';

const formatPrice = (price: number, type: Listing['priceType']) => {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
  return type === 'miete' ? `${formatted}/Monat` : formatted;
};

const buildInquiryHref = (listing: Listing, anliegen: string) => {
  const params = new URLSearchParams({
    anliegen,
    objekt: listing.id,
    titel: listing.title,
    ort: listing.location,
  });
  return `/kontakt?${params.toString()}`;
};

const getListingDescription = (listing: Listing) => {
  const typeText =
    listing.type === 'Wohnung'
      ? 'Wohnimmobilie'
      : listing.type === 'Haus'
        ? 'Haus'
        : 'Grundstueck';
  return `${listing.title} in ${listing.location} bietet auf ${listing.area} m² eine durchdachte Raumstruktur und ein hochwertiges Umfeld. Als ${typeText.toLowerCase()} eignet sich das Objekt ideal fuer Interessenten, die Wert auf Lage, Substanz und ein klares Preis-Leistungs-Verhaeltnis legen.`;
};

const getListingHighlights = (listing: Listing) => {
  const base = [
    `${listing.area} m² Flaeche`,
    listing.rooms > 0 ? `${listing.rooms} Zimmer` : 'Flexible Nutzungsmoeglichkeiten',
    `Standort ${listing.location}`,
    listing.priceType === 'kauf' ? 'Sofortige Kaufoption' : 'Attraktive Mietkonditionen',
  ];
  if (listing.type === 'Haus') {
    base.push('Geeignet fuer Familien und Homeoffice');
  } else if (listing.type === 'Wohnung') {
    base.push('Effizienter Grundriss mit hoher Alltagstauglichkeit');
  } else {
    base.push('Potenzial fuer individuelle Projektentwicklung');
  }
  return base;
};

const buildGallery = (listing: PublicListing, allListings: PublicListing[]) => {
  const similar = allListings
    .filter((entry) => entry.id !== listing.id && entry.type === listing.type)
    .flatMap((entry) => entry.images?.length ? entry.images : [entry.image])
    .slice(0, 3);
  return [...(listing.images?.length ? listing.images : [listing.image]), ...similar]
    .filter((value, index, arr) => !!value && arr.indexOf(value) === index);
};

export default function ImmobilieDetailPage() {
  const { id } = useParams();
  const { listings: availableListings, isLoading: listingsLoading } = usePublishedListings();
  const listing = availableListings.find((entry) => entry.id === id);
  const siteUrl = getSiteUrl();

  if (!listing) {
    if (listingsLoading) {
      return (
        <Layout>
          <Section size="sm">
            <div className="max-w-xl mx-auto text-center py-20">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Objekt wird geladen...</p>
            </div>
          </Section>
        </Layout>
      );
    }
    return <NotFound />;
  }

  const galleryImages = buildGallery(listing, availableListings);
  const highlights = listing.features?.length ? listing.features : getListingHighlights(listing);
  const description = listing.description?.trim() || getListingDescription(listing);
  const detailUrl = `${siteUrl}/immobilien/${listing.id}`;
  const besichtigungHref = buildInquiryHref(listing, 'besichtigung');
  const rueckrufHref = buildInquiryHref(listing, 'verkauf');

  const metaItems = [
    { icon: MapPin, label: listing.location },
    ...(listing.rooms > 0 ? [{ icon: BedDouble, label: `${listing.rooms} Zimmer` }] : []),
    { icon: Maximize, label: `${listing.area} m²` },
    { icon: Home, label: listing.type },
  ];

  return (
    <Layout>
      <SEO
        title={`${listing.title} | ED Immobilien`}
        description={`${listing.title} in ${listing.location}: ${listing.area} m², ${listing.rooms > 0 ? `${listing.rooms} Zimmer, ` : ''}${formatPrice(listing.price, listing.priceType)}.`}
        canonical={detailUrl}
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: `${siteUrl}/` },
          { name: 'Immobilien', url: `${siteUrl}/immobilien` },
          { name: listing.title, url: detailUrl },
        ]}
      />

      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Immobilien', href: '/immobilien' },
            { label: listing.title },
          ]}
        />
      </div>

      {/* Gallery - full width feel */}
      <Section size="sm" className="pt-2 pb-0">
        <div data-reveal>
          <Carousel
            opts={{ loop: galleryImages.length > 1, align: 'start' }}
            className="group"
          >
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={`${listing.id}-gallery-${index}`}>
                  <ProgressiveImage
                    src={image}
                    alt={`${listing.title} - Ansicht ${index + 1}`}
                    containerClassName="ui-visual-frame border-border/35"
                    className="aspect-[16/10] md:aspect-[2/1] lg:aspect-[2.2/1]"
                    aspectRatio="2 / 1"
                    priority={index === 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {galleryImages.length > 1 && (
              <>
                <CarouselPrevious className="!left-3 !right-auto top-1/2 -translate-y-1/2 rounded-none border-cream/40 bg-primary/70 text-cream hover:bg-primary" />
                <CarouselNext className="!right-3 !left-auto top-1/2 -translate-y-1/2 rounded-none border-cream/40 bg-primary/70 text-cream hover:bg-primary" />
              </>
            )}
          </Carousel>

          {/* Image count indicator */}
          {galleryImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {galleryImages.map((_, i) => (
                <div key={i} className="w-8 h-0.5 bg-border/60" />
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Title + Meta + Price bar */}
      <Section size="sm" className="pt-6 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4" data-reveal>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {listing.featured && (
                <Badge className="bg-gold/10 text-gold border-gold/20">Empfohlen</Badge>
              )}
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {listing.priceType === 'kauf' ? 'Zum Kauf' : 'Zur Miete'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance break-words mb-4">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {metaItems.map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <item.icon className="w-4 h-4 text-gold" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Price block */}
          <div className="shrink-0 bg-card border border-border/40 px-6 py-4">
            <span className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
              {listing.priceType === 'kauf' ? 'Kaufpreis' : 'Miete'}
            </span>
            <span className="font-serif text-3xl sm:text-4xl text-foreground leading-none">
              {formatPrice(listing.price, listing.priceType)}
            </span>
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Content + Sidebar */}
      <Section size="sm" className="pt-6 pb-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-6" data-stagger>
            {/* Description */}
            <article className="bg-card border border-border/40 p-6 hover:border-gold/20 transition-colors" data-stagger-item>
              <h2 className="font-serif text-xl mb-3">Beschreibung</h2>
              <p className="text-muted-foreground leading-relaxed text-[0.95rem]">{description}</p>
            </article>

            {/* Highlights */}
            <article className="bg-card border border-border/40 p-6 hover:border-gold/20 transition-colors" data-stagger-item>
              <h2 className="font-serif text-xl mb-3">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Quick facts grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-stagger-item>
              {[
                { label: 'Fläche', value: `${listing.area} m²` },
                { label: 'Zimmer', value: listing.rooms > 0 ? `${listing.rooms}` : '–' },
                { label: 'Typ', value: listing.type },
                { label: 'Ort', value: listing.location },
              ].map((fact) => (
                <div key={fact.label} className="bg-surface border border-border/30 p-4 text-center">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">{fact.label}</span>
                  <span className="font-serif text-lg text-foreground">{fact.value}</span>
                </div>
              ))}
            </div>

            {/* Location */}
            <article className="bg-card border border-border/40 p-6 hover:border-gold/20 transition-colors" data-stagger-item>
              <div className="flex items-center gap-2 mb-3">
                <MapPinned className="w-4 h-4 text-gold" />
                <h2 className="font-serif text-xl">Lage</h2>
              </div>
              <div className="relative overflow-hidden border border-border/30 min-h-[180px] bg-surface">
                <div className="absolute inset-0 ui-noise-soft" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/8" />
                <div className="relative h-full min-h-[180px] flex items-center justify-center text-center p-6">
                  <div>
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-gold" />
                    <p className="text-sm font-medium text-foreground">{listing.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">Kartenansicht in Kürze verfügbar</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4" data-reveal>
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* CTA card */}
              <div className="bg-primary text-cream p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gold/8 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <h2 className="font-serif text-xl mb-2">Interesse?</h2>
                  <p className="text-cream/70 text-sm mb-5 leading-relaxed">
                    Vereinbaren Sie einen Termin oder fordern Sie einen Rückruf an.
                  </p>
                  <div className="space-y-2.5">
                    <Button size="lg" className="w-full rounded-none bg-cream text-primary hover:bg-gold-light" asChild>
                      <Link to={besichtigungHref}>
                        <CalendarClock className="w-4 h-4 mr-2" />
                        Besichtigung anfragen
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full rounded-none border-cream/30 text-cream hover:bg-cream/10" asChild>
                      <Link to={rueckrufHref}>
                        <Phone className="w-4 h-4 mr-2" />
                        Rückruf anfordern
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-card border border-border/40 p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Auf einen Blick</h3>
                {[
                  { label: 'Preis', value: formatPrice(listing.price, listing.priceType) },
                  { label: 'Objektart', value: listing.type },
                  { label: 'Fläche', value: `${listing.area} m²` },
                  ...(listing.rooms > 0 ? [{ label: 'Zimmer', value: `${listing.rooms}` }] : []),
                  { label: 'Ort', value: listing.location },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm border-b border-border/20 pb-2 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Back link */}
              <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-gold">
                <Link to="/immobilien">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Alle Immobilien
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </Layout>
  );
}
