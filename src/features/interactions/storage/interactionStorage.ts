import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ContentInteraction,
  InteractionUser,
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
    JSON.stringify(
      interactions,
    ),
  );
}

export async function getContentInteraction(
  contentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  return (
    interactions[contentId] ??
    createDefaultInteraction(
      contentId,
    )
  );
}

export async function toggleStoredFavorite(
  contentId: string,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(
      contentId,
    );

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
    createDefaultInteraction(
      contentId,
    );

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
  currentUser: InteractionUser,
): Promise<ContentInteraction> {
  const trimmedMessage =
    message.trim();

  if (!trimmedMessage) {
    throw new Error(
      'Comment cannot be empty',
    );
  }

  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(
      contentId,
    );

  const newComment: StoredComment = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    author:
      currentUser.name,
    authorId:
      currentUser.id,
    authorRole:
      currentUser.role,
    message:
      trimmedMessage,
    createdAt:
      new Date().toISOString(),
  };

  const updated: ContentInteraction = {
    ...current,
    comments: [
      ...current.comments,
      newComment,
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
  currentUser: InteractionUser,
): Promise<ContentInteraction> {
  const interactions =
    await getAllInteractions();

  const current =
    interactions[contentId] ??
    createDefaultInteraction(
      contentId,
    );

  const selectedComment =
    current.comments.find(
      (comment) =>
        comment.id ===
        commentId,
    );

  if (!selectedComment) {
    throw new Error(
      'Comment not found',
    );
  }

  const isOwner =
    selectedComment.authorId ===
    currentUser.id;

  const isAdmin =
    currentUser.role ===
    'admin';

  if (!isOwner && !isAdmin) {
    throw new Error(
      'You cannot delete this comment',
    );
  }

  const updated: ContentInteraction = {
    ...current,
    comments:
      current.comments.filter(
        (comment) =>
          comment.id !==
          commentId,
      ),
  };

  interactions[contentId] =
    updated;

  await saveAllInteractions(
    interactions,
  );

  return updated;
}

export async function clearStoredInteractions(): Promise<void> {
  await AsyncStorage.removeItem(
    INTERACTIONS_KEY,
  );
}