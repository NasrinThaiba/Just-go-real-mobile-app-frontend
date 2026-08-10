import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  deleteCreatedNews,
  getCreatedNews,
  updateCreatedNewsStatus,
} from '@/features/news/storage/newsStorage';

import {
  deleteCreatedVideo,
  getCreatedVideos,
  updateCreatedVideoStatus,
} from '@/features/videos/storage/videoStorage';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

export type AdminPostFilter =
  | 'all'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'unpublished';

export function useAdminPosts() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [filter, setFilter] = useState<AdminPostFilter>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadPosts = useCallback(
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

        const [
          createdNews,
          createdVideos,
        ] = await Promise.all([
          getCreatedNews(),
          getCreatedVideos(),
        ]);

        const mergedItems: FeedItem[] =
          [
            ...createdNews,
            ...createdVideos,
          ].sort(
            (
              first,
              second,
            ) => {
              const firstDate =
                new Date(first.createdAt ?? 0).getTime();
              const secondDate =
                new Date(second.createdAt ?? 0).getTime();
              return (secondDate - firstDate);
            },
          );
        setItems(mergedItems);
      } catch (loadError) {
        console.error(
          'Failed to load admin posts:',
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load posts.',
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const changeStatus =
    useCallback(
      async (
        item: FeedItem,
        status: PostStatus,
      ) => {
        console.log(
          'ADMIN STATUS CHANGE:',
          item.id,
          item.type,
          status,
        );

        if (
          item.type === 'video'
        ) {
          await updateCreatedVideoStatus(
            item.id,
            status,
          );
        } else {
          await updateCreatedNewsStatus(
            item.id,
            status,
          );
        }

        setItems(
          (currentItems) =>
            currentItems.map(
              (currentItem) =>
                currentItem.id ===
                item.id
                  ? {
                      ...currentItem,
                      status,

                      publishedAt:
                        status ===
                        'published'
                          ? new Date().toISOString()
                          : undefined,
                    }
                  : currentItem,
            ),
        );
      },
      [],
    );

  const approvePost =
    useCallback(
      async (item: FeedItem) => {
        await changeStatus(
          item,
          'published',
        );
      },
      [changeStatus],
    );

  const rejectPost =
    useCallback(
      async (item: FeedItem) => {
        await changeStatus(
          item,
          'rejected',
        );
      },
      [changeStatus],
    );

  const unpublishPost =
    useCallback(
      async (item: FeedItem) => {
        await changeStatus(
          item,
          'unpublished',
        );
      },
      [changeStatus],
    );

  const deletePost =
    useCallback(
      async (item: FeedItem) => {
        if (
          item.type === 'video'
        ) {
          await deleteCreatedVideo(
            item.id,
          );
        } else {
          await deleteCreatedNews(
            item.id,
          );
        }

        setItems(
          (currentItems) =>
            currentItems.filter(
              (currentItem) =>
                currentItem.id !==
                item.id,
            ),
        );
      },
      [],
    );

  const filteredItems =
    useMemo(() => {
      if (filter === 'all') {
        return items;
      }

      if (filter === 'pending') {
        return items.filter(
          (item) => {
            const status =
              item.status ??
              'pending';

            return (
              status ===
                'pending' ||
              status ===
                'unpublished'
            );
          },
        );
      }

      return items.filter(
        (item) =>
          (item.status ??
            'pending') ===
          filter,
      );
    }, [filter, items]);

  const summary =
    useMemo(() => {
      const pending =
        items.filter(
          (item) => {
            const status =
              item.status ??
              'pending';

            return (
              status ===
                'pending' ||
              status ===
                'unpublished'
            );
          },
        ).length;

      const published =
        items.filter(
          (item) =>
            item.status ===
            'published',
        ).length;

      const rejected =
        items.filter(
          (item) =>
            item.status ===
            'rejected',
        ).length;

      return {
        total: items.length,
        pending,
        published,
        rejected,
      };
    }, [items]);

  const refresh =
    useCallback(() => {
      void loadPosts(true);
    }, [loadPosts]);

  return {
    items,
    filteredItems,
    filter,
    summary,
    isLoading,
    isRefreshing,
    error,

    setFilter,
    approvePost,
    rejectPost,
    unpublishPost,
    deletePost,
    refresh,
  };
}