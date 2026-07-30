export type StoredComment = {
  id: string;
  contentId: string;
  message: string;
  author: string;
  createdAt: string;
};

export type ContentInteraction = {
  contentId: string;
  isFavorite: boolean;
  isBookmarked: boolean;
  comments: StoredComment[];
};