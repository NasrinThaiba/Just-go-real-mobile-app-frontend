import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";


import {
  Ionicons,
} from "@expo/vector-icons";


import type {
  VideoType,
  VideoLanguage,
} from "../types/video.types";



type Props = {

title:string;

description:string;

videoUrl:string;

youtubeUrl:string;

thumbnailUrl:string;

category:string;

videoType:VideoType;

language:VideoLanguage;

location:string;

onBack:()=>void;

onNext:()=>void;

};





export default function CreateVideoPreview({

title,

description,

videoUrl,

youtubeUrl,

thumbnailUrl,

videoType,

language,

location,

category,

onBack,

onNext,


}:Props){



const source =
youtubeUrl
?
'youtube'
:
'direct';



return (

<View>


{/* HEADER */}

<View className="mb-6">


<Text className="text-3xl font-black text-slate-900">

Preview Video

</Text>


<Text className="mt-2 text-sm text-slate-500">

Review your video before publishing

</Text>


</View>





<View className="rounded-3xl bg-white p-5">




{/* VIDEO PREVIEW */}

{
thumbnailUrl ? (

<View className="relative">

<Image
source={{
 uri: thumbnailUrl
}}
className="h-48 w-full rounded-3xl"
/>


<View className="absolute inset-0 items-center justify-center">

<View className="h-14 w-14 items-center justify-center rounded-full bg-black/50">

<Ionicons
name="play"
size={30}
color="white"
/>

</View>

</View>

</View>

)

:

(

<View className="h-48 items-center justify-center rounded-3xl bg-slate-100">

<Ionicons
name={
 source === 'youtube'
 ? "logo-youtube"
 : "videocam-outline"
}
size={50}
color={
 source === 'youtube'
 ? "#FF0000"
 : "#64748B"
}
/>


<Text className="mt-3 font-bold text-slate-600">

{
 source === 'youtube'
 ? "YouTube Video"
 : "Local Uploaded Video"
}

</Text>


</View>

)
}






{/* TAGS */}


<View className="mt-5 flex-row flex-wrap gap-3">


<View className="rounded-full bg-orange-50 px-4 py-2">

<Text className="font-bold text-orange-600">

{category}

</Text>

</View>




<View className="rounded-full bg-blue-50 px-4 py-2">

<Text className="font-bold text-blue-600">

{videoType}

</Text>

</View>





<View className="rounded-full bg-green-50 px-4 py-2">

<Text className="font-bold text-green-600">

{source}

</Text>

</View>



</View>








{/* TITLE */}


<Text className="mt-6 text-2xl font-black text-slate-900">

{
title || "Your video title"
}

</Text>








{/* DESCRIPTION */}


<Text className="mt-4 text-base leading-6 text-slate-600">

{
description || 
"Your video description will appear here"
}

</Text>








{/* MEDIA URL */}


<View className="mt-6 rounded-2xl bg-slate-100 p-4">


<Text className="text-xs font-bold text-slate-400">

SOURCE


</Text>


<Text

numberOfLines={2}

className="mt-2 font-semibold text-slate-700"

>

{
source === 'youtube'
?
youtubeUrl
:
videoUrl
}

</Text>



</View>







{/* INFO */}


<View className="mt-6 gap-4">


<View className="flex-row items-center">


<Ionicons

name="language-outline"

size={20}

color="#64748B"

/>


<Text className="ml-3 font-bold text-slate-700">

Language:

{' '}

{
language === 'en'
?
'English'
:
'Tamil'
}

</Text>


</View>


<View className="flex-row items-center">

<Ionicons
name="location-outline"
size={20}
color="#64748B"
/>

<Text className="ml-3 font-bold text-slate-700">
Location: {location}
</Text>

</View>




<View className="flex-row items-center">


<Ionicons

name="play-circle-outline"

size={20}

color="#64748B"

/>


<Text className="ml-3 font-bold text-slate-700">

Type:

{' '}

{videoType}

</Text>


</View>




</View>







{/* NOTE */}


<View className="mt-6 rounded-2xl bg-orange-50 p-4">


<Text className="font-bold text-orange-700">

Important

</Text>


<Text className="mt-2 text-sm text-orange-700">

Video will be submitted for admin approval before publishing.

</Text>


</View>





</View>







{/* BUTTONS */}


<View className="mt-6 flex-row gap-3">


<Pressable

onPress={onBack}

className="flex-1 items-center rounded-2xl border border-slate-200 py-4"

>


<Text className="font-black text-slate-700">

Edit

</Text>


</Pressable>







<Pressable

onPress={onNext}

className="flex-1 items-center rounded-2xl bg-orange-500 py-4"

>


<Text className="font-black text-white">

Continue

</Text>


</Pressable>



</View>





</View>

);

}