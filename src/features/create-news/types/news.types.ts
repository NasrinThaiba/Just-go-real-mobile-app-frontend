export type NewsType =
  | 'regular'
  | 'breaking'
  | 'featured'
  | 'trending';


export type NewsLanguage =
  | 'en'
  | 'ta';


export type NewsStatus =
  | 'draft'
  | 'pending'
  | 'published'
  | 'rejected'
  | 'unpublished';


export type NewsCategory =
  | 'politics'
  | 'business'
  | 'sports'
  | 'cinema'
  | 'technology'
  | 'science'
  | 'world'
  | 'education'
  | 'health';


export type NewsLocation =
  | 'tamil-nadu'
  | 'chennai'
  | 'coimbatore'
  | 'madurai'
  | 'tiruchirappalli'
  | 'salem'
  | 'tirunelveli'
  | 'tenkasi'
  | 'thoothukudi'
  | 'erode'
  | 'vellore';



export type NewsAuthor = {

  id:string;

  name:string;

  profileImage:string;

};



export type FeedItem = {

  id:string;

  type:
    | 'news'
    | 'video';


  title:string;


  description:string;


  newsType:NewsType;


  language:NewsLanguage;


  category:string;


  location:string;


  mediaUrl:string;


  thumbnailUrl?:string;


  author:string;


  authorData:NewsAuthor;


  views:number;


  likes:number;


  status:NewsStatus;


  createdAt:string;


  updatedAt:string;


  publishedAt?:string;

};




// ===============================
// CREATE NEWS PAYLOAD
// ===============================

export type CreateNewsPayload = {

  title:string;


  description:string;


  newsType:NewsType;


  language:NewsLanguage;


  category:NewsCategory;


  location:NewsLocation;


  mediaUrl?:string;


  thumbnailUrl?:string;


  status:
    | 'draft'
    | 'pending';

};




// ===============================
// API RESPONSE
// ===============================

export type NewsResponse = {

  message:string;

  data:FeedItem;

};



export type NewsListResponse = {

  message:string;

  data:FeedItem[];

};