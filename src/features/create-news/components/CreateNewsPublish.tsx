import {
  Pressable,
  Text,
  View,
} from "react-native";


import {
  Ionicons,
} from "@expo/vector-icons";





type Props = {

  loading:boolean;

  onBack:()=>void;

  onPublish:()=>void;

};







export default function CreateNewsPublish({

loading,

onBack,

onPublish,

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

Publish News

</Text>



<Text

className="mt-2 text-sm text-slate-500"

>

Submit your news for approval

</Text>



</View>









{/* SUCCESS CARD */}



<View

className="items-center rounded-3xl bg-white p-6"

>



<View

className="h-24 w-24 items-center justify-center rounded-full bg-orange-50"

>


<Ionicons

name="checkmark-circle"

size={60}

color="#F97316"

/>


</View>






<Text

className="mt-6 text-center text-2xl font-black text-slate-900"

>

Ready to Publish

</Text>





<Text

className="mt-3 text-center leading-6 text-slate-500"

>

Your news will be reviewed before it becomes visible to users.

</Text>




</View>









{/* PROCESS CARD */}



<View

className="mt-5 rounded-3xl bg-white p-5"

>


<Text

className="text-lg font-black text-slate-900"

>

Publishing Process

</Text>






<View

className="mt-5 gap-4"

>




<StepItem

icon="create-outline"

title="Submit your news"

description="Your content will be sent to admin review"

/>





<StepItem

icon="shield-checkmark-outline"

title="Admin verification"

description="Our team checks your content quality"

/>






<StepItem

icon="globe-outline"

title="News goes live"

description="Approved news will be visible publicly"

/>






</View>



</View>









{/* IMPORTANT */}


<View

className="mt-5 rounded-2xl bg-blue-50 p-4"

>


<View

className="flex-row items-center"

>

<Ionicons

name="information-circle-outline"

size={22}

color="#2563EB"

/>



<Text

className="ml-2 font-black text-blue-700"

>

Important

</Text>



</View>




<Text

className="mt-2 text-sm leading-5 text-blue-700"

>

Make sure all information is correct before submitting.

</Text>




</View>









{/* BUTTONS */}



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

Back

</Text>


</Pressable>









<Pressable

disabled={loading}

onPress={onPublish}

className="flex-1 items-center rounded-2xl bg-orange-500 py-4"

>


<Text

className="font-black text-white"

>

{

loading

?

"Publishing..."

:

"Publish News"

}

</Text>


</Pressable>







</View>





</View>

);

}









function StepItem({

icon,

title,

description,

}:{

icon:any;

title:string;

description:string;

}){


return (

<View

className="flex-row items-center"

>


<View

className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-50"

>


<Ionicons

name={icon}

size={24}

color="#F97316"

/>


</View>





<View

className="ml-4 flex-1"

>


<Text

className="font-black text-slate-900"

>

{title}

</Text>



<Text

className="mt-1 text-sm text-slate-500"

>

{description}

</Text>


</View>




</View>

);

}