// src/features/video/api/video.api.ts


import {
  apiClient,
} from '@/shared/api/axiosInstance';



import type {
  CreateVideoPayload,
  VideoItem,
} from '../types/video.types';





export async function createVideo(

 payload:CreateVideoPayload,

):Promise<VideoItem>{


 const response =

 await apiClient.post(

   '/videos',

   payload,

 );


 return response.data.data;


}







export async function getMyVideoById(

 id:string,

):Promise<VideoItem>{


 const response =

 await apiClient.get(

   `/videos/me/${id}`,

 );


 return response.data.data;


}







export async function updateVideo(

 id:string,

 payload:
 Partial<CreateVideoPayload>,

):Promise<VideoItem>{


 const response =

 await apiClient.patch(

   `/videos/${id}`,

   payload,

 );


 return response.data.data;


}