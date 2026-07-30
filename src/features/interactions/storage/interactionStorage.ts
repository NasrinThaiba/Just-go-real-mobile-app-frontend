import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ContentInteraction,
  StoredComment,
} from '@/features/interactions/types/interaction.types';

const INTERACTIONS_KEY =
  '@just_go_real/content_interactions';

type StoredInteractions = Record<
  string,
  ContentInteraction
>;

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

async function getAllInteractions(): Promise<StoredInteractions> {
  try {
    const storedValue =
      await AsyncStorage.getItem(
        INTERACTIONS_KEY,
      );

    if (!storedValue) {
      return {};
    }

    return JSON.parse(
      storedValue,
    ) as StoredInteractions;
  } catch (error) {
    console.error(
      'Failed to load interactions:',
      error,
    );

    return {};
  }
}

async function saveAllInteractions(
  interactions: StoredInteractions,
): Promise<void> {
  await AsyncStorage.setItem(
    INTERACTIONS_KEY,
    JSON.stringify(interactions),
  );
}

export async function getContentInteraction(
  contentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  return (
    interactions[contentId] ??
    createDefaultInteraction(contentId)
  );
}

export async function toggleStoredFavorite(
  contentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(contentId);

  const updated: ContentInteraction = {
    ...current,
    isFavorite:
      !current.isFavorite,
  };

  interactions[contentId] =
    updated;

  await saveAllInteractions(
    interactions,
  );

  return updated;
}

export async function toggleStoredBookmark(
  contentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(contentId);

  const updated: ContentInteraction = {
    ...current,
    isBookmarked:
      !current.isBookmarked,
  };

  interactions[contentId] =
    updated;

  await saveAllInteractions(
    interactions,
  );

  return updated;
}

export async function addStoredComment(
  contentId: string,
  message: string,
  author = 'Local User',
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(contentId);

  const comment: StoredComment = {
    id: `comment-${Date.now()}`,
    contentId,
    message: message.trim(),
    author,
    createdAt:
      new Date().toISOString(),
  };

  const updated: ContentInteraction = {
    ...current,
    comments: [
      comment,
      ...current.comments,
    ],
  };

  interactions[contentId] =
    updated;

  await saveAllInteractions(
    interactions,
  );

  return updated;
}

export async function deleteStoredComment(
  contentId: string,
  commentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(contentId);

  const updated: ContentInteraction = {
    ...current,
    comments:
      current.comments.filter(
        (comment) =>
          comment.id !== commentId,
      ),
  };

  interactions[contentId] =
    updated;

  await saveAllInteractions(
    interactions,
  );

  return updated;
}