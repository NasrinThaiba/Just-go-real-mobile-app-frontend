import {
  useCallback,
  useState,
} from 'react';

import {
  useFocusEffect,
} from 'expo-router';


import {
  videosApi,
} from '@/features/videos/api/videos.api';


import type {
  VideoItem,
} from '@/features/videos/types/videos.types';



export function usePublishedVideos() {


  const [
    videos,
    setVideos,
  ] =
  useState<VideoItem[]>([]);



  const [
    isLoading,
    setIsLoading,
  ] =
  useState(true);



  const [
    error,
    setError,
  ] =
  useState<string | null>(null);




  const loadVideos =
    useCallback(async()=>{


      try {


        setIsLoading(true);

        setError(null);



        const result =
          await videosApi.getVideos();



        const publishedVideos =
          result

          .filter(
            (item)=>
              item.type === 'video' &&
              item.status === 'published',
          )

          .sort(
            (
              first,
              second,
            )=>{


              const firstDate =
                first.publishedAt ??
                first.createdAt;


              const secondDate =
                second.publishedAt ??
                second.createdAt;



              return (

                new Date(secondDate)
                  .getTime()

                -

                new Date(firstDate)
                  .getTime()

              );


            },
          );



        setVideos(
          publishedVideos,
        );


      } catch(error) {


        console.error(
          'Failed to load published videos:',
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



    },[]);




  useFocusEffect(

    useCallback(()=>{


      void loadVideos();


      return undefined;


    },[
      loadVideos,
    ]),


  );




  return {

    videos,

    isLoading,

    error,

    refetch: loadVideos,

  };


}