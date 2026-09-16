// src/features/news/hooks/useNewsMutations.ts

import {
  useState,
} from 'react';

import {
  createNews,
  updateNews,
  unpublishNews,
  deleteNews,
} from '@/features/news/api/news.api';

import type {
  CreateNewsPayload,
  UpdateNewsPayload,
} from '@/features/news/api/news.api';

import type {
  FeedItem,
} from '@/features/news/types/news.types';


export function useNewsMutations() {

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const create =
    async (
      payload: CreateNewsPayload,
    ): Promise<FeedItem> => {

      try {

        setIsLoading(true);

        setError(null);


        return await createNews(
          payload,
        );

      } catch (mutationError) {

        const message =
          mutationError instanceof Error
            ? mutationError.message
            : 'Unable to create news';


        setError(message);

        throw mutationError;

      } finally {

        setIsLoading(false);

      }

    };


  const update =
    async (
      id: string,
      payload: UpdateNewsPayload,
    ): Promise<FeedItem> => {

      try {

        setIsLoading(true);

        setError(null);


        return await updateNews(
          id,
          payload,
        );

      } catch (mutationError) {

        const message =
          mutationError instanceof Error
            ? mutationError.message
            : 'Unable to update news';


        setError(message);

        throw mutationError;

      } finally {

        setIsLoading(false);

      }

    };


  const unpublish =
    async (
      id: string,
    ) => {

      try {

        setIsLoading(true);

        setError(null);


        return await unpublishNews(
          id,
        );

      } catch (mutationError) {

        const message =
          mutationError instanceof Error
            ? mutationError.message
            : 'Unable to unpublish news';


        setError(message);

        throw mutationError;

      } finally {

        setIsLoading(false);

      }

    };


  const remove =
    async (
      id: string,
    ) => {

      try {

        setIsLoading(true);

        setError(null);


        await deleteNews(
          id,
        );

      } catch (mutationError) {

        const message =
          mutationError instanceof Error
            ? mutationError.message
            : 'Unable to delete news';


        setError(message);

        throw mutationError;

      } finally {

        setIsLoading(false);

      }

    };


  return {

    create,

    update,

    unpublish,

    remove,

    isLoading,

    error,

  };

}