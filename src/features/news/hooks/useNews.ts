// src/features/news/hooks/useNews.ts

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getNews,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
  SupportedLanguage,
} from '@/features/news/types/news.types';


type UseNewsResult = {
  items: FeedItem[];

  businessNews: FeedItem[];

  scienceNews: FeedItem[];

  sportsNews: FeedItem[];

  isLoading: boolean;

  error: string | null;

  refetch: () => Promise<void>;
};


export function useNews(
  language: SupportedLanguage,
): UseNewsResult {

  const [news, setNews] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadNews =
    useCallback(async () => {

      try {

        setIsLoading(true);

        setError(null);


        const result =
          await getNews({
            language,
            page: 1,
            limit: 50,
          });


        setNews(result);

      } catch (loadError) {

        console.error(
          'GET NEWS ERROR:',
          loadError,
        );


        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load news',
        );

        setNews([]);

      } finally {

        setIsLoading(false);

      }

    }, [language]);


  useEffect(() => {

    void loadNews();

  }, [loadNews]);


  const items =
    useMemo(() => {

      return news.filter(
        (item) =>
          item.type === 'news' &&
          item.status === 'published' &&
          item.language === language,
      );

    }, [
      news,
      language,
    ]);


  const businessNews =
    useMemo(() => {

      return items.filter(
        (item) =>
          item.category.toLowerCase() ===
          'business',
      );

    }, [items]);


  const scienceNews =
    useMemo(() => {

      return items.filter(
        (item) =>
          item.category.toLowerCase() ===
          'science',
      );

    }, [items]);


  const sportsNews =
    useMemo(() => {

      return items.filter(
        (item) =>
          item.category.toLowerCase() ===
          'sports',
      );

    }, [items]);


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