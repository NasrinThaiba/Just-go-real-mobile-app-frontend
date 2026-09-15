import {
  useEffect,
  useState,
} from 'react';


import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';


import {
  SafeAreaView,
} from 'react-native-safe-area-context';


import {
  router,
  useLocalSearchParams,
} from 'expo-router';



import {
  createNews,
  getMyNewsById,
  updateNews,
} from '../api/news.api';



import type {
  CreateNewsPayload,
  NewsCategory,
  NewsLanguage,
  NewsLocation,
  NewsType,
} from '../types/news.types';



import CreateNewsContent from "../components/CreateNewsContent";

import CreateNewsPreview from '../components/CreateNewsPreview';

import CreateNewsPublish from '../components/CreateNewsPublish';







type Step =
  | 'content'
  | 'preview'
  | 'publish';





export default function CreateNewsScreen(){



const params =
useLocalSearchParams<{
 id?:string;
}>();



const newsId =
params.id;



const isEdit =
Boolean(newsId);






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



const [mediaUrl,setMediaUrl] =
useState('');



const [newsType,setNewsType] =
useState<NewsType>(
 'regular'
);



const [category,setCategory] =
useState<NewsCategory>(
 'world'
);



const [language,setLanguage] =
useState<NewsLanguage>(
 'en'
);



const [location,setLocation] =
useState<NewsLocation>(
 'tamil-nadu'
);



const [loading,setLoading] =
useState(false);







// ======================
// EDIT LOAD
// ======================


useEffect(() => {

  if (!newsId) {
    return;
  }


  const loadNews = async () => {

    try {


      const data =
        await getMyNewsById(
          newsId,
        );



      setTitle(
        data.title ?? '',
      );


      setDescription(
        data.description ?? '',
      );


      setMediaUrl(
        data.mediaUrl ?? '',
      );


      setNewsType(
        data.newsType,
      );


      setCategory(
        data.category as NewsCategory,
      );


      setLanguage(
        data.language,
      );


      setLocation(
        data.location as NewsLocation,
      );



    } catch(error) {


      console.log(
        "LOAD NEWS ERROR:",
        error,
      );


    }

  };



  loadNews();



}, [
  newsId,
]);









// ======================
// SAVE NEWS
// ======================


async function saveNews(){


try{


setLoading(true);



const payload:
CreateNewsPayload =
{


title:


title.trim(),



description:


description.trim(),



newsType,



language,



category,



location,



mediaUrl,



status:

'pending',


};





if(isEdit && newsId){


await updateNews(

 newsId,

 payload

);



}
else{


await createNews(

 payload

);



}






Alert.alert(

'Success',

'News submitted successfully'

);



router.replace(
'/my-posts'
);




}
catch(error){


console.log(
'SAVE ERROR',
error
);



Alert.alert(

'Error',

'Unable to submit news'

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
step === 'content' &&

(

<CreateNewsContent

title={title}

setTitle={setTitle}


description={description}

setDescription={setDescription}


newsType={newsType}

setNewsType={setNewsType}


category={category}

setCategory={setCategory}


language={language}

setLanguage={setLanguage}


location={location}

setLocation={setLocation}


mediaUrl={mediaUrl}

setMediaUrl={setMediaUrl}



onNext={()=>setStep('preview')}


/>

)

}








{
step === 'preview' &&

(

<CreateNewsPreview

title={title}

description={description}

mediaUrl={mediaUrl}

category={category}

newsType={newsType}

language={language}

location={location}


onBack={()=>setStep('content')}


onNext={()=>setStep('publish')}


/>

)

}









{
step === 'publish' &&

(

<CreateNewsPublish


loading={loading}


onBack={()=>setStep('preview')}


onPublish={saveNews}


/>

)

}




</ScrollView>


</KeyboardAvoidingView>


</SafeAreaView>

);

}