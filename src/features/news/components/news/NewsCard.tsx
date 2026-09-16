// src/features/news/components/news/NewsCard.tsx

import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useRouter,
} from 'expo-router';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

import {
  formatDate,
} from '@/utils/formatDate';


type NewsCardProps = {
  item: FeedItem;
};


export function NewsCard({
  item,
}: NewsCardProps) {

  const router =
    useRouter();


  const displayDate =
    item.publishedAt ??
    item.createdAt;


  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;


  const openNews = () => {

    router.push({
      pathname:
        '/article/[id]',

      params: {
        id: item.id,
      },
    });

  };


  return (

    <Pressable
      onPress={openNews}
      className="mb-4 overflow-hidden rounded-2xl border border-borderSoft bg-white"
    >

      <View className="relative">

        <Image
          source={{
            uri: imageUrl,
          }}
          resizeMode="cover"
          className="h-48 w-full bg-slate-100"
        />

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

            {formatDate(displayDate)}
            {' · '}
            {item.views ?? 0}
            {' views'}

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