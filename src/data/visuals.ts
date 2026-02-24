import heroSideArchitectural from '@/assets/visuals/hero-side-architectural.jpg';
import footerHomeRight from '@/assets/visuals/footer-home-right.jpg';
import listing01 from '@/assets/visuals/listing-01.jpg';
import listing02 from '@/assets/visuals/listing-02.jpg';
import listing03 from '@/assets/visuals/listing-03.jpg';
import listing04 from '@/assets/visuals/listing-04.jpg';
import blogMarket from '@/assets/visuals/blog-market.jpg';
import blogChecklist from '@/assets/visuals/blog-checklist.jpg';

export const heroVisuals = {
  homeSide: heroSideArchitectural,
} as const;

export const footerVisuals = {
  homeRight: footerHomeRight,
} as const;

export const listingVisualById: Record<string, string> = {
  '1': listing01,
  '2': listing02,
  '3': listing03,
  '4': listing04,
};

export const blogVisualBySlug: Record<string, string> = {
  'immobilienmarkt-2026-rhein-neckar': blogMarket,
  'verkauf-checkliste-immobilie': blogChecklist,
};

export const visualAltTextByKey: Record<string, string> = {
  'hero-home-side': 'Moderne Premium-Immobilie mit klarer Architektur im Abendlicht',
  'footer-home-right': 'Hochwertige Wohnarchitektur als atmosphaerischer Footer-Akzent',
  'listing-01': 'Helles Einfamilienhaus mit grossen Fensterfronten',
  'listing-02': 'Eleganter Wohnbereich mit hochwertiger Ausstattung',
  'listing-03': 'Stilvolle Stadtvilla mit gepflegter Fassade',
  'listing-04': 'Moderne Immobilie mit harmonischer Gartenansicht',
  'blog-market': 'Stadtnahe Wohnbebauung als Symbol fuer Marktentwicklung',
  'blog-checklist': 'Strukturiertes Immobilien-Exterieur fuer Verkaufsvorbereitung',
};
