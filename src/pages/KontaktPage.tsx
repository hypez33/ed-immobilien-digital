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
import { getSiteUrl, siteConfig } from '@/lib/siteConfig';

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefon',
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\s/g, '')}`,
  },
  {
    icon: Mail,
    title: 'E-Mail',
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    title: 'Standort',
    value: siteConfig.addressText,
  },
  {
    icon: Clock,
    title: 'Öffnungszeiten',
    value: siteConfig.openingHoursText,
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
          { name: 'Startseite', url: `${getSiteUrl()}/` },
          { name: 'Kontakt', url: `${getSiteUrl()}/kontakt` },
        ]}
      />
      <SchemaOrg type="FAQPage" faqItems={kontaktFAQ} />

      <div className="container">
        <Breadcrumb items={[{ label: 'Kontakt' }]} />
      </div>

      {/* Contact Section - Split Layout */}
      <Section size="default" className="relative overflow-hidden pt-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="ui-noise-soft absolute inset-0" />
          <div className="absolute -left-12 top-12 h-44 w-44 rounded-full bg-gold/10 blur-3xl" />
          <div
            className="absolute right-[-4rem] top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl ui-parallax-soft"
            data-parallax-soft
            data-parallax-speed="0.03"
          />
        </div>
        <div className="relative grid lg:grid-cols-5 gap-10 lg:gap-0">
          {/* Form - 3 cols */}
          <div className="lg:col-span-3 lg:pr-14" data-reveal>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Kontakt</span>
            </div>
            <h1 className="font-serif mb-3">Sprechen Sie mit uns</h1>
            <p className="text-muted-foreground/90 mb-8 max-w-lg leading-relaxed">
              Füllen Sie das Formular aus – wir melden uns innerhalb von 24 Stunden.
            </p>

            <ContactForm />
          </div>

          {/* Info Sidebar - 2 cols */}
          <aside className="lg:col-span-2" data-reveal>
            <div className="bg-primary text-cream p-8 md:p-10 h-full relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/8 rounded-full blur-3xl pointer-events-none" />

              <h3 className="font-serif text-2xl mb-6 relative">Kontaktdaten</h3>

              {/* Contact items with gold icons */}
              <div className="space-y-5 relative">
                {contactInfo.map((item) => {
                  const content = (
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full border border-gold-light/40 bg-gold-light/5 flex items-center justify-center flex-shrink-0 group-hover:border-gold-light/70 transition-colors">
                        <item.icon className="w-5 h-5 text-gold-light" />
                      </div>
                      <div>
                        <span className="text-cream/50 text-xs uppercase tracking-wider block mb-1">{item.title}</span>
                        <p className="text-cream font-medium group-hover:text-gold-light transition-colors">{item.value}</p>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={item.title} href={item.href} className="block">{content}</a>
                  ) : (
                    <div key={item.title}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-cream/10 relative">
                <p className="text-cream/70 text-sm leading-relaxed">
                  Besichtigungstermine auch außerhalb der Bürozeiten nach Absprache möglich.
                </p>
              </div>

              <div className="mt-6">
                <div className="w-12 h-px bg-gold-light" />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Decorative divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* FAQ */}
      <Section variant="surface" size="default">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14" data-split-reveal>
          <div className="lg:col-span-4" data-split-left>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
              <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">FAQ</span>
            </div>
            <h2 className="font-serif mb-4">Häufige Fragen</h2>
            <p className="text-muted-foreground/90 mb-6 leading-relaxed">
              Antworten auf häufig gestellte Fragen rund um Kontaktaufnahme und Termine.
            </p>
            <Button variant="ghost" asChild className="group text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/immobilien">
                Immobilien ansehen
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8" data-split-right>
            <FAQAccordion items={kontaktFAQ} />
          </div>
        </div>
      </Section>
    </Layout>
  );
}
