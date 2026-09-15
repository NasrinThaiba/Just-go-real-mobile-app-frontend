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
  VideoCategory,
  VideoLanguage,
  VideoType,
} from "../types/video.types";





type Props = {


  title:string;


  description:string;


  videoUrl:string;


  thumbnailUrl:string;



  category:VideoCategory;


  videoType:VideoType;


  language:VideoLanguage;




  onBack:()=>void;


  onNext:()=>void;


};









export default function CreateVideoPreview({


title,


description,


videoUrl,


thumbnailUrl,


category,


videoType,


language,


onBack,


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

Preview Video

</Text>



<Text

className="mt-2 text-sm text-slate-500"

>

Review your video before publishing

</Text>



</View>









{/* VIDEO CARD */}



<View

className="rounded-3xl bg-white p-5"

>







{/* THUMBNAIL */}



{

thumbnailUrl ? (


<View

className="relative"

>


<Image

source={{

uri:thumbnailUrl

}}

className="h-56 w-full rounded-3xl"

resizeMode="cover"

/>



<View

className="absolute inset-0 items-center justify-center"

>


<View

className="h-16 w-16 items-center justify-center rounded-full bg-black/60"

>


<Ionicons

name="play"

size={32}

color="white"

/>


</View>


</View>



</View>


)

:

(


<View

className="h-56 items-center justify-center rounded-3xl bg-slate-100"

>


<Ionicons

name="videocam-outline"

size={45}

color="#94A3B8"

/>



<Text

className="mt-3 text-sm font-bold text-slate-400"

>

No Thumbnail Selected

</Text>


</View>


)

}









{/* TAGS */}



<View

className="mt-5 flex-row flex-wrap gap-3"

>





<View

className="rounded-full bg-orange-50 px-4 py-2"

>


<Text

className="font-bold text-orange-600"

>

{category}

</Text>


</View>








<View

className="rounded-full bg-blue-50 px-4 py-2"

>


<Text

className="font-bold text-blue-600"

>

{videoType}

</Text>


</View>





</View>









{/* TITLE */}



<Text

className="mt-6 text-2xl font-black text-slate-900"

>


{

title ||

"Your video title"

}


</Text>









{/* DESCRIPTION */}



<Text

className="mt-4 text-base leading-6 text-slate-600"

>


{

description ||

"Your video description will appear here"

}


</Text>









{/* YOUTUBE URL */}



<View

className="mt-6 flex-row items-center rounded-2xl bg-red-50 p-4"

>


<Ionicons

name="logo-youtube"

size={22}

color="#FF0000"

/>



<Text

numberOfLines={1}

className="ml-3 flex-1 font-semibold text-red-600"

>


{

videoUrl ||

"No YouTube URL added"

}


</Text>


</View>









{/* INFO */}



<View

className="mt-6 gap-3"

>



<View

className="flex-row items-center"

>


<Ionicons

name="language-outline"

size={18}

color="#64748B"

/>



<Text

className="ml-3 font-semibold text-slate-700"

>

Language :

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





<View

className="flex-row items-center"

>


<Ionicons

name="play-circle-outline"

size={18}

color="#64748B"

/>



<Text

className="ml-3 font-semibold text-slate-700"

>

Type :

{' '}

{videoType}


</Text>


</View>





</View>









{/* IMPORTANT */}



<View

className="mt-6 rounded-2xl bg-orange-50 p-4"

>



<View

className="flex-row items-center"

>


<Ionicons

name="information-circle-outline"

size={22}

color="#F97316"

/>



<Text

className="ml-2 font-black text-orange-700"

>

Important

</Text>


</View>





<Text

className="mt-2 text-sm leading-5 text-orange-700"

>

Your video will be submitted for review.
After admin approval, it will be visible to users.

</Text>





</View>







</View>









{/* ACTION BUTTONS */}



<View

className="mt-6 flex-row gap-3"

>





<Pressable

onPress={onBack}

className="flex-1 items-center rounded-2xl border border-slate-200 py-4"

>


<Text

className="font-black text-slate-700"

>

Edit

</Text>


</Pressable>









<Pressable

onPress={onNext}

className="flex-1 items-center rounded-2xl bg-orange-500 py-4"

>


<Text

className="font-black text-white"

>

Continue

</Text>


</Pressable>






</View>







</View>

);

}