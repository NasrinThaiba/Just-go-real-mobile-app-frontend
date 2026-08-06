// src/app/(tabs)/saved.tsx

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
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/AppHeader';
import { getPublisherImage } from '@/features/news/constants/publisher-images';
import type { FeedItem } from '@/features/news/types/news.types';
import { useSavedContent } from '@/features/saved/context/SavedContext';
import {
  formatPublishedTime,
  formatViews,
} from '@/utils/content-formatters';

type SavedTab = 'news' | 'videos';

export default function SavedScreen() {
  const router = useRouter();

  const [
    activeTab,
    setActiveTab,
  ] = useState<SavedTab>('news');

  const {
    savedNews,
    savedVideos,
    isLoading,
    removeSaved,
  } = useSavedContent();

  const activeItems =
    useMemo(() => {
      return activeTab === 'news'
        ? savedNews
        : savedVideos;
    }, [
      activeTab,
      savedNews,
      savedVideos,
    ]);

  const openItem = (
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

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-[#F8F9FB]"
    >
      <View className="flex-1">
        <AppHeader />

        {/* Page title */}

        <View className="bg-white px-4 pb-3 pt-3">
          <View className="flex-row items-center">
            <Text className="text-[22px] font-black leading-8 text-slate-950">
              Saved
            </Text>

            <Text className="ml-2 text-[22px] font-black leading-8 text-[#F0442D]">
              Content
            </Text>
          </View>

          <Text className="mt-1 text-xs font-medium text-slate-500">
            Your saved news and videos
          </Text>
        </View>

        {/* Tabs */}

        <View className="bg-white px-4 pb-4">
          <View className="flex-row rounded-2xl bg-slate-100 p-1">
            <SavedTabButton
              label={`News (${savedNews.length})`}
              icon="newspaper-outline"
              isActive={
                activeTab === 'news'
              }
              onPress={() =>
                setActiveTab('news')
              }
            />

            <SavedTabButton
              label={`Videos (${savedVideos.length})`}
              icon="play-circle-outline"
              isActive={
                activeTab === 'videos'
              }
              onPress={() =>
                setActiveTab('videos')
              }
            />
          </View>
        </View>

        {/* Content */}

        {isLoading ? (
          <LoadingSavedState />
        ) : activeItems.length === 0 ? (
          <EmptySavedState
            activeTab={activeTab}
          />
        ) : (
          <FlatList
            data={activeItems}
            keyExtractor={(item) =>
              item.id
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 16,
              paddingBottom: 40,
            }}
            ItemSeparatorComponent={() => (
              <View className="h-4" />
            )}
            renderItem={({ item }) =>
              item.type === 'news' ? (
                <SavedNewsCard
                  item={item}
                  onPress={() =>
                    openItem(item)
                  }
                  onRemove={() => {
                    void removeSaved(
                      item.id,
                    );
                  }}
                />
              ) : (
                <SavedVideoCard
                  item={item}
                  onPress={() =>
                    openItem(item)
                  }
                  onRemove={() => {
                    void removeSaved(
                      item.id,
                    );
                  }}
                />
              )
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

type SavedTabButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
};

function SavedTabButton({
  label,
  icon,
  isActive,
  onPress,
}: SavedTabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`flex-1 flex-row items-center justify-center rounded-xl py-3 ${
        isActive
          ? 'bg-white'
          : 'bg-transparent'
      }`}
      style={
        isActive
          ? {
              shadowColor: '#101828',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }
          : undefined
      }
    >
      <Ionicons
        name={icon}
        size={18}
        color={
          isActive
            ? '#F0442D'
            : '#667085'
        }
      />

      <Text
        className={`ml-2 text-xs font-black ${
          isActive
            ? 'text-[#F0442D]'
            : 'text-slate-500'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type SavedNewsCardProps = {
  item: FeedItem;
  onPress: () => void;
  onRemove: () => void;
};

function SavedNewsCard({
  item,
  onPress,
  onRemove,
}: SavedNewsCardProps) {
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

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row overflow-hidden rounded-[22px] border border-slate-100 bg-white p-3 active:opacity-80"
      style={{
        shadowColor: '#101828',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Thumbnail */}

      <Image
        source={{
          uri: imageUrl,
        }}
        className="h-[132px] w-[118px] rounded-[18px] bg-slate-100"
        resizeMode="cover"
      />

      {/* Content */}

      <View className="ml-3 flex-1">
        {/* Category + unsave */}

        <View className="flex-row items-start justify-between">
          <View className="max-w-[68%] rounded-lg bg-[#FFF1EE] px-2.5 py-1">
            <Text
              numberOfLines={1}
              className="text-[9px] font-black uppercase tracking-wide text-[#F0442D]"
            >
              {item.category}
            </Text>
          </View>

          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Remove from saved"
            className="h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-[#FFF7F5] active:bg-red-100"
          >
            <Ionicons
              name="bookmark"
              size={18}
              color="#F0442D"
            />
          </Pressable>
        </View>

        {/* Title */}

        <Text
          numberOfLines={3}
          className="mt-2 text-[14px] font-black leading-5 text-slate-950"
        >
          {item.title}
        </Text>

        {/* Publisher */}

        <View className="mt-auto flex-row items-center pt-3">
          <Image
            source={{
              uri: publisherImage,
            }}
            className="h-8 w-8 rounded-full bg-slate-200"
            resizeMode="cover"
          />

          <View className="ml-2 flex-1">
            <Text
              numberOfLines={1}
              className="text-[11px] font-extrabold text-slate-900"
            >
              {publisherName}
            </Text>

            <View className="mt-1 flex-row items-center">
              <Text className="text-[10px] font-semibold text-slate-500">
                {formatPublishedTime(
                  displayDate,
                )}
              </Text>

              <View className="mx-2 h-1 w-1 rounded-full bg-slate-300" />

              <Ionicons
                name="eye-outline"
                size={12}
                color="#667085"
              />

              <Text className="ml-1 text-[10px] font-semibold text-slate-500">
                {formatViews(
                  item.views ?? 0,
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

type SavedVideoCardProps = {
  item: FeedItem;
  onPress: () => void;
  onRemove: () => void;
};

function SavedVideoCard({
  item,
  onPress,
  onRemove,
}: SavedVideoCardProps) {
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
    isLive
      ? 'Live'
      : item.category?.trim() ||
        'Video';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="overflow-hidden rounded-[22px] border border-slate-100 bg-white active:opacity-80"
      style={{
        shadowColor: '#101828',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Video thumbnail */}

      <View className="relative">
        <Image
          source={{
            uri: imageUrl,
          }}
          className="h-48 w-full bg-slate-100"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/25" />

        {/* Category */}

        <View className="absolute left-4 top-4 rounded-lg bg-white/95 px-2.5 py-1">
          <Text className="text-[9px] font-black uppercase tracking-wide text-[#F0442D]">
            {categoryLabel}
          </Text>
        </View>

        {/* Unsave */}

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Remove saved video"
          className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white/95 active:bg-red-50"
        >
          <Ionicons
            name="bookmark"
            size={19}
            color="#F0442D"
          />
        </Pressable>

        {/* Play */}

        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/60">
            <Ionicons
              name="play"
              size={26}
              color="#FFFFFF"
              style={{
                marginLeft: 3,
              }}
            />
          </View>
        </View>
      </View>

      {/* Video content */}

      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-[15px] font-black leading-5 text-slate-950"
        >
          {item.title}
        </Text>

        <View className="mt-4 flex-row items-center">
          <Image
            source={{
              uri: publisherImage,
            }}
            className="h-9 w-9 rounded-full bg-slate-200"
            resizeMode="cover"
          />

          <View className="ml-3 flex-1">
            <Text
              numberOfLines={1}
              className="text-[12px] font-extrabold text-slate-900"
            >
              {publisherName}
            </Text>

            <View className="mt-1 flex-row items-center">
              <Text className="text-[10px] font-semibold text-slate-500">
                {formatPublishedTime(
                  displayDate,
                )}
              </Text>

              <View className="mx-2 h-1 w-1 rounded-full bg-slate-300" />

               <Text className="text-[10px] font-semibold text-slate-500">
                {formatViews(
                  item.views ?? 0,
                )}{' '}
                views
              </Text>
            </View>
          </View>
        </View>

      </View>
    </Pressable>
  );
}

function LoadingSavedState() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator
        size="large"
        color="#F0442D"
      />

      <Text className="mt-3 text-sm font-semibold text-slate-500">
        Loading saved items...
      </Text>
    </View>
  );
}

type EmptySavedStateProps = {
  activeTab: SavedTab;
};

function EmptySavedState({
  activeTab,
}: EmptySavedStateProps) {
  const isNewsTab =
    activeTab === 'news';

  return (
    <View className="flex-1 items-center justify-center px-8 pb-20">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-[#FFF1EE]">
        <Ionicons
          name={
            isNewsTab
              ? 'newspaper-outline'
              : 'play-circle-outline'
          }
          size={42}
          color="#F0442D"
        />
      </View>

      <Text className="mt-6 text-xl font-black text-slate-950">
        {isNewsTab
          ? 'No saved news'
          : 'No saved videos'}
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
        {isNewsTab
          ? 'Save news articles and read them later from this screen.'
          : 'Save videos and watch them later from this screen.'}
      </Text>
    </View>
  );
}