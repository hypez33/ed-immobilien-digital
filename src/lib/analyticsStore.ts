interface AnalyticsState {
  totalViews: number;
  pageViewsByPath: Record<string, number>;
  dailyViews: Record<string, number>;
  dailyVisitors: Record<string, string[]>;
  dailyPageViews: Record<string, Record<string, number>>;
  recentViews: { path: string; ts: number }[];
}

const STORAGE_KEY = 'ed_analytics';
const VISITOR_KEY = 'ed_visitor_id';
const SESSION_TS_KEY = 'ed_session_ts';
const UPDATE_EVENT = 'analytics-storage';

const emptyState: AnalyticsState = {
  totalViews: 0,
  pageViewsByPath: {},
  dailyViews: {},
  dailyVisitors: {},
  dailyPageViews: {},
  recentViews: [],
};

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const getVisitorId = () => {
  if (typeof window === 'undefined') return 'server';
  const stored = window.localStorage.getItem(VISITOR_KEY);
  if (stored) return stored;
  const id = crypto.randomUUID?.() ?? `${Date.now()}`;
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
};

const getSessionActive = () => {
  if (typeof window === 'undefined') return false;
  const ts = window.localStorage.getItem(SESSION_TS_KEY);
  if (!ts) return false;
  const diff = Date.now() - Number(ts);
  return diff < 1000 * 60 * 60 * 24;
};

const touchSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_TS_KEY, `${Date.now()}`);
};

const readState = (): AnalyticsState => {
  if (typeof window === 'undefined') return emptyState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState;
  try {
    return { ...emptyState, ...(JSON.parse(raw) as AnalyticsState) };
  } catch {
    return emptyState;
  }
};

const writeState = (state: AnalyticsState) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

// MVP local analytics (privacy-friendly): no IPs, no personal data, no fingerprinting.
export const logPageView = (path: string) => {
  if (typeof window === 'undefined') return;
  const state = readState();
  const dateKey = getDateKey();
  const visitorId = getVisitorId();

  state.totalViews += 1;
  state.pageViewsByPath[path] = (state.pageViewsByPath[path] ?? 0) + 1;
  state.dailyViews[dateKey] = (state.dailyViews[dateKey] ?? 0) + 1;
  state.dailyPageViews[dateKey] = state.dailyPageViews[dateKey] ?? {};
  state.dailyPageViews[dateKey][path] = (state.dailyPageViews[dateKey][path] ?? 0) + 1;

  const visitors = new Set(state.dailyVisitors[dateKey] ?? []);
  visitors.add(visitorId);
  state.dailyVisitors[dateKey] = Array.from(visitors);

  state.recentViews.unshift({ path, ts: Date.now() });
  state.recentViews = state.recentViews.slice(0, 50);

  touchSession();
  writeState(state);
};

export const getAnalyticsSnapshot = () => readState();

export const getAnalyticsSummary = (days = 7) => {
  const state = readState();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const dates = Object.keys(state.dailyViews).filter((key) => new Date(key).getTime() >= cutoff);

  const totalViews = dates.reduce((sum, key) => sum + (state.dailyViews[key] ?? 0), 0);
  const visitorSet = new Set<string>();
  dates.forEach((key) => {
    (state.dailyVisitors[key] ?? []).forEach((id) => visitorSet.add(id));
  });
  const uniqueVisitors = visitorSet.size;

  const pageTotals: Record<string, number> = {};
  dates.forEach((key) => {
    const daily = state.dailyPageViews[key] ?? {};
    Object.entries(daily).forEach(([path, count]) => {
      pageTotals[path] = (pageTotals[path] ?? 0) + count;
    });
  });

  const topPages = Object.entries(pageTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([path, count]) => ({ path, count }));

  return {
    totalViews,
    uniqueVisitors,
    topPages,
    avgViewsPerDay: dates.length ? Math.round(totalViews / dates.length) : 0,
    recentViews: state.recentViews,
    dailyViews: dates
      .sort()
      .map((key) => ({ date: key, views: state.dailyViews[key] ?? 0 })),
  };
};

export const isSessionActive = () => getSessionActive();

export const subscribeToAnalytics = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};

export const clearAnalytics = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(VISITOR_KEY);
  window.localStorage.removeItem(SESSION_TS_KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
};
