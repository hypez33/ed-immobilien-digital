import { useEffect, useState } from 'react';
import { Activity, getRecentActivities, subscribeToActivities } from '@/lib/activityStore';

export function useActivities(limit = 5) {
  const [activities, setActivities] = useState<Activity[]>(() => getRecentActivities(limit));

  useEffect(() => {
    return subscribeToActivities(() => {
      setActivities(getRecentActivities(limit));
    });
  }, [limit]);

  return activities;
}
