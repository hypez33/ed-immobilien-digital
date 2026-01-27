import listingApartment from '@/assets/listing-apartment.jpg';
import listingHouse from '@/assets/listing-house.jpg';

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  priceType: 'kauf' | 'miete';
  rooms: number;
  area: number;
  image: string;
  featured: boolean;
  type: 'Wohnung' | 'Haus' | 'Grundstück';
}

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Moderne 3-Zimmer-Wohnung mit Balkon',
    location: 'Edingen-Neckarhausen',
    price: 289000,
    priceType: 'kauf',
    rooms: 3,
    area: 85,
    image: listingApartment,
    featured: true,
    type: 'Wohnung',
  },
  {
    id: '2',
    title: 'Freistehendes Einfamilienhaus mit Garten',
    location: 'Ladenburg',
    price: 549000,
    priceType: 'kauf',
    rooms: 5,
    area: 145,
    image: listingHouse,
    featured: true,
    type: 'Haus',
  },
  {
    id: '3',
    title: 'Gepflegte 2-Zimmer-Wohnung zur Miete',
    location: 'Heidelberg',
    price: 950,
    priceType: 'miete',
    rooms: 2,
    area: 58,
    image: listingApartment,
    featured: true,
    type: 'Wohnung',
  },
  {
    id: '4',
    title: 'Ruhig gelegene Doppelhaushälfte',
    location: 'Neckargemünd',
    price: 425000,
    priceType: 'kauf',
    rooms: 4,
    area: 120,
    image: listingHouse,
    featured: false,
    type: 'Haus',
  },
  {
    id: '5',
    title: 'Helle 4-Zimmer-Maisonette',
    location: 'Mannheim',
    price: 1450,
    priceType: 'miete',
    rooms: 4,
    area: 110,
    image: listingApartment,
    featured: false,
    type: 'Wohnung',
  },
  {
    id: '6',
    title: 'Baureifes Grundstück in Top-Lage',
    location: 'Edingen-Neckarhausen',
    price: 195000,
    priceType: 'kauf',
    rooms: 0,
    area: 450,
    image: listingHouse,
    featured: false,
    type: 'Grundstück',
  },
  {
    id: '7',
    title: 'Sanierte Altbauwohnung mit Charme',
    location: 'Schwetzingen',
    price: 319000,
    priceType: 'kauf',
    rooms: 3,
    area: 92,
    image: listingApartment,
    featured: false,
    type: 'Wohnung',
  },
  {
    id: '8',
    title: 'Großzügiges Reihenendhaus',
    location: 'Ilvesheim',
    price: 389000,
    priceType: 'kauf',
    rooms: 4,
    area: 135,
    image: listingHouse,
    featured: false,
    type: 'Haus',
  },
];

export const locations = [
  'Alle Orte',
  'Edingen-Neckarhausen',
  'Ladenburg',
  'Heidelberg',
  'Mannheim',
  'Schwetzingen',
  'Neckargemünd',
  'Ilvesheim',
];
