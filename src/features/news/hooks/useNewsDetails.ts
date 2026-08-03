import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { dummyNews } from '@/data/dummyNews';
import { getCreatedNewsById } from '@/features/news/storage/newsStorage';
import { getCreatedVideoById } from '@/features/videos/storage/videoStorage';

import type { FeedItem } from '@/features/news/types/news.types';

export function useNewsDetails(
  id: string,
) {
  const [item, setItem] =
    useState<FeedItem | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadContent =
    useCallback(async () => {
      if (!id) {
        setItem(null);
        setError(
          'Content ID is required.',
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const seedItem =
          dummyNews.find(
            (newsItem) =>
              newsItem.id === id,
          );

        if (seedItem) {
          setItem(seedItem);
          return;
        }

        if (
          id.startsWith(
            'local-news-',
          )
        ) {
          const localNews =
            await getCreatedNewsById(
              id,
            );

          if (localNews) {
            setItem(localNews);
            return;
          }
        }

        if (
          id.startsWith(
            'local-video-',
          )
        ) {
          const localVideo =
            await getCreatedVideoById(
              id,
            );

          if (localVideo) {
            setItem(localVideo);
            return;
          }
        }

        const localNews =
          await getCreatedNewsById(
            id,
          );

        if (localNews) {
          setItem(localNews);
          return;
        }

        const localVideo =
          await getCreatedVideoById(
            id,
          );

        if (localVideo) {
          setItem(localVideo);
          return;
        }

        setItem(null);
        setError(
          'Content not found.',
        );
      } catch (loadError) {
        console.error(
          'Failed to load content:',
          loadError,
        );

        setItem(null);

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load content.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  return {
    item,
    isLoading,
    error,
    refetch: loadContent,
  };
}