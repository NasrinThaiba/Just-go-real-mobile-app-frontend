import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BreakingCarousel from '@/components/breaking/BreakingCarousel';
import { AppHeader } from '@/components/layout/AppHeader';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { LoadingView } from '@/components/ui/LoadingView';

import { useAds } from '@/features/ads/hooks/useAds';
import { useBreakingNews } from '@/features/news/hooks/useBreakingNews';
import { useNews } from '@/features/news/hooks/useNews';
import type { FeedItem } from '@/features/news/types/news.types';

import { useAppLanguage } from '@/hooks/useAppLanguage';
import { getPublisherImage } from '@/features/news/constants/publisher-images';
import { useSavedContent } from '@/features/saved/context/SavedContext';

import type { SupportedLanguage } from '@/types/common.types';
import { formatPublishedTime, formatViews } from '@/utils/content-formatters';

type CategoryItem = {
  id: string;
  label: string;
  image: string;
};

const categories: CategoryItem[] = [
  {
    id: 'politics',
    label: 'Politics',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=700',
  },
  {
    id: 'science',
    label: 'Science',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700',
  },
  {
    id: 'technology',
    label: 'Technology',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700',
  },
  {
    id: 'sports',
    label: 'Sports',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=700',
  },
  {
    id: 'business',
    label: 'Business',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700',
  },
  {
    id: 'cinema',
    label: 'Cinema',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const [drawerVisible, setDrawerVisible] =
    useState(false);

  const { currentLanguage } =
    useAppLanguage();

  const {
    items: breakingNews,
    isLoading: isBreakingLoading,
    error: breakingError,
  } = useBreakingNews(currentLanguage);

  const {
    businessNews,
    scienceNews,
    sportsNews,
  } = useNews(currentLanguage);

  const { topAds } = useAds();

  const appLanguage =
    i18n.resolvedLanguage === 'ta'
      ? 'ta'
      : 'en';

  const latestNews = useMemo(() => {
    const combinedNews = [
      ...businessNews,
      ...scienceNews,
      ...sportsNews,
    ];

    const uniqueNews =
      combinedNews.filter(
        (
          item,
          index,
          collection,
        ) =>
          collection.findIndex(
            (newsItem) =>
              newsItem.id === item.id,
          ) === index,
      );

    return uniqueNews
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
      })
      .slice(0, 5);
  }, [
    businessNews,
    scienceNews,
    sportsNews,
  ]);

  const openContent = (
    item: FeedItem,
  ) => {
    if (item.type === 'video') {
      router.push({
        pathname: '/video/[id]',
        params: {
          id: item.id,
        },
      });

      return;
    }

    router.push({
      pathname: '/article/[id]',
      params: {
        id: item.id,
      },
    });
  };

  const openCategory = (
    category: string,
  ) => {
    router.push({
      pathname: '/news',
      params: {
        category,
      },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <SideDrawer
        visible={drawerVisible}
        onClose={() =>
          setDrawerVisible(false)
        }
      />

      <AppHeader
        onMenuPress={() =>
          setDrawerVisible(true)
        }
      />

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Top advertisement */}

        {/* <View className="mt-4">
          <ImageAd
            ads={topAds}
            size="top"
          />
        </View> */}

        {/* Advertisement dots */}

        {/* {topAds.length > 1 ? (
          <View className="mt-3 flex-row items-center justify-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
          </View>
        ) : null} */}

        {/* Breaking news */}

        <SectionHeader
          title="Breaking News"
          onViewAll={() => {
            router.navigate({
              pathname: '/news',
              params: {
                type: 'breaking',
              },
            });
          }}
        />

        {isBreakingLoading ? (
          <View className="h-64 items-center justify-center">
            <LoadingView message="Loading breaking news..." />
          </View>
        ) : breakingError ? (
          <View className="rounded-2xl bg-red-50 p-4">
            <Text className="text-sm font-semibold text-red-600">
              {breakingError}
            </Text>
          </View>
        ) : breakingNews.length >
          0 ? (
          <BreakingCarousel
            news={breakingNews}
          />
        ) : (
          <View className="rounded-2xl bg-slate-50 px-4 py-10">
            <Text className="text-center text-sm font-semibold text-textMuted">
              No breaking news available
            </Text>
          </View>
        )}

        {/* Categories */}

        <View className="mt-7">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-xl font-black text-textMain">
              Categories
            </Text>

            <Pressable
              onPress={() =>
                router.push('/categories')
              }
              hitSlop={10}
              className="flex-row items-center"
            >
              <Text className="text-sm font-bold text-primary">
                View All
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="#F0442D"
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingRight: 14,
            }}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() =>
                  openCategory(
                    category.label,
                  )
                }
                className="h-32 w-28 overflow-hidden rounded-2xl bg-slate-900 active:opacity-80"
              >
                <Image
                  source={{
                    uri: category.image,
                  }}
                  resizeMode="cover"
                  className="h-full w-full"
                />

                <View className="absolute inset-0 bg-black/35" />

                <View className="absolute bottom-0 left-0 right-0 p-3">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-black text-white"
                  >
                    {category.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Latest news */}

        <SectionHeader
          title="Latest News"
          className="mt-7"
          onViewAll={() => {
            router.navigate('/news');
          }}
        />

        <View>
          {latestNews.length > 0 ? (
            latestNews.map(
              (item) => (
                <LatestNewsItem
                  key={item.id}
                  item={item}
                  language={
                    appLanguage
                  }
                  onPress={() =>
                    openContent(item)
                  }
                />
              ),
            )
          ) : (
            <View className="rounded-2xl bg-slate-50 px-4 py-10">
              <Text className="text-center text-sm font-semibold text-textMuted">
                No latest news available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionHeaderProps = {
  title: string;
  onViewAll: () => void;
  className?: string;
};

function SectionHeader({
  title,
  onViewAll,
  className = '',
}: SectionHeaderProps) {
  return (
    <View
      className={`mb-3 mt-6 flex-row items-center justify-between ${className}`}
    >
      <Text className="text-xl font-black text-textMain">
        {title}
      </Text>

      <Pressable
        onPress={onViewAll}
        hitSlop={8}
      >
        <Text className="text-sm font-bold text-primary">
          View All
        </Text>
      </Pressable>
    </View>
  );
}

type LatestNewsItemProps = {
  item: FeedItem;
  language: SupportedLanguage;
  onPress: () => void;
};

function LatestNewsItem({
  item,
  language,
  onPress,
}: LatestNewsItemProps) {
  const {
    isSaved,
    toggleSaved,
  } = useSavedContent();

  const itemIsSaved =
    isSaved(item.id);

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;

  const publisherName =
    item.author?.trim() ||
    'News Publisher';

  const publisherImage =
    getPublisherImage(
      publisherName,
    );

  return (
    <Pressable
      onPress={onPress}
      className="mb-5 overflow-hidden rounded-[22px] border border-slate-100 bg-white active:opacity-80"
      style={{
        shadowColor: '#101828',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* News image */}

      <View className="relative">
        <Image
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          className="h-44 w-full bg-slate-100"
        />

        <View className="absolute inset-0 bg-black/10" />

        {/* Category overlay */}

        <View className="absolute left-4 top-4 max-w-[70%] rounded-full bg-white/95 px-3 py-1.5">
          <Text
            numberOfLines={1}
            className="text-[10px] font-black uppercase tracking-wide text-[#F0442D]"
          >
            {item.category}
          </Text>
        </View>
      </View>

      {/* News content */}

      <View className="p-4">
        <Text
          numberOfLines={3}
          className="text-[16px] font-extrabold leading-5 text-textMain"
        >
          {item.title}
        </Text>

        {/* Publisher details and save button */}

        <View className="mt-4 flex-row items-center">
          <Image
            source={{
              uri: publisherImage,
            }}
            resizeMode="cover"
            className="h-10 w-10 rounded-full bg-slate-200"
          />

          <View className="ml-3 flex-1">
            <Text
              numberOfLines={1}
              className="text-[13px] font-extrabold tracking-wide text-[#F0442D]"
            >
              {publisherName}
            </Text>

            <View className="mt-1.5 flex-row items-center">
              {/* Time */}

              <View className="flex-row items-center rounded-full bg-slate-100 px-2.5 py-1">
                <Ionicons
                  name="time-outline"
                  size={12}
                  color="#64748B"
                />

                <Text className="ml-1 text-[10px] font-bold text-slate-600">
                  {formatPublishedTime(
                    displayDate,
                  )}
                </Text>
              </View>

              {/* Views */}

              <View className="ml-2 flex-row items-center rounded-full bg-[#FFF1EE] px-2.5 py-1">
                <Ionicons
                  name="eye-outline"
                  size={12}
                  color="#F0442D"
                />

                <Text className="ml-1 text-[10px] font-bold text-[#F0442D]">
                  {formatViews(
                    item.views ?? 0,
                  )}{' '}
                  views
                </Text>
              </View>
            </View>
          </View>

          {/* Save button */}

          <Pressable
            hitSlop={10}
            onPress={(event) => {
              event.stopPropagation();

              void toggleSaved(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              itemIsSaved
                ? 'Remove from saved'
                : 'Save news'
            }
            className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-[#FFF1EE]"
          >
            <Ionicons
              name={
                itemIsSaved
                  ? 'bookmark'
                  : 'bookmark-outline'
              }
              size={21}
              color={
                itemIsSaved
                  ? '#F0442D'
                  : '#667085'
              }
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}