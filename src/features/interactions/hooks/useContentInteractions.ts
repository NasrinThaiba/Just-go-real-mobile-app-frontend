import {
  useCallback,
  useEffect,
  useState,
} from 'react';


import {
  interactionsApi,
} from '@/features/interactions/api/interactions.api';


import {
  commentsApi,
} from '@/features/interactions/api/comments.api';


import {
  toggleStoredBookmark,
} from '@/features/interactions/storage/interactionStorage';



import type {
  ContentInteraction,
  InteractionUser,
} from '@/features/interactions/types/interaction.types';





function createDefaultInteraction(
  contentId:string,
):ContentInteraction {

  return {

    contentId,

    isFavorite:false,

    isBookmarked:false,

    likes:0,

    shares:0,

    comments:[],

  };

}








export function useContentInteractions(

  contentId:string,

  currentUser:InteractionUser|null,

){



const [
 interaction,
 setInteraction
]=useState<ContentInteraction>(

 createDefaultInteraction(
  contentId
 )

);





const [
 isLoading,
 setIsLoading
]=useState(true);









// =====================
// LOAD INTERACTIONS
// =====================

const loadInteraction =
useCallback(async()=>{


try{


setIsLoading(true);




const summary =
await interactionsApi.getSummary(
 contentId
);





const comments =
await commentsApi.getComments(
 contentId
);






let isFavorite =
false;




if(currentUser?.token){


isFavorite =
await interactionsApi.getLikeStatus(

 contentId,

 currentUser.token

);


}






setInteraction(prev=>({


 ...prev,


 isFavorite,


 likes:
 summary.likes ?? 0,


 shares:
 summary.shares ?? 0,


 comments,



}));




}
catch(error){


console.error(
"Interaction loading failed",
error
);


}
finally{


setIsLoading(false);


}



},[
contentId,
currentUser
]);








useEffect(()=>{


void loadInteraction();


},[
loadInteraction
]);











// =====================
// LIKE
// =====================


const toggleFavorite =
useCallback(async()=>{


if(!currentUser?.token){

throw new Error(
"Please login to like"
);

}





let response;



if(interaction.isFavorite){


response =
await interactionsApi.unlike(

contentId,

currentUser.token

);



}
else{


response =
await interactionsApi.like(

contentId,

currentUser.token

);



}






const updated:ContentInteraction={


 ...interaction,


 isFavorite:
 response.data.isLiked,


 likes:
 response.data.likes,



};




setInteraction(updated);



return updated;



},[
contentId,
currentUser,
interaction
]);









// =====================
// BOOKMARK
// =====================


const toggleBookmark =
useCallback(async()=>{


const result =
await toggleStoredBookmark(
contentId
);




const updated={


 ...interaction,


 isBookmarked:
 result.isBookmarked,



};



setInteraction(updated);



return updated;



},[
contentId,
interaction
]);









// =====================
// ADD COMMENT
// =====================


const addComment =
useCallback(async(

 message:string

)=>{


if(!currentUser?.token){

throw new Error(
"Please login to comment"
);

}





const comment =
await commentsApi.createComment(

contentId,

message,

currentUser.token

);






const updated:ContentInteraction={


 ...interaction,


 comments:[

  ...interaction.comments,

  comment,

 ],



};





setInteraction(updated);



return updated;



},[
contentId,
currentUser,
interaction
]);









// =====================
// DELETE COMMENT
// =====================


const deleteComment =
useCallback(async(

 commentId:string

)=>{


if(!currentUser?.token){

throw new Error(
"Please login"
);

}





await commentsApi.deleteComment(

commentId,

currentUser.token

);






const updated:ContentInteraction={


 ...interaction,


 comments:

 interaction.comments.filter(

 (comment)=>

 comment.id !== commentId

 )



};





setInteraction(updated);



return updated;



},[
currentUser,
interaction
]);









return {


 interaction,


 isLoading,


 toggleFavorite,


 toggleBookmark,


 addComment,


 deleteComment,


 refetch:
 loadInteraction,



};


}