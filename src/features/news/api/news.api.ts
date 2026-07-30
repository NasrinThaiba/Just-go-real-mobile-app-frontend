import { API_BASE_URL } from '@/services/apiClient';
import { dummyNews } from '@/data/dummyNews';
import type { FeedItem } from '@/features/news/types/news.types';

type NewsListResponse = {
  items: FeedItem[];
};

export async function getNews(): Promise<FeedItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);

    if (!response.ok) {
      throw new Error(`Unable to fetch news: ${response.status}`);
    }

    const data = (await response.json()) as NewsListResponse | FeedItem[];

    return Array.isArray(data) ? data : data.items;
  } catch {
    return dummyNews;
  }
}

export async function getNewsById(
  id: string,
): Promise<FeedItem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);

    if (!response.ok) {
      throw new Error(`Unable to fetch news details: ${response.status}`);
    }

    return (await response.json()) as FeedItem;
  } catch {
    return dummyNews.find((item) => item.id === id) ?? null;
  }
}

export async function createNews(
  payload: Omit<FeedItem, 'id' | 'publishedAt' | 'views' | 'likes'>,
): Promise<FeedItem> {
  const response = await fetch(`${API_BASE_URL}/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Unable to create news: ${response.status}`);
  }

  return (await response.json()) as FeedItem;
}
