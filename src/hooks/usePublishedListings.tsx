import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listings as fallbackListings } from '@/data/listings';
import { getPublishedListings, mapListingRowToPublic, type PublicListing } from '@/lib/listingsService';

export function usePublishedListings() {
  const query = useQuery({
    queryKey: ['listings', 'published'],
    queryFn: getPublishedListings,
    staleTime: 1000 * 60 * 5,
  });

  const listings = useMemo<PublicListing[]>(() => {
    if (query.data && query.data.length > 0) {
      return query.data.map(mapListingRowToPublic);
    }
    return fallbackListings.map((listing) => ({
      ...listing,
      images: [listing.image],
      published: true,
    }));
  }, [query.data]);

  const usingFallback = !query.data?.length || !!query.error;

  return {
    ...query,
    listings,
    usingFallback,
  };
}
