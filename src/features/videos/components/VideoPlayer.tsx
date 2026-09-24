import { View } from 'react-native';
import { useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubePlayer from 'react-native-youtube-iframe';


// types
type VideoPlayerProps = {
  mediaUrl:string;
  videoSource?:'direct' | 'youtube';
  youtubeVideoId?:string;
  height?:number;
  autoPlay?:boolean;
};


// extract function
function extractYouTubeVideoId(value?:string){
   // updated regex here
}


// Direct video component
function DirectVideoPlayer({
 uri,
 height,
 autoPlay
}:{
 uri:string;
 height:number;
 autoPlay:boolean;
}){

 const player = useVideoPlayer(uri,(player)=>{
   player.loop=false;

   if(autoPlay){
     player.play();
   }
 });


 return(
   <VideoView
     player={player}
     nativeControls
     style={{
       width:'100%',
       height,
       backgroundColor:'#000'
     }}
   />
 );
}



// YOUR UPDATED COMPONENT HERE
export function VideoPlayer({

 mediaUrl,
 videoSource='direct',
 youtubeVideoId,
 height=300,
 autoPlay=false

}:VideoPlayerProps){


 const [youtubeReady,setYoutubeReady]=useState(false);


 const resolvedYouTubeVideoId =
   youtubeVideoId ?? extractYouTubeVideoId(mediaUrl);



 const isYouTubeVideo =
   videoSource === 'youtube' ||
   Boolean(resolvedYouTubeVideoId);



 if(isYouTubeVideo && resolvedYouTubeVideoId){

   return(
     <View
       style={{
        width:'100%',
        height,
        backgroundColor:'#000'
       }}
     >

       <YoutubePlayer
        height={height}
        videoId={resolvedYouTubeVideoId}

        play={false}

        onReady={()=>{
          console.log("Youtube ready");
        }}

        webViewProps={{
          allowsInlineMediaPlayback:true,
          javaScriptEnabled:true,
          domStorageEnabled:true,
          originWhitelist:[
            '*'
          ],
        }}

        webViewStyle={{
          backgroundColor:"#000"
        }}

        initialPlayerParams={{
          controls:true,
          modestbranding:true,
          rel:false,
        }}
      />

     </View>
   );

 }


 return(
   <DirectVideoPlayer
     uri={mediaUrl}
     height={height}
     autoPlay={autoPlay}
   />
 );

}