import {
 useEffect,
 useState,
} from 'react';

import {
 videosApi,
} from '../api/videos.api';

import type {
 VideoItem,
} from '../types/videos.types';



export function useVideoDetails(
 id:string
){

 const [
  item,
  setItem
 ] =
 useState<VideoItem|null>(null);


 const [
  isLoading,
  setLoading
 ] =
 useState(true);


 const [
  error,
  setError
 ] =
 useState<string|null>(null);



 useEffect(()=>{


  if(!id){
   return;
  }


  async function load(){

   try{

    setLoading(true);


    const video =
     await videosApi.getVideoById(
      id
     );


    setItem(video);


   }
   catch(error){

    setError(
     error instanceof Error
      ? error.message
      : 'Video not found'
    );

   }
   finally{

    setLoading(false);

   }

  }


  void load();


 },[id]);



 return {
  item,
  isLoading,
  error,
 };

}