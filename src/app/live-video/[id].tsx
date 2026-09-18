import { Ionicons } from '@expo/vector-icons';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';

import YoutubePlayer from 'react-native-youtube-iframe';


import { CommentButton } from '@/components/interactions/CommentButton';
import { FavoriteButton } from '@/components/interactions/FavoriteButton';
import { InlineComments } from '@/components/interactions/InlineComments';
import { ShareButton } from '@/components/interactions/ShareButton';


import {
  useCurrentInteractionUser,
} from '@/features/auth/hooks/useCurrentInteractionUser';

import {
  useContentInteractions,
} from '@/features/interactions/hooks/useContentInteractions';


import {
  useVideoDetails,
} from '@/features/videos/hooks/useVideoDetails';


import type {
  VideoItem,
} from '@/features/videos/types/videos.types';


import {
  useAppLanguage,
} from '@/hooks/useAppLanguage';


import {
  formatPublishedTime,
  formatViews,
} from '@/utils/content-formatters';



export default function LiveVideoDetailsScreen() {

  const router = useRouter();


  const {
    currentLanguage,
  } = useAppLanguage();



  const {
    id,
  } =
    useLocalSearchParams<{
      id?: string;
    }>();


  const videoId =
    typeof id === 'string'
      ? id
      : '';



  const {
    item: liveVideo,
    isLoading,
  } =
    useVideoDetails(
      videoId,
    );



  if (isLoading) {

    return (

      <SafeAreaView
        edges={[
          'top',
        ]}
        className="flex-1 items-center justify-center bg-white"
      >

        <Text className="text-sm font-semibold text-textMuted">

          Loading live video...

        </Text>

      </SafeAreaView>

    );

  }



  if (!liveVideo) {

    return (

      <SafeAreaView
        edges={[
          'top',
        ]}
        className="flex-1 bg-white"
      >

        <Pressable
          onPress={() =>
            router.back()
          }
          className="m-4 h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >

          <Ionicons
            name="arrow-back"
            size={22}
            color="#121826"
          />

        </Pressable>



        <View className="flex-1 items-center justify-center">

          <Ionicons
            name="radio-outline"
            size={44}
            color="#98A2B3"
          />


          <Text className="mt-4 text-lg font-black text-textMain">

            Live video not found

          </Text>

        </View>


      </SafeAreaView>

    );

  }



  return (

    <LiveVideoContent

      liveVideo={
        liveVideo
      }

      onBack={() =>
        router.back()
      }

      language={
        currentLanguage
      }

    />

  );

}




type LiveVideoContentProps = {

  liveVideo: VideoItem;

  onBack: () => void;

  language: 'en' | 'ta';

};




function LiveVideoContent({

  liveVideo,

  onBack,

  language,

}: LiveVideoContentProps) {


  const [
    showComments,
    setShowComments,
  ] = useState(false);



  const {
    currentUser,
    isLoading:
      isCurrentUserLoading,

  } =
    useCurrentInteractionUser();




  const {

    interaction,

    toggleFavorite,

    addComment,

    deleteComment,

  } =
    useContentInteractions(

      liveVideo.id,

      currentUser,

    );




  const totalFavorites =

    (liveVideo.likes ?? 0)

    +

    (
      interaction.isFavorite
        ? 1
        : 0
    );




  const displayDate =

    liveVideo.publishedAt

    ??

    liveVideo.createdAt;




  const handleFavorite =

    async () => {

      try {


        const updated =

          await toggleFavorite();



        Toast.show({

          type:
            'success',

          text1:

            updated.isFavorite

              ? 'Added to favorites'

              : 'Removed from favorites',

          position:
            'top',

          visibilityTime:
            1200,

        });



      } catch {


        Toast.show({

          type:
            'error',

          text1:
            'Unable to update favorite',

          position:
            'top',

        });


      }

    };




  return (

    <SafeAreaView

      edges={[
        'top',
      ]}

      className="flex-1 bg-white"

    >


      <ScrollView

        className="flex-1"

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps="handled"

        contentContainerStyle={{

          paddingBottom:
            40,

        }}

      >



        {/* Header */}

        <View className="flex-row items-center border-b border-slate-100 px-4 py-4">


          <Pressable

            onPress={onBack}

            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"

          >

            <Ionicons

              name="arrow-back"

              size={22}

              color="#121826"

            />

          </Pressable>



          <Text className="ml-3 flex-1 text-lg font-black text-textMain">

            Live News

          </Text>



          <View className="rounded-full bg-red-50 px-3 py-1.5">

            <Text className="text-xs font-black text-red-600">

              LIVE

            </Text>

          </View>


        </View>





        {/* Video */}

        <View className="bg-black">


          {
            liveVideo.youtubeVideoId

              ?

              (

                <YoutubePlayer

                  height={230}

                  play

                  videoId={
                    liveVideo.youtubeVideoId
                  }

                />

              )

              :

              (

                <View className="h-56 items-center justify-center">

                  <Ionicons

                    name="videocam-off-outline"

                    size={40}

                    color="#fff"

                  />


                  <Text className="mt-3 text-white">

                    Live stream unavailable

                  </Text>


                </View>

              )

          }


        </View>






        <View className="px-4 py-5">


          <Text className="text-2xl font-black text-textMain">

            {liveVideo.title}

          </Text>



          {
            liveVideo.description
              ?

              <Text className="mt-4 text-base text-slate-700">

                {
                  liveVideo.description
                }

              </Text>

              :

              null

          }




          <View className="mt-5 flex-row items-center">


            <Ionicons

              name="radio-outline"

              size={22}

              color="#F0442D"

            />


            <View className="ml-3">

              <Text className="font-bold text-textMain">

                {
                  liveVideo.author
                  ??
                  'Live News'
                }

              </Text>


              <Text className="text-xs text-textMuted">

                {
                  formatPublishedTime(
                    displayDate,
                  )
                }

                {' • '}

                {
                  formatViews(
                    liveVideo.views ?? 0,
                  )
                }

                {' views'}

              </Text>


            </View>


          </View>





          <View className="mt-8 flex-row justify-between border-t border-borderSoft pt-5">


            <FavoriteButton

              selected={
                interaction.isFavorite
              }

              count={
                totalFavorites
              }

              onPress={() =>
                void handleFavorite()
              }

            />



            <CommentButton

              count={
                interaction.comments.length
              }

              onPress={() =>
                setShowComments(
                  value =>
                    !value,
                )
              }

            />



            <ShareButton

              title={
                liveVideo.title
              }

              description={
                liveVideo.description
              }

            />


          </View>





          {
            showComments

              ?

              (

                <InlineComments

                  comments={
                    interaction.comments
                  }

                  language={
                    language
                  }

                  currentUserId={
                    currentUser?.id
                  }

                  isAdmin={
                    currentUser?.role ===
                    'admin'
                  }

                  isUserLoading={
                    isCurrentUserLoading
                  }

                  onAddComment={
                    addComment
                  }

                  onDeleteComment={
                    deleteComment
                  }

                />

              )

              :

              null

          }



        </View>



      </ScrollView>


    </SafeAreaView>


  );

}