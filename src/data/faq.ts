export interface FAQItem {
  question: string;
  answer: string;
}

export const homeFAQ: FAQItem[] = [
  {
    question: 'Wie läuft eine Immobilienbewertung ab?',
    answer: 'Wir analysieren Ihre Immobilie vor Ort, prüfen vergleichbare Verkäufe in der Region und erstellen eine fundierte Wertermittlung. Der gesamte Prozess ist für Sie kostenfrei und unverbindlich.',
  },
  {
    question: 'Welche Unterlagen benötige ich für den Verkauf?',
    answer: 'Grundbuchauszug, Energieausweis, Grundrisse, Wohnflächenberechnung und ggf. Teilungserklärung. Wir unterstützen Sie bei der Beschaffung aller erforderlichen Dokumente.',
  },
  {
    question: 'Wie lange dauert ein Immobilienverkauf?',
    answer: 'Im Rhein-Neckar-Kreis rechnen wir je nach Objekt mit 2–4 Monaten von der Erstberatung bis zum Notartermin. Wir halten Sie transparent über jeden Schritt informiert.',
  },
  {
    question: 'Wer trägt die Maklerkosten?',
    answer: 'Bei Verkäufen teilen sich in der Regel Käufer und Verkäufer die Provision. Die genauen Konditionen besprechen wir individuell in der Erstberatung.',
  },
  {
    question: 'Bieten Sie auch Vermietung an?',
    answer: 'Ja, wir unterstützen Eigentümer bei der Mietersuche, Bonitätsprüfung und Mietvertragsgestaltung. Kontaktieren Sie uns für ein unverbindliches Gespräch.',
  },
  {
    question: 'Was kostet die Erstberatung?',
    answer: 'Die Erstberatung inkl. Wertermittlung ist für Sie kostenfrei und unverbindlich. Erst bei Beauftragung entstehen Kosten.',
  },
];

export const immobilienFAQ: FAQItem[] = [
  {
    question: 'Wie vereinbare ich eine Besichtigung?',
    answer: 'Klicken Sie bei der gewünschten Immobilie auf „Besichtigung anfragen" oder kontaktieren Sie uns direkt. Wir melden uns innerhalb von 24 Stunden.',
  },
  {
    question: 'Kann ich neue Objekte automatisch erhalten?',
    answer: 'Ja, senden Sie uns einen Suchauftrag mit Ihren Kriterien. Wir informieren Sie, sobald passende Immobilien verfügbar sind.',
  },
  {
    question: 'Welche Unterlagen brauche ich für eine Anmietung?',
    answer: 'Personalausweis, Einkommensnachweise der letzten drei Monate, SCHUFA-Auskunft und ggf. eine Mietschuldenfreiheitsbescheinigung.',
  },
];

export const kontaktFAQ: FAQItem[] = [
  {
    question: 'Wie schnell erhalte ich eine Rückmeldung?',
    answer: 'Wir antworten in der Regel innerhalb von 24 Stunden auf Ihre Anfrage. Bei dringenden Anliegen erreichen Sie uns auch telefonisch.',
  },
  {
    question: 'Kann ich Unterlagen mitsenden?',
    answer: 'Ja, Sie können Dokumente wie Grundrisse oder Fotos per E-Mail an uns senden. Alternativ besprechen wir alles Weitere im persönlichen Termin.',
  },
  {
    question: 'Gibt es Rückruftermine?',
    answer: 'Selbstverständlich. Geben Sie im Formular Ihre bevorzugte Rückrufzeit an, und wir melden uns zum gewünschten Zeitpunkt.',
  },
  {
    question: 'Wo befindet sich Ihr Büro?',
    answer: 'Unser Büro liegt zentral in Edingen-Neckarhausen. Die genaue Adresse und Anfahrt erhalten Sie nach Terminvereinbarung.',
  },
];
