// src/app/(tabs)/news.tsx

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useMemo,
} from 'react';

import {
  useTranslation,
} from 'react-i18next';

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
  useTrendingNews,
} from '@/features/news/hooks/useTrendingNews';

import {
  useAppLanguage,
} from '@/hooks/useAppLanguage';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

export default function NewsScreen() {
  const router = useRouter();

  const { t } =
    useTranslation();

  // ============================================================
  // URL PARAMS
  // ============================================================

  const { type } =
    useLocalSearchParams<{
      type?: string | string[];
    }>();

  const selectedType =
    Array.isArray(type)
      ? type[0]
      : type;

  // ============================================================
  // LANGUAGE
  // ============================================================

  const {
    currentLanguage,
  } = useAppLanguage();

  // ============================================================
  // GENERAL NEWS
  //
  // GET /news
  // ============================================================

  const {
    items: allNews,
    isLoading: isNewsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNews(
    currentLanguage,
  );

  // ============================================================
  // BREAKING NEWS
  //
  // GET /news/breaking
  // ============================================================

  const {
    items: breakingNews,
    isLoading: isBreakingLoading,
    error: breakingError,
  } = useBreakingNews(
    currentLanguage,
  );

  // ============================================================
  // TRENDING NEWS
  //
  // GET /news/trending
  // ============================================================

  const {
    items: trendingNews,
    isLoading: isTrendingLoading,
    error: trendingError,
  } = useTrendingNews(
    currentLanguage,
  );

  // ============================================================
  // VIEW TYPE
  // ============================================================

  const isBreakingView =
    selectedType === 'breaking';

  const isTrendingView =
    selectedType === 'trending';

  // ============================================================
  // SELECT DATA FOR CURRENT SCREEN
  // ============================================================

  const newsItems =
    useMemo(() => {
      let result: FeedItem[] = [];

      if (isBreakingView) {
        result = breakingNews;
      } else if (isTrendingView) {
        result = trendingNews;
      } else {
        result = allNews;
      }

      return result
        .filter(
          (item) =>
            item.type === 'news' &&
            item.status === 'published' &&
            item.language ===
              currentLanguage,
        )
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
    }, [
      allNews,
      breakingNews,
      trendingNews,
      currentLanguage,
      isBreakingView,
      isTrendingView,
    ]);

  // ============================================================
  // CURRENT LOADING STATE
  // ============================================================

  const isLoading =
    isBreakingView
      ? isBreakingLoading
      : isTrendingView
        ? isTrendingLoading
        : isNewsLoading;

  // ============================================================
  // CURRENT ERROR
  // ============================================================

  const error =
    isBreakingView
      ? breakingError
      : isTrendingView
        ? trendingError
        : newsError;

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh =
    () => {
      void refetchNews();
    };

  // ============================================================
  // OPEN NEWS
  // ============================================================

  const openNews = (
    item: FeedItem,
  ) => {
    router.push({
      pathname:
        '/article/[id]',
      params: {
        id: item.id,
      },
    });
  };

  // ============================================================
  // CLEAR FILTER
  // ============================================================

  const clearFilter =
    () => {
      router.replace('/news');
    };

  // ============================================================
  // TITLE
  // ============================================================

  const screenTitle =
  isBreakingView
    ? 'Breaking News'
    : isTrendingView
      ? 'Trending News'
      : 'Latest News';

  // ============================================================
  // EMPTY MESSAGE
  // ============================================================

  const emptyMessage =
    isBreakingView
      ? 'No breaking news available'
      : isTrendingView
        ? 'No trending news available'
        : 'No news available';

  // ============================================================
  // SCREEN
  // ============================================================

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

      <View className="flex-row items-center px-4 pb-3 pt-2">

        {(isBreakingView ||
          isTrendingView) ? (
          <Pressable
            onPress={
              clearFilter
            }
            hitSlop={10}
            className="mr-2 h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#121826"
            />
          </Pressable>
        ) : null}

        <View className="flex-1">

          <Text className="text-2xl font-black text-textMain">
            {screenTitle}
          </Text>

          <Text className="mt-1 text-sm text-textMuted">
            {newsItems.length}{' '}
            {newsItems.length ===
            1
              ? 'article'
              : 'articles'}
          </Text>

        </View>

      </View>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error ? (
        <View className="mx-4 mb-3 rounded-2xl border border-red-100 bg-red-50 p-4">

          <Text className="font-bold text-red-700">
            {error}
          </Text>

          <Pressable
            onPress={
              handleRefresh
            }
            className="mt-3 self-start rounded-xl bg-red-600 px-4 py-2"
          >
            <Text className="font-bold text-white">
              Retry
            </Text>
          </Pressable>

        </View>
      ) : null}

      {/* ======================================================
          NEWS LIST
      ====================================================== */}

      <FlatList
        data={newsItems}

        keyExtractor={(
          item,
        ) =>
          item.id
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

        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-20">

              <ActivityIndicator
                size="large"
                color="#F0442D"
              />

              <Text className="mt-3 text-sm font-semibold text-textMuted">
                Loading news...
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

        renderItem={({
          item,
        }) => (
          <Pressable
            onPress={() =>
              openNews(
                item,
              )
            }
            className="active:opacity-75"
          >
            <NewsHorizontalCard
              item={item}
            />
          </Pressable>
        )}
      />

    </SafeAreaView>
  );
}