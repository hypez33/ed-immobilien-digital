import { Link } from 'react-router-dom';
import { MapPin, Users, BarChart3, FileImage, ArrowRight, CheckCircle, Shield, Handshake } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/button';
import { CTABanner } from '@/components/CTABanner';

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
  return (
    <Layout>
      <SEO
        title="Über uns | ED Immobilien aus Edingen-Neckarhausen"
        description="Lernen Sie ED Immobilien kennen: Werte, Arbeitsweise und regionale Expertise in Edingen-Neckarhausen & Rhein-Neckar-Kreis."
      />
      <SchemaOrg
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Startseite', url: 'https://ed-immobilien.de/' },
          { name: 'Über uns', url: 'https://ed-immobilien.de/ueber-uns' },
        ]}
      />

      <div className="container">
        <Breadcrumb items={[{ label: 'Über uns' }]} />
      </div>

      {/* Hero Quote */}
      <Section size="lg" className="pt-8">
        <div className="max-w-4xl mx-auto text-center" data-reveal>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-foreground">
            "Immobilien sind mehr als Quadratmeter.
            Es sind <span className="text-gold">Lebensräume</span>, die Geschichten erzählen."
          </blockquote>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </Section>

      {/* Regional - Split Layout */}
      <Section className="py-0 overflow-hidden">
        <div className="grid lg:grid-cols-2 lg:min-h-[500px]">
          {/* Left - Content */}
          <div className="flex items-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-gold" />
                <span className="text-gold text-sm uppercase tracking-[0.15em]">Unsere Region</span>
              </div>
              <h2 className="font-serif mb-6">Regional verwurzelt</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                ED Immobilien hat seinen Sitz in Edingen-Neckarhausen und ist seit Jahren im Rhein-Neckar-Kreis aktiv.
                Wir verstehen die Besonderheiten jeder Gemeinde – von der Altbauwohnung in Heidelberg bis zum
                Einfamilienhaus in Ladenburg.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {regions.map((region) => (
                  <span
                    key={region}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-surface border border-border/40"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    {region}
                  </span>
                ))}
              </div>
              <Button asChild className="h-12 rounded-none bg-gold text-cream hover:bg-gold-dark">
                <Link to="/kontakt">
                  Erstberatung vereinbaren
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Decorative */}
          <div className="relative bg-primary order-1 lg:order-2 min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-0">
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
      <Section size="lg">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Unser Ansatz</span>
            <div className="w-12 h-px bg-gold" />
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
              className={`relative bg-card border border-border/40 p-8 md:p-10 group hover:border-gold/40 transition-all duration-500 ${
                index === 1 ? 'md:translate-y-8' : ''
              }`}
              data-stagger-item
            >
              {/* Gold corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-px h-8 bg-gold/30" />
                <div className="absolute top-0 right-0 h-px w-8 bg-gold/30" />
              </div>

              <div className="w-14 h-14 rounded-full border-2 border-gold/30 flex items-center justify-center mb-6 group-hover:border-gold/60 transition-colors">
                <card.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-xl mb-3 text-foreground">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </article>
          ))}
        </div>

        {/* Values */}
        <div className="mt-16 pt-16 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto" data-stagger>
            {values.map((value) => (
              <div key={value.title} className="flex items-start gap-4 p-6 bg-surface" data-stagger-item>
                <div className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center shrink-0">
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

      {/* Process - Timeline */}
      <Section variant="surface" size="lg">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.15em]">Prozess</span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="font-serif mb-4">Unser Prozess</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Strukturiert, transparent, ergebnisorientiert – so arbeiten wir mit Ihnen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-stagger>
          {processSteps.map((step) => (
            <div key={step.step} className="bg-card p-8 border border-border/40" data-stagger-item>
              <span className="font-serif text-5xl text-gold/20 block mb-4">0{step.step}</span>
              <h3 className="font-serif text-xl mb-3 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{step.description}</p>
              <div className="flex items-start gap-2 text-sm text-gold pt-4 border-t border-border/40">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{step.benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section size="lg">
        <div className="max-w-2xl mx-auto text-center" data-reveal>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          <h2 className="font-serif mb-6">Bereit für ein Gespräch?</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Ob Verkauf, Vermietung oder erste Orientierung – wir beraten Sie gerne persönlich und unverbindlich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="h-13 px-8 rounded-none bg-gold text-cream hover:bg-gold-dark">
              <Link to="/kontakt">
                Erstberatung vereinbaren
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-13 px-8 rounded-none border-border/60">
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
