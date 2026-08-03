import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { FeedItem } from '@/features/news/types/news.types';
import { formatDate } from '@/utils/formatData';

export function NewsCard({
  item,
}: {
  item: FeedItem;
}) {
  const router = useRouter();

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const openItem = () => {
    router.push(
      item.type === 'video'
        ? ({
            pathname: '/video/[id]',
            params: {
              id: item.id,
            },
          } as never)
        : ({
            pathname: '/article/[id]',
            params: {
              id: item.id,
            },
          } as never),
    );
  };

  return (
    <Pressable
      onPress={openItem}
      className="mb-4 overflow-hidden rounded-2xl border border-borderSoft bg-white"
    >
      <View className="relative">
        <Image
          source={{
            uri:
              item.thumbnailUrl ??
              item.mediaUrl,
          }}
          resizeMode="cover"
          className="h-48 w-full bg-slate-100"
        />

        {item.type === 'video' ? (
          <View className="absolute inset-0 items-center justify-center bg-black/15">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-black/65">
              <Ionicons
                name="play"
                size={24}
                color="#FFFFFF"
              />
            </View>
          </View>
        ) : null}
      </View>

      <View className="p-4">
        <View className="self-start rounded-full bg-primarySoft px-2.5 py-1">
          <Text className="text-[10px] font-extrabold text-primary">
            {item.category}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className="mt-3 text-base font-extrabold leading-6 text-textMain"
        >
          {item.title}
        </Text>

        <Text className="mt-2 text-xs font-bold text-textMain">
          {item.author || 'Just Go Real'}
        </Text>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-[11px] text-textMuted">
            {formatDate(displayDate)} · {item.views ?? 0} views
          </Text>

          <View className="flex-row items-center gap-1">
            <Ionicons
              name="heart-outline"
              size={15}
              color="#667085"
            />

            <Text className="text-[11px] text-textMuted">
              {item.likes ?? 0}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}