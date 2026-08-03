import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCreatedNews } from '@/features/news/storage/newsStorage';
import type { FeedItem } from '@/features/news/types/news.types';
import { getCreatedVideos } from '@/features/videos/storage/videoStorage';

export type MyPostFilter =
  | 'all'
  | 'news'
  | 'video';

export function useMyPosts() {
  const [items, setItems] =
    useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadPosts = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          createdNews,
          createdVideos,
        ] = await Promise.all([
          getCreatedNews(),
          getCreatedVideos(),
        ]);

        const allPosts = [
          ...createdNews,
          ...createdVideos,
        ].sort((first, second) => {
          const firstDate =
            new Date(
              first.createdAt,
            ).getTime();

          const secondDate =
            new Date(
              second.createdAt,
            ).getTime();

          return (
            secondDate -
            firstDate
          );
        });

        setItems(allPosts);
      } catch (loadError) {
        console.error(
          'Failed to load posts:',
          loadError,
        );

        setError(
          'Unable to load your posts.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const summary = useMemo(() => {
    return {
      totalPosts:
        items.length,

      totalNews:
        items.filter(
          (item) =>
            item.type === 'news',
        ).length,

      totalVideos:
        items.filter(
          (item) =>
            item.type === 'video',
        ).length,

      totalFavorites:
        items.reduce(
          (total, item) =>
            total +
            (item.likes ?? 0),
          0,
        ),

      totalViews:
        items.reduce(
          (total, item) =>
            total +
            (item.views ?? 0),
          0,
        ),
    };
  }, [items]);

  return {
    items,
    summary,
    isLoading,
    error,
    refetch: loadPosts,
  };
}