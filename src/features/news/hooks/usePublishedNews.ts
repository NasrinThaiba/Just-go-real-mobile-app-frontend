// src/features/news/hooks/usePublishedNews.ts

import {
  useCallback,
  useState,
} from 'react';
import {
  useFocusEffect,
} from 'expo-router';

import {
  getCreatedNews,
} from '@/features/news/storage/newsStorage';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

export function usePublishedNews() {
  const [news, setNews] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadNews = useCallback(
    async (
      refreshing = false,
    ) => {
      try {
        if (refreshing) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError(null);

        const createdNews =
          await getCreatedNews();

        const publishedNews =
          createdNews
            .filter(
              (item) =>
                item.type ===
                  'news' &&
                item.status ===
                  'published',
            )
            .sort(
              (first, second) => {
                const firstDate =
                  first.publishedAt ??
                  first.createdAt ??
                  0;

                const secondDate =
                  second.publishedAt ??
                  second.createdAt ??
                  0;

                return (
                  new Date(
                    secondDate,
                  ).getTime() -
                  new Date(
                    firstDate,
                  ).getTime()
                );
              },
            );

        setNews(publishedNews);
      } catch (loadError) {
        console.error(
          'Failed to load published news:',
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
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      void loadNews();
    }, [loadNews]),
  );

  return {
    news,
    isLoading,
    isRefreshing,
    error,

    refetch: () =>
      loadNews(true),
  };
}