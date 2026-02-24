import coverHouse from '@/assets/listing-house.jpg';
import coverApartment from '@/assets/listing-apartment.jpg';
import { blogVisualBySlug } from '@/data/visuals';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date?: string;
  category?: string;
  cover?: string;
  content?: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'markt-2026-rhein-neckar',
    slug: 'immobilienmarkt-2026-rhein-neckar',
    title: 'Immobilienmarkt 2026 im Rhein-Neckar-Kreis: Trends & Chancen',
    excerpt:
      'Welche Entwicklungen prägen den regionalen Markt, wie verändern sich Nachfrage und Preisniveaus und wo liegen Chancen für Käufer und Verkäufer?',
    date: '2026-01-12',
    category: 'Markt',
    cover: blogVisualBySlug['immobilienmarkt-2026-rhein-neckar'] ?? coverHouse,
    status: 'published',
    createdAt: '2026-01-12',
    updatedAt: '2026-01-12',
    content:
      'Der Rhein-Neckar-Kreis bleibt ein gefragter Wohnstandort. In vielen Lagen zeigt sich eine stabile Nachfrage, während sich das Tempo der Preisentwicklung normalisiert.\n\n' +
      'Wer verkaufen möchte, profitiert von professioneller Aufbereitung und klarer Zielgruppenansprache. Käufer wiederum gewinnen mehr Zeit für die Entscheidung und sollten eine solide Finanzierungsvorbereitung mitbringen.',
  },
  {
    id: 'verkauf-vorbereitung-checkliste',
    slug: 'verkauf-checkliste-immobilie',
    title: 'Verkauf vorbereiten: Die 7 wichtigsten Schritte',
    excerpt:
      'Von Unterlagen bis Exposé – mit dieser Checkliste bringen Sie Ihre Immobilie strukturiert auf den Markt und vermeiden typische Verzögerungen.',
    date: '2026-01-05',
    category: 'Praxis',
    cover: blogVisualBySlug['verkauf-checkliste-immobilie'] ?? coverApartment,
    status: 'published',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-05',
    content:
      'Eine strukturierte Vorbereitung spart Zeit und steigert die Qualität der Vermarktung. Dazu gehören vollständige Unterlagen, eine klare Preisstrategie und hochwertige Bilder.\n\n' +
      'Auch kleine Verbesserungen an der Immobilie können die Wahrnehmung deutlich erhöhen. Wir unterstützen Sie dabei, die richtigen Maßnahmen zu priorisieren.',
  },
];
