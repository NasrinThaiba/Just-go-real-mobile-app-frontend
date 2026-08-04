// src/app/(tabs)/news.tsx

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { NewsHorizontalCard } from '@/features/news/components/news/NewsHorizontalCard';

import { useNews } from '@/features/news/hooks/useNews';
import { usePublishedNews } from '@/features/news/hooks/usePublishedNews';
import { useAppLanguage } from '@/hooks/useAppLanguage';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

export default function NewsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { type } =
    useLocalSearchParams<{
      type?: string | string[];
    }>();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading: isNewsLoading,
  } = useNews(currentLanguage);

  const {
    news: publishedLocalNews,
    isLoading:
      isPublishedNewsLoading,
    isRefreshing,
    error,
    refetch,
  } = usePublishedNews();

  const selectedType =
    Array.isArray(type)
      ? type[0]
      : type;

  const isBreakingView =
    selectedType === 'breaking';

  const newsItems =
    useMemo(() => {
      const existingPublishedNews =
        items.filter(
          (item) =>
            item.type ===
              'news' &&
            item.status ===
              'published',
        );

      const mergedNews: FeedItem[] =
        [
          ...publishedLocalNews,

          ...existingPublishedNews.filter(
            (existingItem) =>
              !publishedLocalNews.some(
                (localItem) =>
                  localItem.id ===
                  existingItem.id,
              ),
          ),
        ];

      return mergedNews
        .filter((item) => {
          const matchesLanguage =
            !item.language ||
            item.language ===
              currentLanguage;

          const matchesType =
            isBreakingView
              ? item.newsType ===
                'breaking'
              : true;

          return (
            item.type ===
              'news' &&
            item.status ===
              'published' &&
            matchesLanguage &&
            matchesType
          );
        })
        .sort(
          (first, second) => {
            const firstDate =
              first.publishedAt ??
              first.createdAt ??
              0;

            const secondDate =
              second.publishedAt ??
              second.createdAt ??
              0;

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
      items,
      publishedLocalNews,
      currentLanguage,
      isBreakingView,
    ]);

  const isLoading =
    isNewsLoading ||
    isPublishedNewsLoading;

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

  const clearBreakingFilter =
    () => {
      router.replace('/news');
    };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <View className="flex-row items-center px-4 pb-3 pt-2">
        {isBreakingView ? (
          <Pressable
            onPress={
              clearBreakingFilter
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
            {isBreakingView
              ? 'Breaking News'
              : t('tabs.news')}
          </Text>

          <Text className="mt-1 text-sm text-textMuted">
            {newsItems.length}{' '}
            {newsItems.length === 1
              ? 'article'
              : 'articles'}
          </Text>
        </View>
      </View>

      {error ? (
        <View className="mx-4 mb-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <Text className="font-bold text-red-700">
            {error}
          </Text>

          <Pressable
            onPress={() => {
              void refetch();
            }}
            className="mt-3 self-start rounded-xl bg-red-600 px-4 py-2"
          >
            <Text className="font-bold text-white">
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={newsItems}
        keyExtractor={(item) =>
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
        refreshing={isRefreshing}
        onRefresh={() => {
          void refetch();
        }}
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
                isBreakingView
                  ? 'No breaking news available'
                  : 'No news available'
              }
            />
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              openNews(item)
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