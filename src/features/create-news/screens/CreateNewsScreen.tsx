// // import {
// //   useEffect,
// //   useState,
// // } from 'react';


// // import {
// //   Image,
// //   KeyboardAvoidingView,
// //   Modal,
// //   Platform,
// //   Pressable,
// //   ScrollView,
// //   Text,
// //   View,
// // } from 'react-native';


// // import {
// //   useLocalSearchParams,
// //   useRouter,
// // } from 'expo-router';


// // import {
// //   SafeAreaView,
// // } from 'react-native-safe-area-context';


// // import {
// //   Ionicons,
// // } from '@expo/vector-icons';


// // import * as ImagePicker from 'expo-image-picker';


// // import Toast from 'react-native-toast-message';



// // import {
// //   AppButton,
// // } from '@/components/ui/AppButton';


// // import {
// //   AppInput,
// // } from '@/components/ui/AppInput';



// // import {
// //   createNews,
// //   getMyNewsById,
// //   updateNews,
// // } from '../api/news.api';



// // import type { 
// //   CreateNewsPayload,
// //   FeedItem
// // } from '../types/news.types';





// // type SaveMode =
// //   | 'draft'
// //   | 'publish';





// // type PickerItem = {

// //   label:string;

// //   value:string;

// // };





// // const NEWS_TYPES:PickerItem[] = [

// //   {
// //     label:'Regular',
// //     value:'regular',
// //   },

// //   {
// //     label:'Breaking',
// //     value:'breaking',
// //   },

// //   {
// //     label:'Featured',
// //     value:'featured',
// //   },

// //   {
// //     label:'Trending',
// //     value:'trending',
// //   },

// // ];





// // const LANGUAGES:PickerItem[] = [

// //   {
// //     label:'English',
// //     value:'en',
// //   },

// //   {
// //     label:'Tamil',
// //     value:'ta',
// //   },

// // ];





// // const CATEGORIES:PickerItem[] = [

// //   {
// //     label:'Politics',
// //     value:'politics',
// //   },

// //   {
// //     label:'Business',
// //     value:'business',
// //   },

// //   {
// //     label:'Sports',
// //     value:'sports',
// //   },

// //   {
// //     label:'Cinema',
// //     value:'cinema',
// //   },

// //   {
// //     label:'Technology',
// //     value:'technology',
// //   },

// //   {
// //     label:'Science',
// //     value:'science',
// //   },

// //   {
// //     label:'World',
// //     value:'world',
// //   },

// //   {
// //     label:'Education',
// //     value:'education',
// //   },

// //   {
// //     label:'Health',
// //     value:'health',
// //   },

// // ];





// // const LOCATIONS:PickerItem[] = [

// //   {
// //     label:'Tamil Nadu',
// //     value:'tamil-nadu',
// //   },

// //   {
// //     label:'Chennai',
// //     value:'chennai',
// //   },

// //   {
// //     label:'Coimbatore',
// //     value:'coimbatore',
// //   },

// //   {
// //     label:'Madurai',
// //     value:'madurai',
// //   },

// //   {
// //     label:'Salem',
// //     value:'salem',
// //   },

// // ];





// // export default function CreateNewsScreen(){


// //   const router =
// //     useRouter();



// //   const params =
// //     useLocalSearchParams<{
// //       id?:string;
// //     }>();



// //   const editingNewsId =
// //     params.id;



// //   const isEditMode =
// //     Boolean(editingNewsId);




// //   const [
// //     title,
// //     setTitle,
// //   ] = useState('');



// //   const [
// //     description,
// //     setDescription,
// //   ] = useState('');



// //   const [
// //     newsType,
// //     setNewsType,
// //   ] = useState<
// //     CreateNewsPayload['newsType']
// //   >('regular');



// //   const [
// //     language,
// //     setLanguage,
// //   ] = useState<
// //     CreateNewsPayload['language']
// //   >('en');



// //   const [
// //     category,
// //     setCategory,
// //   ] = useState<
// //     CreateNewsPayload['category']
// //   >('world');



// //   const [
// //     location,
// //     setLocation,
// //   ] = useState<
// //     CreateNewsPayload['location']
// //   >('tamil-nadu');



// //   const [
// //     imageUri,
// //     setImageUri,
// //   ] = useState<string | null>(null);



// //   const [
// //     isSaving,
// //     setIsSaving,
// //   ] = useState(false);




// //   const [
// //     pickerType,
// //     setPickerType,
// //   ] = useState<
// //     'category'
// //     | 'location'
// //     | 'language'
// //     | 'newsType'
// //     | null
// //   >(null);




// //   const [
// //     error,
// //     setError,
// //   ] = useState<string | null>(null);

// //     // ===============================
// //   // LOAD EXISTING NEWS FOR EDIT
// //   // ===============================

// //   useEffect(()=>{


// //     async function loadNews(){


// //       if(!editingNewsId){

// //         return;

// //       }



// //       try{


// //         const news =
// //           await getMyNewsById(
// //             editingNewsId,
// //           );



// //         setTitle(
// //           news.title,
// //         );


// //         setDescription(
// //           news.description,
// //         );


// //         setNewsType(
// //           news.newsType,
// //         );


// //         setLanguage(
// //           news.language,
// //         );


// //         setCategory(
// //           news.category as CreateNewsPayload['category'],
// //         );


// //         setLocation(
// //           news.location as CreateNewsPayload['location'],
// //         );


// //         setImageUri(
// //           news.mediaUrl || null,
// //         );



// //       }
// //       catch(error){


// //         console.log(
// //           "LOAD NEWS ERROR:",
// //           error,
// //         );


// //         Toast.show({

// //           type:'error',

// //           text1:'Unable to load news',

// //         });


// //       }


// //     }



// //     void loadNews();


// //   },[
// //     editingNewsId,
// //   ]);







// //   // ===============================
// //   // IMAGE PICKER
// //   // ===============================


// //   const pickImage =
// //     async()=>{


// //       const permission =
// //         await ImagePicker
// //           .requestMediaLibraryPermissionsAsync();



// //       if(!permission.granted){


// //         Toast.show({

// //           type:'error',

// //           text1:
// //             'Permission required',

// //           text2:
// //             'Allow gallery access',

// //         });


// //         return;

// //       }




// //       const result =
// //         await ImagePicker.launchImageLibraryAsync({

// //           mediaTypes:
// //             ImagePicker
// //               .MediaTypeOptions
// //               .Images,


// //           quality:0.8,


// //         });




// //       if(
// //         !result.canceled &&
// //         result.assets.length
// //       ){


// //         setImageUri(
// //           result.assets[0].uri,
// //         );


// //       }


// //     };








// //   // ===============================
// //   // VALIDATION
// //   // ===============================


// //   const validateForDraft =
// //     ()=>{


// //       if(!title.trim()){


// //         setError(
// //           "Title is required",
// //         );


// //         return false;

// //       }


// //       setError(null);


// //       return true;


// //     };






// //   const validateForPublish =
// //     ()=>{


// //       if(!title.trim()){


// //         setError(
// //           "Title is required",
// //         );


// //         return false;

// //       }



// //       if(!description.trim()){


// //         setError(
// //           "Description is required",
// //         );


// //         return false;

// //       }



// //       if(!imageUri){


// //         setError(
// //           "Featured image is required",
// //         );


// //         return false;

// //       }




// //       setError(null);


// //       return true;


// //     };









// //   // ===============================
// //   // SAVE NEWS TO BACKEND
// //   // ===============================


// //   const saveNews =
// //     async(
// //       mode:SaveMode,
// //     )=>{


// //       const isDraft =
// //         mode === 'draft';




// //       const isValid =
// //         isDraft
// //           ? validateForDraft()
// //           : validateForPublish();




// //       if(!isValid){

// //         return;

// //       }





// //       const payload:CreateNewsPayload =
// //       {


// //         title:
// //           title.trim(),



// //         description:
// //           description.trim(),



// //         newsType:
// //           newsType || 'regular',



// //         language:
// //           language || 'en',



// //         category:
// //           category || 'world',



// //         location:
// //           location || 'tamil-nadu',



// //         mediaUrl:
// //           imageUri ?? '',



// //         status:
// //           isDraft
// //             ? 'draft'
// //             : 'pending',


// //       };






// //       try{


// //         setIsSaving(true);




// //         if(
// //           isEditMode &&
// //           editingNewsId
// //         ){



// //           await updateNews(

// //             editingNewsId,

// //             payload,

// //           );



// //         }
// //         else{



// //           await createNews(

// //             payload,

// //           );



// //         }






// //         Toast.show({

// //           type:
// //             'success',



// //           text1:
// //             isEditMode
// //               ? 'News updated'
// //               : isDraft
// //                 ? 'Draft saved'
// //                 : 'News submitted',



// //           text2:
// //             isDraft
// //               ? 'Saved successfully'
// //               : 'Waiting for approval',



// //           visibilityTime:
// //             1500,


// //         });







// //         setTimeout(()=>{


// //           router.replace(
// //             '/my-posts',
// //           );



// //         },800);






// //       }
// //       catch(error){



// //         console.error(

// //           "SAVE NEWS ERROR:",

// //           error,

// //         );



// //         Toast.show({

// //           type:'error',

// //           text1:
// //             'Failed to save news',

// //           text2:
// //             'Please try again',

// //         });



// //       }
// //       finally{


// //         setIsSaving(false);


// //       }


// //     };








// //   // ===============================
// //   // PICKER HELPERS
// //   // ===============================


// //   const getPickerData = ()=>{


// //     switch(pickerType){


// //       case 'category':

// //         return CATEGORIES;


// //       case 'location':

// //         return LOCATIONS;


// //       case 'language':

// //         return LANGUAGES;


// //       case 'newsType':

// //         return NEWS_TYPES;


// //       default:

// //         return [];


// //     }


// //   };



// //   const handlePickerSelect =
// //     (
// //       item:PickerItem,
// //     )=>{


// //       if(
// //         pickerType === 'category'
// //       ){

// //         setCategory(
// //           item.value as CreateNewsPayload['category'],
// //         );

// //       }



// //       if(
// //         pickerType === 'location'
// //       ){

// //         setLocation(
// //           item.value as CreateNewsPayload['location'],
// //         );

// //       }



// //       if(
// //         pickerType === 'language'
// //       ){

// //         setLanguage(
// //           item.value as CreateNewsPayload['language'],
// //         );

// //       }



// //       if(
// //         pickerType === 'newsType'
// //       ){

// //         setNewsType(
// //           item.value as CreateNewsPayload['newsType'],
// //         );

// //       }



// //       setPickerType(null);


// //     };

// //       return (

// //     <SafeAreaView
// //       className="flex-1 bg-slate-50"
// //     >

// //       <KeyboardAvoidingView

// //         behavior={
// //           Platform.OS === 'ios'
// //             ? 'padding'
// //             : undefined
// //         }

// //         className="flex-1"

// //       >


// //         <ScrollView

// //           className="flex-1"

// //           contentContainerStyle={{
// //             padding:16,
// //             paddingBottom:40,
// //           }}

// //           showsVerticalScrollIndicator={false}

// //         >



// //           {/* HEADER */}

// //           <View
// //             className="mb-6 flex-row items-center"
// //           >

// //             <Pressable

// //               onPress={()=>
// //                 router.back()
// //               }

// //               className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white"

// //             >

// //               <Ionicons

// //                 name="arrow-back"

// //                 size={22}

// //                 color="#0F172A"

// //               />

// //             </Pressable>



// //             <View>

// //               <Text
// //                 className="text-2xl font-black text-textMain"
// //               >

// //                 {
// //                   isEditMode
// //                     ? 'Edit News'
// //                     : 'Create News'
// //                 }

// //               </Text>


// //               <Text
// //                 className="mt-1 text-sm text-textMuted"
// //               >

// //                 Publish your latest news

// //               </Text>

// //             </View>


// //           </View>





// //           {/* IMAGE */}

// //           <Pressable

// //             onPress={pickImage}

// //             className="mb-5 h-52 items-center justify-center overflow-hidden rounded-2xl border border-borderSoft bg-white"

// //           >

// //             {
// //               imageUri ? (

// //                 <Image

// //                   source={{
// //                     uri:imageUri,
// //                   }}

// //                   className="h-full w-full"

// //                   resizeMode="cover"

// //                 />

// //               ) : (

// //                 <View
// //                   className="items-center"
// //                 >

// //                   <Ionicons

// //                     name="image-outline"

// //                     size={40}

// //                     color="#64748B"

// //                   />


// //                   <Text
// //                     className="mt-2 text-sm font-semibold text-textMuted"
// //                   >

// //                     Add featured image

// //                   </Text>

// //                 </View>

// //               )
// //             }


// //           </Pressable>







// //           {
// //             error && (

// //               <View
// //                 className="mb-4 rounded-xl bg-red-50 p-3"
// //               >

// //                 <Text
// //                   className="text-sm font-semibold text-red-600"
// //                 >

// //                   {error}

// //                 </Text>

// //               </View>

// //             )
// //           }







// //           {/* TITLE */}

// //           <Text
// //             className="mb-2 text-sm font-bold text-textMain"
// //           >

// //             Title

// //           </Text>


// //           <AppInput

// //             value={title}

// //             onChangeText={setTitle}

// //             placeholder="Enter news title"

// //           />








// //           {/* DESCRIPTION */}

// //           <Text
// //             className="mb-2 mt-5 text-sm font-bold text-textMain"
// //           >

// //             Description

// //           </Text>


// //           <AppInput

// //             value={description}

// //             onChangeText={setDescription}

// //             placeholder="Enter description"

// //             multiline

// //           />









// //           {/* NEWS TYPE */}

// //           <Text
// //             className="mb-2 mt-5 text-sm font-bold text-textMain"
// //           >

// //             News Type

// //           </Text>


// //           <Pressable

// //             onPress={()=>
// //               setPickerType('newsType')
// //             }

// //             className="rounded-xl border border-borderSoft bg-white p-4"

// //           >

// //             <Text
// //               className="font-semibold text-textMain"
// //             >

// //               {
// //                 NEWS_TYPES.find(
// //                   item =>
// //                     item.value === newsType,
// //                 )?.label
// //               }

// //             </Text>

// //           </Pressable>









// //           {/* LANGUAGE */}

// //           <Text
// //             className="mb-2 mt-5 text-sm font-bold text-textMain"
// //           >

// //             Language

// //           </Text>


// //           <Pressable

// //             onPress={()=>
// //               setPickerType('language')
// //             }

// //             className="rounded-xl border border-borderSoft bg-white p-4"

// //           >

// //             <Text
// //               className="font-semibold text-textMain"
// //             >

// //               {
// //                 LANGUAGES.find(
// //                   item =>
// //                     item.value === language,
// //                 )?.label
// //               }

// //             </Text>

// //           </Pressable>









// //           {/* CATEGORY */}

// //           <Text
// //             className="mb-2 mt-5 text-sm font-bold text-textMain"
// //           >

// //             Category

// //           </Text>


// //           <Pressable

// //             onPress={()=>
// //               setPickerType('category')
// //             }

// //             className="rounded-xl border border-borderSoft bg-white p-4"

// //           >

// //             <Text
// //               className="font-semibold text-textMain"
// //             >

// //               {
// //                 CATEGORIES.find(
// //                   item =>
// //                     item.value === category,
// //                 )?.label
// //               }

// //             </Text>


// //           </Pressable>









// //           {/* LOCATION */}

// //           <Text
// //             className="mb-2 mt-5 text-sm font-bold text-textMain"
// //           >

// //             Location

// //           </Text>


// //           <Pressable

// //             onPress={()=>
// //               setPickerType('location')
// //             }

// //             className="rounded-xl border border-borderSoft bg-white p-4"

// //           >

// //             <Text
// //               className="font-semibold text-textMain"
// //             >

// //               {
// //                 LOCATIONS.find(
// //                   item =>
// //                     item.value === location,
// //                 )?.label
// //               }

// //             </Text>


// //           </Pressable>









// //           {/* BUTTONS */}


// //           <View
// //             className="mt-8 flex-row gap-3"
// //           >


// //             <View
// //               className="flex-1"
// //             >

// //               <AppButton

// //                 title="Save Draft"

// //                 variant="secondary"

// //                 loading={
// //                   isSaving
// //                 }

// //                 onPress={()=>
// //                   saveNews(
// //                     'draft',
// //                   )
// //                 }

// //               />

// //             </View>





// //             <View
// //               className="flex-1"
// //             >

// //               <AppButton

// //                 title={
// //                   isEditMode
// //                     ? "Update"
// //                     : "Submit"
// //                 }

// //                 loading={
// //                   isSaving
// //                 }

// //                 onPress={()=>
// //                   saveNews(
// //                     'publish',
// //                   )
// //                 }

// //               />


// //             </View>


// //           </View>





// //         </ScrollView>





// //         {/* PICKER MODAL */}


// //         <Modal

// //           visible={
// //             pickerType !== null
// //           }

// //           transparent

// //           animationType="slide"

// //           onRequestClose={()=>
// //             setPickerType(null)
// //           }

// //         >


// //           <Pressable

// //             className="flex-1 justify-end bg-black/40"

// //             onPress={()=>
// //               setPickerType(null)
// //             }

// //           >


// //             <View

// //               className="rounded-t-3xl bg-white p-5"

// //             >


// //               <Text

// //                 className="mb-4 text-lg font-black text-textMain"

// //               >

// //                 Select

// //               </Text>




// //               {
// //                 getPickerData()
// //                 .map(
// //                   item=>(

// //                     <Pressable

// //                       key={item.value}

// //                       onPress={()=>
// //                         handlePickerSelect(
// //                           item,
// //                         )
// //                       }

// //                       className="border-b border-borderSoft py-4"

// //                     >

// //                       <Text

// //                         className="text-base font-semibold text-textMain"

// //                       >

// //                         {item.label}

// //                       </Text>


// //                     </Pressable>

// //                   ),
// //                 )
// //               }




// //             </View>


// //           </Pressable>


// //         </Modal>




// //       </KeyboardAvoidingView>


// //     </SafeAreaView>


// //   );

// // }



// // src/features/news/screens/CreateNewsScreen.tsx


// import {
//   useEffect,
//   useState,
// } from 'react';


// import {
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';


// import {
//   SafeAreaView,
// } from 'react-native-safe-area-context';


// import {
//   Ionicons,
// } from '@expo/vector-icons';


// import {
//   router,
//   useLocalSearchParams,
// } from 'expo-router';


// import * as ImagePicker from 'expo-image-picker';



// import {
//   createNews,
//   getMyNewsById,
//   updateNews,
// } from '../api/news.api';



// import type {
//   CreateNewsPayload,
//   NewsCategory,
//   NewsLanguage,
//   NewsLocation,
//   NewsType,
// } from '../types/news.types';





// // ===============================
// // TYPES
// // ===============================


// type Step =
//   | 'content'
//   | 'preview'
//   | 'publish';



// type PickerType =
//   | 'category'
//   | 'language'
//   | 'location'
//   | 'newsType'
//   | null;



// type SaveMode =
//   | 'draft'
//   | 'publish';







// // ===============================
// // CONSTANTS
// // ===============================


// const NEWS_TYPES = [

//   {
//     label:'Regular',
//     value:'regular',
//     icon:'newspaper-outline',
//   },

//   {
//     label:'Breaking',
//     value:'breaking',
//     icon:'flash-outline',
//   },

//   {
//     label:'Featured',
//     value:'featured',
//     icon:'star-outline',
//   },

//   {
//     label:'Trending',
//     value:'trending',
//     icon:'trending-up-outline',
//   },

// ] as const;





// const CATEGORIES = [

//   'politics',
//   'business',
//   'sports',
//   'cinema',
//   'technology',
//   'science',
//   'world',
//   'education',
//   'health',

// ] as const;





// const LANGUAGES = [

//   {
//     label:'English',
//     value:'en',
//   },

//   {
//     label:'Tamil',
//     value:'ta',
//   },

// ];





// const LOCATIONS = [

//   {
//     label:'Tamil Nadu',
//     value:'tamil-nadu',
//   },

//   {
//     label:'Chennai',
//     value:'chennai',
//   },

//   {
//     label:'Coimbatore',
//     value:'coimbatore',
//   },

//   {
//     label:'Madurai',
//     value:'madurai',
//   },

//   {
//     label:'Salem',
//     value:'salem',
//   },

// ];









// // ===============================
// // SCREEN
// // ===============================


// export default function CreateNewsScreen(){



// const params =
//   useLocalSearchParams<{
//     id?:string;
//   }>();



// const editingNewsId =
//   params.id;



// const isEditMode =
//   Boolean(editingNewsId);






// // ===============================
// // STATES
// // ===============================


// const [step,setStep] =
//   useState<Step>(
//     'content',
//   );



// const [title,setTitle] =
//   useState('');



// const [description,setDescription] =
//   useState('');



// const [imageUri,setImageUri] =
//   useState<string | null>(
//     null,
//   );



// const [newsType,setNewsType] =
//   useState<NewsType>(
//     'regular',
//   );



// const [language,setLanguage] =
//   useState<NewsLanguage>(
//     'en',
//   );



// const [category,setCategory] =
//   useState<NewsCategory>(
//     'world',
//   );



// const [location,setLocation] =
//   useState<NewsLocation>(
//     'tamil-nadu',
//   );



// const [picker,setPicker] =
//   useState<PickerType>(
//     null,
//   );



// const [isSaving,setIsSaving] =
//   useState(false);







// // ===============================
// // LOAD EDIT NEWS
// // ===============================


// useEffect(() => {

//   if (!editingNewsId) {
//     return;
//   }


//   async function loadNews(
//     id: string,
//   ) {

//     try {

//       const news =
//         await getMyNewsById(
//           id,
//         );


//       setTitle(
//         news.title,
//       );


//       setDescription(
//         news.description,
//       );


//       setImageUri(
//         news.mediaUrl,
//       );


//       setNewsType(
//         news.newsType,
//       );


//       setLanguage(
//         news.language,
//       );


//       setCategory(
//         news.category as NewsCategory,
//       );


//       setLocation(
//         news.location as NewsLocation,
//       );


//     } catch(error) {

//       console.log(
//         error,
//       );

//     }

//   }



//   loadNews(
//     editingNewsId,
//   );


// }, [
//   editingNewsId,
// ]);








// // ===============================
// // IMAGE PICKER
// // ===============================


// async function pickImage(){


//  const result =
//    await ImagePicker.launchImageLibraryAsync({

//     mediaTypes:
//       ['images'],

//     quality:
//       0.8,

//    });



//  if(!result.canceled){


//    setImageUri(
//      result.assets[0].uri,
//    );


//  }


// }







// // ===============================
// // SAVE
// // ===============================


// async function saveNews(
//   mode: SaveMode,
// ){

//   console.log("1. SAVE CLICKED", mode);


//   setIsSaving(true);


//   const payload: CreateNewsPayload = {

//     title:title.trim(),

//     description:description.trim(),

//     newsType,

//     language,

//     category,

//     location,

//     mediaUrl:imageUri ?? '',

//     status:
//       mode === 'draft'
//       ? 'draft'
//       : 'pending',

//   };


//   console.log(
//     "2. PAYLOAD",
//     payload,
//   );



//   try {


//     console.log(
//       "3. API START",
//     );



//     if(
//       isEditMode &&
//       editingNewsId
//     ){

//       await updateNews(
//         editingNewsId,
//         payload,
//       );


//     }
//     else{


//       await createNews(
//         payload,
//       );


//     }



//     console.log(
//       "4. API SUCCESS",
//     );



//     Alert.alert(
//       "Success",
//       "News saved successfully",
//     );



//     router.replace(
//       "/my-posts",
//     );



//   }
//   catch(error){


//     console.log(
//       "5. SAVE ERROR",
//       error,
//     );



//     Alert.alert(
//       "Error",
//       "Unable to save news",
//     );


//   }
//   finally{


//     console.log(
//       "6. FINISHED",
//     );


//     setIsSaving(false);


//   }


// }

// // ===============================
// // CONTENT UI
// // ===============================


// function renderContent(){


// return (

// <View>


// {/* HEADER */}

// <View
// className="mb-6 flex-row items-center"
// >


// <Pressable

// onPress={() =>
//  router.back()
// }

// className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-white"

// >

// <Ionicons

// name="arrow-back"

// size={22}

// color="#0F172A"

// />


// </Pressable>



// <View>


// <Text

// className="text-2xl font-black text-slate-900"

// >

// {
// isEditMode
// ?
// 'Edit News'
// :
// 'Create News'
// }

// </Text>



// <Text

// className="mt-1 text-sm text-slate-500"

// >

// Share important updates

// </Text>



// </View>


// </View>







// {/* STEP BAR */}


// <View

// className="mb-5 rounded-3xl bg-white p-5"

// >


// <View

// className="flex-row justify-between"

// >


// {
// [
// 'Content',
// 'Preview',
// 'Publish',
// ].map(
// (item,index)=>{


// const active =
// index === 0;



// return (

// <View

// key={item}

// className="items-center"

// >


// <View

// className={`h-10 w-10 items-center justify-center rounded-full ${
// active
// ?
// 'bg-primary'
// :
// 'bg-slate-200'
// }`}

// >

// <Text

// className={`font-black ${
// active
// ?
// 'text-white'
// :
// 'text-slate-500'
// }`}

// >

// {index+1}

// </Text>


// </View>



// <Text

// className={`mt-2 text-xs font-bold ${
// active
// ?
// 'text-primary'
// :
// 'text-slate-400'
// }`}

// >

// {item}

// </Text>



// </View>

// );

// })
// }


// </View>


// </View>









// {/* MAIN CARD */}


// <View

// className="rounded-3xl bg-white p-5"

// >


// <Text

// className="text-xl font-black text-slate-900"

// >

// News Content

// </Text>



// <Text

// className="mt-1 text-sm text-slate-500"

// >

// Create your news story

// </Text>








// {/* IMAGE */}


// <Pressable

// onPress={pickImage}

// className="mt-5 h-52 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-200"

// >


// {
// imageUri

// ?

// <Image

// source={{
// uri:imageUri
// }}

// className="h-full w-full"

// resizeMode="cover"

// />


// :

// <View

// className="items-center"

// >

// <Ionicons

// name="cloud-upload-outline"

// size={45}

// color="#64748B"

// />


// <Text

// className="mt-3 font-bold text-slate-500"

// >

// Upload Featured Image

// </Text>


// </View>

// }


// </Pressable>








// {/* TITLE */}


// <Text

// className="mb-2 mt-6 text-sm font-black text-slate-800"

// >

// Headline

// </Text>



// <View

// className="rounded-2xl bg-slate-50 p-4"

// >


// <TextInput

// value={title}

// onChangeText={setTitle}

// placeholder="Enter news title"

// placeholderTextColor="#94A3B8"

// className="text-base text-slate-900"

// />


// </View>








// {/* DESCRIPTION */}



// <Text

// className="mb-2 mt-5 text-sm font-black text-slate-800"

// >

// Description

// </Text>




// <View

// className="min-h-[140px] rounded-2xl bg-slate-50 p-4"

// >


// <TextInput

// value={description}

// onChangeText={setDescription}

// placeholder="Write your news description"

// placeholderTextColor="#94A3B8"

// multiline

// textAlignVertical="top"

// className="text-base text-slate-900"

// />


// </View>









// {/* NEWS TYPE */}

// <Text
//   className="mb-3 mt-6 text-lg font-black text-slate-900"
// >
//   News Type
// </Text>


// <View
//   className="flex-row flex-wrap gap-3 justify-between"
// >

// {
// NEWS_TYPES.map((item)=>{

//   const selected =
//     newsType === item.value;


//   return (

//     <Pressable

//       key={item.value}

//       onPress={() =>
//         setNewsType(item.value)
//       }

//       className={`
//         h-32
//         w-[48%]
//         rounded-3xl
//         border
//         p-4
//         justify-between

//         ${
//           selected
//           ?
//           'border-primary bg-orange-50'
//           :
//           'border-slate-200 bg-white'
//         }
//       `}

//     >

//       <View
//         className={`
//           h-10
//           w-10
//           items-center
//           justify-center
//           rounded-xl

//           ${
//             selected
//             ?
//             'bg-orange-100'
//             :
//             'bg-slate-100'
//           }
//         `}
//       >

//         <Ionicons

//           name={
//             item.icon as any
//           }

//           size={24}

//           color={
//             selected
//             ?
//             '#FF7A1A'
//             :
//             '#64748B'
//           }

//         />

//       </View>



//       <Text

//         className={`
//           text-sm
//           font-black

//           ${
//             selected
//             ?
//             'text-slate-900'
//             :
//             'text-slate-700'
//           }
//         `}
//       >

//         {item.label}

//       </Text>


//     </Pressable>

//   );

// })

// }

// </View>








// <Text
//   className="mb-4 mt-8 text-lg font-black text-slate-900"
// >
//   Category
// </Text>


// <View
//   className="
//     flex-row
//     flex-wrap
//     gap-3
//   "
// >

// {
// CATEGORIES.map((item)=>{

//   const selected =
//     category === item;


//   return (

//     <Pressable

//       key={item}

//       onPress={() =>
//         setCategory(item)
//       }

//       className={`
//         w-[27%]
//         items-center
//         rounded-full
//         py-3

//         ${
//           selected
//           ?
//           'bg-primary'
//           :
//           'bg-slate-100'
//         }
//       `}

//     >

//       <Text

//         className={`
//           text-sm
//           font-black

//           ${
//             selected
//             ?
//             'text-white'
//             :
//             'text-slate-700'
//           }
//         `}

//       >

//         {item}

//       </Text>


//     </Pressable>

//   );

// })

// }

// </View>








// {/* LANGUAGE */}


// <Pressable

// onPress={() =>
//  setPicker('language')
// }

// className="mt-6 flex-row items-center justify-between rounded-2xl bg-slate-50 p-4"

// >


// <Text

// className="font-bold text-slate-800"

// >

// Language

// </Text>



// <Text

// className="text-slate-500"

// >

// {
// language === 'en'
// ?
// 'English'
// :
// 'Tamil'
// }

// </Text>


// </Pressable>







// {/* LOCATION */}



// <Pressable

// onPress={() =>
//  setPicker('location')
// }

// className="mt-3 flex-row items-center justify-between rounded-2xl bg-slate-50 p-4"

// >


// <Text

// className="font-bold text-slate-800"

// >

// Location

// </Text>



// <Text

// className="text-slate-500"

// >

// {
// location
// }

// </Text>


// </Pressable>





// </View>



// </View>

// );

// }

// // ===============================
// // PREVIEW UI
// // ===============================


// function renderPreview(){


// return (

// <View>

// <View
// className="mb-5 rounded-3xl bg-white p-5"
// >


// <Text

// className="text-xl font-black text-slate-900"

// >

// Preview News

// </Text>


// <Text

// className="mt-1 text-sm text-slate-500"

// >

// Review before submitting

// </Text>





// {
// imageUri && (

// <Image

// source={{
// uri:imageUri,
// }}

// className="mt-5 h-52 w-full rounded-3xl"

// resizeMode="cover"

// />

// )

// }






// <View

// className="mt-5 flex-row gap-2"

// >


// <View

// className="rounded-full bg-orange-50 px-4 py-2"

// >

// <Text

// className="font-bold text-primary"

// >

// {category}

// </Text>

// </View>



// <View

// className="rounded-full bg-blue-50 px-4 py-2"

// >

// <Text

// className="font-bold text-blue-600"

// >

// {newsType}

// </Text>


// </View>



// </View>







// <Text

// className="mt-5 text-2xl font-black text-slate-900"

// >

// {
// title ||
// 'News Title'
// }

// </Text>





// <Text

// className="mt-3 text-base leading-6 text-slate-600"

// >

// {
// description ||
// 'Description'
// }

// </Text>







// <View

// className="mt-5 flex-row items-center"

// >


// <Ionicons

// name="location-outline"

// size={18}

// color="#64748B"

// />


// <Text

// className="ml-2 font-semibold text-slate-500"

// >

// {location}

// </Text>


// </View>




// </View>


// </View>

// );

// }









// // ===============================
// // PUBLISH UI
// // ===============================


// function renderPublish(){


// return (

// <View

// className="rounded-3xl bg-white p-6"

// >


// <View

// className="items-center"

// >


// <View

// className="h-20 w-20 items-center justify-center rounded-full bg-orange-50"

// >

// <Ionicons

// name="checkmark-circle"

// size={48}

// color="#FF7A1A"

// />

// </View>





// <Text

// className="mt-5 text-xl font-black text-slate-900"

// >

// Ready to Publish

// </Text>




// <Text

// className="mt-2 text-center text-sm leading-5 text-slate-500"

// >

// Your news will be reviewed before going live.

// </Text>


// </View>





// <View

// className="mt-8 rounded-2xl bg-slate-50 p-5"

// >


// <Text

// className="font-black text-slate-800"

// >

// Publishing Process

// </Text>



// <Text

// className="mt-3 text-sm leading-6 text-slate-500"

// >

// • Submit your news

// {"\n"}

// • Admin verification

// {"\n"}

// • News becomes public

// </Text>


// </View>




// </View>

// );

// }








// // ===============================
// // STEP CONTENT
// // ===============================


// function renderStep(){


// switch(step){


// case 'content':

// return renderContent();



// case 'preview':

// return renderPreview();



// case 'publish':

// return renderPublish();



// }

// }








// // ===============================
// // PICKER DATA
// // ===============================


// function getPickerData(){


// switch(picker){


// case 'language':

// return LANGUAGES;



// case 'location':

// return LOCATIONS;



// default:

// return [];

// }


// }






// function selectPickerValue(
// value:string,
// ){


// if(picker === 'language'){

// setLanguage(
// value as NewsLanguage,
// );

// }


// if(picker === 'location'){

// setLocation(
// value as NewsLocation,
// );

// }


// setPicker(null);

// }







// // ===============================
// // FINAL RETURN
// // ===============================


// return (

// <SafeAreaView

// className="flex-1 bg-slate-50"

// >


// <KeyboardAvoidingView

// className="flex-1"

// behavior={
// Platform.OS === 'ios'
// ?
// 'padding'
// :
// undefined
// }

// >



// <ScrollView

// showsVerticalScrollIndicator={false}

// contentContainerStyle={{
// padding:16,
// paddingBottom:120,
// }}

// >


// {renderStep()}


// </ScrollView>







// {/* BOTTOM BUTTONS */}


// <View

// className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-slate-100 bg-white p-4"

// >





// {
// step !== 'content' && (

// <Pressable


// onPress={()=>{


// if(step === 'publish'){

// setStep('preview');

// }

// else{

// setStep('content');

// }


// }}


// className="flex-1 items-center rounded-2xl border border-slate-200 py-4"

// >


// <Text

// className="font-black text-slate-700"

// >

// Back

// </Text>


// </Pressable>


// )

// }






// <Pressable

// onPress={()=>{


// if(step === 'content'){


// setStep(
// 'preview'
// );


// }

// else if(step === 'preview'){


// setStep(
// 'publish'
// );


// }

// else{


// saveNews(
// 'publish'
// );


// }



// }}

// className="flex-1 items-center rounded-2xl bg-primary py-4"

// >


// <Text

// className="font-black text-white"

// >

// {
// step === 'publish'
// ?
// (
// isSaving
// ?
// 'Saving...'
// :
// 'Publish'
// )
// :
// 'Continue'
// }

// </Text>


// </Pressable>





// </View>







// {/* PICKER MODAL */}



// <Modal

// visible={
// picker !== null
// }

// transparent

// animationType="slide"

// >



// <Pressable

// onPress={()=>setPicker(null)}

// className="flex-1 justify-end bg-black/40"

// >



// <View

// className="rounded-t-3xl bg-white p-5"

// >


// <Text

// className="mb-4 text-lg font-black text-slate-900"

// >

// Select Option

// </Text>





// {
// getPickerData().map(
// (item:any)=>(


// <Pressable

// key={item.value}

// onPress={()=>selectPickerValue(item.value)}

// className="border-b border-slate-100 py-4"

// >


// <Text

// className="font-bold text-slate-800"

// >

// {item.label}

// </Text>


// </Pressable>


// )

// )

// }



// </View>



// </Pressable>


// </Modal>





// </KeyboardAvoidingView>


// </SafeAreaView>

// );

// }

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