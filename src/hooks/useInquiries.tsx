import { useEffect, useState, useCallback } from 'react';
import { Inquiry, listInquiries } from '@/lib/inquiriesService';

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      setError('Anfragen konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { inquiries, loading, error, refetch };
}
