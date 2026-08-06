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
  InteractionUser,
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
  currentUser: InteractionUser | null,
) {
  const [
    interaction,
    setInteraction,
  ] = useState<ContentInteraction>(
    createDefaultInteraction(
      contentId,
    ),
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

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
      async (
        message: string,
      ) => {
        if (!currentUser) {
          throw new Error(
            'Please login to comment',
          );
        }

        const result =
          await addStoredComment(
            contentId,
            message,
            currentUser,
          );

        setInteraction(result);

        return result;
      },
      [
        contentId,
        currentUser,
      ],
    );

  const deleteComment =
    useCallback(
      async (
        commentId: string,
      ) => {
        if (!currentUser) {
          throw new Error(
            'Please login to delete this comment',
          );
        }

        const result =
          await deleteStoredComment(
            contentId,
            commentId,
            currentUser,
          );

        setInteraction(result);

        return result;
      },
      [
        contentId,
        currentUser,
      ],
    );

  return {
    interaction,
    isLoading,
    toggleFavorite,
    toggleBookmark,
    addComment,
    deleteComment,
    refetch:
      loadInteraction,
  };
}