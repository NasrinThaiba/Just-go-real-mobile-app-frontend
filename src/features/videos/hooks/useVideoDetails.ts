import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { getCreatedVideoById } from '@/features/videos/storage/videoStorage';

import type {
  VideoItem,
} from '@/features/videos/types/videos.types';

export function useVideoDetails(
  id: string,
) {
  const [item, setItem] =
    useState<VideoItem | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadVideo =
    useCallback(async () => {
      if (!id) {
        setItem(null);
        setError(
          'Video ID is required.',
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const video =
          await getCreatedVideoById(
            id,
          );

        if (
          !video ||
          video.type !== 'video'
        ) {
          setItem(null);
          setError(
            'Video not found.',
          );
          return;
        }

        setItem(
          video as VideoItem,
        );
      } catch (loadError) {
        console.error(
          'Failed to load video:',
          loadError,
        );

        setItem(null);
        setError(
          'Unable to load video.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [id]);

  useEffect(() => {
    void loadVideo();
  }, [loadVideo]);

  return {
    item,
    isLoading,
    error,
    refetch: loadVideo,
  };
}