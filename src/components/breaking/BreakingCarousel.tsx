import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { BreakingVideoSlide } from '@/components/breaking/BreakingVideoSlide';
import { CONFIG } from '@/constants/config';
import type { FeedItem } from '@/features/news/types/news.types';

type BreakingCarouselProps = {
  news: FeedItem[];
};

export default function BreakingCarousel({
  news,
}: BreakingCarouselProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList<FeedItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideWidth = Math.max(width - 32, 0);

  const moveToIndex = useCallback(
    (nextIndex: number) => {
      if (!news.length) {
        return;
      }

      const normalizedIndex =
        (nextIndex + news.length) % news.length;

      listRef.current?.scrollToIndex({
        index: normalizedIndex,
        animated: true,
      });

      setActiveIndex(normalizedIndex);
    },
    [news.length],
  );

  useEffect(() => {
    if (news.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      moveToIndex(activeIndex + 1);
    }, CONFIG.breakingIntervalMs);

    return () => clearInterval(interval);
  }, [activeIndex, moveToIndex, news.length]);

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (!slideWidth) {
      return;
    }

    const index = Math.round(
      event.nativeEvent.contentOffset.x / slideWidth,
    );

    setActiveIndex(index);
  };

  if (!news.length) {
    return null;
  }

  return (
    <View className="relative">
      <View className="mb-2 flex-row items-center gap-1.5">
        <View className="h-2 w-2 rounded-full bg-red-500" />

        <Text className="text-xs font-extrabold text-red-500">
          {t('home.breaking')}
        </Text>
      </View>

      <View className="overflow-hidden rounded-2xl">
        <FlatList
          ref={listRef}
          data={news}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, index) => ({
            length: slideWidth,
            offset: slideWidth * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.index * slideWidth,
              animated: true,
            });
          }}
          renderItem={({ item, index }) => (
            <Pressable
              style={{ width: slideWidth }}
              onPress={() => {
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
                );
              }}
              className="relative h-56 overflow-hidden bg-slate-900"
            >
              {item.type === 'video' ? (
                <BreakingVideoSlide
                  item={item}
                  active={index === activeIndex}
                />
              ) : (
                <Image
                  source={{ uri: item.mediaUrl }}
                  resizeMode="cover"
                  className="h-full w-full"
                />
              )}

              <View className="absolute inset-0 justify-end bg-black/35 p-4">
                <Text
                  numberOfLines={3}
                  className="text-lg font-extrabold leading-6 text-white"
                >
                  {item.title}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>

      {news.length > 1 ? (
        <>
          <Pressable
            onPress={() => moveToIndex(activeIndex - 1)}
            className="absolute left-2 top-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/60"
          >
            <Ionicons name="chevron-back" size={21} color="#FFFFFF" />
          </Pressable>

          <Pressable
            onPress={() => moveToIndex(activeIndex + 1)}
            className="absolute right-2 top-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/60"
          >
            <Ionicons name="chevron-forward" size={21} color="#FFFFFF" />
          </Pressable>

          <View className="mt-3 flex-row justify-center gap-1.5">
            {news.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => moveToIndex(index)}
                className={
                  index === activeIndex
                    ? 'h-2 w-5 rounded-full bg-red-500'
                    : 'h-2 w-2 rounded-full bg-slate-300'
                }
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
