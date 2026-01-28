export type ServiceId =
  | 'bewertung'
  | 'renovierung'
  | 'vermietung'
  | 'verkauf'
  | 'energie'
  | 'finanzierung'
  | 'expose'
  | 'staging'
  | 'sonstiges';

export interface Service {
  id: ServiceId;
  title: string;
  description: string;
  bullets: string[];
  popular?: boolean;
}

export type QuestionType = 'select' | 'text' | 'number' | 'textarea' | 'checkbox';

export interface ServiceInquiryFormData {
  serviceId: ServiceId | '';
  propertyType: string;
  location: string;
  timeframe: string;
  budget: string;
  livingArea: string;
  condition: string;
  yearBuilt: string;
  renovationScope: string;
  renovationStart: string;
  targetRent: string;
  availability: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export interface ServiceQuestion {
  id: keyof ServiceInquiryFormData;
  label: string;
  type: QuestionType;
  step: 1 | 2 | 3;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  services?: ServiceId[];
  hint?: string;
}

export const SERVICE_INQUIRY_EMAIL = 'info@ed-immobilien.de';

export const services: Service[] = [
  {
    id: 'bewertung',
    title: 'Immobilienbewertung',
    description: 'Marktgerechte Bewertung mit klarer Preisstrategie.',
    bullets: ['Kostenfrei & unverbindlich', 'Lokale Vergleichsdaten', 'Kurze Reaktionszeit'],
    popular: true,
  },
  {
    id: 'verkauf',
    title: 'Verkauf',
    description: 'Professionelle Vermarktung bis zum Notartermin.',
    bullets: ['Exposé & Vermarktung', 'Verhandlung & Käuferqualifizierung', 'Begleitung bis Übergabe'],
    popular: true,
  },
  {
    id: 'vermietung',
    title: 'Vermietung',
    description: 'Zuverlässige Mieterfindung mit rechtssicherem Ablauf.',
    bullets: ['Bonitätsprüfung', 'Besichtigungsmanagement', 'Mietvertrag & Übergabe'],
  },
  {
    id: 'renovierung',
    title: 'Renovierung / Sanierung',
    description: 'Planung und Koordination für sichtbare Wertsteigerung.',
    bullets: ['Umfang flexibel', 'Transparente Kosten', 'Starttermine planbar'],
  },
  {
    id: 'energie',
    title: 'Energieberatung',
    description: 'Optimierung von Effizienz und Fördermöglichkeiten.',
    bullets: ['Zustandsanalyse', 'Maßnahmenplan', 'Fördermittel-Hinweise'],
  },
  {
    id: 'finanzierung',
    title: 'Finanzierungspartner',
    description: 'Zugang zu Finanzierungslösungen aus unserem Netzwerk.',
    bullets: ['Vergleich mehrerer Angebote', 'Beratung zu Konditionen', 'Unterlagen-Check'],
  },
  {
    id: 'expose',
    title: 'Exposé & Foto-Service',
    description: 'Hochwertige Präsentation für maximale Nachfrage.',
    bullets: ['Professionelle Fotos', 'Starkes Exposé', 'Optional Video/360°'],
  },
  {
    id: 'staging',
    title: 'Home Staging',
    description: 'Inszenierung, die Käufer überzeugt.',
    bullets: ['Einrichtungskonzept', 'Möblierung/Styling', 'Schneller Wirkeffekt'],
  },
  {
    id: 'sonstiges',
    title: 'Sonstiges Anliegen',
    description: 'Individuelle Fragen? Wir beraten gerne.',
    bullets: ['Persönliche Rückmeldung', 'Klare nächste Schritte', 'Schnelle Antwort'],
  },
];

const serviceOptions = services.map((service) => ({
  label: service.title,
  value: service.id,
}));

export const inquiryQuestions: ServiceQuestion[] = [
  {
    id: 'serviceId',
    label: 'Worum geht es?',
    type: 'select',
    step: 1,
    required: true,
    options: serviceOptions,
  },
  {
    id: 'propertyType',
    label: 'Immobilientyp',
    type: 'select',
    step: 1,
    required: true,
    options: [
      { label: 'Wohnung', value: 'wohnung' },
      { label: 'Haus', value: 'haus' },
      { label: 'Grundstück', value: 'grundstueck' },
      { label: 'Gewerbe', value: 'gewerbe' },
    ],
  },
  {
    id: 'location',
    label: 'Ort / PLZ',
    type: 'text',
    step: 1,
    required: true,
    placeholder: 'z.B. 68535 Edingen-Neckarhausen',
  },
  {
    id: 'timeframe',
    label: 'Zeitrahmen',
    type: 'select',
    step: 2,
    required: true,
    options: [
      { label: 'Sofort', value: 'sofort' },
      { label: '1–3 Monate', value: '1-3' },
      { label: 'Später', value: 'spaeter' },
    ],
  },
  {
    id: 'budget',
    label: 'Budget-Spanne (optional)',
    type: 'select',
    step: 2,
    options: [
      { label: 'Unter 50.000 €', value: '<50k' },
      { label: '50.000–150.000 €', value: '50-150k' },
      { label: '150.000–350.000 €', value: '150-350k' },
      { label: '350.000–750.000 €', value: '350-750k' },
      { label: 'Über 750.000 €', value: '>750k' },
    ],
    services: ['renovierung', 'verkauf', 'finanzierung'],
  },
  {
    id: 'livingArea',
    label: 'Wohnfläche (m²)',
    type: 'number',
    step: 2,
    required: true,
    placeholder: 'z.B. 120',
    services: ['bewertung'],
  },
  {
    id: 'condition',
    label: 'Zustand der Immobilie',
    type: 'select',
    step: 2,
    required: true,
    services: ['bewertung'],
    options: [
      { label: 'Neuwertig', value: 'neuwertig' },
      { label: 'Gepflegt', value: 'gepflegt' },
      { label: 'Renovierungsbedürftig', value: 'renovierungsbeduerftig' },
    ],
  },
  {
    id: 'yearBuilt',
    label: 'Baujahr (optional)',
    type: 'number',
    step: 2,
    placeholder: 'z.B. 1998',
    services: ['bewertung'],
  },
  {
    id: 'renovationScope',
    label: 'Umfang der Renovierung',
    type: 'select',
    step: 2,
    required: true,
    services: ['renovierung'],
    options: [
      { label: 'Bad', value: 'bad' },
      { label: 'Küche', value: 'kueche' },
      { label: 'Komplett', value: 'komplett' },
      { label: 'Teilbereiche', value: 'teilbereiche' },
    ],
  },
  {
    id: 'renovationStart',
    label: 'Gewünschter Start',
    type: 'select',
    step: 2,
    required: true,
    services: ['renovierung'],
    options: [
      { label: 'Sofort', value: 'sofort' },
      { label: 'In 1–3 Monaten', value: '1-3' },
      { label: 'Später', value: 'spaeter' },
    ],
  },
  {
    id: 'targetRent',
    label: 'Zielmiete (optional)',
    type: 'number',
    step: 2,
    placeholder: 'z.B. 1.200',
    services: ['vermietung'],
  },
  {
    id: 'availability',
    label: 'Verfügbarkeit',
    type: 'select',
    step: 2,
    required: true,
    services: ['vermietung'],
    options: [
      { label: 'Sofort verfügbar', value: 'sofort' },
      { label: 'In 1–3 Monaten', value: '1-3' },
      { label: 'Später', value: 'spaeter' },
    ],
  },
  {
    id: 'name',
    label: 'Ihr Name',
    type: 'text',
    step: 3,
    required: true,
    placeholder: 'Max Mustermann',
  },
  {
    id: 'email',
    label: 'E-Mail',
    type: 'text',
    step: 3,
    required: true,
    placeholder: 'max@beispiel.de',
  },
  {
    id: 'phone',
    label: 'Telefon (optional)',
    type: 'text',
    step: 3,
    placeholder: '+49 123 456789',
  },
  {
    id: 'message',
    label: 'Nachricht (optional)',
    type: 'textarea',
    step: 3,
    placeholder: 'Kurze Details zu Ihrem Anliegen...',
  },
  {
    id: 'consent',
    label: 'Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.',
    type: 'checkbox',
    step: 3,
    required: true,
  },
];
