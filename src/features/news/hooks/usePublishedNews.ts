// src/features/news/hooks/usePublishedNews.ts

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getNews,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import type {
  SupportedLanguage,
} from '@/types/common.types';


export function usePublishedNews(
  language: SupportedLanguage = 'en',
) {

  const [news, setNews] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadNews =
    useCallback(async (
      refreshing = false,
    ) => {

      try {

        if (refreshing) {

          setIsRefreshing(true);

        } else {

          setIsLoading(true);

        }


        setError(null);


        const result =
          await getNews({
            language,
            page: 1,
            limit: 50,
          });


        const publishedNews =
          result.filter(
            (item) =>
              item.type === 'news' &&
              item.status === 'published',
          );


        setNews(
          publishedNews,
        );

      } catch (loadError) {

        console.error(
          'GET PUBLISHED NEWS ERROR:',
          loadError,
        );


        setNews([]);

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load published news.',
        );

      } finally {

        setIsLoading(false);

        setIsRefreshing(false);

      }

    }, [language]);


  useEffect(() => {

    void loadNews();

  }, [loadNews]);


  return {

    news,

    isLoading,

    isRefreshing,

    error,

    refetch: () =>
      loadNews(true),

  };

}