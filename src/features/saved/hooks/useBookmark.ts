import {
 useCallback,
 useEffect,
 useState,
} from 'react';


import {
 SavedApi,
} from '../api/saved.api';



export function useBookmark(

 contentId:string,

 token:string | null

){


const [
 isBookmarked,
 setIsBookmarked
]=useState(false);



const [
 loading,
 setLoading
]=useState(false);





const loadStatus =
useCallback(async()=>{


if(!token)
 return;


try{


const status =
await SavedApi.getStatus(

contentId,

token

);


setIsBookmarked(status);



}
catch(error){

console.error(
"Bookmark status error",
error
);

}



},[
contentId,
token
]);





useEffect(()=>{

loadStatus();

},[
loadStatus
]);







const toggleBookmark =
useCallback(async()=>{


if(!token){

throw new Error(
"Please login"
);

}



try{


setLoading(true);



if(isBookmarked){


await SavedApi.remove(

contentId,

token

);


setIsBookmarked(false);



}
else{


await SavedApi.add(

contentId,

token

);


setIsBookmarked(true);


}



}
finally{

setLoading(false);

}



},[
contentId,
token,
isBookmarked
]);






return {

isBookmarked,

loading,

toggleBookmark,

refetch:
loadStatus

};


}