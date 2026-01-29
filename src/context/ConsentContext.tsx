import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Consent, ConsentInput } from '@/lib/consent';
import { getConsent, setConsent as persistConsent, subscribeToConsent } from '@/lib/consent';

type ConsentContextValue = {
  consent: Consent | null;
  hasDecision: boolean;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSettings: (input: ConsentInput) => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

let externalOpenSettings: (() => void) | null = null;

export const openCookieSettings = () => {
  externalOpenSettings?.();
};

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<Consent | null>(() => getConsent());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    externalOpenSettings = () => setIsSettingsOpen(true);
    return () => {
      externalOpenSettings = null;
    };
  }, []);

  useEffect(() => subscribeToConsent(() => setConsentState(getConsent())), []);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const acceptAll = useCallback(() => {
    const next = persistConsent({ analytics: true, marketing: true });
    setConsentState(next);
    setIsSettingsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const next = persistConsent({ analytics: false, marketing: false });
    setConsentState(next);
    setIsSettingsOpen(false);
  }, []);

  const saveSettings = useCallback((input: ConsentInput) => {
    const next = persistConsent(input);
    setConsentState(next);
    setIsSettingsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      hasDecision: consent !== null,
      isSettingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectAll,
      saveSettings,
    }),
    [consent, isSettingsOpen, openSettings, closeSettings, acceptAll, rejectAll, saveSettings],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return ctx;
};
