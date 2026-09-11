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
  NewsCategory,
  NewsLanguage,
  NewsLocation,
  NewsType,
} from "../types/news.types";



const CATEGORIES = [

"politics",
"business",
"sports",
"cinema",
"technology",
"science",
"world",
"education",
"health",

] as const;



const NEWS_TYPES = [

{
 label:"Regular",
 value:"regular",
 icon:"newspaper-outline",
},

{
 label:"Breaking",
 value:"breaking",
 icon:"flash-outline",
},

{
 label:"Featured",
 value:"featured",
 icon:"star-outline",
},

{
 label:"Trending",
 value:"trending",
 icon:"trending-up-outline",
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



const LOCATIONS = [

{
label:"Tamil Nadu",
value:"tamil-nadu",
},

{
label:"Chennai",
value:"chennai",
},

{
label:"Coimbatore",
value:"coimbatore",
},

];





type Props = {


title:string;

setTitle:(v:string)=>void;



description:string;

setDescription:(v:string)=>void;



newsType:NewsType;

setNewsType:(v:NewsType)=>void;



category:NewsCategory;

setCategory:(v:NewsCategory)=>void;



language:NewsLanguage;

setLanguage:(v:NewsLanguage)=>void;



location:NewsLocation;

setLocation:(v:NewsLocation)=>void;



mediaUrl:string;

setMediaUrl:(v:string)=>void;



onNext:()=>void;


};





export default function CreateNewsContent({

title,
setTitle,

description,
setDescription,

newsType,
setNewsType,

category,
setCategory,

language,
setLanguage,

location,
setLocation,

mediaUrl,
setMediaUrl,

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

Create News

</Text>


<Text

className="mt-2 text-sm text-slate-500"

>

Create and publish your latest updates

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
"Publish",
]
.map(
(item,index)=>


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

Basic Information

</Text>




<Text

className="mb-2 mt-5 text-sm font-bold text-slate-700"

>

News Title *

</Text>



<View

className="rounded-2xl bg-slate-100 px-4 py-3"

>


<TextInput

value={title}

onChangeText={setTitle}

placeholder="Enter news title"

placeholderTextColor="#94A3B8"

maxLength={150}

className="text-base text-slate-900"

/>


<Text

className="mt-1 self-end text-xs text-slate-400"

>

{title.length}/150

</Text>


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

onPress={()=>setCategory(item)}

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









{/* NEWS TYPE */}



<Text

className="mb-3 mt-6 text-sm font-bold text-slate-700"

>

News Type *

</Text>



<View

className="flex-row flex-wrap gap-3"

>


{
NEWS_TYPES.map(item=>{


const active =
newsType===item.value;



return (

<Pressable

key={item.value}

onPress={()=>setNewsType(item.value as NewsType)}

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

size={24}

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

placeholder="Write detailed news description"

placeholderTextColor="#94A3B8"

multiline

textAlignVertical="top"

className="text-base text-slate-900"

/>


</View>









{/* IMAGE */}



<Text

className="mb-3 mt-6 text-sm font-bold text-slate-700"

>

Featured Image *

</Text>



<Pressable

className="h-44 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300"

>


{
mediaUrl ?

<Image

source={{
uri:mediaUrl
}}

className="h-full w-full rounded-3xl"

/>

:

<>

<Ionicons

name="cloud-upload-outline"

size={45}

color="#94A3B8"

/>


<Text

className="mt-3 font-bold text-slate-500"

>

Upload Image

</Text>


</>

}


</Pressable>










{/* LANGUAGE */}



<View

className="mt-6"

>


<Text

className="mb-2 text-sm font-bold text-slate-700"

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

onPress={()=>setLanguage(item.value as NewsLanguage)}

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

</View>









{/* LOCATION */}


<Text

className="mb-2 mt-6 text-sm font-bold text-slate-700"

>

Location *

</Text>


<View

className="flex-row flex-wrap gap-3"

>

{
LOCATIONS.map(item=>(


<Pressable

key={item.value}

onPress={()=>setLocation(item.value as NewsLocation)}

className={`
rounded-xl
px-5
py-3

${
location===item.value
?
"bg-orange-500"
:
"bg-slate-100"
}

`}

>

<Text

className={
location===item.value
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









{/* NEXT BUTTON */}


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