import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';


import {
  AppHeader,
} from '@/components/layout/AppHeader';


import {
  getPublisherImage,
} from '@/features/news/constants/publisher-images';


import {
  useVideos,
} from '@/features/videos/hooks/useVideos';


import type {
  VideoItem,
} from '@/features/videos/types/videos.types';


import {
  useSavedContent,
} from '@/features/saved/context/SavedContext';


import {
  useAppLanguage,
} from '@/hooks/useAppLanguage';


import {
  formatPublishedTime,
  formatViews,
} from '@/utils/content-formatters';



type VideoCategory = {
  id:string;
  label:string;
  category:string;
};



const VIDEO_CATEGORIES:VideoCategory[] = [

 {
  id:'all',
  label:'#All',
  category:'all',
 },

 {
  id:'breaking',
  label:'#Breaking',
  category:'breaking',
 },

 {
  id:'live',
  label:'#Live',
  category:'live',
 },

 {
  id:'politics',
  label:'#Politics',
  category:'politics',
 },

 {
  id:'technology',
  label:'#Technology',
  category:'technology',
 },

 {
  id:'world',
  label:'#World',
  category:'world',
 },

 {
  id:'business',
  label:'#Business',
  category:'business',
 },

 {
  id:'sports',
  label:'#Sports',
  category:'sports',
 },

 {
  id:'cinema',
  label:'#Cinema',
  category:'cinema',
 },

];



export default function VideoScreen(){

 const router = useRouter();


 const {
  currentLanguage,
 } = useAppLanguage();



 const {
  items,
  isLoading,
  refetch,
 } =
 useVideos(
  currentLanguage
 );



 const [
  selectedCategory,
  setSelectedCategory,
 ] =
 useState('all');



 const [
  isRefreshing,
  setIsRefreshing,
 ] =
 useState(false);




 const publishedVideos =
 useMemo(()=>{


  return items

   .filter(
    item =>
     item.type === 'video' &&
     item.status === 'published'
   )

   .sort(
    (a,b)=>{


     const first =
      a.publishedAt ??
      a.createdAt;


     const second =
      b.publishedAt ??
      b.createdAt;


     return (
      new Date(second).getTime() -
      new Date(first).getTime()
     );


    }
   );


 },[
  items
 ]);





 const filteredVideos =
 useMemo(()=>{


  if(selectedCategory === 'all'){
    return publishedVideos;
  }



  if(selectedCategory === 'breaking'){

   return publishedVideos.filter(
    item =>
     item.videoType === 'breaking'
   );

  }



  if(selectedCategory === 'live'){

   return publishedVideos.filter(
    item =>
     item.videoType === 'live'
   );

  }



  return publishedVideos.filter(
   item =>
    normalizeText(
     item.category
    ) === selectedCategory
  );



 },[
  selectedCategory,
  publishedVideos
 ]);





 const openVideo =
 (
  item:VideoItem
 )=>{

  router.push({

   pathname:
    '/video/[id]',

   params:{
    id:item.id
   }

  });

 };




 const handleRefresh =
 async()=>{

  try{

   setIsRefreshing(true);

   await refetch();

  }
  finally{

   setIsRefreshing(false);

  }

 };




 return (

 <SafeAreaView
  edges={['top']}
  className="flex-1 bg-white"
 >

  <AppHeader/>


  <FlatList

   data={filteredVideos}


   keyExtractor={
    item=>item.id
   }


   refreshControl={
    <RefreshControl

     refreshing={
      isRefreshing
     }

     onRefresh={
      handleRefresh
     }

    />
   }



   contentContainerStyle={{
    paddingBottom:40,
   }}



   ListHeaderComponent={

   <>

    <View className="px-4 pb-1 pt-3">

     <View className="flex-row">

      <Text className="text-[20px] font-black text-slate-950">
       Trending
      </Text>


      <Text className="ml-2 text-[20px] font-black text-[#F0442D]">
       Videos
      </Text>

     </View>

    </View>



    <ScrollView

     horizontal

     showsHorizontalScrollIndicator={false}

     contentContainerStyle={{
      paddingHorizontal:14,
      paddingVertical:18,
      gap:8,
     }}

    >

     {
      VIDEO_CATEGORIES.map(
       category=>(

        <Pressable

         key={category.id}

         onPress={()=>
          setSelectedCategory(
           category.category
          )
         }


         className={
          selectedCategory === category.category

          ?

          'rounded-full border border-[#F0442D] bg-[#FFF1EE] px-4 py-2'

          :

          'rounded-full border border-slate-200 bg-white px-4 py-2'
         }

        >

         <Text className="text-xs font-black text-slate-600">

          {category.label}

         </Text>


        </Pressable>

       )
      )
     }


    </ScrollView>



    <View className="mb-4 flex-row justify-between px-4">

     <Text className="text-lg font-black">
      Trending Videos
     </Text>


     <Text className="text-xs font-bold text-slate-500">

      {filteredVideos.length} videos

     </Text>


    </View>


   </>

   }



   ListEmptyComponent={

    isLoading

    ?

    <View className="items-center py-20">

     <ActivityIndicator
      size="large"
      color="#F0442D"
     />


     <Text className="mt-3">
      Loading videos...
     </Text>


    </View>


    :

    <Text className="text-center mt-20">
     No videos found
    </Text>


   }



   renderItem={
    ({
     item
    })=>(


    <View className="px-4">

     <VideoNewsCard

      item={item}

      onPress={()=>
       openVideo(item)
      }

     />

    </View>


    )
   }


  />



 </SafeAreaView>

 );

}






type VideoNewsCardProps = {

 item:VideoItem;

 onPress:()=>void;

};



function VideoNewsCard({

 item,

 onPress,

}:VideoNewsCardProps){


 const {
  isSaved,
  toggleSaved,
 } =
 useSavedContent();



 const itemIsSaved =
  isSaved(item.id);



 const imageUrl =
  item.thumbnailUrl ??
  item.mediaUrl;



 const publisherName =
  item.author ??
  'Video Publisher';



 const publisherImage =
  getPublisherImage(
   publisherName
  );



 const displayDate =
  item.publishedAt ??
  item.createdAt;



 const isLive =
  item.videoType === 'live';



 return (

 <Pressable

  onPress={onPress}

  className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white"


 >

  <View>

   <Image

    source={{
     uri:imageUrl
    }}

    className="h-48 w-full"

    resizeMode="cover"

   />


   <View className="absolute inset-0 items-center justify-center bg-black/20">


    <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">


     <Ionicons

      name="play"

      size={28}

      color="white"

     />


    </View>


   </View>



   {
    isLive &&

    <View className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1">

     <Text className="text-xs font-black text-white">
      LIVE
     </Text>

    </View>

   }


  </View>



  <View className="p-4">


   <Text

    numberOfLines={3}

    className="text-lg font-black"

   >

    {item.title}

   </Text>



   <View className="mt-4 flex-row items-center">


    <Image

     source={{
      uri:publisherImage
     }}

     className="h-10 w-10 rounded-full"

    />


    <View className="ml-3 flex-1">

     <Text className="font-bold text-red-500">

      {publisherName}

     </Text>


     <Text className="text-xs text-slate-500">

      {formatPublishedTime(displayDate)}

     </Text>


    </View>


    <Text className="text-xs">

     {formatViews(item.views ?? 0)} views

    </Text>


   </View>


  </View>


 </Pressable>

 );

}




function normalizeText(
 value?:string
){

 return (
  value
   ?.trim()
   .toLowerCase()
  ??
  ''
 );

}