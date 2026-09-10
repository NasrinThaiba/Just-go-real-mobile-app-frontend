import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';


import {
  EmptyState,
} from '@/components/ui/EmptyState';


import {
  MyPostCard,
} from '@/features/posts/components/MyPostCard';


import {
  PostSummary,
} from '@/features/posts/components/PostSummary';


import {
  type MyPostFilter,
  useMyPosts,
} from '@/features/posts/hooks/useMyPosts';


import {
  useProfile,
} from '@/features/profile/hooks/useProfile';


import {
  postsApi,
} from '@/features/posts/api/posts.api';


import type {
  FeedItem,
} from '@/features/news/types/news.types';




export function PostDashboard(){


  const router = useRouter();



  const {
    profile,
  } = useProfile();



  const isAdmin =
    profile?.role === 'admin';




  const {
    items,
    summary,
    isLoading,
    error,
    refetch,
  } = useMyPosts();





  const [
    activeFilter,
    setActiveFilter,
  ] =
  useState<MyPostFilter>('all');



  const [
    isRefreshing,
    setIsRefreshing,
  ] =
  useState(false);





  useFocusEffect(

    useCallback(()=>{

      void refetch();

    },[
      refetch,
    ])

  );





  const filteredItems =
    useMemo(()=>{


      if(
        activeFilter === 'all'
      ){

        return items;

      }



      return items.filter(
        item =>
          item.type === activeFilter,
      );


    },[
      activeFilter,
      items,
    ]);







  const refreshPosts =
    useCallback(
      async()=>{

        try{

          setIsRefreshing(true);

          await refetch();


        }
        finally{

          setIsRefreshing(false);

        }


      },
      [
        refetch,
      ],
    );








  // ============================
  // PUBLISH
  // ============================

  const handlePublish =
    useCallback(
      async(
        item:FeedItem,
      )=>{


        if(!isAdmin){

          Toast.show({

            type:'error',

            text1:
              'Admin access required',

            text2:
              'Only admin can publish posts.',

          });


          return;

        }



        try{


          await postsApi.updatePost(
            item.id,
            {
              status:
                'published',
            },
          );



          await refetch();



          Toast.show({

            type:'success',

            text1:
              'Post published',

          });


        }
        catch(error){


          console.log(
            "PUBLISH ERROR:",
            error,
          );


          Toast.show({

            type:'error',

            text1:
              'Publish failed',

          });


        }


      },
      [
        isAdmin,
        refetch,
      ],
    );









  // ============================
  // UNPUBLISH
  // ============================

  const handleUnpublish =
    useCallback(
      async(
        item:FeedItem,
      )=>{


        if(!isAdmin){

          return;

        }



        try{


          await postsApi.unpublishPost(
            item.id,
          );



          await refetch();



          Toast.show({

            type:'success',

            text1:
              'Post unpublished',

          });



        }
        catch(error){


          console.log(
            "UNPUBLISH ERROR:",
            error,
          );


        }


      },
      [
        isAdmin,
        refetch,
      ],
    );







  // ============================
  // DELETE
  // ============================


  const deletePost =
    useCallback(
      async(
        item:FeedItem,
      )=>{


        try{


          await postsApi.deletePost(
            item.id,
          );



          await refetch();



          Toast.show({

            type:'success',

            text1:
              'Post deleted',

          });



        }
        catch(error){


          console.log(
            "DELETE ERROR:",
            error,
          );


          Toast.show({

            type:'error',

            text1:
              'Delete failed',

          });


        }


      },
      [
        refetch,
      ],
    );







  const confirmDelete =
    useCallback(
      (
        item:FeedItem,
      )=>{


        Alert.alert(

          'Delete post',

          `Delete "${item.title}"?`,

          [

            {
              text:'Cancel',

              style:'cancel',

            },


            {

              text:'Delete',

              style:'destructive',

              onPress:()=>{

                void deletePost(
                  item,
                );

              },

            },

          ],

        );


      },
      [
        deletePost,
      ],
    );









  return (

    <SafeAreaView

      edges={[
        'top',
      ]}

      className="flex-1 bg-slate-50"

    >


      <View className="h-14 flex-row items-center border-b border-borderSoft bg-white px-4">


        <Pressable

          onPress={()=>
            router.back()
          }

          className="h-10 w-10 items-center justify-center rounded-full"

        >

          <Ionicons

            name="arrow-back"

            size={25}

            color="#121826"

          />

        </Pressable>



        <View className="ml-2 flex-1">

          <Text className="text-xl font-black text-textMain">

            My Posts

          </Text>

        </View>



        {
          isAdmin && (

            <View className="rounded-full bg-indigo-50 px-3 py-1.5">

              <Text className="text-xs font-extrabold text-indigo-700">

                ADMIN

              </Text>

            </View>

          )
        }


      </View>





      <FlatList


        data={filteredItems}


        keyExtractor={
          item =>
            item.id
        }



        renderItem={
          ({
            item,
          })=>(

            <MyPostCard

              item={item}

              isAdmin={isAdmin}

              onPublish={
                handlePublish
              }

              onUnpublish={
                handleUnpublish
              }

              onDelete={
                confirmDelete
              }

            />

          )
        }



        contentContainerStyle={{

          paddingHorizontal:16,

          paddingTop:18,

          paddingBottom:50,

          flexGrow:1,

        }}



        refreshControl={

          <RefreshControl

            refreshing={
              isRefreshing
            }

            onRefresh={
              refreshPosts
            }

          />

        }



        ListHeaderComponent={

          <>

            <PostSummary

              summary={summary}

              activeFilter={
                activeFilter
              }

              filteredCount={
                filteredItems.length
              }

              onFilterChange={
                setActiveFilter
              }

            />



            {
              isLoading && (

                <View className="items-center py-10">

                  <ActivityIndicator />

                  <Text className="mt-3">

                    Loading posts...

                  </Text>

                </View>

              )
            }



            {
              error && (

                <View className="rounded-xl bg-red-50 p-4">

                  <Text className="text-red-600">

                    {error}

                  </Text>

                </View>

              )
            }


          </>

        }



        ListEmptyComponent={

          !isLoading && !error

          ? (

            <EmptyState

              message="No posts available"

            />

          )

          : null

        }



        showsVerticalScrollIndicator={false}


      />


    </SafeAreaView>

  );

}