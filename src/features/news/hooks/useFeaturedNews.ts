// src/features/news/hooks/useFeaturedNews.ts

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getFeaturedNews,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
  SupportedLanguage,
} from '@/features/news/types/news.types';


export function useFeaturedNews(
  language: SupportedLanguage,
) {

  const [items, setItems] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadFeaturedNews =
    useCallback(async () => {

      try {

        setIsLoading(true);

        setError(null);


        const result =
          await getFeaturedNews({
            language,
            page: 1,
            limit: 20,
          });


        setItems(result);

      } catch (loadError) {

        console.error(
          'GET FEATURED NEWS ERROR:',
          loadError,
        );


        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load featured news',
        );

        setItems([]);

      } finally {

        setIsLoading(false);

      }

    }, [language]);


  useEffect(() => {

    void loadFeaturedNews();

  }, [loadFeaturedNews]);


  return {

    items,

    isLoading,

    error,

    refetch: loadFeaturedNews,

  };

}