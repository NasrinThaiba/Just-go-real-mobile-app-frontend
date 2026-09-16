// src/features/news/hooks/useTrendingNews.ts

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getTrendingNews,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
  SupportedLanguage,
} from '@/features/news/types/news.types';


export function useTrendingNews(
  language: SupportedLanguage,
) {

  const [items, setItems] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadTrendingNews =
    useCallback(async () => {

      try {

        setIsLoading(true);

        setError(null);


        const result =
          await getTrendingNews({
            language,
            page: 1,
            limit: 20,
          });


        setItems(result);

      } catch (loadError) {

        console.error(
          'GET TRENDING NEWS ERROR:',
          loadError,
        );


        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load trending news',
        );

        setItems([]);

      } finally {

        setIsLoading(false);

      }

    }, [language]);


  useEffect(() => {

    void loadTrendingNews();

  }, [loadTrendingNews]);


  return {

    items,

    isLoading,

    error,

    refetch: loadTrendingNews,

  };

}