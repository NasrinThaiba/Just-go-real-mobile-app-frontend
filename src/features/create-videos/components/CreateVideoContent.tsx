import {
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";


import {
  Ionicons,
} from "@expo/vector-icons";


import type {
  VideoCategory,
  VideoLanguage,
  VideoType,
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
 label:"Normal",
 value:"normal",
 icon:"videocam-outline",
},

{
 label:"Short",
 value:"short",
 icon:"flash-outline",
},

{
 label:"Live",
 value:"live",
 icon:"radio-outline",
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



category:VideoCategory;

setCategory:(v:VideoCategory)=>void;



language:VideoLanguage;

setLanguage:(v:VideoLanguage)=>void;



videoUrl:string;

setVideoUrl:(v:string)=>void;



thumbnailUrl:string;

setThumbnailUrl:(v:string)=>void;



onNext:()=>void;

};









export default function CreateVideoContent({

title,

setTitle,


description,

setDescription,


videoType,

setVideoType,


category,

setCategory,


language,

setLanguage,


videoUrl,

setVideoUrl,


thumbnailUrl,

setThumbnailUrl,


onNext,


}:Props){





return (

<View>





{/* HEADER */}


<View

className="mb-6"

>


<Text

className="text-3xl font-black text-slate-900"

>

Create Video

</Text>



<Text

className="mt-2 text-sm text-slate-500"

>

Upload videos and share latest updates

</Text>


</View>









{/* STEP */}


<View

className="mb-6 rounded-3xl bg-white p-5"

>


<View

className="flex-row justify-between"

>


{

[
"Content",
"Preview",
"Publish"
]
.map(
(item,index)=>(


<View

key={item}

className="items-center"

>


<View

className={`
h-10
w-10
items-center
justify-center
rounded-full

${
index===0
?
"bg-orange-500"
:
"bg-slate-200"
}

`}

>


<Text

className={`
font-black

${
index===0
?
"text-white"
:
"text-slate-500"
}

`}

>

{index+1}

</Text>


</View>



<Text

className="mt-2 text-xs font-bold text-slate-500"

>

{item}

</Text>



</View>


)

)


}


</View>


</View>









{/* BASIC INFORMATION */}



<View

className="rounded-3xl bg-white p-5"

>


<Text

className="text-xl font-black text-slate-900"

>

Video Information

</Text>








{/* TITLE */}



<Text

className="mb-2 mt-5 text-sm font-bold text-slate-700"

>

Video Title *

</Text>



<View

className="rounded-2xl bg-slate-100 px-4 py-3"

>


<TextInput

value={title}

onChangeText={setTitle}

placeholder="Enter video title"

placeholderTextColor="#94A3B8"

maxLength={150}

className="text-base text-slate-900"

/>



<Text

className="self-end text-xs text-slate-400"

>

{title.length}/150

</Text>


</View>









{/* YOUTUBE URL */}



<Text

className="mb-2 mt-6 text-sm font-bold text-slate-700"

>

YouTube Video URL *

</Text>



<View

className="flex-row items-center rounded-2xl bg-slate-100 px-4"

>


<Ionicons

name="logo-youtube"

size={22}

color="#FF0000"

/>



<TextInput

value={videoUrl}

onChangeText={setVideoUrl}

placeholder="https://youtube.com/watch?v="

placeholderTextColor="#94A3B8"

autoCapitalize="none"

className="ml-3 flex-1 py-4 text-base text-slate-900"

/>



</View>









{/* THUMBNAIL URL */}



<Text

className="mb-2 mt-6 text-sm font-bold text-slate-700"

>

Thumbnail Image URL

</Text>



<View

className="rounded-2xl bg-slate-100 px-4"

>


<TextInput

value={thumbnailUrl}

onChangeText={setThumbnailUrl}

placeholder="Enter thumbnail image URL"

placeholderTextColor="#94A3B8"

className="py-4 text-base text-slate-900"

/>


</View>









{/* CATEGORY */}



<Text

className="mb-3 mt-6 text-sm font-bold text-slate-700"

>

Category *

</Text>




<View

className="flex-row flex-wrap gap-3"

>


{
CATEGORIES.map(item=>{


const active =
category===item;



return (

<Pressable

key={item}

onPress={()=>
setCategory(item)
}

className={`

w-[31%]

items-center

rounded-full

py-3


${
active
?
"bg-orange-500"
:
"bg-slate-100"
}

`}

>


<Text

className={`

text-sm

font-bold


${
active
?
"text-white"
:
"text-slate-700"
}

`}

>

{item}

</Text>


</Pressable>

)

})

}


</View>









{/* VIDEO TYPE */}



<Text

className="mb-3 mt-6 text-sm font-bold text-slate-700"

>

Video Type *

</Text>



<View

className="flex-row flex-wrap gap-3"

>


{
VIDEO_TYPES.map(item=>{


const active =
videoType===item.value;



return (

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

border

p-4


${
active
?
"border-orange-500 bg-orange-50"
:
"border-slate-200 bg-white"
}

`}

>


<Ionicons

name={item.icon as any}

size={25}

color={
active
?
"#F97316"
:
"#64748B"
}

/>



<Text

className="mt-3 font-black text-slate-800"

>

{item.label}

</Text>


</Pressable>


)

})

}


</View>









{/* DESCRIPTION */}



<Text

className="mb-2 mt-6 text-sm font-bold text-slate-700"

>

Description *

</Text>



<View

className="min-h-[130px] rounded-2xl bg-slate-100 p-4"

>


<TextInput

value={description}

onChangeText={setDescription}

placeholder="Write video description"

placeholderTextColor="#94A3B8"

multiline

textAlignVertical="top"

className="text-base text-slate-900"

/>


</View>









{/* LANGUAGE */}



<Text

className="mb-2 mt-6 text-sm font-bold text-slate-700"

>

Language *

</Text>




<View

className="flex-row gap-3"

>


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

rounded-xl

px-6

py-3


${
language===item.value

?

"bg-orange-500"

:

"bg-slate-100"

}

`}

>


<Text

className={

language===item.value

?

"text-white font-bold"

:

"text-slate-700 font-bold"

}

>

{item.label}

</Text>


</Pressable>


))

}


</View>









{/* NEXT */}



<Pressable

onPress={onNext}

className="mt-8 items-center rounded-2xl bg-orange-500 py-4"

>


<Text

className="font-black text-white"

>

Continue to Preview

</Text>


</Pressable>






</View>





</View>

);

}