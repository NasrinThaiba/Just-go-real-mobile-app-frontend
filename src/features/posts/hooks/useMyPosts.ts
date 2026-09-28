import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import {
  postsApi,
} from '@/features/posts/api/posts.api';


export type MyPostFilter =
  | 'all'
  | 'news'
  | 'video'
  | 'published';


export type PostSummaryData = {

  totalPosts: number;

  totalNews: number;

  totalVideos: number;

  totalFavorites: number;

  totalViews: number;

  totalPublished: number;

};


// =====================================================
// HOOK
// =====================================================

export function useMyPosts() {


  const [
    items,
    setItems,
  ] = useState<FeedItem[]>([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  // ===================================================
  // FETCH POSTS
  // ===================================================

  const fetchPosts =
    useCallback(
      async () => {

        try {

          setIsLoading(true);

          setError(null);


          const nextItems =
            await postsApi.getMyPosts();


          console.log(
            'MY POSTS DATA:',
            JSON.stringify(
              nextItems,
              null,
              2,
            ),
          );


          setItems(
            Array.isArray(nextItems)
              ? nextItems
              : [],
          );

        }
        catch (error) {

          console.log(
            'GET MY POSTS ERROR:',
            error,
          );


          setError(
            'Failed to load posts.',
          );


          setItems([]);

        }
        finally {

          setIsLoading(false);

        }

      },
      [],
    );


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    void fetchPosts();

  }, [
    fetchPosts,
  ]);


  // ===================================================
  // SUMMARY
  // ===================================================

  const summary =
    useMemo<PostSummaryData>(() => {


      const totalPosts =
        items.length;


      const totalNews =
        items.filter(
          item =>
            item.type === 'news',
        ).length;


      const totalVideos =
        items.filter(
          item =>
            item.type === 'video',
        ).length;


      const totalFavorites =
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            Number(
              item.likes ?? 0,
            ),
          0,
        );


      const totalViews =
        items.reduce(
          (
            total,
            item,
          ) =>
            total +
            Number(
              item.views ?? 0,
            ),
          0,
        );


      const totalPublished =
        items.filter(
          item =>
            item.status === 'published',
        ).length;


      return {

        totalPosts,

        totalNews,

        totalVideos,

        totalFavorites,

        totalViews,

        totalPublished,

      };

    }, [
      items,
    ]);


  // ===================================================
  // RETURN
  // ===================================================

  return {

    items,

    summary,

    isLoading,

    error,

    refetch:
      fetchPosts,

  };

}