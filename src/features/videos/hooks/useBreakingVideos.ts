import {
  useCallback,
  useEffect,
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



type UseBreakingVideosResult = {

  items: VideoItem[];

  isLoading: boolean;

  error: string | null;

  refetch: () => Promise<void>;

};



export function useBreakingVideos(
  language: SupportedLanguage,
): UseBreakingVideosResult {


  const [items,setItems] =
    useState<VideoItem[]>([]);



  const [isLoading,setIsLoading] =
    useState(true);



  const [error,setError] =
    useState<string | null>(null);




  const loadBreakingVideos =
    useCallback(
      async()=>{


        try {


          setIsLoading(true);

          setError(null);



          const result =
            await videosApi.getBreakingVideos({
              language,
              page:1,
              limit:20,
            });



          setItems(result);



        } catch(error) {


          console.error(
            'GET BREAKING VIDEOS ERROR:',
            error,
          );


          setItems([]);



          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load breaking videos',
          );


        } finally {


          setIsLoading(false);

        }



      },
      [
        language,
      ],
    );




  useEffect(()=>{

    void loadBreakingVideos();

  },[
    loadBreakingVideos,
  ]);




  return {

    items,

    isLoading,

    error,

    refetch:
      loadBreakingVideos,

  };

}