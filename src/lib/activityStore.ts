export type ActivityType =
  | 'blog:create'
  | 'blog:update'
  | 'blog:delete'
  | 'inquiry:create'
  | 'inquiry:status'
  | 'inquiry:note'
  | 'inquiry:delete';

export interface Activity {
  id: string;
  type: ActivityType;
  label: string;
  createdAt: string;
  meta?: Record<string, string>;
}

const STORAGE_KEY = 'ed_admin_activity';
const UPDATE_EVENT = 'admin-activity';
const MAX_ITEMS = 200;

const readActivities = (): Activity[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Activity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeActivities = (items: Activity[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const addActivity = (type: ActivityType, label: string, meta?: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  const activity: Activity = {
    id: crypto.randomUUID?.() ?? `${Date.now()}`,
    type,
    label,
    createdAt: new Date().toISOString(),
    meta,
  };
  const items = [activity, ...readActivities()].slice(0, MAX_ITEMS);
  writeActivities(items);
};

export const getRecentActivities = (limit = 5) => {
  const items = readActivities();
  return items.slice(0, limit);
};

export const subscribeToActivities = (callback: (items: Activity[]) => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback(readActivities());
  window.addEventListener('storage', handler);
  window.addEventListener(UPDATE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(UPDATE_EVENT, handler);
  };
};
