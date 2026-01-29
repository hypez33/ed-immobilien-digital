import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/ContactForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { kontaktFAQ } from '@/data/faq';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefon',
    value: '+49 (0) 123 456789',
  },
  {
    icon: Mail,
    title: 'E-Mail',
    value: 'info@ed-immobilien.de',
  },
  {
    icon: MapPin,
    title: 'Standort',
    value: 'Edingen-Neckarhausen',
  },
  {
    icon: Clock,
    title: 'Öffnungszeiten',
    value: 'Mo–Fr: 9:00–18:00 Uhr',
  },
];

export default function KontaktPage() {
  return (
    <Layout>
      <SEO
        title="Kontakt | ED Immobilien – Termin & Bewertung anfragen"
        description="Kontaktieren Sie ED Immobilien: Termin, Bewertung oder Besichtigung. Schnell per Formular – wir melden uns zeitnah zurück."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Kontakt', url: 'https://ed-immobilien.de/kontakt' },
        ]}
      />
      <SchemaOrg type="FAQPage" faqItems={kontaktFAQ} />

      <div className="container">
        <Breadcrumb items={[{ label: 'Kontakt' }]} />
      </div>

      {/* Contact Section - Split Layout */}
      <Section size="lg" className="pt-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-0">
          {/* Form - 3 cols */}
          <div className="lg:col-span-3 lg:pr-16" data-reveal>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-gold text-sm uppercase tracking-[0.15em]">Kontakt</span>
            </div>
            <h1 className="font-serif mb-4">Sprechen Sie mit uns</h1>
            <p className="text-muted-foreground/90 mb-10 max-w-lg leading-relaxed">
              Wir freuen uns darauf, Sie kennenzulernen und Ihre Immobilienziele zu besprechen.
              Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.
            </p>

            <ContactForm />
          </div>

          {/* Info Sidebar - 2 cols */}
          <aside className="lg:col-span-2" data-reveal>
            <div className="bg-primary text-cream p-8 md:p-10 lg:p-12 h-full">
              <h3 className="font-serif text-2xl mb-8">Kontaktdaten</h3>

              {/* Contact items with gold icons */}
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold-light/40 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold-light" />
                    </div>
                    <div>
                      <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">{item.title}</span>
                      <p className="text-cream font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-cream/10">
                <p className="text-cream/70 text-sm leading-relaxed">
                  Besichtigungstermine auch außerhalb der Bürozeiten nach Absprache möglich.
                </p>
              </div>

              <div className="mt-8">
                <div className="w-12 h-px bg-gold-light" />
              </div>
            </div>
          </aside>
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
            <p className="text-muted-foreground/90 mb-8 leading-relaxed">
              Antworten auf häufig gestellte Fragen rund um Kontaktaufnahme und Termine.
            </p>
            <Button variant="ghost" asChild className="text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/immobilien">
                Immobilien ansehen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={kontaktFAQ} />
          </div>
        </div>
      </Section>
    </Layout>
  );
}
