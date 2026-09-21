import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ContentInteraction,
  InteractionUser,
  StoredComment,
} from '@/features/interactions/types/interaction.types';


const INTERACTIONS_KEY =
  '@just_go_real/content_interactions';



type StoredInteractions =
  Record<
    string,
    ContentInteraction
  >;



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




async function getAllInteractions()
:Promise<StoredInteractions>{

  try{

    const value =
      await AsyncStorage.getItem(
        INTERACTIONS_KEY,
      );


    if(!value){
      return {};
    }


    return JSON.parse(
      value,
    );


  }catch(error){

    console.error(
      'Failed loading interactions',
      error,
    );

    return {};

  }

}





async function saveAllInteractions(
  data:StoredInteractions,
){

  await AsyncStorage.setItem(
    INTERACTIONS_KEY,
    JSON.stringify(data),
  );

}







export async function getContentInteraction(
  contentId:string,
):Promise<ContentInteraction>{


  const interactions =
    await getAllInteractions();


  return (
    interactions[contentId]
    ??
    createDefaultInteraction(
      contentId,
    )
  );

}









// BOOKMARK ONLY

export async function toggleStoredBookmark(
  contentId:string,
)
:Promise<ContentInteraction>{


 const interactions =
   await getAllInteractions();



 const current =
   interactions[contentId]
   ??
   createDefaultInteraction(
     contentId,
   );



 const updated =
 {
   ...current,

   isBookmarked:
     !current.isBookmarked,

 };



 interactions[contentId] =
   updated;



 await saveAllInteractions(
   interactions,
 );



 return updated;


}









// COMMENTS TEMPORARY

export async function addStoredComment(
 contentId:string,
 message:string,
 currentUser:InteractionUser,
)
:Promise<ContentInteraction>{


 const text =
   message.trim();



 if(!text){

  throw new Error(
    'Comment cannot be empty',
  );

 }




 const interactions =
   await getAllInteractions();



 const current =
   interactions[contentId]
   ??
   createDefaultInteraction(
    contentId,
   );




 const comment:StoredComment =
 {

   id:
    `${Date.now()}`,

   author:
    currentUser.name,

   authorId:
    currentUser.id,

   authorRole:
    currentUser.role,


   message:
    text,


   createdAt:
    new Date()
    .toISOString(),

 };




 const updated =
 {

  ...current,


  comments:
   [
    ...current.comments,

    comment,
   ],

 };



 interactions[contentId] =
   updated;



 await saveAllInteractions(
   interactions,
 );



 return updated;


}









export async function deleteStoredComment(
 contentId:string,
 commentId:string,
 currentUser:InteractionUser,
)
:Promise<ContentInteraction>{


 const interactions =
   await getAllInteractions();



 const current =
   interactions[contentId]
   ??
   createDefaultInteraction(
    contentId,
   );




 const comment =
   current.comments.find(
    item =>
     item.id === commentId,
   );



 if(!comment){

  throw new Error(
   'Comment not found',
  );

 }




 const canDelete =
   comment.authorId === currentUser.id
   ||
   currentUser.role === 'admin';




 if(!canDelete){

  throw new Error(
   'Cannot delete comment',
  );

 }




 const updated =
 {

  ...current,

  comments:
   current.comments.filter(
    item =>
     item.id !== commentId,
   ),

 };



 interactions[contentId] =
   updated;



 await saveAllInteractions(
   interactions,
 );



 return updated;


}








export async function clearStoredInteractions(){

 await AsyncStorage.removeItem(
   INTERACTIONS_KEY,
 );

}