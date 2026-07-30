import { useEffect, useMemo, useState } from 'react';

import { getNews } from '@/features/news/api/news.api';
import type { FeedItem } from '@/features/news/types/news.types';
import {
  filterNewsByCategory,
  filterNewsByLanguage,
} from '@/features/news/utils/news.utils';
import type { SupportedLanguage } from '@/types/common.types';

export function useNews(language: SupportedLanguage) {
  const [news, setNews] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getNews();
      setNews(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load news',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNews();
  }, []);

  const items = useMemo(
    () => filterNewsByLanguage(news, language),
    [news, language],
  );

  const businessNews = useMemo(
    () => filterNewsByCategory(news, 'Business', language),
    [news, language],
  );

  const scienceNews = useMemo(
    () => filterNewsByCategory(news, 'Science', language),
    [news, language],
  );

  const sportsNews = useMemo(
    () => filterNewsByCategory(news, 'Sports', language),
    [news, language],
  );

  return {
    items,
    businessNews,
    scienceNews,
    sportsNews,
    isLoading,
    error,
    refetch: loadNews,
  };
}
