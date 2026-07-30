import { useMemo } from 'react';

import { useNews } from '@/features/news/hooks/useNews';
import type {
  FeedItem,
  SupportedLanguage,
} from '@/features/news/types/news.types';

type UseBreakingNewsResult = {
  items: FeedItem[];
  isLoading: boolean;
  error: string | null;
};

export function useBreakingNews(
  language: SupportedLanguage,
): UseBreakingNewsResult {
  const {
    items,
    isLoading,
    error,
  } = useNews(language);

  const breakingItems = useMemo(() => {
    return items
      .filter((item) => {
        const isBreakingNews =
          item.type === 'news' &&
          item.newsType === 'breaking';

        const isBreakingVideo =
          item.type === 'video' &&
          item.videoType === 'breaking';

        return (
          item.status === 'published' &&
          item.language === language &&
          (isBreakingNews ||
            isBreakingVideo)
        );
      })
      .sort((first, second) => {
        const firstDate =
          first.publishedAt ??
          first.createdAt;

        const secondDate =
          second.publishedAt ??
          second.createdAt;

        return (
          new Date(
            secondDate,
          ).getTime() -
          new Date(
            firstDate,
          ).getTime()
        );
      });
  }, [items, language]);

  return {
    items: breakingItems,
    isLoading,
    error,
  };
}