import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

const CREATED_VIDEOS_KEY =
  '@just_go_real/created_videos';

export async function getCreatedVideos(): Promise<
  FeedItem[]
> {
  try {
    const storedValue =
      await AsyncStorage.getItem(
        CREATED_VIDEOS_KEY,
      );

    if (!storedValue) {
      return [];
    }

    const parsedVideos =
      JSON.parse(storedValue) as FeedItem[];

    return parsedVideos.map((item) => ({
      ...item,
      status:
        item.status ??
        'pending',
    }));
  } catch (error) {
    console.error(
      'Failed to load created videos:',
      error,
    );

    return [];
  }
}

export async function saveCreatedVideo(
  videoItem: FeedItem,
): Promise<void> {
  const existingVideos =
    await getCreatedVideos();

  const updatedVideos = [
    videoItem,
    ...existingVideos,
  ];

  await AsyncStorage.setItem(
    CREATED_VIDEOS_KEY,
    JSON.stringify(updatedVideos),
  );
}

export async function updateCreatedVideoStatus(
  videoId: string,
  status: PostStatus,
): Promise<void> {
  const existingVideos =
    await getCreatedVideos();

  const updatedVideos =
    existingVideos.map((item) => {
      if (item.id !== videoId) {
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
    CREATED_VIDEOS_KEY,
    JSON.stringify(updatedVideos),
  );
}

export async function deleteCreatedVideo(
  videoId: string,
): Promise<void> {
  const existingVideos =
    await getCreatedVideos();

  const updatedVideos =
    existingVideos.filter(
      (item) =>
        item.id !== videoId,
    );

  await AsyncStorage.setItem(
    CREATED_VIDEOS_KEY,
    JSON.stringify(updatedVideos),
  );
}

export async function getCreatedVideoById(
  videoId: string,
): Promise<FeedItem | null> {
  const items =
    await getCreatedVideos();

  return (
    items.find(
      (item) => item.id === videoId,
    ) ?? null
  );
}

export async function updateCreatedVideo(
  videoId: string,
  updatedValues: Partial<FeedItem>,
): Promise<void> {
  const existingVideos =
    await getCreatedVideos();

  const updatedVideos =
    existingVideos.map((item) =>
      item.id === videoId
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
    CREATED_VIDEOS_KEY,
    JSON.stringify(updatedVideos),
  );
}