import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/supabase';
import { listings as fallbackListings, type Listing } from '@/data/listings';

export interface ListingRecord {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  price: number;
  price_suffix: string | null;
  area: number;
  rooms: number;
  address: string;
  city: string;
  zip: string;
  description: string | null;
  features: string[];
  images: string[];
  is_featured: boolean;
  published: boolean;
}

export interface ListingUpsertPayload {
  id?: string;
  title?: string;
  slug?: string;
  type?: string;
  status?: string;
  price?: number;
  price_suffix?: string | null;
  area?: number;
  rooms?: number;
  address?: string;
  city?: string;
  zip?: string;
  description?: string | null;
  features?: string[];
  images?: string[];
  is_featured?: boolean;
  published?: boolean;
}

export interface PublicListing extends Listing {
  slug?: string;
  status?: string;
  address?: string;
  city?: string;
  zip?: string;
  description?: string;
  features?: string[];
  images?: string[];
  published?: boolean;
}

const LOCAL_LISTINGS_STORAGE_KEY = 'ed_admin_listings_v1';
const fallbackImages = Array.from(new Set(fallbackListings.map((listing) => listing.image))).filter(Boolean);
const fallbackListingRecords: ListingRecord[] = fallbackListings.map((listing, index) => {
  const status = listing.priceType === 'miete' ? 'zu_vermieten' : 'zu_verkaufen';
  const now = new Date(2024, 0, index + 1).toISOString();

  return {
    id: listing.id,
    created_at: now,
    updated_at: now,
    title: listing.title,
    slug: listing.title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    type:
      listing.type === 'Grundstück'
        ? 'grundstueck'
        : listing.type === 'Wohnung'
          ? 'wohnung'
          : listing.type === 'Haus'
            ? 'haus'
            : 'gewerbe',
    status,
    price: listing.price,
    price_suffix: listing.priceType === 'miete' ? '€/Monat' : '€',
    area: listing.area,
    rooms: listing.rooms,
    address: `${listing.location} 1`,
    city: listing.location,
    zip: '68535',
    description: null,
    features: [],
    images: [listing.image].filter(Boolean),
    is_featured: listing.featured,
    published: true,
  };
});

const parseStringArray = (value: Json | null | undefined): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};

const normalizeRow = (row: Omit<ListingRecord, 'features' | 'images'> & { features: Json | null; images: Json | null }): ListingRecord => ({
  ...row,
  features: parseStringArray(row.features),
  images: parseStringArray(row.images),
});

const typeToUiLabel = (value: string): Listing['type'] => {
  const normalized = value.toLowerCase();
  if (normalized.includes('wohnung')) return 'Wohnung';
  if (normalized.includes('haus')) return 'Haus';
  if (normalized.includes('grund')) return 'Grundstück';
  return 'Gewerbe';
};

const statusToPriceType = (status: string, suffix?: string | null): Listing['priceType'] => {
  const normalized = status.toLowerCase();
  if (normalized.includes('vermiet') || suffix?.toLowerCase().includes('/monat')) return 'miete';
  return 'kauf';
};

const fallbackImageForId = (id: string): string => {
  if (!fallbackImages.length) return '';
  const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
};

const dedupeById = (records: ListingRecord[]) => {
  const unique = new Map<string, ListingRecord>();
  records.forEach((record) => {
    unique.set(record.id, record);
  });
  return Array.from(unique.values());
};

const dedupeByIdOrSlug = (records: ListingRecord[]) => {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const unique: ListingRecord[] = [];

  records.forEach((record) => {
    if (seenIds.has(record.id) || seenSlugs.has(record.slug)) {
      return;
    }
    seenIds.add(record.id);
    seenSlugs.add(record.slug);
    unique.push(record);
  });

  return unique;
};

const isListingRecord = (value: unknown): value is ListingRecord =>
  !!value &&
  typeof value === 'object' &&
  typeof (value as ListingRecord).id === 'string' &&
  typeof (value as ListingRecord).title === 'string' &&
  typeof (value as ListingRecord).slug === 'string' &&
  typeof (value as ListingRecord).created_at === 'string' &&
  typeof (value as ListingRecord).updated_at === 'string' &&
  Array.isArray((value as ListingRecord).features) &&
  Array.isArray((value as ListingRecord).images);

const getPersistedLocalListings = (): ListingRecord[] | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_LISTINGS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const records = parsed.filter(isListingRecord);
    return records.length ? dedupeById(records) : [];
  } catch {
    return null;
  }
};

const getLocalListings = (): ListingRecord[] => getPersistedLocalListings() ?? fallbackListingRecords;

const saveLocalListings = (records: ListingRecord[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_LISTINGS_STORAGE_KEY, JSON.stringify(dedupeById(records)));
};

const ensureInsertRequirements = (payload: ListingUpsertPayload) => {
  if (hasMissingInsertFields(payload)) {
    throw new Error('Missing required fields for listing insert.');
  }
};

const applyListingPayload = (base: ListingRecord, payload: ListingUpsertPayload): ListingRecord => ({
  ...base,
  title: payload.title ?? base.title,
  slug: payload.slug ?? base.slug,
  type: payload.type ?? base.type,
  status: payload.status ?? base.status,
  price: payload.price ?? base.price,
  price_suffix: payload.price_suffix === undefined ? base.price_suffix : payload.price_suffix,
  area: payload.area ?? base.area,
  rooms: payload.rooms ?? base.rooms,
  address: payload.address ?? base.address,
  city: payload.city ?? base.city,
  zip: payload.zip ?? base.zip,
  description: payload.description === undefined ? base.description : payload.description,
  features: payload.features ?? base.features,
  images: payload.images ?? base.images,
  is_featured: payload.is_featured ?? base.is_featured,
  published: payload.published ?? base.published,
  updated_at: new Date().toISOString(),
});

const upsertLocalListing = (payload: ListingUpsertPayload): ListingRecord => {
  const records = getLocalListings();
  const now = new Date().toISOString();

  if (payload.id) {
    const index = records.findIndex((record) => record.id === payload.id);
    if (index >= 0) {
      const updated = applyListingPayload(records[index], payload);
      const nextRecords = [...records];
      nextRecords[index] = updated;
      saveLocalListings(nextRecords);
      return updated;
    }
  }

  ensureInsertRequirements(payload);

  const created: ListingRecord = {
    id: payload.id ?? crypto.randomUUID?.() ?? `${Date.now()}`,
    created_at: now,
    updated_at: now,
    title: payload.title!,
    slug: payload.slug!,
    type: payload.type!,
    status: payload.status!,
    price: payload.price!,
    price_suffix: payload.price_suffix ?? null,
    area: payload.area!,
    rooms: payload.rooms!,
    address: payload.address!,
    city: payload.city!,
    zip: payload.zip!,
    description: payload.description ?? null,
    features: payload.features ?? [],
    images: payload.images ?? [],
    is_featured: payload.is_featured ?? false,
    published: payload.published ?? false,
  };

  saveLocalListings([created, ...records]);
  return created;
};

const deleteLocalListing = (id: string): boolean => {
  const records = getLocalListings();
  const nextRecords = records.filter((record) => record.id !== id);
  saveLocalListings(nextRecords);
  return nextRecords.length !== records.length;
};

export const mapListingRowToPublic = (row: ListingRecord): PublicListing => {
  const primaryImage = row.images[0] || fallbackImageForId(row.id);
  return {
    id: row.id,
    title: row.title,
    location: row.city,
    price: row.price,
    priceType: statusToPriceType(row.status, row.price_suffix),
    rooms: row.rooms,
    area: row.area,
    image: primaryImage,
    featured: row.is_featured,
    type: typeToUiLabel(row.type),
    slug: row.slug,
    status: row.status,
    address: row.address,
    city: row.city,
    zip: row.zip,
    description: row.description ?? undefined,
    features: row.features,
    images: row.images.length ? row.images : [primaryImage].filter(Boolean),
    published: row.published,
  };
};

const compactObject = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));

const toDbPayload = (payload: ListingUpsertPayload) =>
  compactObject({
    title: payload.title,
    slug: payload.slug,
    type: payload.type,
    status: payload.status,
    price: payload.price,
    price_suffix: payload.price_suffix,
    area: payload.area,
    rooms: payload.rooms,
    address: payload.address,
    city: payload.city,
    zip: payload.zip,
    description: payload.description,
    features: payload.features,
    images: payload.images,
    is_featured: payload.is_featured,
    published: payload.published,
  });

const hasMissingInsertFields = (payload: ListingUpsertPayload) =>
  !payload.title ||
  !payload.slug ||
  !payload.type ||
  !payload.status ||
  payload.price === undefined ||
  payload.area === undefined ||
  payload.rooms === undefined ||
  !payload.address ||
  !payload.city ||
  !payload.zip;

export async function getPublishedListings(): Promise<ListingRecord[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching published listings:', error);
      return getLocalListings().filter((listing) => listing.published);
    }

    const rows = ((data || []) as Array<Omit<ListingRecord, 'features' | 'images'> & { features: Json | null; images: Json | null }>).map(
      normalizeRow
    );
    const persistedLocal = getPersistedLocalListings();

    if (rows.length && persistedLocal?.length) {
      const merged = dedupeByIdOrSlug([
        ...persistedLocal.filter((listing) => listing.published),
        ...rows,
      ]);
      return merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return rows.length ? rows : getLocalListings().filter((listing) => listing.published);
  } catch (error) {
    console.error('Error fetching published listings:', error);
    return getLocalListings().filter((listing) => listing.published);
  }
}

export async function getAllListings(): Promise<ListingRecord[]> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all listings:', error);
      return getLocalListings();
    }

    const rows = ((data || []) as Array<Omit<ListingRecord, 'features' | 'images'> & { features: Json | null; images: Json | null }>).map(
      normalizeRow
    );
    const persistedLocal = getPersistedLocalListings();

    if (rows.length && persistedLocal?.length) {
      const merged = dedupeByIdOrSlug([...persistedLocal, ...rows]);
      return merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return rows.length ? rows : getLocalListings();
  } catch (error) {
    console.error('Error fetching all listings:', error);
    return getLocalListings();
  }
}

export async function upsertListing(payload: ListingUpsertPayload): Promise<ListingRecord> {
  try {
    if (payload.id) {
      const { id, ...rest } = payload;
      const { data, error } = await supabase
        .from('listings')
        .update(toDbPayload(rest))
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating listing:', error);
        throw error;
      }

      return normalizeRow(data as Omit<ListingRecord, 'features' | 'images'> & { features: Json | null; images: Json | null });
    }

    ensureInsertRequirements(payload);

    const insertPayload = {
      ...toDbPayload(payload),
      price_suffix: payload.price_suffix ?? null,
      description: payload.description ?? null,
      features: payload.features ?? [],
      images: payload.images ?? [],
      is_featured: payload.is_featured ?? false,
      published: payload.published ?? false,
    };

    const { data, error } = await supabase
      .from('listings')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      throw error;
    }

    return normalizeRow(data as Omit<ListingRecord, 'features' | 'images'> & { features: Json | null; images: Json | null });
  } catch (error) {
    console.error('Error in upsertListing:', error);
    return upsertLocalListing(payload);
  }
}

export async function deleteListing(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting listing:', error);
    return deleteLocalListing(id);
  }
}
