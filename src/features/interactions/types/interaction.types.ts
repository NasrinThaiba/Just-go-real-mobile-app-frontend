export type UserRole =
  | 'user'
  | 'admin';


export type InteractionUser = {

  id:string;

  name:string;

  role:UserRole;

  token:string;

};



export type StoredComment = {

  id:string;

  author:string;

  authorId:string;

  authorRole:UserRole;

  message:string;

  createdAt:string;

};



export type ContentInteraction = {

  contentId:string;

  isFavorite:boolean;

  isBookmarked:boolean;

  likes:number;

  shares:number;

  comments:StoredComment[];

};