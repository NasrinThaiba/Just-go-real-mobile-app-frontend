import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';


import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';


import {
  SavedApi,
} from '@/features/saved/api/saved.api';


import {
  getAccessToken,
} from '@/features/auth/storage/auth.storage';



type SavedContentContextValue = {

  savedItems: FeedItem[];

  savedNews: FeedItem[];

  savedVideos: FeedItem[];

  isLoading:boolean;


  isSaved:(id:string)=>boolean;


  toggleSaved:(
    item:FeedItem
  )=>Promise<void>;


  removeSaved:(
    id:string
  )=>Promise<void>;

};



const SavedContentContext =
createContext<
SavedContentContextValue | undefined
>(undefined);





type SavedContentProviderProps = {

 children:ReactNode;

};







export function SavedContentProvider({

 children,

}:SavedContentProviderProps){



const [
 savedItems,
 setSavedItems
]=useState<FeedItem[]>([]);




const [
 isLoading,
 setIsLoading
]=useState(true);







// =========================
// LOAD SAVED CONTENT
// =========================


const loadSaved =
useCallback(async()=>{


try{


setIsLoading(true);



const token =
await getAccessToken();



if(!token){

 setSavedItems([]);

 return;

}




const response =
await SavedApi.getSaved(
 token
);



const mappedItems: FeedItem[] =
response.data.items.map(
(item) => ({

  id: item.id,

  type:
    item.type.toLowerCase() as 'news' | 'video',


  title:
    item.title,


  description:
    item.description ?? '',


  thumbnailUrl:
    item.thumbnailUrl ?? '',


  mediaUrl:
    item.mediaUrl ?? '',


  category:
    item.category ?? '',


  location:
    item.location ?? '',


  language:
    (item.language?.toLowerCase() as 'en' | 'ta') ?? 'en',


  views:
    item.views ?? 0,


  likes:
    item.likes ?? 0,


  status:
    (item.status?.toLowerCase() as PostStatus) ?? 'published',


  author:
    item.author?.name ?? 'Unknown',


  createdAt:
    item.createdAt,


  publishedAt:
    item.publishedAt ?? undefined,


})
);



setSavedItems(
 mappedItems
);



}
catch(error){


console.error(
"Failed loading saved content",
error
);



}
finally{

setIsLoading(false);

}


},[]);







useEffect(()=>{

void loadSaved();

},[
loadSaved
]);









// =========================
// CHECK SAVED
// =========================


const isSaved =
useCallback(
(id:string)=>{


return savedItems.some(
 item =>
 item.id === id
);


},
[
savedItems
]
);










// =========================
// TOGGLE SAVE
// =========================


const toggleSaved =
useCallback(async(

 item:FeedItem

)=>{


const token =
await getAccessToken();



if(!token){

throw new Error(
"Please login"
);

}




const alreadySaved =
isSaved(
 item.id
);





if(alreadySaved){


await SavedApi.remove(

 item.id,

 token

);



setSavedItems(
current=>
current.filter(
saved=>
saved.id !== item.id
)
);



}
else{


await SavedApi.add(

 item.id,

 token

);



setSavedItems(
current=>[
 item,
 ...current
]
);



}



},[
isSaved
]);









// =========================
// REMOVE SAVE
// =========================


const removeSaved =
useCallback(async(

 id:string

)=>{


const token =
await getAccessToken();



if(!token){

return;

}



await SavedApi.remove(

 id,

 token

);



setSavedItems(
current=>
current.filter(
item=>
item.id !== id
)
);



},[]);










// =========================
// FILTERS
// =========================


const savedNews =
useMemo(()=>{


return savedItems.filter(

item=>
item.type === 'news'

);


},[
savedItems
]);





const savedVideos =
useMemo(()=>{


return savedItems.filter(

item=>
item.type === 'video'

);


},[
savedItems
]);









const value =
useMemo<SavedContentContextValue>(

()=>({

 savedItems,

 savedNews,

 savedVideos,

 isLoading,

 isSaved,

 toggleSaved,

 removeSaved,


}),

[

 savedItems,

 savedNews,

 savedVideos,

 isLoading,

 isSaved,

 toggleSaved,

 removeSaved,

]


);







return (

<SavedContentContext.Provider

value={value}

>

{children}

</SavedContentContext.Provider>

);


}









export function useSavedContent(){


const context =
useContext(
SavedContentContext
);



if(!context){

throw new Error(
'useSavedContent must be used inside SavedContentProvider'
);

}



return context;


}