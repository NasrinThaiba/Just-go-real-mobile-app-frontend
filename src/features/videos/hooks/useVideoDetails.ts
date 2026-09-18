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



export function useVideoDetails(
  id:string,
) {


  const [
    item,
    setItem,
  ] =
  useState<VideoItem | null>(null);



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




  const loadVideo =
    useCallback(async()=>{


      if(!id){

        setError(
          'Video id required',
        );

        setIsLoading(false);

        return;

      }



      try {


        setIsLoading(true);

        setError(null);



        const video =
          await videosApi.getVideoById(
            id,
          );



        if(!video){


          setItem(null);


          setError(
            'Video not found',
          );


          return;

        }



        setItem(
          video,
        );



      } catch(error) {


        console.error(
          'Failed to load video:',
          error,
        );


        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load video',
        );



      } finally {


        setIsLoading(false);


      }


    },[
      id,
    ]);




  useEffect(()=>{


    void loadVideo();


  },[
    loadVideo,
  ]);




  return {

    item,

    isLoading,

    error,

    refetch: loadVideo,

  };


}