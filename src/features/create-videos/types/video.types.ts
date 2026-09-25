export type VideoType =
  | 'normal'
  | 'short'
  | 'live';


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


  status?:
    | 'draft'
    | 'pending';

};