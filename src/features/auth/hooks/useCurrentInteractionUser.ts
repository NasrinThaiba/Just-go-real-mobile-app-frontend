import {
  useFocusEffect,
} from 'expo-router';

import {
  useCallback,
  useState,
} from 'react';


import {
  getAuthSession,
  getAccessToken,
} from '@/features/auth/storage/auth.storage';


import {
  getProfile,
} from '@/features/profile/storage/profileStorage';


import type {
  InteractionUser,
} from '@/features/interactions/types/interaction.types';



export function useCurrentInteractionUser(){

const [
 currentUser,
 setCurrentUser,
] =
useState<InteractionUser|null>(null);



const [
 isLoading,
 setIsLoading,
] =
useState(true);




const loadCurrentUser =
useCallback(async()=>{


try{


setIsLoading(true);



const [
 session,
 profile,
 token,
] =
await Promise.all([

 getAuthSession(),

 getProfile(),

 getAccessToken(),

]);





if(
 !session?.isAuthenticated ||
 !session.userId ||
 !token
){

 setCurrentUser(null);

 return;

}





const userId =
 profile?.id ??
 session.userId;





setCurrentUser({

 id:userId,


 name:
 profile?.name?.trim()
 ??
 'New User',


 role:
 profile?.role === 'admin'
 ?
 'admin'
 :
 'user',


 token,

});



}
catch(error){

console.error(
"Interaction user error",
error
);


setCurrentUser(null);


}
finally{

setIsLoading(false);

}



},[]);





useFocusEffect(

useCallback(()=>{

 void loadCurrentUser();


 return undefined;

},[
 loadCurrentUser
])

);



return {

 currentUser,

 isLoading,

 refetch:
 loadCurrentUser,

};


}