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
import { listings } from '@/data/listings';
import { immobilienFAQ } from '@/data/faq';

export default function ImmobilienPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoading] = useState(false);

  const [searchForm, setSearchForm] = useState({
    wunschort: '',
    budget: '',
    zimmer: '',
    email: '',
  });

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (filters.location !== 'Alle Orte' && listing.location !== filters.location) {
        return false;
      }
      if (filters.priceType !== 'alle' && listing.priceType !== filters.priceType) {
        return false;
      }
      if (filters.minPrice && listing.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && listing.price > parseInt(filters.maxPrice)) {
        return false;
      }
      if (filters.minRooms && parseInt(filters.minRooms) > 0 && listing.rooms < parseInt(filters.minRooms)) {
        return false;
      }
      if (filters.minArea && listing.area < parseInt(filters.minArea)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area-desc':
          return b.area - a.area;
        default:
          return 0;
      }
    });
  }, [filters]);

  const featuredListings = listings.filter((l) => l.featured);
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
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Immobilien', url: 'https://ed-immobilien.de/immobilien' },
        ]}
      />
      <SchemaOrg type="FAQPage" faqItems={immobilienFAQ} />

      <div className="container">
        <Breadcrumb items={[{ label: 'Immobilien' }]} />
      </div>

      {/* Hero - Premium */}
      <Section size="sm" className="pt-8 pb-12">
        <div className="max-w-3xl" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Portfolio</span>
          </div>
          <h1 className="font-serif mb-4">Unsere Immobilien</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Entdecken Sie exklusive Objekte in besten Lagen des Rhein-Neckar-Kreises.
            Filtern Sie nach Ihren Wünschen oder senden Sie uns einen Suchauftrag.
          </p>
        </div>
      </Section>

      {/* Filter - Refined */}
      <Section size="sm" className="pt-0 pb-10">
        <div className="bg-card p-6 border border-border/40" data-reveal>
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
        </div>
      </Section>

      {/* Featured */}
      {featuredListings.length > 0 && (
        <Section variant="surface" size="lg">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-gold" />
                <span className="text-gold text-sm uppercase tracking-[0.15em]">Empfohlen</span>
              </div>
              <h2 className="font-serif">Unsere Top-Objekte</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </Section>
      )}

      {/* All Listings */}
      <Section size="lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-serif">Alle Objekte</h2>
            <p className="text-muted-foreground mt-2">
              {filteredListings.length} {filteredListings.length === 1 ? 'Immobilie gefunden' : 'Immobilien gefunden'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : hasNoResults ? (
          <div className="bg-card border border-border/40 p-12 md:p-16 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Search className="w-7 h-7 text-gold" />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-foreground">Keine passenden Objekte</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Passen Sie Ihre Filter an oder senden Sie uns einen Suchauftrag –
              wir informieren Sie, sobald passende Immobilien verfügbar sind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
                className="h-12 rounded-none border-border/60"
              >
                Filter zurücksetzen
              </Button>
              <Button asChild className="h-12 rounded-none bg-gold text-cream hover:bg-gold-dark">
                <a href="#suchauftrag">
                  Suchauftrag senden
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </Section>

      {/* Search Request - Premium */}
      <Section variant="surface" size="lg" id="suchauftrag">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Suchauftrag</span>
              <div className="w-12 h-px bg-gold" />
            </div>
            <h2 className="font-serif mb-4">Noch nicht das Passende gefunden?</h2>
            <p className="text-muted-foreground">
              Teilen Sie uns Ihre Wünsche mit – wir melden uns, sobald neue Objekte verfügbar sind.
            </p>
          </div>
          <form onSubmit={handleSearchSubmit} className="bg-card p-8 md:p-10 border border-border/40" data-reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="wunschort" className="text-sm font-medium">Wunschort *</Label>
                <Input
                  id="wunschort"
                  placeholder="z.B. Edingen-Neckarhausen"
                  className="h-12 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.wunschort}
                  onChange={(e) => setSearchForm({ ...searchForm, wunschort: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium">Maximales Budget (€) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="z.B. 350.000"
                  className="h-12 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.budget}
                  onChange={(e) => setSearchForm({ ...searchForm, budget: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="zimmer" className="text-sm font-medium">Mindest-Zimmer</Label>
                <Input
                  id="zimmer"
                  type="number"
                  placeholder="z.B. 3"
                  className="h-12 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.zimmer}
                  onChange={(e) => setSearchForm({ ...searchForm, zimmer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Ihre E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  className="h-12 rounded-none border-border/60 focus:border-gold focus:ring-gold/30"
                  value={searchForm.email}
                  onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full h-13 rounded-none bg-gold text-cream hover:bg-gold-dark">
              <FileSearch className="w-4 h-4 mr-2" />
              Suchauftrag absenden
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Wir behandeln Ihre Daten vertraulich und melden uns zeitnah bei Ihnen.
            </p>
          </form>
        </div>
      </Section>

      {/* FAQ */}
      <Section size="lg">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">FAQ</span>
            </div>
            <h2 className="font-serif mb-4">Häufige Fragen</h2>
            <p className="text-muted-foreground mb-8">
              Antworten rund um Besichtigungen, Anmietung und Kaufprozess.
            </p>
            <Button variant="ghost" asChild className="text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/kontakt">
                Weitere Fragen?
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8">
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
