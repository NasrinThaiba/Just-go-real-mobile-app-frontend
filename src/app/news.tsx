import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useEffect,
  useMemo,
  useState,
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

import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { NewsHorizontalCard } from '@/features/news/components/news/NewsHorizontalCard';
import { useNews } from '@/features/news/hooks/useNews';
import { usePublishedNews } from '@/features/news/hooks/usePublishedNews';
import type { FeedItem } from '@/features/news/types/news.types';
import { useAppLanguage } from '@/hooks/useAppLanguage';

const ALL_CATEGORY = 'All';

export default function NewsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    type,
    category,
  } = useLocalSearchParams<{
    type?: string | string[];
    category?: string | string[];
  }>();

  const routeType = Array.isArray(type)
    ? type[0]
    : type;

  const routeCategory = Array.isArray(category)
    ? category[0]
    : category;

  const [selectedCategory, setSelectedCategory] =
    useState(routeCategory || ALL_CATEGORY);

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading: isNewsLoading,
  } = useNews(currentLanguage);

  const {
    news: publishedLocalNews,
    isLoading: isPublishedNewsLoading,
    isRefreshing,
    error,
    refetch,
  } = usePublishedNews();

  const isBreakingView =
    routeType === 'breaking';

  useEffect(() => {
    setSelectedCategory(
      routeCategory || ALL_CATEGORY,
    );
  }, [routeCategory]);

  const mergedPublishedNews =
    useMemo<FeedItem[]>(() => {
      const existingPublishedNews =
        items.filter(
          (item) =>
            item.type === 'news' &&
            item.status === 'published',
        );

      const uniqueExistingNews =
        existingPublishedNews.filter(
          (existingItem) =>
            !publishedLocalNews.some(
              (publishedItem) =>
                publishedItem.id ===
                existingItem.id,
            ),
        );

      return [
        ...publishedLocalNews,
        ...uniqueExistingNews,
      ];
    }, [
      items,
      publishedLocalNews,
    ]);

  const baseNewsItems =
    useMemo(() => {
      return mergedPublishedNews.filter(
        (item) => {
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
            item.type === 'news' &&
            item.status ===
              'published' &&
            matchesLanguage &&
            matchesType
          );
        },
      );
    }, [
      mergedPublishedNews,
      currentLanguage,
      isBreakingView,
    ]);

  const categories =
    useMemo(() => {
      const uniqueCategories =
        Array.from(
          new Set(
            baseNewsItems
              .map((item) =>
                item.category.trim(),
              )
              .filter(Boolean),
          ),
        ).sort((first, second) =>
          first.localeCompare(second),
        );

      return [
        ALL_CATEGORY,
        ...uniqueCategories,
      ];
    }, [baseNewsItems]);

  const newsItems =
    useMemo(() => {
      const normalizedSelectedCategory =
        selectedCategory
          .trim()
          .toLowerCase();

      return baseNewsItems
        .filter((item) => {
          if (
            selectedCategory ===
            ALL_CATEGORY
          ) {
            return true;
          }

          return (
            item.category
              .trim()
              .toLowerCase() ===
            normalizedSelectedCategory
          );
        })
        .sort((first, second) => {
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
        });
    }, [
      baseNewsItems,
      selectedCategory,
    ]);

  const isLoading =
    isNewsLoading ||
    isPublishedNewsLoading;

  const openNews = (
    item: FeedItem,
  ) => {
    router.push({
      pathname: '/article/[id]',
      params: {
        id: item.id,
      },
    });
  };

  const clearBreakingFilter = () => {
    setSelectedCategory(
      ALL_CATEGORY,
    );

    router.replace('/news');
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      {/* Heading */}
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
              : t('tabs.news', {
                  defaultValue:
                    'News',
                })}
          </Text>

          <Text className="mt-1 text-sm text-textMuted">
            {newsItems.length}{' '}
            {newsItems.length === 1
              ? 'article'
              : 'articles'}
          </Text>
        </View>
      </View>

      {/* Category chips */}
      <View className="h-12">
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) =>
            item
          }
          style={{
            flexGrow: 0,
          }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 6,
            alignItems: 'center',
            gap: 8,
          }}
          showsHorizontalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const isSelected =
              selectedCategory
                .trim()
                .toLowerCase() ===
              item
                .trim()
                .toLowerCase();

            return (
              <Pressable
                onPress={() =>
                  setSelectedCategory(
                    item,
                  )
                }
                className={`h-9 items-center justify-center rounded-full border px-5 ${
                  isSelected
                    ? 'border-[#F0442D] bg-[#F0442D]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text
                  numberOfLines={1}
                  className={`text-xs font-bold capitalize ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Error */}
      {error ? (
        <View className="mx-4 mb-3 mt-2 rounded-2xl border border-red-100 bg-red-50 p-4">
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

      {/* News list */}
      <FlatList
        data={newsItems}
        keyExtractor={(item) =>
          item.id
        }
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
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
                selectedCategory ===
                ALL_CATEGORY
                  ? isBreakingView
                    ? 'No breaking news available'
                    : 'No news available'
                  : `No ${selectedCategory} news available`
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