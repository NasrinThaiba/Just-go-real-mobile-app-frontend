// src/app/(tabs)/news.tsx

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useMemo,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  AppHeader,
} from '@/components/layout/AppHeader';

import {
  EmptyState,
} from '@/components/ui/EmptyState';

import {
  NewsHorizontalCard,
} from '@/features/news/components/news/NewsHorizontalCard';

import {
  useNews,
} from '@/features/news/hooks/useNews';

import {
  useBreakingNews,
} from '@/features/news/hooks/useBreakingNews';

import {
  useBreakingVideos,
} from '@/features/videos/hooks/useBreakingVideos';

import {
  useAppLanguage,
} from '@/hooks/useAppLanguage';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import type {
  VideoItem,
} from '@/features/videos/types/videos.types';


// ============================================================
// COMBINED BREAKING ITEM
// ============================================================

type BreakingFeedItem =
  | FeedItem
  | VideoItem;


// ============================================================
// SCREEN
// ============================================================

export default function NewsScreen() {

  const router =
    useRouter();


  // ==========================================================
  // URL PARAMS
  // ==========================================================

  const { type } =
    useLocalSearchParams<{
      type?: string | string[];
    }>();


  const selectedType =
    Array.isArray(type)
      ? type[0]
      : type;


  // ==========================================================
  // LANGUAGE
  // ==========================================================

  const {
    currentLanguage,
  } =
    useAppLanguage();


  // ==========================================================
  // ALL NEWS
  // ==========================================================

  const {
    items: allNews,

    isLoading:
      isNewsLoading,

    error:
      newsError,

    refetch:
      refetchNews,

  } =
    useNews(
      currentLanguage,
    );


  // ==========================================================
  // BREAKING NEWS
  // ==========================================================

  const {
    items: breakingNews,

    isLoading:
      isBreakingLoading,

    error:
      breakingError,

    refetch:
      refetchBreakingNews,

  } =
    useBreakingNews(
      currentLanguage,
    );


  // ==========================================================
  // BREAKING VIDEOS
  // ==========================================================

  const {
    items: breakingVideos,

    isLoading:
      isBreakingVideosLoading,

    error:
      breakingVideosError,

    refetch:
      refetchBreakingVideos,

  } =
    useBreakingVideos(
      currentLanguage,
    );


  // ==========================================================
  // VIEW TYPE
  // ==========================================================

  const isBreakingView =
    selectedType === 'breaking';


  // ==========================================================
  // COMBINE DATA
  //
  // Breaking page:
  //
  //     Breaking News
  //     +
  //     Breaking Videos
  //
  // Latest page:
  //
  //     Latest News
  // ==========================================================

  const newsItems =
    useMemo(
      (): BreakingFeedItem[] => {

        let result:
          BreakingFeedItem[];


        // ======================================================
        // BREAKING
        // ======================================================

        if (isBreakingView) {

          result = [
            ...breakingNews,
            ...breakingVideos,
          ];

        }

        // ======================================================
        // LATEST NEWS
        // ======================================================

        else {

          result = [
            ...allNews,
          ];

        }


        // ======================================================
        // FILTER
        // ======================================================

        return result

          .filter(
            (item) => {

              // Published only
              if (
                item.status !==
                'published'
              ) {
                return false;
              }


              // Current language only
              if (
                item.language !==
                currentLanguage
              ) {
                return false;
              }


              // Breaking view:
              // allow both news and videos
              if (isBreakingView) {

                return (
                  item.type ===
                    'news' ||
                  item.type ===
                    'video'
                );

              }


              // Latest view:
              // news only
              return (
                item.type ===
                'news'
              );

            },
          )

          // ====================================================
          // NEWEST FIRST
          // ====================================================

          .sort(
            (
              first,
              second,
            ) => {

              const firstDate =
                first.publishedAt ??
                first.createdAt;


              const secondDate =
                second.publishedAt ??
                second.createdAt;


              return (
                new Date(
                  secondDate,
                ).getTime() -
                new Date(
                  firstDate,
                ).getTime()
              );

            },
          );

      },
      [
        allNews,

        breakingNews,

        breakingVideos,

        currentLanguage,

        isBreakingView,
      ],
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  const isLoading =
    isBreakingView

      ? (
          isBreakingLoading ||
          isBreakingVideosLoading
        )

      : isNewsLoading;


  // ==========================================================
  // ERROR
  // ==========================================================

  const error =
    isBreakingView

      ? (
          breakingError ||
          breakingVideosError
        )

      : newsError;


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh =
    () => {

      if (isBreakingView) {

        void Promise.all([
          refetchBreakingNews(),
          refetchBreakingVideos(),
        ]);

        return;
      }


      void refetchNews();

    };


  // ==========================================================
  // OPEN CONTENT
  // ==========================================================

  const openContent =
    (
      item: BreakingFeedItem,
    ) => {

      // ========================================================
      // VIDEO
      // ========================================================

      if (
        item.type ===
        'video'
      ) {

        router.push({
          pathname:
            '/video/[id]',

          params: {
            id: item.id,
          },
        });

        return;
      }


      // ========================================================
      // NEWS
      // ========================================================

      router.push({
        pathname:
          '/article/[id]',

        params: {
          id: item.id,
        },
      });

    };


  // ==========================================================
  // CLEAR FILTER
  // ==========================================================

  const clearFilter =
    () => {

      router.replace(
        '/news',
      );

    };


  // ==========================================================
  // TITLE
  // ==========================================================

  const screenTitle =
    isBreakingView
      ? 'Breaking News'
      : 'Latest News';


  // ==========================================================
  // EMPTY MESSAGE
  // ==========================================================

  const emptyMessage =
    isBreakingView
      ? 'No breaking news or videos available'
      : 'No news available';


  // ==========================================================
  // SCREEN
  // ==========================================================

  return (

    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <AppHeader />


      {/* ======================================================
          TITLE
      ====================================================== */}

      <View
        className="
          flex-row
          items-center
          px-4
          pb-3
          pt-2
        "
      >

        {/* ====================================================
            BACK BUTTON
        ==================================================== */}

        {isBreakingView ? (

          <Pressable
            onPress={
              clearFilter
            }

            hitSlop={10}

            className="
              mr-2
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              active:bg-slate-100
            "
          >

            <Ionicons
              name="arrow-back"
              size={23}
              color="#121826"
            />

          </Pressable>

        ) : null}


        {/* ====================================================
            TITLE
        ==================================================== */}

        <View
          className="flex-1"
        >

          <Text
            className="
              text-2xl
              font-black
              text-textMain
            "
          >
            {screenTitle}
          </Text>


          <Text
            className="
              mt-1
              text-sm
              text-textMuted
            "
          >

            {newsItems.length}{' '}

            {newsItems.length === 1
              ? 'item'
              : 'items'}

          </Text>

        </View>

      </View>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error ? (

        <View
          className="
            mx-4
            mb-3
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-4
          "
        >

          <Text
            className="
              font-bold
              text-red-700
            "
          >
            {error}
          </Text>


          <Pressable
            onPress={
              handleRefresh
            }

            className="
              mt-3
              self-start
              rounded-xl
              bg-red-600
              px-4
              py-2
            "
          >

            <Text
              className="
                font-bold
                text-white
              "
            >
              Retry
            </Text>

          </Pressable>

        </View>

      ) : null}


      {/* ======================================================
          CONTENT LIST
      ====================================================== */}

      <FlatList<BreakingFeedItem>

        data={
          newsItems
        }


        keyExtractor={(
          item,
        ) =>
          `${item.type}-${item.id}`
        }


        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 40,
          flexGrow: 1,
        }}


        showsVerticalScrollIndicator={
          false
        }


        refreshing={
          isLoading
        }


        onRefresh={
          handleRefresh
        }


        // ====================================================
        // EMPTY / LOADING
        // ====================================================

        ListEmptyComponent={

          isLoading ? (

            <View
              className="
                flex-1
                items-center
                justify-center
                py-20
              "
            >

              <ActivityIndicator
                size="large"
                color="#F0442D"
              />


              <Text
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-textMuted
                "
              >
                Loading...
              </Text>

            </View>

          ) : (

            <EmptyState
              message={
                emptyMessage
              }
            />

          )

        }


        // ====================================================
        // RENDER ITEM
        // ====================================================

        renderItem={({
          item,
        }) => (

          <Pressable
            onPress={() =>
              openContent(
                item,
              )
            }

            className="
              active:opacity-75
            "
          >

            {/* =================================================
                NEWS
                ================================================= */}

            {item.type === 'news' ? (

              <NewsHorizontalCard
                item={
                  item
                }
              />

            ) : (

              /* ===============================================
                 VIDEO

                 IMPORTANT:
                 Replace this with your actual video card
                 component if you already have one.
                 =============================================== */

              <View
                className="
                  mb-3
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                "
              >

                <View
                  className="
                    aspect-video
                    items-center
                    justify-center
                    bg-slate-900
                  "
                >

                  <Ionicons
                    name="play-circle"
                    size={52}
                    color="#FFFFFF"
                  />

                </View>


                <View
                  className="p-4"
                >

                  <Text
                    numberOfLines={2}
                    className="
                      text-base
                      font-bold
                      text-textMain
                    "
                  >
                    {item.title}
                  </Text>


                  {item.description ? (

                    <Text
                      numberOfLines={2}
                      className="
                        mt-1
                        text-sm
                        text-textMuted
                      "
                    >
                      {item.description}
                    </Text>

                  ) : null}

                </View>

              </View>

            )}

          </Pressable>

        )}

      />

    </SafeAreaView>

  );

}