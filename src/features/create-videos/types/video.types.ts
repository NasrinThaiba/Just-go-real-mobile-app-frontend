// src/features/video/types/video.types.ts


export type VideoCategory =

  | 'politics'

  | 'business'

  | 'sports'

  | 'cinema'

  | 'technology'

  | 'science'

  | 'world'

  | 'education'

  | 'entertainment'

  | 'other';




export type VideoLanguage =

  | 'en'

  | 'ta';




export type VideoStatus =

  | 'draft'

  | 'pending'

  | 'published'

  | 'rejected';




export type VideoType =

  | 'short'

  | 'normal'

  | 'live';





export type VideoItem = {

  id:string;

  title:string;

  description:string;

  videoUrl:string;

  thumbnailUrl:string;

  category:VideoCategory;

  language:VideoLanguage;

  videoType:VideoType;

  status:VideoStatus;

  views:number;

  createdAt:string;

  updatedAt:string;

};






export type CreateVideoPayload = {

  title:string;

  description:string;

  videoUrl:string;

  thumbnailUrl?:string;

  category:VideoCategory;

  language:VideoLanguage;

  videoType:VideoType;

  status:

    | 'draft'

    | 'pending';

};