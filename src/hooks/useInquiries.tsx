import { useEffect, useState } from 'react';
import { Inquiry, listInquiries, subscribeToInquiries } from '@/lib/inquiriesStore';

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => listInquiries());

  useEffect(() => {
    return subscribeToInquiries(setInquiries);
  }, []);

  return inquiries;
}
