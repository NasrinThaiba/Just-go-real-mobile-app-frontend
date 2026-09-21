import { API_BASE_URL } from '@/services/apiClient';


export type CommentItem = {

  id:string;

  author:string;

  authorId:string;

  authorRole:'user' | 'admin';

  message:string;

  createdAt:string;

};



type CommentResponse = {

 message:string;

 data?:{
   comment:CommentItem;
 };

};



export const commentsApi = {


async getComments(
 contentId:string,
):Promise<CommentItem[]> {


const response =
await fetch(
 `${API_BASE_URL}/contents/${contentId}/comments`
);


if(!response.ok){

 throw new Error(
  "Failed to load comments"
 );

}


const result =
await response.json();


return result.data?.comments ?? [];


},





async createComment(
 contentId:string,
 message:string,
 token:string,
):Promise<CommentItem>{


const response =
await fetch(

`${API_BASE_URL}/contents/${contentId}/comments`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:
`Bearer ${token}`,

},


body:
JSON.stringify({

message,

}),


}

);



if(!response.ok){

throw new Error(
"Failed to create comment"
);

}



const result =
await response.json();


return result.data.comment;


},





async deleteComment(

commentId:string,

token:string,

){


const response =
await fetch(

`${API_BASE_URL}/comments/${commentId}`,

{

method:"DELETE",

headers:{

Authorization:
`Bearer ${token}`,

}

}

);



if(!response.ok){

throw new Error(
"Failed to delete comment"
);

}


}



};