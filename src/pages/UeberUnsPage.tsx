import { Link } from 'react-router-dom';
import { MapPin, Users, BarChart3, FileImage, ArrowRight, CheckCircle, Shield, Handshake } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { CTABanner } from '@/components/CTABanner';
import { getSiteUrl } from '@/lib/siteConfig';

const regions = [
  'Edingen-Neckarhausen',
  'Ladenburg',
  'Heidelberg',
  'Mannheim',
  'Schwetzingen',
  'Neckargemünd',
  'Ilvesheim',
  'Weinheim',
];

const approachCards = [
  {
    icon: Users,
    title: 'Persönliche Betreuung',
    description: 'Kein Call-Center, keine Weiterleitungen. Sie haben einen festen Ansprechpartner, der Ihr Anliegen kennt.',
  },
  {
    icon: BarChart3,
    title: 'Marktgerechte Bewertung',
    description: 'Unsere Wertermittlung basiert auf aktuellen Marktdaten und vergleichbaren Transaktionen.',
  },
  {
    icon: FileImage,
    title: 'Überzeugende Vermarktung',
    description: 'Professionelle Fotografie, ansprechende Exposés und gezielte Ansprache qualifizierter Interessenten.',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Transparenz',
    description: 'Sie erhalten regelmäßige Updates und wissen immer, wo wir im Prozess stehen.',
  },
  {
    icon: Handshake,
    title: 'Fairness',
    description: 'Ehrliche Beratung, realistische Einschätzungen – auch wenn es nicht das ist, was Sie hören wollen.',
  },
];

const processSteps = [
  {
    step: 1,
    title: 'Erstgespräch',
    description: 'Wir lernen Ihre Immobilie und Ihre Ziele kennen.',
    benefit: 'Kostenfrei und unverbindlich',
  },
  {
    step: 2,
    title: 'Bewertung',
    description: 'Fundierte Marktanalyse für einen realistischen Angebotspreis.',
    benefit: 'Schriftliche Wertermittlung',
  },
  {
    step: 3,
    title: 'Vermarktung',
    description: 'Professionelles Exposé und zielgerichtete Interessentenansprache.',
    benefit: 'Wöchentliche Status-Updates',
  },
  {
    step: 4,
    title: 'Abschluss',
    description: 'Verhandlungsführung und Begleitung bis zum Notartermin.',
    benefit: 'Service bis zur Schlüsselübergabe',
  },
];

export default function UeberUnsPage() {
  const siteUrl = getSiteUrl();
  return (
    <Layout>
      <SEO
        title="Über uns | ED Immobilien aus Edingen-Neckarhausen"
        description="Lernen Sie ED Immobilien kennen: Werte, Arbeitsweise und regionale Expertise in Edingen-Neckarhausen & Rhein-Neckar-Kreis."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: `${siteUrl}/` },
          { name: 'Über uns', url: `${siteUrl}/ueber-uns` },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Über uns' }]} />
      </div>

      {/* Hero Quote */}
      <Section size="default" className="relative overflow-hidden pt-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="ui-noise-soft absolute inset-0" />
          <div
            className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl ui-parallax-soft"
            data-parallax-soft
            data-parallax-speed="0.03"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center" data-reveal>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
            "Immobilien sind mehr als Quadratmeter.
            Es sind <span className="text-gold">Lebensräume</span>, die Geschichten erzählen."
          </blockquote>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </Section>

      {/* Decorative divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Regional - Split Layout */}
      <Section className="py-0 overflow-hidden">
        <div className="grid lg:grid-cols-2 lg:min-h-[440px]" data-split-reveal>
          {/* Left - Content */}
          <div className="flex items-center p-6 sm:p-8 md:p-10 lg:p-14 xl:p-16 order-2 lg:order-1" data-split-left>
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-px bg-gradient-to-r from-gold to-transparent" />
                <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Unsere Region</span>
              </div>
              <h2 className="font-serif mb-5">Regional verwurzelt</h2>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                ED Immobilien hat seinen Sitz in Edingen-Neckarhausen und ist seit Jahren im Rhein-Neckar-Kreis aktiv.
                Wir verstehen die Besonderheiten jeder Gemeinde – von der Altbauwohnung in Heidelberg bis zum
                Einfamilienhaus in Ladenburg.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {regions.map((region) => (
                  <span
                    key={region}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-surface border border-border/40 hover:border-gold/30 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    {region}
                  </span>
                ))}
              </div>
              <Button size="lg" asChild className="rounded-none">
                <Link to="/kontakt">
                  Erstberatung vereinbaren
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Decorative */}
          <div className="relative bg-primary order-1 lg:order-2 min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-0" data-split-right>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-cream">
                <span className="font-serif text-7xl md:text-8xl block">15+</span>
                <span className="text-cream/60 uppercase tracking-[0.2em] text-sm mt-2 block">Jahre Erfahrung</span>
                <div className="w-16 h-px bg-gold-light mx-auto mt-6" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Approach */}
      <Section size="default">
        <div className="text-center mb-10 md:mb-12" data-reveal>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Unser Ansatz</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="font-serif mb-4">Was uns auszeichnet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Drei Grundsätze, die unsere Arbeit prägen – für Ihren erfolgreichen Immobilienverkauf oder Ihre Vermietung.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-stagger>
          {approachCards.map((card, index) => (
            <article
              key={card.title}
              className={`relative bg-card border border-border/40 p-8 md:p-10 group hover:border-gold/40 transition-all duration-500 overflow-hidden ${
                index === 1 ? 'md:translate-y-6' : ''
              }`}
              data-stagger-item
            >
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/0 via-gold to-gold/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative w-14 h-14 rounded-full border-2 border-gold/30 bg-gold/5 flex items-center justify-center mb-6 group-hover:border-gold/60 group-hover:bg-gold/10 transition-all duration-300">
                <card.icon className="w-6 h-6 text-gold transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </article>
          ))}
        </div>

        {/* Values */}
        <div className="mt-12 pt-10 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto" data-stagger>
            {values.map((value) => (
              <div key={value.title} className="group flex items-start gap-4 p-6 bg-surface hover:bg-surface/80 transition-colors" data-stagger-item>
                <div className="w-12 h-12 rounded-full border-2 border-gold/30 bg-gold/5 flex items-center justify-center shrink-0 group-hover:border-gold/60 transition-colors">
                  <value.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Decorative divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Process - Timeline */}
      <Section variant="surface" size="default">
        <div className="text-center mb-10 md:mb-12" data-reveal>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.2em] font-medium">Prozess</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="font-serif mb-4">Unser Prozess</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Strukturiert, transparent, ergebnisorientiert – so arbeiten wir mit Ihnen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-stagger>
          {processSteps.map((step) => (
            <div key={step.step} className="group bg-card p-7 border border-border/40 hover:border-gold/30 transition-all duration-300 hover:shadow-elegant overflow-hidden relative" data-stagger-item>
              {/* Gold top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" />
              <span className="font-serif text-5xl text-gold/15 block mb-3 group-hover:text-gold/25 transition-colors duration-300">0{step.step}</span>
              <h3 className="font-serif text-xl mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{step.description}</p>
              <div className="flex items-start gap-2 text-sm text-gold pt-4 border-t border-border/40">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{step.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section size="sm" className="bg-cream">
        <div className="max-w-2xl mx-auto text-center" data-reveal>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <h2 className="font-serif mb-4">Bereit für ein Gespräch?</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ob Verkauf, Vermietung oder erste Orientierung – wir beraten Sie gerne persönlich und unverbindlich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="rounded-none">
              <Link to="/kontakt">
                Erstberatung vereinbaren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-none border-border/60">
              <Link to="/kontakt?anliegen=bewertung">
                Immobilie bewerten lassen
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <CTABanner
        headline="Verkaufen oder vermieten – mit Erfahrung und Engagement"
        subline="Lassen Sie uns gemeinsam den besten Weg für Ihre Immobilie finden."
      />
    </Layout>
  );
}
