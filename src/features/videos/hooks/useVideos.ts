import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  videosApi,
} from '@/features/videos/api/videos.api';

import type {
  VideoItem,
} from '@/features/videos/types/videos.types';

import type {
  SupportedLanguage,
} from '@/features/news/types/news.types';


export function useVideos(
  language?: SupportedLanguage,
) {

  const [
    items,
    setItems,
  ] = useState<VideoItem[]>([]);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(null);



  const loadVideos =
    useCallback(async () => {

      try {

        setIsLoading(true);

        setError(null);


        const response =
          await videosApi.getVideos();


        setItems(
          response,
        );


      } catch (error) {

        console.error(
          'Failed to load videos:',
          error,
        );


        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load videos',
        );


      } finally {

        setIsLoading(false);

      }


    }, []);



  useEffect(() => {

    void loadVideos();

  }, [
    loadVideos,
  ]);



  const filteredItems =
    useMemo(() => {


      if (!language) {

        return items;

      }


      return items.filter(
        (item) =>
          item.language === language,
      );


    }, [
      items,
      language,
    ]);



  return {

    items: filteredItems,

    isLoading,

    error,

    refetch: loadVideos,

  };

}