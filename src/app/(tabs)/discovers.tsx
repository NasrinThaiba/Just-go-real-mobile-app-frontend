// src/app/(tabs)/discovers.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNews } from '@/features/news/hooks/useNews';
import type { FeedItem } from '@/features/news/types/news.types';
import { useAppLanguage } from '@/hooks/useAppLanguage';

const SCREEN_WIDTH =
  Dimensions.get('window').width;

const HORIZONTAL_PADDING = 16;

const CARD_WIDTH =
  SCREEN_WIDTH - HORIZONTAL_PADDING * 2;

const publishers = [
  {
    id: 'publisher-1',
    name: 'Just Go Real',
    shortName: 'JG',
    backgroundColor: '#F0442D',
  },
  {
    id: 'publisher-2',
    name: 'Global Times',
    shortName: 'GT',
    backgroundColor: '#101828',
  },
  {
    id: 'publisher-3',
    name: 'Insight Today',
    shortName: 'IT',
    backgroundColor: '#D97706',
  },
  {
    id: 'publisher-4',
    name: 'The Observer',
    shortName: 'TO',
    backgroundColor: '#1D2939',
  },
  {
    id: 'publisher-5',
    name: 'Frontier Report',
    shortName: 'FR',
    backgroundColor: '#B42318',
  },
];

const topics = [
  '#Elections',
  '#Tech',
  '#World',
  '#Economy',
  '#Climate',
  '#Sports',
  '#Startup',
  '#Health',
];

export default function DiscoversScreen() {
  const router = useRouter();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading,
  } = useNews(currentLanguage);

  const carouselRef =
    useRef<FlatList<FeedItem>>(null);

  const [searchText, setSearchText] =
    useState('');

  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState('#Elections');

  const [
    activeSlideIndex,
    setActiveSlideIndex,
  ] = useState(0);

  const discoverNews =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return items
        .filter((item) => {
          const isPublishedNews =
            item.type === 'news' &&
            item.status === 'published';

          const matchesLanguage =
            item.language ===
            currentLanguage;

          const matchesSearch =
            !normalizedSearch ||
            item.title
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.description
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.category
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.location
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          return (
            isPublishedNews &&
            matchesLanguage &&
            matchesSearch
          );
        })
        .sort((firstItem, secondItem) => {
          const firstPriority =
            getNewsPriority(
              firstItem,
            );

          const secondPriority =
            getNewsPriority(
              secondItem,
            );

          if (
            firstPriority !==
            secondPriority
          ) {
            return (
              secondPriority -
              firstPriority
            );
          }

          return (
            secondItem.views -
            firstItem.views
          );
        })
        .slice(0, 6);
    }, [
      items,
      currentLanguage,
      searchText,
    ]);

  const openNews = (
    item: FeedItem,
  ) => {
    router.push({
      pathname:
        '/article/[id]',
      params: {
        id: item.id,
      },
    });
  };

  const handleCarouselEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX =
      event.nativeEvent
        .contentOffset.x;

    const nextIndex =
      Math.round(
        offsetX /
          SCREEN_WIDTH,
      );

    setActiveSlideIndex(
      nextIndex,
    );
  };

  const scrollToSlide = (
    index: number,
  ) => {
    carouselRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setActiveSlideIndex(index);
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 32,
        }}
      >
        <View className="px-4 pt-3">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-[30px] font-black leading-8 text-textMain">
                Discover
              </Text>

              <Text className="text-[30px] font-black leading-8 text-[#F0442D]">
                Hot News
              </Text>
            </View>

            <Pressable
              hitSlop={10}
              className="relative h-11 w-11 items-center justify-center rounded-full"
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#121826"
              />

              <View className="absolute right-2 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#F0442D]" />
            </Pressable>
          </View>

          <View className="mt-5 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
            <Ionicons
              name="search-outline"
              size={20}
              color="#98A2B3"
            />

            <TextInput
              value={searchText}
              onChangeText={
                setSearchText
              }
              placeholder="Search anything..."
              placeholderTextColor="#98A2B3"
              className="ml-3 flex-1 text-sm font-semibold text-textMain"
              returnKeyType="search"
            />

            {searchText ? (
              <Pressable
                onPress={() =>
                  setSearchText('')
                }
                hitSlop={10}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#98A2B3"
                />
              </Pressable>
            ) : (
              <Pressable
                hitSlop={10}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color="#667085"
                />
              </Pressable>
            )}
          </View>
        </View>

        <View className="mt-6">
          {/* <SectionHeader
            title="Top Publishers"
            onSeeAll={() => {
              router.push(
                '/publishers',
              );
            }}
          /> */}
          <SectionHeader title="Top Publishers" />

          <FlatList
            horizontal
            data={publishers}
            keyExtractor={(
              item,
            ) => item.id}
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 14,
              gap: 14,
            }}
            renderItem={({
              item,
            }) => (
              <Pressable
                style={{
                  width: 64,
                  alignItems:
                    'center',
                }}
              >
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      item.backgroundColor,
                  }}
                >
                  <Text className="text-sm font-black text-white">
                    {
                      item.shortName
                    }
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  className="mt-2 text-center text-[10px] font-semibold leading-4 text-slate-700"
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View className="mt-6">
          <SectionHeader
            title="Trending Topics"
            onSeeAll={() => {
              router.push(
                '/trending',
              );
            }}
          />

          <View className="mt-4 flex-row flex-wrap gap-2 px-4">
            {topics.map(
              (topic) => {
                const isSelected =
                  selectedTopic ===
                  topic;

                return (
                  <Pressable
                    key={topic}
                    onPress={() =>
                      setSelectedTopic(
                        topic,
                      )
                    }
                    className={`rounded-full border px-4 py-2 ${
                      isSelected
                        ? 'border-[#F0442D] bg-[#FFF1EE]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected
                          ? 'text-[#F0442D]'
                          : 'text-slate-600'
                      }`}
                    >
                      {topic}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        <View className="mt-7">
          <SectionHeader
            title="Live Report"
            onSeeAll={() => {
              router.push('/news');
            }}
          />

          {discoverNews.length ===
            0 && !isLoading ? (
            <View className="px-4 pt-4">
              <EmptyState message="No news available" />
            </View>
          ) : (
            <>
              <FlatList
                ref={carouselRef}
                data={discoverNews}
                horizontal
                pagingEnabled
                keyExtractor={(
                  item,
                ) => item.id}
                showsHorizontalScrollIndicator={
                  false
                }
                decelerationRate="fast"
                disableIntervalMomentum
                snapToInterval={
                  SCREEN_WIDTH
                }
                snapToAlignment="start"
                onMomentumScrollEnd={
                  handleCarouselEnd
                }
                getItemLayout={(
                  _data,
                  index,
                ) => ({
                  length:
                    SCREEN_WIDTH,
                  offset:
                    SCREEN_WIDTH *
                    index,
                  index,
                })}
                contentContainerStyle={{
                  paddingTop: 14,
                }}
                renderItem={({
                  item,
                }) => (
                  <View
                    style={{
                      width:
                        SCREEN_WIDTH,
                      paddingHorizontal:
                        HORIZONTAL_PADDING,
                    }}
                  >
                    <DiscoverNewsCard
                      item={item}
                      width={
                        CARD_WIDTH
                      }
                      onPress={() =>
                        openNews(item)
                      }
                    />
                  </View>
                )}
              />

              <View className="mt-4 flex-row items-center justify-center">
                {discoverNews.map(
                  (
                    item,
                    index,
                  ) => {
                    const isActive =
                      activeSlideIndex ===
                      index;

                    return (
                      <Pressable
                        key={
                          item.id
                        }
                        onPress={() =>
                          scrollToSlide(
                            index,
                          )
                        }
                        hitSlop={6}
                        className={`mx-1 h-2 rounded-full ${
                          isActive
                            ? 'w-6 bg-[#F0442D]'
                            : 'w-2 bg-slate-300'
                        }`}
                      />
                    );
                  },
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type DiscoverNewsCardProps = {
  item: FeedItem;
  width: number;
  onPress: () => void;
};

function DiscoverNewsCard({
  item,
  width,
  onPress,
}: DiscoverNewsCardProps) {
  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;

  const isLive =
    item.type === 'video' &&
    item.videoType === 'live';

  const badgeLabel =
    getBadgeLabel(item);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-[22px] bg-slate-900 active:opacity-90"
      style={{
        width,
        height: 250,
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        className="h-full w-full"
        resizeMode="cover"
      />

      <View className="absolute inset-0 bg-black/35" />

      <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-[#F0442D] px-3 py-1.5">
        {isLive ? (
          <Ionicons
            name="radio"
            size={12}
            color="#FFFFFF"
          />
        ) : (
          <Ionicons
            name="newspaper"
            size={12}
            color="#FFFFFF"
          />
        )}

        <Text className="ml-1.5 text-[11px] font-black text-white">
          {badgeLabel}
        </Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-5">
        <Text
          numberOfLines={2}
          className="text-xl font-black leading-7 text-white"
        >
          {item.title}
        </Text>

        <View className="mt-3 flex-row items-center">
          <Text
            numberOfLines={1}
            className="max-w-[45%] text-xs font-semibold text-white/90"
          >
            {item.author}
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-[#F0442D]" />

          <Ionicons
            name="eye-outline"
            size={14}
            color="#FFFFFF"
          />

          <Text className="ml-1 text-xs font-semibold text-white/90">
            {formatViews(
              item.views,
            )}
          </Text>

          <View className="mx-2 h-1 w-1 rounded-full bg-white/70" />

          <Text className="text-xs font-semibold text-white/90">
            {formatPublishedTime(
              item.publishedAt ??
                item.createdAt,
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

type SectionHeaderProps = {
  title: string;
  onSeeAll?: () => void;
};

function SectionHeader({
  title,
  onSeeAll,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4">
      <Text className="text-lg font-black text-textMain">
        {title}
      </Text>

      <Pressable
        onPress={onSeeAll}
        hitSlop={10}
      >
        <Text className="text-xs font-bold text-textMuted">
          See All
        </Text>
      </Pressable>
    </View>
  );
}

function getNewsPriority(
  item: FeedItem,
) {
  switch (item.newsType) {
    case 'breaking':
      return 4;

    case 'featured':
      return 3;

    case 'trending':
      return 2;

    case 'regular':
    default:
      return 1;
  }
}

function getBadgeLabel(
  item: FeedItem,
) {
  if (
    item.type === 'video'
  ) {
    switch (
      item.videoType
    ) {
      case 'live':
        return 'LIVE';

      case 'breaking':
        return 'BREAKING';

      case 'interview':
        return 'INTERVIEW';

      case 'short':
        return 'SHORT';

      case 'featured':
        return 'FEATURED';

      case 'news':
      default:
        return 'VIDEO';
    }
  }

  switch (item.newsType) {
    case 'breaking':
      return 'BREAKING';

    case 'featured':
      return 'FEATURED';

    case 'trending':
      return 'TRENDING';

    case 'regular':
    default:
      return 'NEWS';
  }
}

function formatViews(
  views: number,
) {
  if (views >= 1_000_000) {
    return `${(
      views / 1_000_000
    ).toFixed(1)}M`;
  }

  if (views >= 1_000) {
    return `${(
      views / 1_000
    ).toFixed(1)}K`;
  }

  return String(views);
}

function formatPublishedTime(
  dateValue: string,
) {
  const publishedTime =
    new Date(
      dateValue,
    ).getTime();

  if (
    Number.isNaN(
      publishedTime,
    )
  ) {
    return '';
  }

  const difference =
    Date.now() -
    publishedTime;

  const minutes =
    Math.floor(
      difference /
        (1000 * 60),
    );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  return `${days}d ago`;
}