import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, Home, Key, Star, ChevronDown } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { ListingCard } from '@/components/cards/ListingCard';
import { FAQAccordion } from '@/components/FAQAccordion';
import { CTABanner } from '@/components/CTABanner';
import { ServiceSection } from '@/components/services/ServiceSection';
import { BlogCard } from '@/components/cards/BlogCard';
import { listings } from '@/data/listings';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { homeFAQ } from '@/data/faq';
import { scrollToTarget } from '@/lib/smoothScroll';
import heroImage from '@/assets/hero-home.jpg';

const services = [
  {
    icon: FileSearch,
    title: 'Immobilienbewertung',
    description: 'Erfahren Sie den realistischen Marktwert Ihrer Immobilie – fundiert und kostenfrei.',
    features: [
      'Kostenfreie Erstberatung vor Ort',
      'Aktuelle Vergleichswertanalyse',
      'Schriftliche Wertermittlung binnen 48h',
    ],
    ctaText: 'Bewertung anfragen',
    ctaHref: '/kontakt?anliegen=bewertung',
  },
  {
    icon: Home,
    title: 'Immobilienverkauf',
    description: 'Vom ersten Gespräch bis zum Notartermin – Ihr Verkauf in erfahrenen Händen.',
    features: [
      'Professionelles Foto-Exposé',
      'Vorqualifizierte Kaufinteressenten',
      'Begleitung bis zur Schlüsselübergabe',
    ],
    ctaText: 'Verkauf besprechen',
    ctaHref: '/kontakt?anliegen=verkauf',
  },
  {
    icon: Key,
    title: 'Vermietung',
    description: 'Schnelle Mietersuche mit sorgfältiger Prüfung – für nachhaltige Mietverhältnisse.',
    features: [
      'Zielgruppengerechte Mietersuche',
      'Bonitätsprüfung & Referenzen',
      'Rechtssichere Vertragsgestaltung',
    ],
    ctaText: 'Vermietung anfragen',
    ctaHref: '/kontakt?anliegen=vermietung',
  },
];

const processSteps = [
  {
    step: 1,
    title: 'Erstgespräch',
    description: 'Wir besichtigen Ihre Immobilie und verstehen Ihre Ziele – kostenfrei und unverbindlich.',
  },
  {
    step: 2,
    title: 'Exposé-Erstellung',
    description: 'Professionelle Fotos und ein hochwertiges Exposé präsentieren Ihr Objekt optimal.',
  },
  {
    step: 3,
    title: 'Vermarktung',
    description: 'Gezielte Ansprache passender Interessenten über die effektivsten Kanäle.',
  },
  {
    step: 4,
    title: 'Abschluss',
    description: 'Verhandlungsbegleitung und Koordination bis zum erfolgreichen Notartermin.',
  },
];


export default function HomePage() {
  const featuredListings = listings.slice(0, 3);
  const featuredPosts = useBlogPosts({ publicOnly: true }).slice(0, 2);
  const handleDiscoverClick = () => {
    if (typeof window === 'undefined') return;
    const header = document.querySelector('header');
    const headerOffset = header ? header.getBoundingClientRect().height : 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollToTarget('#services', {
      offset: -(headerOffset + 8),
      immediate: reduceMotion,
    });
  };

  return (
    <Layout>
      <SEO
        title="ED Immobilien | Makler im Rhein-Neckar-Kreis"
        description="ED Immobilien aus Edingen-Neckarhausen: Verkauf & Vermietung im Rhein-Neckar-Kreis. Bewertung, Exposé, Vermarktung – Termin anfragen."
      />
      <SchemaOrg type="LocalBusiness" />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[{ name: 'Startseite', url: 'https://ed-immobilien.de/' }]}
      />
      <SchemaOrg type="FAQPage" faqItems={homeFAQ} />

      {/* Hero Section - Premium Redesign */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modernes Einfamilienhaus im Rhein-Neckar-Kreis"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-8 lg:left-12 w-px h-32 bg-gradient-to-b from-gold-light to-transparent hidden md:block" />
        <div className="absolute bottom-1/4 right-8 lg:right-12 w-px h-32 bg-gradient-to-t from-gold-light to-transparent hidden md:block" />

        <div className="container relative py-16 sm:py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-stagger>
              {/* Pre-title */}
              <div className="flex items-center gap-4 mb-8" data-stagger-item>
                <div className="w-12 h-px bg-gold-light" />
                <span className="text-gold-light text-sm uppercase tracking-[0.2em]">
                  Rhein-Neckar-Kreis
                </span>
              </div>

              {/* Main headline - serif */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-cream leading-[1.05] mb-8" data-stagger-item>
                Exklusive Immobilien.
                <br />
                <span className="text-gold-light">Persönliche Betreuung.</span>
              </h1>

              {/* Subline */}
              <p className="text-cream/70 text-lg md:text-xl max-w-lg mb-10 leading-relaxed" data-stagger-item>
                Ihr vertrauensvoller Partner für Verkauf und Vermietung
                erstklassiger Immobilien in der Metropolregion.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4" data-stagger-item>
                <Button
                  size="lg"
                  asChild
                  className="bg-gold-light text-primary hover:bg-gold hover:text-cream rounded-none"
                >
                  <Link to="/kontakt">
                    Kostenlose Beratung
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-cream/30 bg-transparent text-cream hover:bg-cream/10 rounded-none"
                >
                  <Link to="/immobilien">
                    Objekte entdecken
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats overlay card */}
            <div className="hidden lg:flex justify-end">
              <div className="bg-card/95 backdrop-blur-sm p-8 shadow-luxe max-w-xs border border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-5 h-5 text-gold" />
                  <span className="text-2xs uppercase tracking-[0.15em] text-muted-foreground">Erfahrung</span>
                </div>
                <span className="font-serif text-5xl text-foreground block">15+</span>
                <span className="text-muted-foreground mt-1 block">Jahre am Markt</span>
                <div className="w-12 h-px bg-gold mt-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={handleDiscoverClick}
          aria-label="Zu den Leistungen scrollen"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/60 focus-visible:ring-offset-4 focus-visible:ring-offset-primary"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Entdecken</span>
          <ChevronDown className="w-5 h-5 animate-gentle-float" />
        </button>
      </section>

      {/* Services - Staggered layout */}
      <Section size="lg" id="services">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Leistungen</span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="font-serif mb-4">Unsere Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Von der ersten Beratung bis zum erfolgreichen Abschluss – professionell und persönlich.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-stagger>
          {services.map((service, index) => (
            <div key={service.title} className={index === 1 ? 'md:translate-y-8' : ''}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </Section>

      {/* Services */}
      <ServiceSection />

      {/* Blog */}
      <Section size="lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" data-reveal>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Blog</span>
            </div>
            <h2 className="font-serif">Aktuelle Einblicke</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Marktentwicklungen, Checklisten und Tipps – kompakt für Sie zusammengefasst.
            </p>
          </div>
          <Button variant="ghost" asChild className="text-gold hover:text-gold hover:bg-gold/5">
            <Link to="/blog">
              Alle Beiträge ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" data-stagger>
          {featuredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      {/* Listings */}
      <Section variant="surface" size="lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Portfolio</span>
            </div>
            <h2 className="font-serif">Aktuelle Immobilien</h2>
          </div>
          <Button variant="ghost" asChild className="text-gold hover:text-gold hover:bg-gold/5">
            <Link to="/immobilien">
              Alle ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" data-stagger>
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </Section>

      {/* Process - Vertical Timeline */}
      <Section size="lg" className="bg-cream">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Prozess</span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="font-serif">Ihr Weg zum Erfolg</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical gold line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-0" data-stagger>
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${index > 0 ? 'md:mt-16' : ''}`}
                data-stagger-item
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-card p-8 border border-border/40 inline-block w-full max-w-sm">
                    <span className="font-serif text-5xl text-gold/20 block mb-3">0{step.step}</span>
                    <h3 className="font-serif text-xl mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="w-4 h-4 rounded-full bg-gold z-10 hidden md:block" />

                {/* Empty space for alternating */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild className="rounded-none">
            <Link to="/kontakt">
              Erstberatung vereinbaren
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="surface" size="lg">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">FAQ</span>
            </div>
            <h2 className="font-serif mb-4">Häufige Fragen</h2>
            <p className="text-muted-foreground mb-8">
              Antworten auf die wichtigsten Fragen rund um Verkauf, Vermietung und Bewertung.
            </p>
            <Button variant="ghost" asChild className="text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/kontakt">
                Weitere Fragen?
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={homeFAQ} />
          </div>
        </div>
      </Section>

      {/* CTA Banner */}
      <CTABanner
        headline="Bereit für den nächsten Schritt?"
        subline="Vereinbaren Sie jetzt Ihre kostenfreie Erstberatung – unverbindlich und persönlich."
      />
    </Layout>
  );
}
