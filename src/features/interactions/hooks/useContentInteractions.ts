import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  addStoredComment,
  deleteStoredComment,
  getContentInteraction,
  toggleStoredBookmark,
  toggleStoredFavorite,
} from '@/features/interactions/storage/interactionStorage';

import type {
  ContentInteraction,
} from '@/features/interactions/types/interaction.types';

function createDefaultInteraction(
  contentId: string,
): ContentInteraction {
  return {
    contentId,
    isFavorite: false,
    isBookmarked: false,
    comments: [],
  };
}

export function useContentInteractions(
  contentId: string,
) {
  const [
    interaction,
    setInteraction,
  ] = useState<ContentInteraction>(
    createDefaultInteraction(contentId),
  );

  const [isLoading, setIsLoading] =
    useState(true);

  const loadInteraction =
    useCallback(async () => {
      if (!contentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const result =
          await getContentInteraction(
            contentId,
          );

        setInteraction(result);
      } catch (error) {
        console.error(
          'Interaction load failed:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }, [contentId]);

  useEffect(() => {
    void loadInteraction();
  }, [loadInteraction]);

  const toggleFavorite =
    useCallback(async () => {
      const result =
        await toggleStoredFavorite(
          contentId,
        );

      setInteraction(result);

      return result;
    }, [contentId]);

  const toggleBookmark =
    useCallback(async () => {
      const result =
        await toggleStoredBookmark(
          contentId,
        );

      setInteraction(result);

      return result;
    }, [contentId]);

  const addComment =
    useCallback(
      async (message: string) => {
        const result =
          await addStoredComment(
            contentId,
            message,
          );

        setInteraction(result);

        return result;
      },
      [contentId],
    );

  const deleteComment =
    useCallback(
      async (
        commentId: string,
      ) => {
        const result =
          await deleteStoredComment(
            contentId,
            commentId,
          );

        setInteraction(result);

        return result;
      },
      [contentId],
    );

  return {
    interaction,
    isLoading,
    toggleFavorite,
    toggleBookmark,
    addComment,
    deleteComment,
    refetch: loadInteraction,
  };
}