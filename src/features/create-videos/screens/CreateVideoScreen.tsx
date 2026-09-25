import {
  useEffect,
  useState,
} from 'react';


import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';


import {
  SafeAreaView,
} from 'react-native-safe-area-context';



import {
  router,
  useLocalSearchParams,
} from 'expo-router';




import {
  createVideo,
  getMyVideoById,
  updateVideo,
} from '../api/video.api';




import type {
  CreateVideoPayload,
  VideoLanguage,
  VideoType,
} from '../types/video.types';





import CreateVideoContent from "../components/CreateVideoContent";

import CreateVideoPreview from "../components/CreateVideoPreview";

import CreateVideoPublish from "../components/CreateVideoPublish";







type Step =

  | 'content'

  | 'preview'

  | 'publish';








export default function CreateVideoScreen(){


function extractYoutubeId(url:string){


const regex =
/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&?/]+)/;


const match =
url.match(regex);


return match?.[1];

}


const params =

useLocalSearchParams<{

 id?:string;

}>();





const videoId =

params.id;





const isEdit =

Boolean(videoId);








// ======================
// STATES
// ======================


const [step,setStep] =

useState<Step>(

 'content'

);





const [title,setTitle] =

useState('');





const [description,setDescription] =

useState('');





const [videoUrl,setVideoUrl] =

useState('');





const [thumbnailUrl,setThumbnailUrl] =

useState('');





const [videoType,setVideoType] =

useState<VideoType>(

 'normal'

);





const [category,setCategory] =
useState<string>(
  'other'
);





const [language,setLanguage] =

useState<VideoLanguage>(

 'en'

);





const [loading,setLoading] =

useState(false);











// ======================
// EDIT LOAD
// ======================


useEffect(()=>{


 if(!videoId){

  return;

 }



 const loadVideo = async()=>{


 try{


 const data =

 await getMyVideoById(

  videoId,

 );





 setTitle(

  data.title ?? '',

 );





 setDescription(

  data.description ?? '',

 );





 setVideoUrl(

  data.videoUrl ?? '',

 );





 setThumbnailUrl(

  data.thumbnailUrl ?? '',

 );





 setVideoType(

  data.videoType,

 );





 setCategory(

  data.category,

 );





 setLanguage(

  data.language,

 );





 }

 catch(error){


 console.log(

  "LOAD VIDEO ERROR:",

  error,

 );


 }



 };




 loadVideo();



},[

videoId

]);











// ======================
// SAVE VIDEO
// ======================

async function saveVideo(){


try{


setLoading(true);



const isYoutube =
videoUrl.startsWith("http");



const payload:CreateVideoPayload = {

title:title.trim(),

description:description.trim(),

videoType,

videoSource:
isYoutube
? 'youtube'
: 'direct',

mediaUrl:
!isYoutube
? videoUrl
: undefined,

youtubeVideoId:
isYoutube
? extractYoutubeId(videoUrl)
: undefined,

thumbnailUrl,

category,

language,

status:"pending",

};



console.log(
"VIDEO PAYLOAD",
payload
);



if(videoId){

await updateVideo(
videoId,
payload
);

}
else{


await createVideo(
payload
);


}



Alert.alert(
"Success",
"Video submitted successfully"
);



router.replace("/video");



}

catch(error:any){


console.log(
"SAVE VIDEO ERROR",
error.response?.data
);


Alert.alert(
"Error",
JSON.stringify(
error.response?.data
)
);


}

finally{


setLoading(false);


}


}












return (

<SafeAreaView

className="flex-1 bg-slate-50"

>


<KeyboardAvoidingView

className="flex-1"

behavior={

Platform.OS === 'ios'

?

'padding'

:

undefined

}

>



<ScrollView

showsVerticalScrollIndicator={false}

contentContainerStyle={{

padding:16,

paddingBottom:120,

}}

>







{

step === 'content'

&&

(


<CreateVideoContent

title={title}
setTitle={setTitle}


description={description}
setDescription={setDescription}


videoType={videoType}
setVideoType={setVideoType}


category={category}
setCategory={setCategory}


language={language}
setLanguage={setLanguage}


videoUrl={videoUrl}
setVideoUrl={setVideoUrl}


youtubeUrl={youtubeUrl}
setYoutubeUrl={setYoutubeUrl}


thumbnailUrl={thumbnailUrl}
setThumbnailUrl={setThumbnailUrl}


onNext={()=>setStep('preview')}

/>

&&

(


<CreateVideoPreview


title={title}


description={description}


videoUrl={videoUrl}


thumbnailUrl={thumbnailUrl}


category={category}


videoType={videoType}


language={language}



onBack={()=>setStep('content')}



onNext={()=>setStep('publish')}



/>


)

}









{

step === 'publish'

&&

(


<CreateVideoPublish


loading={loading}



onBack={()=>setStep('preview')}



onPublish={saveVideo}


/>


)

}








</ScrollView>



</KeyboardAvoidingView>



</SafeAreaView>

);



}