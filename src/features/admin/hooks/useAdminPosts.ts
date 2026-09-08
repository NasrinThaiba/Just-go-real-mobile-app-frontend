import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getAdminDashboard,
  getAdminPosts,
  approveAdminPost,
  rejectAdminPost,
  unpublishAdminPost,
  deleteAdminPost,
} from '@/features/admin/api/admin.api';

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

type DashboardSummary = {
  total: number;
  pending: number;
  published: number;
  rejected: number;
};

const INITIAL_SUMMARY: DashboardSummary = {
  total: 0,
  pending: 0,
  published: 0,
  rejected: 0,
};

export function useAdminPosts() {
  // =====================================================
  // STATE
  // =====================================================

  const [items, setItems] =
    useState<FeedItem[]>([]);

  const [filter, setFilter] =
    useState<AdminPostFilter>('pending');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [summary, setSummary] =
    useState<DashboardSummary>(
      INITIAL_SUMMARY,
    );

  // =====================================================
  // LOAD POSTS + DASHBOARD
  // =====================================================

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
          posts,
          dashboard,
        ] = await Promise.all([
          getAdminPosts(),
          getAdminDashboard(),
        ]);

        // Newest posts first
        const sortedPosts =
          [...posts].sort(
            (
              first,
              second,
            ) => {
              const firstTime =
                new Date(
                  first.createdAt ?? 0,
                ).getTime();

              const secondTime =
                new Date(
                  second.createdAt ?? 0,
                ).getTime();

              return (
                secondTime -
                firstTime
              );
            },
          );

        setItems(
          sortedPosts,
        );

        setSummary(
          dashboard,
        );
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

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // =====================================================
  // CHANGE POST STATUS
  // =====================================================

  const changeStatus =
    useCallback(
      async (
        item: FeedItem,
        status: PostStatus,
      ) => {
        let updatedItem: FeedItem;

        switch (status) {
          case 'published':
            updatedItem =
              await approveAdminPost(
                item.id,
              );
            break;

          case 'rejected':
            updatedItem =
              await rejectAdminPost(
                item.id,
              );
            break;

          case 'unpublished':
            updatedItem =
              await unpublishAdminPost(
                item.id,
              );
            break;

          default:
            return;
        }

        // Update post immediately
        setItems(
          currentItems =>
            currentItems.map(
              currentItem =>
                currentItem.id ===
                item.id
                  ? {
                      ...currentItem,
                      ...updatedItem,
                    }
                  : currentItem,
            ),
        );

        // Refresh dashboard counters
        try {
          const dashboard =
            await getAdminDashboard();

          setSummary(
            dashboard,
          );
        } catch (dashboardError) {
          console.error(
            'Failed to refresh dashboard:',
            dashboardError,
          );
        }
      },
      [],
    );

  // =====================================================
  // APPROVE / PUBLISH
  // =====================================================

  const approvePost =
    useCallback(
      async (
        item: FeedItem,
      ) => {
        await changeStatus(
          item,
          'published',
        );
      },
      [changeStatus],
    );

  // =====================================================
  // REJECT
  // =====================================================

  const rejectPost =
    useCallback(
      async (
        item: FeedItem,
      ) => {
        await changeStatus(
          item,
          'rejected',
        );
      },
      [changeStatus],
    );

  // =====================================================
  // UNPUBLISH
  // =====================================================

  const unpublishPost =
    useCallback(
      async (
        item: FeedItem,
      ) => {
        await changeStatus(
          item,
          'unpublished',
        );
      },
      [changeStatus],
    );

  // =====================================================
  // DELETE
  // =====================================================

  const deletePost =
    useCallback(
      async (
        item: FeedItem,
      ) => {
        await deleteAdminPost(
          item.id,
        );

        // Remove from local list
        setItems(
          currentItems =>
            currentItems.filter(
              currentItem =>
                currentItem.id !==
                item.id,
            ),
        );

        // Refresh dashboard counters
        try {
          const dashboard =
            await getAdminDashboard();

          setSummary(
            dashboard,
          );
        } catch (dashboardError) {
          console.error(
            'Failed to refresh dashboard:',
            dashboardError,
          );
        }
      },
      [],
    );

  // =====================================================
  // FILTER POSTS
  // =====================================================

  const filteredItems =
    useMemo(() => {
      if (
        filter === 'all'
      ) {
        return items;
      }

      return items.filter(
        item => {
          const status =
            item.status ??
            'pending';

          return (
            status === filter
          );
        },
      );
    }, [
      filter,
      items,
    ]);

  // =====================================================
  // REFRESH
  // =====================================================

  const refresh =
    useCallback(() => {
      void loadPosts(true);
    }, [loadPosts]);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    // Posts
    items,
    filteredItems,

    // Filter
    filter,
    setFilter,

    // Dashboard
    summary,

    // Loading
    isLoading,
    isRefreshing,

    // Error
    error,

    // Actions
    approvePost,
    rejectPost,
    unpublishPost,
    deletePost,

    // Refresh
    refresh,
  };
}