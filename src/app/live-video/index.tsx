import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/ui/EmptyState';
import { useNews } from '@/features/news/hooks/useNews';
import type { FeedItem } from '@/features/news/types/news.types';
import { useAppLanguage } from '@/hooks/useAppLanguage';
import {
  formatPublishedTime,
  formatViews,
} from '@/utils/content-formatters';

export default function LiveVideoIndexScreen() {
  const router = useRouter();

  const {
    currentLanguage,
  } = useAppLanguage();

  const {
    items,
    isLoading,
  } = useNews(currentLanguage);

  const liveVideos =
    useMemo(() => {
      return items
        .filter((item) => {
          const isLiveVideo =
            item.type === 'video' &&
            item.videoType === 'live';

          const isPublished =
            item.status ===
            'published';

          const matchesLanguage =
            !item.language ||
            item.language ===
              currentLanguage;

          return (
            isLiveVideo &&
            isPublished &&
            matchesLanguage
          );
        })
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
      items,
      currentLanguage,
    ]);

  const openLiveVideo = (
    item: FeedItem,
  ) => {
    router.push({
      pathname:
        '/live-video/[id]',
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
      {/* Header */}

      <View className="flex-row items-center border-b border-slate-100 px-4 py-4">
        <Pressable
          onPress={() =>
            router.back()
          }
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#121826"
          />
        </Pressable>

        <View className="ml-3 flex-1">
          <Text className="text-xl font-black text-textMain">
            Live News
          </Text>

          <Text className="mt-1 text-xs font-semibold text-textMuted">
            Watch live coverage and updates
          </Text>
        </View>

        <View className="flex-row items-center rounded-full bg-red-50 px-3 py-1.5">
          <View className="mr-2 h-2 w-2 rounded-full bg-red-500" />

          <Text className="text-[11px] font-black text-red-600">
            {liveVideos.length} LIVE
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#F0442D"
          />

          <Text className="mt-3 text-sm font-semibold text-textMuted">
            Loading live news...
          </Text>
        </View>
      ) : liveVideos.length ===
        0 ? (
        <View className="flex-1 px-4 pt-10">
          <EmptyState message="No live news available" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          {liveVideos.map(
            (item) => (
              <LiveVideoCard
                key={item.id}
                item={item}
                onPress={() =>
                  openLiveVideo(
                    item,
                  )
                }
              />
            ),
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type LiveVideoCardProps = {
  item: FeedItem;
  onPress: () => void;
};

function LiveVideoCard({
  item,
  onPress,
}: LiveVideoCardProps) {
  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const publisherName =
    item.author?.trim() ||
    'Live News';

  return (
    <Pressable
      onPress={onPress}
      className="mb-5 overflow-hidden rounded-[22px] border border-slate-100 bg-white active:opacity-85"
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
      {/* Thumbnail */}

      <View className="relative">
        <Image
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          className="h-52 w-full bg-slate-200"
        />

        <View className="absolute inset-0 bg-black/30" />

        {/* Live badge */}

        <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-[#F0442D] px-3 py-1.5">
          <View className="mr-2 h-2 w-2 rounded-full bg-white" />

          <Text className="text-[11px] font-black text-white">
            LIVE
          </Text>
        </View>

        {/* Play */}

        <View className="absolute inset-0 items-center justify-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white/95">
            <Ionicons
              name="play"
              size={27}
              color="#F0442D"
              style={{
                marginLeft: 3,
              }}
            />
          </View>
        </View>

        {/* Views */}

        <View className="absolute bottom-4 right-4 flex-row items-center rounded-full bg-black/55 px-3 py-1.5">
          <Ionicons
            name="eye-outline"
            size={13}
            color="#FFFFFF"
          />

          <Text className="ml-1.5 text-[11px] font-bold text-white">
            {formatViews(
              item.views ?? 0,
            )}
          </Text>
        </View>
      </View>

      {/* Details */}

      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-[16px] font-black leading-6 text-textMain"
        >
          {item.title}
        </Text>

        {item.description ? (
          <Text
            numberOfLines={2}
            className="mt-2 text-sm leading-5 text-textMuted"
          >
            {item.description}
          </Text>
        ) : null}

        <View className="mt-4 flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFF1EE]">
            <Ionicons
              name="radio-outline"
              size={18}
              color="#F0442D"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text
              numberOfLines={1}
              className="text-xs font-extrabold text-[#F0442D]"
            >
              {publisherName}
            </Text>

            <Text className="mt-1 text-[11px] font-semibold text-textMuted">
              {formatPublishedTime(
                displayDate,
              )}
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-red-50 px-2.5 py-1.5">
            <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />

            <Text className="text-[10px] font-black text-red-600">
              LIVE NOW
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}