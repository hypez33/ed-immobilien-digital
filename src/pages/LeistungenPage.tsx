import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { ServiceSection } from '@/components/services/ServiceSection';
import { getSiteUrl } from '@/lib/siteConfig';

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

      <Section size="sm" className="relative overflow-hidden pt-8 pb-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="ui-noise-soft absolute inset-0" />
          <div
            className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-gold/10 blur-3xl ui-parallax-soft"
            data-parallax-soft
            data-parallax-speed="0.03"
          />
        </div>
        <div className="relative max-w-3xl" data-reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Leistungen</span>
          </div>
          <h1 className="font-serif mb-4">Alles aus einer Hand</h1>
          <p className="text-lg text-muted-foreground/90 leading-relaxed">
            Wählen Sie den passenden Service – wir kümmern uns um die nächsten Schritte und melden uns
            innerhalb von 24 Stunden.
          </p>
        </div>
      </Section>

      <ServiceSection showHeader={false} />
    </Layout>
  );
}
