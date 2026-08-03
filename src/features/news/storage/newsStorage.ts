import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

const CREATED_NEWS_KEY =
  '@just_go_real/created_news';

export async function getCreatedNews(): Promise<
  FeedItem[]
> {
  try {
    const storedValue =
      await AsyncStorage.getItem(
        CREATED_NEWS_KEY,
      );

    if (!storedValue) {
      return [];
    }

    const parsedNews =
      JSON.parse(storedValue) as FeedItem[];

    // Supports older stored posts that do not have status.
    return parsedNews.map((item) => ({
      ...item,
      status:
        item.status ??
        'pending',
    }));
  } catch (error) {
    console.error(
      'Failed to load created news:',
      error,
    );

    return [];
  }
}

export async function saveCreatedNews(
  newsItem: FeedItem,
): Promise<void> {
  const existingNews =
    await getCreatedNews();

  const updatedNews = [
    newsItem,
    ...existingNews,
  ];

  await AsyncStorage.setItem(
    CREATED_NEWS_KEY,
    JSON.stringify(updatedNews),
  );
}

export async function updateCreatedNewsStatus(
  newsId: string,
  status: PostStatus,
): Promise<void> {
  const existingNews = await getCreatedNews();

  const updatedNews =
    existingNews.map((item) => {
      if (item.id !== newsId) {
        return item;
      }

      return {
        ...item,
        status,
        publishedAt:
          status === 'published'
            ? item.publishedAt ??
              new Date().toISOString()
            : item.publishedAt,
      };
    });

  await AsyncStorage.setItem(
    CREATED_NEWS_KEY,
    JSON.stringify(updatedNews),
  );

  console.log('NEWS STATUS UPDATED:', newsId, status );
}

export async function deleteCreatedNews(
  newsId: string,
): Promise<void> {
  const existingNews =
    await getCreatedNews();

  const updatedNews =
    existingNews.filter(
      (item) =>
        item.id !== newsId,
    );

  await AsyncStorage.setItem(
    CREATED_NEWS_KEY,
    JSON.stringify(updatedNews),
  );
}

export async function getCreatedNewsById(
  newsId: string,
): Promise<FeedItem | null> {
  const items = await getCreatedNews();

  return (
    items.find(
      (item) => item.id === newsId,
    ) ?? null
  );
}

export async function updateCreatedNews(
  newsId: string,
  updatedValues: Partial<FeedItem>,
): Promise<void> {
  const existingNews =
    await getCreatedNews();

  const updatedNews =
    existingNews.map((item) =>
      item.id === newsId
        ? {
            ...item,
            ...updatedValues,
            id: item.id,
            createdAt:
              item.createdAt,
          }
        : item,
    );

  await AsyncStorage.setItem(
    CREATED_NEWS_KEY,
    JSON.stringify(updatedNews),
  );
}