import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";


import type {
  VideoType,
  VideoLanguage,
} from "../types/video.types";



const CATEGORIES = [
  "politics",
  "business",
  "sports",
  "cinema",
  "technology",
  "science",
  "world",
  "education",
  "entertainment",
  "other",
] as const;



const VIDEO_TYPES = [

{
  label:"News",
  value:"news",
  icon:"newspaper-outline",
},

{
  label:"Breaking",
  value:"breaking",
  icon:"flash-outline",
},

{
  label:"Live",
  value:"live",
  icon:"radio-outline",
},

{
  label:"Interview",
  value:"interview",
  icon:"person-outline",
},

{
  label:"Short",
  value:"short",
  icon:"phone-portrait-outline",
},

{
  label:"Featured",
  value:"featured",
  icon:"star-outline",
},

];



const LANGUAGES = [

{
 label:"English",
 value:"en",
},

{
 label:"Tamil",
 value:"ta",
},

];




type Props = {

title:string;
setTitle:(v:string)=>void;


description:string;
setDescription:(v:string)=>void;


videoType:VideoType;
setVideoType:(v:VideoType)=>void;


language:VideoLanguage;
setLanguage:(v:VideoLanguage)=>void;


videoUrl:string;
setVideoUrl:(v:string)=>void;


youtubeUrl:string;
setYoutubeUrl:(v:string)=>void;


thumbnailUrl:string;
setThumbnailUrl:(v:string)=>void;


category:string;
setCategory:(v:string)=>void;


onNext:()=>void;

};





export default function CreateVideoContent({

title,
setTitle,

description,
setDescription,

videoType,
setVideoType,

language,
setLanguage,

videoUrl,
setVideoUrl,

youtubeUrl,
setYoutubeUrl,

thumbnailUrl,
setThumbnailUrl,

category,
setCategory,

onNext,

}:Props){



const pickVideo = async()=>{


const result =
await ImagePicker.launchImageLibraryAsync({

mediaTypes:
 ImagePicker.MediaTypeOptions.Videos,

allowsEditing:true,

quality:1,

});



if(!result.canceled){

setVideoUrl(
 result.assets[0].uri
);


}

};




return (

<View>


<Text className="mb-6 text-3xl font-black text-slate-900">
Create Video
</Text>



<View className="rounded-3xl bg-white p-5">


<Text className="text-xl font-black text-slate-900">
Video Information
</Text>



{/* TITLE */}

<Text className="mb-2 mt-5 font-bold text-slate-700">
Video Title *
</Text>


<TextInput

value={title}

onChangeText={setTitle}

placeholder="Enter video title"

className="rounded-2xl bg-slate-100 px-4 py-4"

/>




{/* LOCAL VIDEO */}


<Pressable

onPress={pickVideo}

className="
mt-5
h-44
items-center
justify-center
rounded-3xl
border-2
border-dashed
border-slate-300
"

>


{
videoUrl
?

<Text className="font-bold text-green-600">
Local Video Selected
</Text>

:

<>

<Ionicons

name="cloud-upload-outline"

size={45}

color="#94A3B8"

/>

<Text className="mt-3 font-bold text-slate-500">
Upload Video
</Text>

</>

}


</Pressable>




{/* YOUTUBE */}

<Text className="mb-2 mt-6 font-bold text-slate-700">
YouTube URL (Optional)
</Text>



<View className="flex-row items-center rounded-2xl bg-slate-100 px-4">


<Ionicons

name="logo-youtube"

size={22}

color="red"

/>



<TextInput

value={youtubeUrl}

onChangeText={setYoutubeUrl}

placeholder="Paste YouTube URL"

autoCapitalize="none"

className="ml-3 flex-1 py-4"

/>


</View>





{/* THUMBNAIL */}

<Text className="mb-2 mt-6 font-bold text-slate-700">
Thumbnail URL
</Text>


<TextInput

value={thumbnailUrl}

onChangeText={setThumbnailUrl}

placeholder="Thumbnail image URL"

className="rounded-2xl bg-slate-100 px-4 py-4"

/>






{/* CATEGORY */}


<Text className="mb-3 mt-6 font-bold text-slate-700">
Category
</Text>


<View className="flex-row flex-wrap gap-3">


{
CATEGORIES.map(item=>(


<Pressable

key={item}

onPress={()=>
setCategory(item)
}

className={`
w-[30%]
rounded-full
py-3
items-center

${
category===item
?
"bg-orange-500"
:
"bg-slate-100"
}

`}

>


<Text

className={

category===item

?
"text-white font-bold"

:

"text-slate-700 font-bold"

}

>

{item}

</Text>


</Pressable>


))

}


</View>






{/* VIDEO TYPE */}


<Text className="mb-3 mt-6 font-bold text-slate-700">
Video Type
</Text>


<View className="flex-row flex-wrap gap-3">


{
VIDEO_TYPES.map(item=>(


<Pressable

key={item.value}

onPress={()=>
setVideoType(
 item.value as VideoType
)
}

className={`
w-[48%]
rounded-3xl
p-4

${
videoType===item.value

?

"bg-orange-50 border border-orange-500"

:

"bg-white border border-slate-200"

}

`}

>


<Ionicons

name={item.icon as any}

size={25}

color="#F97316"

/>


<Text className="mt-2 font-black">
{item.label}
</Text>


</Pressable>


))

}


</View>






{/* DESCRIPTION */}


<Text className="mb-2 mt-6 font-bold text-slate-700">
Description
</Text>


<TextInput

value={description}

onChangeText={setDescription}

multiline

placeholder="Write description"

className="
h-32
rounded-2xl
bg-slate-100
p-4
"

/>





{/* LANGUAGE */}


<Text className="mb-3 mt-6 font-bold text-slate-700">
Language
</Text>


<View className="flex-row gap-3">


{
LANGUAGES.map(item=>(


<Pressable

key={item.value}

onPress={()=>
setLanguage(
 item.value as VideoLanguage
)
}

className={`
rounded-xl px-6 py-3

${
language===item.value
?
"bg-orange-500"
:
"bg-slate-100"
}

`}

>


<Text className={

language===item.value

?
"text-white font-bold"

:

"text-slate-700 font-bold"

}>

{item.label}

</Text>


</Pressable>


))

}


</View>






<Pressable

onPress={onNext}

className="mt-8 rounded-2xl bg-orange-500 py-4 items-center"

>


<Text className="font-black text-white">
Continue
</Text>


</Pressable>



</View>


</View>

);


}