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

  return [ ...(listing.images?.length ? listing.images : [listing.image]), ...similar]
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
          <Section size="lg">
            <div className="max-w-xl mx-auto text-center">
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

      <Section size="sm" className="pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="max-w-5xl" data-reveal>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Objektdetails</span>
          </div>

          {listing.featured && (
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">Empfohlen</Badge>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-balance break-words mb-5">
            {listing.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-muted-foreground mb-7">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              {listing.location}
            </span>
            {listing.rooms > 0 && (
              <span className="inline-flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-gold" />
                {listing.rooms} Zimmer
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Maximize className="w-4 h-4 text-gold" />
              {listing.area} m²
            </span>
            <span className="inline-flex items-center gap-2">
              <Home className="w-4 h-4 text-gold" />
              {listing.type}
            </span>
          </div>

        </div>
      </Section>

      <Section size="default" className="pt-2 md:pt-4">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
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
                        className="aspect-[16/10] md:aspect-[16/9]"
                        aspectRatio="16 / 9"
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
            </div>

            <div className="flex justify-end" data-reveal data-reveal-once="true">
              <div className="inline-flex flex-col gap-2 bg-card border border-border/40 px-5 py-4 shadow-card">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {listing.priceType === 'kauf' ? 'Kaufpreis' : 'Miete'}
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-foreground leading-none">
                  {formatPrice(listing.price, listing.priceType)}
                </span>
              </div>
            </div>

            <div className="space-y-8" data-stagger>
              <article className="bg-card border border-border/40 p-6 md:p-7" data-stagger-item>
                <h2 className="font-serif text-2xl mb-4">Beschreibung</h2>
                <p className="text-readable-muted leading-relaxed">{description}</p>
              </article>

              <article className="bg-card border border-border/40 p-6 md:p-7" data-stagger-item>
                <h2 className="font-serif text-2xl mb-4">Highlights</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 mt-1 text-gold flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="bg-card border border-border/40 p-6 md:p-7" data-stagger-item>
                <h2 className="font-serif text-2xl mb-4">Lage</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPinned className="w-4 h-4 text-gold" />
                  <span>{listing.location}</span>
                </div>
                <div className="relative overflow-hidden border border-border/40 min-h-[220px] bg-surface">
                  <div className="absolute inset-0 ui-noise-soft" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-gold/10" />
                  <div className="relative h-full min-h-[220px] flex items-center justify-center text-center p-6">
                    <div>
                      <MapPin className="w-8 h-8 mx-auto mb-3 text-gold" />
                      <p className="font-medium text-foreground">Lage-Placeholder</p>
                      <p className="text-sm text-muted-foreground">
                        Kartenansicht fuer {listing.location} kann spaeter angebunden werden.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <aside className="lg:col-span-4" data-reveal data-reveal-variant="left">
            <div className="bg-card border border-border/40 p-6 md:p-7 lg:sticky lg:top-28 space-y-6">
              <div>
                <h2 className="font-serif text-2xl mb-3">Interesse am Objekt?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Vereinbaren Sie direkt einen Termin oder fordern Sie einen Rueckruf an.
                </p>
              </div>
              <div className="space-y-3">
                <Button size="lg" className="w-full rounded-none" asChild>
                  <Link to={besichtigungHref}>
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Besichtigung anfragen
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full rounded-none" asChild>
                  <Link to={rueckrufHref}>
                    <Phone className="w-4 h-4 mr-2" />
                    Rueckruf anfordern
                  </Link>
                </Button>
              </div>
              <div className="border-t border-border/40 pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span>Preis</span>
                  <span className="font-medium text-foreground">{formatPrice(listing.price, listing.priceType)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Objektart</span>
                  <span className="font-medium text-foreground">{listing.type}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Ort</span>
                  <span className="font-medium text-foreground">{listing.location}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </Layout>
  );
}
