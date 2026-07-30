import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type { FeedItem } from '@/features/news/types/news.types';

export function NewsHorizontalCard({
  item,
}: {
  item: FeedItem;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push(
          item.type === 'video'
            ? ({
                pathname: '/video/[id]',
                params: { id: item.id },
              } as never)
            : ({
                pathname: '/article/[id]',
                params: { id: item.id },
              } as never),
        )
      }
      className="mb-3 min-h-28 flex-row overflow-hidden rounded-2xl border border-borderSoft bg-white"
    >
      <View className="relative w-32">
        <Image
          source={{
            uri: item.thumbnailUrl || item.mediaUrl,
          }}
          resizeMode="cover"
          className="h-full w-full bg-slate-100"
        />

        {item.type === 'video' ? (
          <View className="absolute inset-0 items-center justify-center bg-black/15">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-black/65">
              <Ionicons name="play" size={18} color="#FFFFFF" />
            </View>
          </View>
        ) : null}
      </View>

      <View className="flex-1 justify-center p-3">
        <Text className="text-[10px] font-extrabold text-primary">
          {item.category}
        </Text>

        <Text
          numberOfLines={3}
          className="mt-1 font-extrabold leading-5 text-textMain"
        >
          {item.title}
        </Text>

        <Text className="mt-2 text-xs text-textMuted">
          {item.author}
        </Text>
      </View>
    </Pressable>
  );
}
