export type BookmarkStatus = {
  isBookmarked: boolean;
};



export type BookmarkResponse = {
  message: string;

  data: BookmarkStatus;
};





export type SavedContentItem = {

  id: string;


  type: 'NEWS' | 'VIDEO';


  title: string;


  description?: string | null;


  thumbnailUrl?: string | null;


  mediaUrl?: string | null;



  category?: string | null;


  location?: string | null;



  language?: 'EN' | 'TA';



  newsType?:
    | 'REGULAR'
    | 'BREAKING'
    | 'TRENDING'
    | 'FEATURED'
    | null;



  videoType?:
    | 'NEWS'
    | 'BREAKING'
    | 'LIVE'
    | 'INTERVIEW'
    | 'SHORT'
    | 'FEATURED'
    | null;



  views?: number;


  likes?: number;


  shares?: number;



  status?:
    | 'DRAFT'
    | 'PENDING'
    | 'PUBLISHED'
    | 'REJECTED'
    | 'UNPUBLISHED'
    | string;



  author?: {

    id:string;

    name:string | null;

    profileImage:string | null;

  } | null;



  createdAt:string;


  publishedAt?:string | null;

};





export type SavedContentResponse = {

  message:string;


  data:{

    items:SavedContentItem[];

  };

};





export type BookmarkActionResponse = {

  message:string;


  data:{

    isBookmarked:boolean;

  };

};