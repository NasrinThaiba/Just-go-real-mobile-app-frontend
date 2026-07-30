import { useEffect, useMemo, useState } from 'react';

import { getAds } from '@/features/ads/api/ads.api';
import type {
  AdItem,
  AdPlacement,
} from '@/features/ads/types/ads.types';

export function useAds() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAds = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAds();
      setAds(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load advertisements',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAds();
  }, []);

  const getByPlacement = (placement: AdPlacement) =>
    ads.filter((ad) => ad.placement === placement);

  const topAds = useMemo(
    () => getByPlacement('top'),
    [ads],
  );

  const homeAds = useMemo(
    () => getByPlacement('home'),
    [ads],
  );

  const mediumAds = useMemo(
    () => getByPlacement('medium'),
    [ads],
  );

  const largeAds = useMemo(
    () => getByPlacement('large'),
    [ads],
  );

  return {
    ads,
    topAds,
    homeAds,
    mediumAds,
    largeAds,
    isLoading,
    error,
    refetch: loadAds,
  };
}
