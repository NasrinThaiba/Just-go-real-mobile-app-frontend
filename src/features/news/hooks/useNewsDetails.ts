// src/features/news/hooks/useNewsDetails.ts

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getNewsById,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
} from '@/features/news/types/news.types';


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


        const result =
          await getNewsById(id);


        if (!result) {

          setItem(null);

          setError(
            'News not found.',
          );

          return;
        }


        setItem(result);

      } catch (loadError) {

        console.error(
          'Failed to load news:',
          loadError,
        );


        setItem(null);


        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load news.',
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