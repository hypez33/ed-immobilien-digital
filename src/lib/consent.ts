export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: number;
};

export type ConsentInput = {
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = 'ed_consent_v1';
const CONSENT_VERSION = 1;
const UPDATE_EVENT = 'ed-consent-update';

const normalizeConsent = (value: unknown): Consent | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (record.version !== CONSENT_VERSION) return null;
  if (typeof record.analytics !== 'boolean' || typeof record.marketing !== 'boolean') return null;
  return {
    necessary: true,
    analytics: record.analytics,
    marketing: record.marketing,
    timestamp: typeof record.timestamp === 'number' ? record.timestamp : Date.now(),
    version: CONSENT_VERSION,
  };
};

export const getConsent = (): Consent | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return normalizeConsent(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const setConsent = (input: ConsentInput): Consent => {
  if (typeof window === 'undefined') {
    return {
      necessary: true,
      analytics: input.analytics,
      marketing: input.marketing,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
  }
  const consent: Consent = {
    necessary: true,
    analytics: !!input.analytics,
    marketing: !!input.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event(UPDATE_EVENT));
  return consent;
};

export const hasDecision = () => getConsent() !== null;

export const subscribeToConsent = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};
