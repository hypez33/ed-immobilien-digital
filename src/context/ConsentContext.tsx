import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Consent, ConsentInput } from '@/lib/consent';
import { getConsent, setConsent as persistConsent, subscribeToConsent } from '@/lib/consent';

type ConsentContextValue = {
  consent: Consent | null;
  hasDecision: boolean;
  settingsOpen: boolean;
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    externalOpenSettings = () => setSettingsOpen(true);
    return () => {
      externalOpenSettings = null;
    };
  }, []);

  useEffect(() => subscribeToConsent(() => setConsentState(getConsent())), []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const acceptAll = useCallback(() => {
    const next = persistConsent({ analytics: true, marketing: true });
    setConsentState(next);
    setSettingsOpen(false);
  }, []);

  const rejectAll = useCallback(() => {
    const next = persistConsent({ analytics: false, marketing: false });
    setConsentState(next);
    setSettingsOpen(false);
  }, []);

  const saveSettings = useCallback((input: ConsentInput) => {
    const next = persistConsent(input);
    setConsentState(next);
    setSettingsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      hasDecision: consent !== null,
      settingsOpen,
      openSettings,
      closeSettings,
      acceptAll,
      rejectAll,
      saveSettings,
    }),
    [consent, settingsOpen, openSettings, closeSettings, acceptAll, rejectAll, saveSettings],
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
