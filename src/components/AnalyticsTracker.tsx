import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '@/lib/analyticsStore';
import { useConsent } from '@/context/ConsentContext';

export function AnalyticsTracker() {
  const location = useLocation();
  const { consent } = useConsent();
  const allowAnalytics = consent?.analytics ?? false;

  useEffect(() => {
    if (!allowAnalytics) return;
    if (location.pathname.startsWith('/admin')) return;
    logPageView(location.pathname);
  }, [location.pathname, allowAnalytics]);

  return null;
}
