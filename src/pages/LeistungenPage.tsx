import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { ServiceSection } from '@/components/services/ServiceSection';
import { getSiteUrl } from '@/lib/siteConfig';

const stats = [
  { value: '15+', label: 'Jahre Erfahrung' },
  { value: '500+', label: 'Zufriedene Kunden' },
  { value: '24h', label: 'Rückmeldung' },
];

export default function LeistungenPage() {
  const siteUrl = getSiteUrl();
  return (
    <Layout>
      <SEO
        title="Leistungen | ED Immobilien"
        description="Alle Leistungen von ED Immobilien: Bewertung, Verkauf, Vermietung und weitere Services – schnell die passende Anfrage stellen."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: `${siteUrl}/` },
          { name: 'Leistungen', url: `${siteUrl}/leistungen` },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Leistungen' }]} />
      </div>

      {/* Hero section */}
      <Section size="sm" className="relative overflow-hidden pt-8 pb-6">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="ui-noise-soft absolute inset-0" />
          <div
            className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl ui-parallax-soft"
            data-parallax-soft
            data-parallax-speed="0.03"
          />
          <div className="absolute left-0 top-1/2 w-32 h-32 border border-gold/8 rounded-full hidden lg:block" />
          <div className="absolute right-20 bottom-0 w-48 h-48 border border-gold/6 rounded-full hidden lg:block" />
        </div>

        <div className="relative max-w-3xl" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Leistungen</span>
          </div>
          <h1 className="font-serif mb-4">Alles aus einer Hand</h1>
          <p className="text-lg text-muted-foreground/90 leading-relaxed mb-10">
            Wählen Sie den passenden Service – wir kümmern uns um die nächsten Schritte und melden uns
            innerhalb von 24 Stunden.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 md:gap-12" data-stagger data-stagger-once="true">
            {stats.map((stat) => (
              <div key={stat.label} className="group" data-stagger-item>
                <span className="block font-serif text-3xl md:text-4xl text-foreground mb-1">{stat.value}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-[0.1em]">{stat.label}</span>
                <div className="h-[2px] w-0 group-hover:w-full bg-gold/40 transition-all duration-500 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Decorative divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <ServiceSection showHeader={false} />

      {/* Bottom CTA */}
      <Section size="default" className="bg-cream relative overflow-hidden">
        <div className="absolute top-8 right-12 w-24 h-24 border border-gold/10 rounded-full pointer-events-none hidden lg:block" />
        <div className="text-center max-w-2xl mx-auto" data-reveal data-reveal-once="true">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Kontakt</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="font-serif mb-4">Nicht sicher, welcher Service passt?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Kein Problem – rufen Sie uns an oder schreiben Sie uns. Wir beraten Sie unverbindlich und finden gemeinsam die beste Lösung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="group rounded-none">
              <Link to="/kontakt">
                <Phone className="w-4 h-4 mr-2" />
                Kostenlose Beratung
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
