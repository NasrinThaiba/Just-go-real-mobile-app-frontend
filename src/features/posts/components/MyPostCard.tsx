import {
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';



type MyPostCardProps = {

  item: FeedItem;

  isAdmin?: boolean;

  onDelete: (
    item: FeedItem,
  ) => void;

  onPublish: (
    item: FeedItem,
  ) => void;

  onUnpublish: (
    item: FeedItem,
  ) => void;

};



type StatusDetails = {

  label:string;

  containerClass:string;

  textClass:string;

};



const FALLBACK_IMAGE =
'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80';



function getStatusDetails(
  status:PostStatus,
):StatusDetails {


  switch(status){


    case 'published':

      return {

        label:'Published',

        containerClass:'bg-green-50',

        textClass:'text-green-700',

      };



    case 'unpublished':

      return {

        label:'Unpublished',

        containerClass:'bg-slate-100',

        textClass:'text-slate-600',

      };



    case 'rejected':

      return {

        label:'Rejected',

        containerClass:'bg-red-50',

        textClass:'text-red-700',

      };



    case 'draft':

      return {

        label:'Draft',

        containerClass:'bg-blue-50',

        textClass:'text-blue-700',

      };



    case 'pending':

    default:

      return {

        label:'Pending Approval',

        containerClass:'bg-amber-50',

        textClass:'text-amber-700',

      };


  }

}




export function MyPostCard({

  item,

  isAdmin = false,

  onDelete,

  onPublish,

  onUnpublish,

}:MyPostCardProps){


  const router = useRouter();



  const isVideo =
    item.type === 'video';



  const currentStatus =
    item.status ?? 'pending';



  const statusDetails =
    getStatusDetails(
      currentStatus,
    );



  const isPublished =
    currentStatus === 'published';



  const canTogglePublish =
    isAdmin &&
    currentStatus !== 'published';




  const imageUrl =
    item.thumbnailUrl?.trim() ||
    item.mediaUrl?.trim() ||
    FALLBACK_IMAGE;





  const openPost = ()=>{


    if(isVideo){

      router.push({

        pathname:'/video/[id]',

        params:{
          id:item.id,
        },

      });


      return;

    }



    router.push({

      pathname:'/article/[id]',

      params:{
        id:item.id,
      },

    });


  };






  const editPost = ()=>{


    if(isVideo){

      router.push({

        pathname:'/create-video',

        params:{

          id:item.id,

          mode:'edit',

        },

      });


      return;

    }



    router.push({

      pathname:'/create-news',

      params:{

        id:item.id,

        mode:'edit',

      },

    });


  };







  const handlePublishSwitch = (
    enabled:boolean,
  )=>{


    if(!isAdmin){

      return;

    }



    if(enabled){

      onPublish(item);

      return;

    }



    onUnpublish(item);


  };






  return (

    <View
      className="
      mb-4
      overflow-hidden
      rounded-2xl
      border
      border-borderSoft
      bg-white
      "
    >



      <Pressable

        onPress={openPost}

        className="flex-row active:opacity-75"

      >



        <View

          style={{

            width:130,

            minHeight:112,

            backgroundColor:'#E2E8F0',

          }}

        >


          <Image

            source={{
              uri:imageUrl,
            }}

            resizeMode="cover"

            style={{

              width:'100%',

              height:'100%',

            }}

          />



          {
            isVideo && (

              <View
                className="
                absolute
                inset-0
                items-center
                justify-center
                bg-black/20
                "
              >

                <View
                  className="
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  "
                >

                  <Ionicons

                    name="play"

                    size={21}

                    color="#fff"

                  />

                </View>


              </View>

            )
          }


        </View>





        <View
          className="
          flex-1
          p-4
          "
        >


          <View
            className="
            flex-row
            items-center
            justify-between
            "
          >


            <View
              className={`
              rounded-full
              px-3
              py-1.5

              ${
                isVideo
                ? 'bg-purple-50'
                : 'bg-blue-50'
              }
              `}
            >

              <Text
                className={`
                text-xs
                font-extrabold

                ${
                  isVideo
                  ? 'text-purple-700'
                  : 'text-blue-700'
                }
                `}
              >

                {
                  isVideo
                  ? 'VIDEO'
                  : 'NEWS'
                }

              </Text>


            </View>





            <View
              className={`
              rounded-full
              px-3
              py-1.5

              ${statusDetails.containerClass}
              `}
            >

              <Text
                className={`
                text-xs
                font-extrabold

                ${statusDetails.textClass}
                `}
              >

                {statusDetails.label}

              </Text>


            </View>


          </View>






          <Text

            numberOfLines={2}

            className="
            mt-4
            text-lg
            font-black
            leading-6
            text-textMain
            "

          >

            {item.title}

          </Text>






          <View
            className="
            mt-3
            flex-row
            items-center
            "
          >

            <Ionicons
              name="eye-outline"
              size={14}
              color="#667085"
            />


            <Text
              className="
              ml-1
              text-xs
              font-semibold
              text-textMuted
              "
            >

              {item.views ?? 0} views

            </Text>




            <View
              className="
              mx-2
              h-1
              w-1
              rounded-full
              bg-slate-400
              "
            />



            <Ionicons
              name="heart-outline"
              size={14}
              color="#667085"
            />



            <Text
              className="
              ml-1
              text-xs
              font-semibold
              text-textMuted
              "
            >

              {item.likes ?? 0} likes

            </Text>


          </View>



        </View>


      </Pressable>






      <View
        className="h-px bg-borderSoft"
      />






      <View
        className="flex-row"
      >



        <View
          className="
          flex-1
          flex-row
          items-center
          justify-center
          px-3
          py-3.5
          "
        >



          <Text
            className={`
            mr-3
            text-sm
            font-bold

            ${
              isPublished
              ? 'text-green-700'
              : 'text-textMuted'
            }
            `}
          >

            {
              isPublished
              ? 'Published'
              : 'Publish'
            }

          </Text>





          <Switch

            value={isPublished}

            disabled={!canTogglePublish}

            onValueChange={
              handlePublishSwitch
            }

            trackColor={{

              false:'#CBD5E1',

              true:'#86EFAC',

            }}

            thumbColor={

              isPublished
              ? '#16A34A'
              : '#F8FAFC'

            }

          />


        </View>





        <View
          className="w-px bg-borderSoft"
        />





        <Pressable

          onPress={editPost}

          disabled={isPublished}

          className={`
          flex-1
          flex-row
          items-center
          justify-center
          py-3.5

          ${
            isPublished
            ? 'opacity-40'
            : ''
          }
          `}

        >

          <Ionicons

            name="create-outline"

            size={19}

            color="#17336B"

          />


          <Text
            className="
            ml-2
            text-sm
            font-bold
            text-blue-900
            "
          >

            Edit

          </Text>


        </Pressable>





        <View
          className="w-px bg-borderSoft"
        />





        <Pressable

          onPress={()=>
            onDelete(item)
          }

          className="
          flex-1
          flex-row
          items-center
          justify-center
          py-3.5
          "

        >


          <Ionicons

            name="trash-outline"

            size={19}

            color="#DC2626"

          />


          <Text
            className="
            ml-2
            text-sm
            font-bold
            text-red-600
            "
          >

            Delete

          </Text>


        </Pressable>


      </View>






      {
        currentStatus === 'pending' && (

          <View
            className="
            border-t
            border-borderSoft
            bg-amber-50
            px-4
            py-3
            "
          >

            <Text
              className="
              text-xs
              font-semibold
              text-amber-700
              "
            >

              Waiting for admin approval.

            </Text>


          </View>

        )
      }




    </View>

  );

}