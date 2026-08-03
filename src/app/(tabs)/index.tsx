import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import ImageAd from '@/components/ads/ImageAd';
import BreakingCarousel from '@/components/breaking/BreakingCarousel';
import { AppHeader } from '@/components/layout/AppHeader';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { LoadingView } from '@/components/ui/LoadingView';

import { useAds } from '@/features/ads/hooks/useAds';
import { useBreakingNews } from '@/features/news/hooks/useBreakingNews';
import { useNews } from '@/features/news/hooks/useNews';
import type { FeedItem } from '@/features/news/types/news.types';

import { useAppLanguage } from '@/hooks/useAppLanguage';
import { formatRelativeDate } from '@/utils/formatData';

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

        <View className="mt-4">
          <ImageAd
            ads={topAds}
            size="top"
          />
        </View>

        {/* Advertisement dots */}

        {topAds.length > 1 ? (
          <View className="mt-3 flex-row items-center justify-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
            <View className="h-2 w-2 rounded-full bg-slate-300" />
          </View>
        ) : null}

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
                    openNews(item)
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
  language: 'en' | 'ta';
  onPress: () => void;
};

function LatestNewsItem({
  item,
  language,
  onPress,
}: LatestNewsItemProps) {
  const displayDate =
    item.publishedAt ??
    item.createdAt;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row border-b border-borderSoft py-3 active:opacity-70"
    >
      <Image
        source={{
          uri: item.mediaUrl,
        }}
        resizeMode="cover"
        className="h-[82px] w-24 rounded-xl bg-slate-100"
      />

      <View className="ml-3 flex-1 justify-center">
        <Text
          numberOfLines={2}
          className="text-[15px] font-black leading-5 text-textMain"
        >
          {item.title}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Text
            numberOfLines={1}
            className="max-w-[45%] text-xs font-semibold capitalize text-textMuted"
          >
            {item.category}
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-slate-400" />

          <Text className="text-xs font-semibold text-textMuted">
            {formatRelativeDate(
              displayDate,
              language,
            )}
          </Text>
        </View>
      </View>

      <Pressable
        hitSlop={10}
        className="ml-1 h-9 w-8 items-center justify-center"
      >
        <Ionicons
          name="ellipsis-vertical"
          size={18}
          color="#667085"
        />
      </Pressable>
    </Pressable>
  );
}