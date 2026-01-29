import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';

export default function DatenschutzPage() {
  return (
    <Layout>
      <SEO
        title="Datenschutz | ED Immobilien"
        description="Datenschutzhinweise der ED Immobilien – Informationen zu Cookies, Analytics und Ihren Rechten."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Datenschutz', url: 'https://ed-immobilien.de/datenschutz' },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Datenschutz' }]} />
      </div>

      <Section size="sm" className="pt-8 pb-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Datenschutz</span>
          </div>
          <h1 className="font-serif mb-4">Datenschutzerklärung</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung
            personenbezogener Daten auf dieser Website.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6">
          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Verantwortlicher</h2>
            <p className="text-muted-foreground leading-relaxed">
              ED Immobilien<br />
              Musterstraße 12, 68535 Edingen-Neckarhausen<br />
              E-Mail: info@ed-immobilien.de
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              Für Fragen zum Datenschutz wenden Sie sich bitte an die oben genannten Kontaktmöglichkeiten.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Hosting</h2>
            <p className="text-muted-foreground leading-relaxed">
              Diese Website wird bei Vercel (Vercel Inc., USA) gehostet. Vercel verarbeitet technische Daten wie
              IP-Adresse, Zeitpunkt des Zugriffs und Browserinformationen, um die Bereitstellung der Website zu
              ermöglichen.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Cookies &amp; Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              Notwendige Cookies sind für den Betrieb der Website erforderlich. Statistik- und Marketing-Cookies
              werden nur nach Ihrer aktiven Einwilligung gesetzt. Ihre Auswahl können Sie jederzeit in den
              Cookie-Einstellungen ändern.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Analytics (lokal)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Zur Verbesserung der Website nutzen wir eine lokale, datensparsame Statistik ohne Weitergabe
              personenbezogener Daten. Tracking erfolgt nur, wenn Sie der Kategorie „Statistik“ ausdrücklich
              zustimmen.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Rechte der Betroffenen</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie
              Datenübertragbarkeit. Zudem können Sie eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft
              widerrufen.
            </p>
          </div>

          <div className="bg-card border border-border/40 p-6 md:p-8">
            <h2 className="font-serif text-xl md:text-2xl mb-3">Speicherdauer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Personenbezogene Daten speichern wir nur so lange, wie es zur Erfüllung der genannten Zwecke notwendig
              ist oder gesetzliche Aufbewahrungsfristen bestehen.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
