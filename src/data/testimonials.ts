export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  type: 'Verkauf' | 'Vermietung' | 'Kauf';
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Familie Schneider',
    location: 'Edingen-Neckarhausen',
    text: 'Schnelle Vermittlung, transparente Kommunikation und ein fairer Verkaufspreis. Wir fühlten uns von Anfang an gut betreut.',
    type: 'Verkauf',
  },
  {
    id: '2',
    name: 'M. Weber',
    location: 'Ladenburg',
    text: 'Nach nur drei Besichtigungen hatten wir den passenden Mieter. Die Bonitätsprüfung und Vertragsabwicklung liefen reibungslos.',
    type: 'Vermietung',
  },
  {
    id: '3',
    name: 'J. Hoffmann',
    location: 'Heidelberg',
    text: 'Dank ED Immobilien haben wir unsere Traumwohnung gefunden. Die Beratung war ehrlich und ohne Druck.',
    type: 'Kauf',
  },
];
