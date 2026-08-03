import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { FeedItem } from '@/features/news/types/news.types';
import { formatRelativeDate } from '@/utils/formatData';

type NewsHorizontalCardProps = {
  item: FeedItem;
  language?: 'en' | 'ta';
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80';

export function NewsHorizontalCard({
  item,
  language = 'en',
}: NewsHorizontalCardProps) {
  const router = useRouter();

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const imageUrl =
    item.thumbnailUrl?.trim() ||
    item.mediaUrl?.trim() ||
    FALLBACK_IMAGE;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/article/[id]',
          params: {
            id: item.id,
          },
        })
      }
      className="mb-3 flex-row overflow-hidden rounded-2xl border border-borderSoft bg-white active:opacity-70"
    >
      <View
        style={{
          width: 132,
          height: 118,
          flexShrink: 0,
          backgroundColor: '#E2E8F0',
        }}
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
          onError={(event) => {
            console.log(
              'NEWS IMAGE ERROR:',
              item.id,
              imageUrl,
              event.nativeEvent,
            );
          }}
          onLoad={() => {
            console.log(
              'NEWS IMAGE LOADED:',
              item.id,
            );
          }}
        />
      </View>

      <View className="min-w-0 flex-1 justify-center px-3 py-3">
        {item.category ? (
          <Text
            numberOfLines={1}
            className="text-xs font-extrabold capitalize text-primary"
          >
            {item.category}
          </Text>
        ) : null}

        <Text
          numberOfLines={2}
          className="mt-1.5 text-[15px] font-black leading-5 text-textMain"
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1.5 text-xs font-semibold text-textMuted"
        >
          {item.author || 'Just Go Real'}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Ionicons
            name="time-outline"
            size={13}
            color="#667085"
          />

          <Text className="ml-1 text-[11px] text-textMuted">
            {formatRelativeDate(
              displayDate,
              language,
            )}
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-slate-400" />

          <Ionicons
            name="eye-outline"
            size={13}
            color="#667085"
          />

          <Text className="ml-1 text-[11px] text-textMuted">
            {item.views ?? 0}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}