import { useEffect, useState } from 'react';

import { getNewsById } from '@/features/news/api/news.api';
import type { FeedItem } from '@/features/news/types/news.types';

export function useNewsDetails(id?: string) {
  const [item, setItem] = useState<FeedItem | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const loadDetails = async () => {
    if (!id) {
      setItem(null);
      setError('News ID is missing');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getNewsById(id);

      if (!result) {
        setError('News not found');
      }

      setItem(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load news details',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDetails();
  }, [id]);

  return {
    item,
    isLoading,
    error,
    refetch: loadDetails,
  };
}
