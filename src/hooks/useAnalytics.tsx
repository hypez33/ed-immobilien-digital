import { useEffect, useMemo, useState } from 'react';
import { getAnalyticsSummary, subscribeToAnalytics } from '@/lib/analyticsStore';

export function useAnalyticsSummary(days = 7) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    return subscribeToAnalytics(() => setTick((prev) => prev + 1));
  }, []);

  return useMemo(() => getAnalyticsSummary(days), [days, tick]);
}
