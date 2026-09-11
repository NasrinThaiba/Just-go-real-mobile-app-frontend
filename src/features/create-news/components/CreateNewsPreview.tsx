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
  NewsCategory,
  NewsLanguage,
  NewsLocation,
  NewsType,
} from "../types/news.types";





type Props = {

  title:string;

  description:string;

  mediaUrl:string;


  category:NewsCategory;

  newsType:NewsType;


  language:NewsLanguage;

  location:NewsLocation;



  onBack:()=>void;

  onNext:()=>void;

};







export default function CreateNewsPreview({

title,

description,

mediaUrl,

category,

newsType,

language,

location,

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

Preview News

</Text>



<Text

className="mt-2 text-sm text-slate-500"

>

Review your content before publishing

</Text>



</View>









{/* PREVIEW CARD */}



<View

className="rounded-3xl bg-white p-5"

>





{/* IMAGE */}


{
mediaUrl ? (

<Image

source={{
uri:mediaUrl
}}

className="h-56 w-full rounded-3xl"

resizeMode="cover"

/>

)

:

(

<View

className="h-56 items-center justify-center rounded-3xl bg-slate-100"

>


<Ionicons

name="image-outline"

size={45}

color="#94A3B8"

/>



<Text

className="mt-3 text-sm font-bold text-slate-400"

>

No Image Selected

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

{newsType}

</Text>


</View>



</View>








{/* TITLE */}


<Text

className="mt-6 text-2xl font-black text-slate-900"

>


{
title ||
"Your news title"
}


</Text>







{/* DESCRIPTION */}



<Text

className="mt-4 text-base leading-6 text-slate-600"

>


{
description ||
"Your news description will appear here"
}


</Text>










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

name="location-outline"

size={18}

color="#64748B"

/>


<Text

className="ml-3 font-semibold text-slate-700"

>

Location :

{' '}

{location}


</Text>


</View>




</View>








{/* IMPORTANT INFO */}



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

Your news will be submitted for review.
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