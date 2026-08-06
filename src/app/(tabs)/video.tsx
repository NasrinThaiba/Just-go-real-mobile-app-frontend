// src/app/(tabs)/video.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/layout/AppHeader';
import { getPublisherImage } from '@/features/news/constants/publisher-images';
import { useNews } from '@/features/news/hooks/useNews';
import type { FeedItem } from '@/features/news/types/news.types';
import { useSavedContent } from '@/features/saved/context/SavedContext';
import { useAppLanguage } from '@/hooks/useAppLanguage';
import { formatPublishedTime, formatViews} from '@/utils/content-formatters';

type VideoCategory = {
  id: string;
  label: string;
  category: string;
};

const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'all',
    label: '#All',
    category: 'all',
  },
  {
    id: 'breaking',
    label: '#Breaking',
    category: 'breaking',
  },
  {
    id: 'live',
    label: '#Live',
    category: 'live',
  },
  {
    id: 'politics',
    label: '#Politics',
    category: 'politics',
  },
  {
    id: 'technology',
    label: '#Technology',
    category: 'technology',
  },
  {
    id: 'world',
    label: '#World',
    category: 'world',
  },
  {
    id: 'business',
    label: '#Business',
    category: 'business',
  },
  {
    id: 'sports',
    label: '#Sports',
    category: 'sports',
  },
  {
    id: 'cinema',
    label: '#Cinema',
    category: 'cinema',
  },
];

export default function VideoScreen() {
  const router = useRouter();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading,
    refetch,
  } = useNews(currentLanguage);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('all');

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const publishedVideos =
    useMemo(() => {
      return items.filter(
        (item) =>
          item.type === 'video' &&
          item.status === 'published',
      );
    }, [items]);

  const filteredVideos =
    useMemo(() => {
      if (
        selectedCategory === 'all'
      ) {
        return publishedVideos;
      }

      if (
        selectedCategory ===
        'breaking'
      ) {
        return publishedVideos.filter(
          (item) =>
            item.videoType ===
            'breaking',
        );
      }

      if (
        selectedCategory === 'live'
      ) {
        return publishedVideos.filter(
          (item) =>
            item.videoType ===
            'live',
        );
      }

      return publishedVideos.filter(
        (item) =>
          normalizeText(
            item.category,
          ) === selectedCategory,
      );
    }, [
      publishedVideos,
      selectedCategory,
    ]);

  const openVideo = (
    item: FeedItem,
  ) => {
    router.push({
      pathname: '/video/[id]',
      params: {
        id: item.id,
      },
    });
  };

  const handleRefresh =
    async () => {
      try {
        setIsRefreshing(true);

        await refetch?.();
      } finally {
        setIsRefreshing(false);
      }
    };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />
      <FlatList
        data={filteredVideos}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={() => {
              void handleRefresh();
            }}
            colors={['#F0442D']}
            tintColor="#F0442D"
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <>
            {/* Page title */}

            <View className="px-4 pb-1 pt-3">
              <View className="flex-row items-center">
                <Text className="text-[20px] font-black leading-9 text-slate-950">
                  Trending
                </Text>

                <Text className="ml-2 text-[20px] font-black leading-9 text-[#F0442D]">
                  Videos
                </Text>
              </View>
            </View>

            {/* Video categories */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingHorizontal: 14,
                paddingTop: 18,
                paddingBottom: 18,
                gap: 8,
              }}
            >
              {VIDEO_CATEGORIES.map(
                (category) => {
                  const isSelected =
                    selectedCategory ===
                    category.category;

                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => {
                        setSelectedCategory(
                          category.category,
                        );
                      }}
                      accessibilityRole="button"
                      className={`rounded-full border px-4 py-2 ${
                        isSelected
                          ? 'border-[#F0442D] bg-[#FFF1EE]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-[11px] font-black ${
                          isSelected
                            ? 'text-[#F0442D]'
                            : 'text-slate-600'
                        }`}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>

            {/* Section heading */}

            <View className="mb-4 flex-row items-center justify-between px-4">
              <Text className="text-lg font-black text-slate-950">
                Trending Videos
              </Text>

              <Text className="text-xs font-bold text-slate-500">
                {
                  filteredVideos.length
                }{' '}
                videos
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState />
          ) : (
            <EmptyVideoState
              selectedCategory={
                selectedCategory
              }
            />
          )
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <VideoNewsCard
              item={item}
              onPress={() =>
                openVideo(item)
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

type VideoNewsCardProps = {
  item: FeedItem;
  onPress: () => void;
};

function VideoNewsCard({
  item,
  onPress,
}: VideoNewsCardProps) {
  const {
    isSaved,
    toggleSaved,
  } = useSavedContent();

  const itemIsSaved =
    isSaved(item.id);

  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;

  const publisherName =
    item.author?.trim() ||
    'Video Publisher';

  const publisherImage =
    getPublisherImage(
      publisherName,
    );

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const isLive =
    item.videoType === 'live';

  const categoryLabel =
    getVideoCategoryLabel(item);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
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
      {/* Video thumbnail */}

      <View className="relative">
        <Image
          source={{
            uri: imageUrl,
          }}
          className="h-48 w-full bg-slate-200"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/20" />

        {/* Category overlay */}

        <View className="absolute left-4 top-4 max-w-[65%] rounded-full bg-white/95 px-3 py-1.5">
          <Text
            numberOfLines={1}
            className="text-[10px] font-black uppercase tracking-wide text-[#F0442D]"
          >
            {categoryLabel}
          </Text>
        </View>

        {/* Live badge */}

        {isLive ? (
          <View className="absolute right-4 top-4 flex-row items-center rounded-full bg-[#F0442D] px-3 py-1.5">
            <View className="mr-1.5 h-2 w-2 rounded-full bg-white" />

            <Text className="text-[10px] font-black uppercase text-white">
              Live
            </Text>
          </View>
        ) : null}

        {/* Play icon */}

        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <Ionicons
              name="play"
              size={27}
              color="#FFFFFF"
              style={{
                marginLeft: 3,
              }}
            />
          </View>
        </View>
      </View>

      {/* Video details */}

      <View className="p-4">
        {/* Description intentionally removed */}

        <Text
          numberOfLines={3}
          className="text-[18px] font-black leading-6 text-slate-950"
        >
          {item.title}
        </Text>

        {/* Publisher, time, views and bookmark */}

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
                  color="#64748B"
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
                ? 'Remove saved video'
                : 'Save video'
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

function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center px-8 py-24">
      <ActivityIndicator
        size="large"
        color="#F0442D"
      />

      <Text className="mt-4 text-sm font-semibold text-slate-500">
        Loading videos...
      </Text>
    </View>
  );
}

type EmptyVideoStateProps = {
  selectedCategory: string;
};

function EmptyVideoState({
  selectedCategory,
}: EmptyVideoStateProps) {
  const categoryName =
    selectedCategory === 'all'
      ? ''
      : selectedCategory;

  return (
    <View className="flex-1 items-center justify-center px-8 py-24">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-[#FFF1EE]">
        <Ionicons
          name="videocam-outline"
          size={36}
          color="#F0442D"
        />
      </View>

      <Text className="mt-5 text-lg font-black text-slate-950">
        No videos found
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
        {categoryName
          ? `No ${categoryName} videos are available.`
          : 'No published videos are available.'}
      </Text>
    </View>
  );
}

function getVideoCategoryLabel(
  item: FeedItem,
) {
  if (
    item.videoType === 'live'
  ) {
    return 'Live';
  }

  if (
    item.videoType ===
    'breaking'
  ) {
    return 'Breaking';
  }

  if (
    item.videoType ===
    'interview'
  ) {
    return 'Interview';
  }

  if (
    item.videoType === 'short'
  ) {
    return 'Short';
  }

  if (
    item.videoType ===
    'featured'
  ) {
    return 'Featured';
  }

  return (
    item.category?.trim() ||
    'Video'
  );
}

function normalizeText(
  value?: string,
) {
  return (
    value
      ?.trim()
      .toLowerCase() ?? ''
  );
}
