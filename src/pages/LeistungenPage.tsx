import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { ServiceSection } from '@/components/services/ServiceSection';

export default function LeistungenPage() {
  return (
    <Layout>
      <SEO
        title="Leistungen | ED Immobilien"
        description="Alle Leistungen von ED Immobilien: Bewertung, Verkauf, Vermietung und weitere Services – schnell die passende Anfrage stellen."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Leistungen', url: 'https://ed-immobilien.de/leistungen' },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Leistungen' }]} />
      </div>

      <Section size="sm" className="pt-8 pb-6">
        <div className="max-w-3xl" data-reveal>
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

      <ServiceSection />
    </Layout>
  );
}
