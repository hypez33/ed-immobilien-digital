import { addActivity } from '@/lib/activityStore';

export type InquiryStatus = 'new' | 'in_progress' | 'done' | 'archived';

export interface InquiryNote {
  id: string;
  createdAt: string;
  text: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  serviceOrAnliegen: string;
  message: string;
  status: InquiryStatus;
  source?: string;
  notes?: InquiryNote[];
}

const STORAGE_KEY = 'ed_inquiries';
const UPDATE_EVENT = 'inquiries-storage';

const readInquiries = (): Inquiry[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Inquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeInquiries = (items: Inquiry[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const listInquiries = () =>
  readInquiries().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const createInquiry = (payload: Omit<Inquiry, 'id' | 'createdAt' | 'status'> & Partial<Pick<Inquiry, 'status'>>) => {
  const inquiry: Inquiry = {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: payload.status ?? 'new',
    ...payload,
  };
  const items = [inquiry, ...readInquiries()];
  writeInquiries(items);
  addActivity('inquiry:create', `Neue Anfrage: ${inquiry.name}`, { id: inquiry.id });
  return inquiry;
};

export const updateInquiry = (id: string, updates: Partial<Inquiry>) => {
  const items = readInquiries();
  const index = items.findIndex((entry) => entry.id === id);
  if (index < 0) return null;
  items[index] = { ...items[index], ...updates };
  writeInquiries(items);
  return items[index];
};

export const setInquiryStatus = (id: string, status: InquiryStatus) => {
  const updated = updateInquiry(id, { status });
  if (updated) {
    addActivity('inquiry:status', `Status geändert: ${updated.name}`, { status });
  }
  return updated;
};

export const addInquiryNote = (id: string, text: string) => {
  const items = readInquiries();
  const index = items.findIndex((entry) => entry.id === id);
  if (index < 0) return null;
  const note: InquiryNote = {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    createdAt: new Date().toISOString(),
    text,
  };
  const currentNotes = items[index].notes ?? [];
  items[index] = { ...items[index], notes: [note, ...currentNotes] };
  writeInquiries(items);
  addActivity('inquiry:note', `Notiz ergänzt: ${items[index].name}`);
  return note;
};

export const deleteInquiry = (id: string) => {
  const items = readInquiries();
  const removed = items.find((entry) => entry.id === id);
  const next = items.filter((entry) => entry.id !== id);
  writeInquiries(next);
  if (removed) {
    addActivity('inquiry:delete', `Anfrage gelöscht: ${removed.name}`);
  }
  return next;
};

export const subscribeToInquiries = (callback: (items: Inquiry[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback(listInquiries());
  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};
