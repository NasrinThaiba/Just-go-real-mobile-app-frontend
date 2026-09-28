export type VideoType =
  | 'breaking'
  | 'live'
  | 'latest';


export type VideoSource =
  | 'direct'
  | 'youtube';


export type VideoLanguage =
  | 'en'
  | 'ta';


export type VideoStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'unpublished';



export type CreateVideoPayload = {

  title:string;

  description?:string;

  videoType:VideoType;

  videoSource?:VideoSource;

  mediaUrl?:string;

  youtubeVideoId?:string;

  thumbnailUrl?:string;

  category?:string;

  language?:VideoLanguage;

  location?:string;

  status?:
    | 'draft'
    | 'pending';

};




// API response type

export type VideoItem = {

  id:string;

  title:string;

  description:string | null;


  videoType:VideoType;


  videoSource:VideoSource | null;


  mediaUrl:string | null;


  youtubeVideoId:string | null;


  thumbnailUrl:string | null;


  category:string | null;


  language:VideoLanguage;


  location:string | null;


  status:VideoStatus;


  createdAt:string;

  updatedAt:string;

};