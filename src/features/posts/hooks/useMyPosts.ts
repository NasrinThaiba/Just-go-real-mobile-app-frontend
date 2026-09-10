import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import {
  postsApi,
} from '@/features/posts/api/posts.api';



export type MyPostFilter =
  | 'all'
  | 'news'
  | 'video';



export function useMyPosts() {


  const [
    items,
    setItems,
  ] = useState<FeedItem[]>([]);



  const [
    isLoading,
    setIsLoading,
  ] = useState(true);



  const [
    error,
    setError,
  ] = useState<string | null>(null);




  // ===============================
  // LOAD POSTS FROM BACKEND
  // ===============================

  const loadPosts =
    useCallback(
      async()=>{

        try{


          setIsLoading(true);

          setError(null);



          const createdNews =
            await postsApi.getMyPosts();



          const allPosts =
            Array.isArray(createdNews)
              ? createdNews.sort(
                  (
                    first,
                    second,
                  )=>{


                    const firstDate =
                      new Date(
                        first.createdAt,
                      ).getTime();



                    const secondDate =
                      new Date(
                        second.createdAt,
                      ).getTime();



                    return (
                      secondDate -
                      firstDate
                    );

                  },
                )
              : [];




          setItems(
            allPosts,
          );



        }
        catch(loadError){


          console.error(
            'Failed to load posts:',
            loadError,
          );


          setError(
            'Unable to load your posts.',
          );


        }
        finally{


          setIsLoading(false);


        }


      },
      [],
    );





  useEffect(()=>{

    void loadPosts();

  },[
    loadPosts,
  ]);







  // ===============================
  // SUMMARY
  // ===============================


  const summary =
    useMemo(
      ()=>{


        return {


          totalPosts:
            items.length,



          totalNews:
            items.filter(
              item =>
                item.type === 'news',
            ).length,



          totalVideos:
            items.filter(
              item =>
                item.type === 'video',
            ).length,



          totalFavorites:
            items.reduce(
              (
                total,
                item,
              )=>
                total +
                (item.likes ?? 0),

              0,
            ),



          totalViews:
            items.reduce(
              (
                total,
                item,
              )=>

                total +
                (item.views ?? 0),

              0,
            ),


        };


      },
      [
        items,
      ],
    );





  return {


    items,


    summary,


    isLoading,


    error,


    refetch:
      loadPosts,


  };


}