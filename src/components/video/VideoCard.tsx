import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { FeedItem } from '@/features/news/types/news.types';
import { formatRelativeDate } from '@/utils/formatData';

type VideoCardProps = {
  item: FeedItem;
  language: 'en' | 'ta';
  onPress: () => void;
};

export function VideoCard({
  item,
  language,
  onPress,
}: VideoCardProps) {
  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const thumbnailUri =
    item.thumbnailUrl ??
    item.mediaUrl;

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl border border-borderSoft bg-white active:opacity-80"
    >
      <View className="relative h-48 w-full bg-slate-100">
        <Image
          source={{
            uri: thumbnailUri,
          }}
          resizeMode="cover"
          className="h-full w-full"
        />

        <View className="absolute inset-0 items-center justify-center bg-black/15">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-black/65">
            <Ionicons
              name="play"
              size={24}
              color="#FFFFFF"
              style={{
                marginLeft: 2,
              }}
            />
          </View>
        </View>

        {item.videoType ? (
          <View className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1.5">
            <Text className="text-xs font-extrabold capitalize text-white">
              {item.videoType}
            </Text>
          </View>
        ) : null}

        {item.videoSource === 'youtube' ? (
          <View className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-red-600">
            <Ionicons
              name="logo-youtube"
              size={18}
              color="#FFFFFF"
            />
          </View>
        ) : null}
      </View>

      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-base font-black leading-6 text-textMain"
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

        <View className="mt-3 flex-row items-center">
          <Ionicons
            name="time-outline"
            size={14}
            color="#667085"
          />

          <Text className="ml-1 text-xs font-semibold text-textMuted">
            {formatRelativeDate(
              displayDate,
              language,
            )}
          </Text>

          {item.location ? (
            <>
              <View className="mx-2 h-1 w-1 rounded-full bg-slate-400" />

              <Ionicons
                name="location-outline"
                size={14}
                color="#667085"
              />

              <Text
                numberOfLines={1}
                className="ml-1 flex-1 text-xs font-semibold capitalize text-textMuted"
              >
                {item.location.replace(/-/g, ' ')}
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
