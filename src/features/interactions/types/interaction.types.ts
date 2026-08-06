export type UserRole =
  | 'user'
  | 'admin';

export type InteractionUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type StoredComment = {
  id: string;
  author: string;
  authorId: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
};

export type ContentInteraction = {
  contentId: string;
  isFavorite: boolean;
  isBookmarked: boolean;
  comments: StoredComment[];
};