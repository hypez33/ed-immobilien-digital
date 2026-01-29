import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';

export default function ImpressumPage() {
  return (
    <Layout>
      <SEO
        title="Impressum | ED Immobilien"
        description="Impressum der ED Immobilien – rechtliche Anbieterinformationen und Kontaktdaten."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Impressum', url: 'https://ed-immobilien.de/impressum' },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Impressum' }]} />
      </div>

      <Section size="sm" className="pt-8 pb-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Rechtliches</span>
          </div>
          <h1 className="font-serif mb-4">Impressum</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Angaben gemäß § 5 TMG – bitte ersetzen Sie die Platzhalter mit Ihren tatsächlichen Daten.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6">
          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Anbieter</h2>
            <p className="text-muted-foreground leading-relaxed">
              ED Immobilien<br />
              Musterstraße 12<br />
              68535 Edingen-Neckarhausen<br />
              Deutschland
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              Telefon: +49 (0) 123 456789<br />
              E-Mail: info@ed-immobilien.de
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Vertretungsberechtigter</h2>
            <p className="text-muted-foreground leading-relaxed">
              Max Mustermann (Geschäftsführer)
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Register &amp; Steuern</h2>
            <p className="text-muted-foreground leading-relaxed">
              Handelsregister: Amtsgericht Mannheim, HRB 000000 (Platzhalter)<br />
              Umsatzsteuer-ID: DE000000000 (Platzhalter)
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Haftung &amp; Urheberrecht</h2>
            <p className="text-muted-foreground leading-relaxed">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Die Inhalte und
              Werke auf dieser Website unterliegen dem deutschen Urheberrecht.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
