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
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;


  const match = url.match(regex);


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
useState<Step>('content');


const [title,setTitle] =
useState('');


const [description,setDescription] =
useState('');


/**
 * Local uploaded video
 */
const [videoUrl,setVideoUrl] =
useState('');



/**
 * Youtube URL
 */
const [youtubeUrl,setYoutubeUrl] =
useState('');



const [thumbnailUrl,setThumbnailUrl] =
useState('');



const [videoType,setVideoType] =
useState<VideoType>(
  'latest'
);



const [category,setCategory] =
useState(
  'other'
);



const [language,setLanguage] =
useState<VideoLanguage>(
  'en'
);


const [location,setLocation] =
useState('');



const [loading,setLoading] =
useState(false);





// ======================
// EDIT LOAD
// ======================

useEffect(()=>{

  if(!videoId){
    return;
  }


  const id = videoId;


  async function loadVideo(){

    try{

      const data =
        await getMyVideoById(id);


      setTitle(
        data.title ?? ''
      );


      setDescription(
        data.description ?? ''
      );


      setVideoUrl(
        data.videoSource === 'direct'
          ? data.mediaUrl ?? ''
          : ''
      );


      setYoutubeUrl(
        data.videoSource === 'youtube'
        ? `https://youtube.com/watch?v=${data.youtubeVideoId}`
        :''
      );


      setThumbnailUrl(
        data.thumbnailUrl ?? ''
      );


      setVideoType(
        data.videoType ?? 'latest'
      );


      setCategory(
        data.category ?? ''
      );


      setLocation(
        data.location ?? ''
      );


      setLanguage(
        data.language ?? 'en'
      );


    }
    catch(error){

      console.log(
        "LOAD VIDEO ERROR",
        error
      );

    }

  }


  loadVideo();


},[videoId]);







// ======================
// SAVE VIDEO
// ======================


async function saveVideo(){


try{


setLoading(true);



const isYoutube =
youtubeUrl.trim().length > 0;



const payload:CreateVideoPayload = {

title:title.trim(),

description:description.trim(),

videoType,

videoSource:
isYoutube
?
'youtube'
:
'direct',

mediaUrl:
!isYoutube
?
videoUrl
:
undefined,

youtubeVideoId:
isYoutube
?
extractYoutubeId(youtubeUrl)
:
undefined,

thumbnailUrl,

category,

language,

location,

status:'pending',

};


console.log(
"VIDEO PAYLOAD",
payload
);




if(isEdit && videoId){


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



router.replace('/video');



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


location={location}
setLocation={setLocation}


onNext={()=>setStep('preview')}

/>

)

}







{
step === 'preview'
&&
(

<CreateVideoPreview


title={title}


description={description}


videoUrl={videoUrl}


youtubeUrl={youtubeUrl}


thumbnailUrl={thumbnailUrl}


category={category}


videoType={videoType}


language={language}


location={location}


onBack={()=>
setStep('content')
}



onNext={()=>
setStep('publish')
}



/>

)

}








{
step === 'publish'
&&
(

<CreateVideoPublish


loading={loading}



onBack={()=>
setStep('preview')
}



onPublish={saveVideo}


/>

)

}



</ScrollView>


</KeyboardAvoidingView>


</SafeAreaView>

);


}