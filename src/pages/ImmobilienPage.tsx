import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileSearch, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListingCard, ListingCardSkeleton } from '@/components/cards/ListingCard';
import { FilterBar, FilterState, defaultFilters } from '@/components/FilterBar';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTABanner } from '@/components/CTABanner';
import { usePublishedListings } from '@/hooks/usePublishedListings';
import { immobilienFAQ } from '@/data/faq';
import { getSiteUrl } from '@/lib/siteConfig';

export default function ImmobilienPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const { listings: availableListings, isLoading: remoteLoading } = usePublishedListings();
  const siteUrl = getSiteUrl();

  const [searchForm, setSearchForm] = useState({
    wunschort: '',
    budget: '',
    zimmer: '',
    email: '',
  });

  const filteredListings = useMemo(() => {
    return availableListings.filter((listing) => {
      if (filters.location !== 'Alle Orte' && listing.location !== filters.location) return false;
      if (filters.priceType !== 'alle' && listing.priceType !== filters.priceType) return false;
      if (filters.minPrice && listing.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && listing.price > parseInt(filters.maxPrice)) return false;
      if (filters.minRooms && parseInt(filters.minRooms) > 0 && listing.rooms < parseInt(filters.minRooms)) return false;
      if (filters.minArea && listing.area < parseInt(filters.minArea)) return false;
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'area-desc': return b.area - a.area;
        default: return 0;
      }
    });
  }, [filters, availableListings]);

  const locationOptions = useMemo(
    () => ['Alle Orte', ...Array.from(new Set(availableListings.map((listing) => listing.location))).sort((a, b) => a.localeCompare(b))],
    [availableListings]
  );
  const featuredListings = availableListings.filter((l) => l.featured);
  const nonFeaturedListings = filteredListings.filter((l) => !l.featured);
  const isLoading = remoteLoading && availableListings.length === 0;
  const hasNoResults = filteredListings.length === 0 && !isLoading;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Suchauftrag:', searchForm);
    alert('Vielen Dank! Wir melden uns, sobald passende Objekte verfügbar sind.');
    setSearchForm({ wunschort: '', budget: '', zimmer: '', email: '' });
  };

  return (
    <Layout>
      <SEO
        title="Immobilienangebote Rhein-Neckar-Kreis | ED Immobilien"
        description="Finden Sie Häuser & Wohnungen im Rhein-Neckar-Kreis. Filtern nach Ort, Preis, Zimmern – Details ansehen und Besichtigung anfragen."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: `${siteUrl}/` },
          { name: 'Immobilien', url: `${siteUrl}/immobilien` },
        ]}
      />
      <SchemaOrg type="FAQPage" faqItems={immobilienFAQ} />

      <div className="container">
        <Breadcrumb items={[{ label: 'Immobilien' }]} />
      </div>

      {/* Hero + Filter combined */}
      <Section size="sm" className="relative overflow-hidden pt-6 pb-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="ui-noise-soft absolute inset-0" />
          <div className="absolute -right-12 top-10 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative" data-reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
                <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Portfolio</span>
              </div>
              <h1 className="font-serif mb-2">Unsere Immobilien</h1>
              <p className="text-muted-foreground">
                Exklusive Objekte in besten Lagen des Rhein-Neckar-Kreises.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-serif text-2xl text-foreground mr-1">{availableListings.length}</span>
              Objekte verfügbar
            </div>
          </div>

          {/* Filter bar integrated */}
          <div className="bg-card border border-border/40 p-5 md:p-6 hover:border-gold/20 transition-colors">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
              locations={locationOptions}
            />
          </div>
        </div>
      </Section>

      {/* Featured */}
      {featuredListings.length > 0 && (
        <Section size="sm" className="bg-surface pt-6 pb-8">
          <div className="flex items-center gap-4 mb-6" data-reveal>
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em] font-medium">Empfohlen</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </Section>
      )}

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* All Listings */}
      <Section size="sm" className="pt-6 pb-8">
        <div className="flex items-center justify-between mb-6" data-reveal>
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl">Alle Objekte</h2>
            <span className="text-sm text-muted-foreground bg-surface px-3 py-1 border border-border/40">
              {filteredListings.length} {filteredListings.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : hasNoResults ? (
          <div className="bg-card border border-border/40 p-10 md:p-14 text-center max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full border-2 border-gold/30 bg-gold/5 flex items-center justify-center mx-auto mb-5">
              <Search className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-xl mb-3 text-foreground">Keine passenden Objekte</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              Passen Sie Ihre Filter an oder senden Sie uns einen Suchauftrag.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(defaultFilters)}
                className="rounded-none border-border/60"
              >
                Filter zurücksetzen
              </Button>
              <Button size="sm" asChild className="rounded-none">
                <a href="#suchauftrag">
                  Suchauftrag senden
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {(featuredListings.length > 0 ? nonFeaturedListings : filteredListings).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Search Request */}
      <Section size="default" id="suchauftrag" className="bg-surface">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left - Text */}
          <div data-reveal>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Suchauftrag</span>
            </div>
            <h2 className="font-serif mb-4">Noch nicht das Passende gefunden?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Teilen Sie uns Ihre Wünsche mit – wir melden uns, sobald neue Objekte verfügbar sind.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gold">1</span>
                </div>
                <p className="text-sm text-muted-foreground">Suchkriterien angeben und absenden</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gold">2</span>
                </div>
                <p className="text-sm text-muted-foreground">Wir suchen passende Objekte für Sie</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-gold">3</span>
                </div>
                <p className="text-sm text-muted-foreground">Sie erhalten Vorschläge per E-Mail</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSearchSubmit} className="bg-card p-7 md:p-8 border border-border/40 hover:border-gold/20 transition-colors" data-reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="space-y-1.5">
                <Label htmlFor="wunschort" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wunschort *</Label>
                <Input
                  id="wunschort"
                  placeholder="z.B. Heidelberg"
                  className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.wunschort}
                  onChange={(e) => setSearchForm({ ...searchForm, wunschort: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Budget (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="z.B. 350.000"
                  className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.budget}
                  onChange={(e) => setSearchForm({ ...searchForm, budget: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="space-y-1.5">
                <Label htmlFor="zimmer" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Zimmer (min.)</Label>
                <Input
                  id="zimmer"
                  type="number"
                  placeholder="z.B. 3"
                  className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.zimmer}
                  onChange={(e) => setSearchForm({ ...searchForm, zimmer: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  className="h-11 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.email}
                  onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full rounded-none">
              <FileSearch className="w-4 h-4 mr-2" />
              Suchauftrag absenden
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Wir behandeln Ihre Daten vertraulich.
            </p>
          </form>
        </div>
      </Section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* FAQ */}
      <Section size="sm">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12" data-split-reveal>
          <div className="lg:col-span-4" data-split-left>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">FAQ</span>
            </div>
            <h2 className="font-serif mb-3">Häufige Fragen</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Antworten rund um Besichtigungen, Anmietung und Kaufprozess.
            </p>
            <Button variant="ghost" asChild className="group text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/kontakt">
                Weitere Fragen?
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8" data-split-right>
            <FAQAccordion items={immobilienFAQ} />
          </div>
        </div>
      </Section>

      <CTABanner
        headline="Sie möchten Ihre Immobilie verkaufen?"
        subline="Erfahren Sie kostenfrei, was Ihre Immobilie aktuell wert ist."
        primaryText="Kostenlose Bewertung"
        primaryHref="/kontakt?anliegen=bewertung"
      />
    </Layout>
  );
}
