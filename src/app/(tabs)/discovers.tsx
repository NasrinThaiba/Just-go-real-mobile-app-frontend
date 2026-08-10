import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
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
import { usePublishedNews } from '@/features/news/hooks/usePublishedNews';
import type { FeedItem } from '@/features/news/types/news.types';
import { useAppLanguage } from '@/hooks/useAppLanguage';
import { getPublisherImage } from '@/features/news/constants/publisher-images';
import { useSavedContent } from '@/features/saved/context/SavedContext';
import { formatPublishedTime, formatViews } from '@/utils/content-formatters';

const SCREEN_WIDTH =
  Dimensions.get('window').width;

const HORIZONTAL_PADDING = 16;

const LIVE_CARD_WIDTH =
  SCREEN_WIDTH -
  HORIZONTAL_PADDING * 2;

type TopicItem = {
  id: string;
  label: string;
  category: string;
};

const topics: TopicItem[] = [
  {
    id: 'all',
    label: '#All',
    category: 'all',
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
    id: 'science',
    label: '#Science',
    category: 'science',
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
  {
    id: 'health',
    label: '#Health',
    category: 'health',
  },
];

export default function DiscoversScreen() {
  const router = useRouter();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading: isFeedLoading,
  } = useNews(currentLanguage);

  const {
    news: publishedLocalNews,
    isLoading:
      isPublishedNewsLoading,
    isRefreshing,
    error,
    refetch,
  } = usePublishedNews();

  const liveCarouselRef =
    useRef<FlatList<FeedItem>>(null);

  const [searchText, setSearchText] =
    useState('');

  const [
    selectedTopic,
    setSelectedTopic,
  ] = useState('all');

  const [
    activeLiveIndex,
    setActiveLiveIndex,
  ] = useState(0);

  const isLoading =
    isFeedLoading ||
    isPublishedNewsLoading;


  const mergedPublishedNews =
    useMemo<FeedItem[]>(() => {
      const feedPublishedNews =
        items.filter(
          (item) =>
            item.type === 'news' &&
            item.status ===
              'published',
        );

      const uniqueFeedNews =
        feedPublishedNews.filter(
          (feedItem) =>
            !publishedLocalNews.some(
              (publishedItem) =>
                publishedItem.id ===
                feedItem.id,
            ),
        );

      return [
        ...publishedLocalNews,
        ...uniqueFeedNews,
      ];
    }, [
      items,
      publishedLocalNews,
    ]);

  const discoverNews =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return mergedPublishedNews
        .filter((item) => {
          const isPublishedNews =
            item.type === 'news' &&
            item.status ===
              'published';

          const matchesLanguage =
            !item.language ||
            item.language ===
              currentLanguage;

          const normalizedCategory =
            item.category
              ?.trim()
              .toLowerCase() ?? '';

          const matchesTopic =
            selectedTopic ===
              'all' ||
            normalizedCategory ===
              selectedTopic;

          const searchableText = [
            item.title,
            item.description,
            item.category,
            item.location,
            item.author,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
              normalizedSearch,
            );

          return (
            isPublishedNews &&
            matchesLanguage &&
            matchesTopic &&
            matchesSearch
          );
        })
        .sort(
          (
            firstItem,
            secondItem,
          ) => {
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

            const firstDate =
              firstItem.publishedAt ??
              firstItem.createdAt;

            const secondDate =
              secondItem.publishedAt ??
              secondItem.createdAt;

            const dateDifference =
              new Date(
                secondDate,
              ).getTime() -
              new Date(
                firstDate,
              ).getTime();

            if (dateDifference !== 0) {
              return dateDifference;
            }

            return (
              (secondItem.views ??
                0) -
              (firstItem.views ??
                0)
            );
          },
        )
        .slice(0, 12);
    }, [
      mergedPublishedNews,
      currentLanguage,
      searchText,
      selectedTopic,
    ]);

  
  const liveVideos =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return items
        .filter((item) => {
          const isPublishedLive =
            item.type === 'video' &&
            item.videoType ===
              'live' &&
            item.status ===
              'published';

          const matchesLanguage =
            !item.language ||
            item.language ===
              currentLanguage;

          const normalizedCategory =
            item.category
              ?.trim()
              .toLowerCase() ?? '';

          const matchesTopic =
            selectedTopic ===
              'all' ||
            normalizedCategory ===
              selectedTopic;

          const searchableText = [
            item.title,
            item.description,
            item.category,
            item.location,
            item.author,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
              normalizedSearch,
            );

          return (
            isPublishedLive &&
            matchesLanguage &&
            matchesTopic &&
            matchesSearch
          );
        })
        .sort(
          (
            firstItem,
            secondItem,
          ) => {
            const firstDate =
              firstItem.publishedAt ??
              firstItem.createdAt;

            const secondDate =
              secondItem.publishedAt ??
              secondItem.createdAt;

            return (
              new Date(
                secondDate,
              ).getTime() -
              new Date(
                firstDate,
              ).getTime()
            );
          },
        )
        .slice(0, 8);
    }, [
      items,
      currentLanguage,
      searchText,
      selectedTopic,
    ]);

  const selectedTopicLabel =
    useMemo(() => {
      const selectedItem =
        topics.find(
          (topic) =>
            topic.category ===
            selectedTopic,
        );

      return (
        selectedItem?.label.replace(
          '#',
          '',
        ) ?? 'Trending'
      );
    }, [selectedTopic]);

  const openContent = (
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

  const openAllNews = () => {
    router.push({
      pathname: '/news',
      params: {
        category:
          selectedTopic === 'all'
            ? 'All'
            : selectedTopicLabel,
      },
    });
  };

  const openAllLiveVideos = () => {
    router.push('/live-video');
  };

  const selectTopic = (
    topic: TopicItem,
  ) => {
    setSelectedTopic(
      topic.category,
    );

    setActiveLiveIndex(0);

    liveCarouselRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  };

  const clearSearch = () => {
    setSearchText('');
    setActiveLiveIndex(0);

    liveCarouselRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  };

  const handleLiveCarouselEnd = (
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

    setActiveLiveIndex(
      nextIndex,
    );
  };

  const scrollToLiveItem = (
    index: number,
  ) => {
    liveCarouselRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setActiveLiveIndex(index);
  };

  const normalNewsTitle =
    selectedTopic === 'all'
      ? 'Trending News'
      : `${selectedTopicLabel} News`;

  const emptyMessage =
    searchText.trim().length > 0
      ? `No news found for "${searchText.trim()}"`
      : selectedTopic === 'all'
        ? 'No news available'
        : `No ${selectedTopicLabel} news available`;

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* Page header */}

        <View className="px-4 pt-3">
          <View className="flex-row items-center">
            <Text className="text-[20px] font-black leading-8 text-textMain">
              Discover
            </Text>

            <Text className="ml-2 text-[20px] font-black leading-8 text-[#F0442D]">
              News
            </Text>
          </View>
        </View>

          {/* Search */}

          <View className="mt-5 h-12 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
            <Ionicons
              name="search-outline"
              size={20}
              color="#98A2B3"
            />

            <TextInput
              value={searchText}
              onChangeText={(value) => {
                setSearchText(value);
                setActiveLiveIndex(0);
              }}
              placeholder="Search news, category, location..."
              placeholderTextColor="#98A2B3"
              className="ml-3 flex-1 text-sm font-semibold text-textMain"
              returnKeyType="search"
              autoCorrect={false}
            />

            {searchText.length > 0 ? (
              <Pressable
                onPress={clearSearch}
                hitSlop={10}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#98A2B3"
                />
              </Pressable>
            ) : (
              <Ionicons
                name="options-outline"
                size={20}
                color="#667085"
              />
            )}
          </View>
        

        {/* Trending topics */}

        <View className="mt-6">
          <SectionHeader
            title="Trending Topics"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingRight: 24,
              gap: 8,
            }}
          >
            {topics.map((topic) => {
              const isSelected =
                selectedTopic ===
                topic.category;

              return (
                <Pressable
                  key={topic.id}
                  onPress={() =>
                    selectTopic(topic)
                  }
                  className={`rounded-full border px-4 py-2.5 ${
                    isSelected
                      ? 'border-[#F0442D] bg-[#FFF1EE]'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected
                        ? 'text-[#F0442D]'
                        : 'text-slate-600'
                    }`}
                  >
                    {topic.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* API error */}

        {error ? (
          <View className="mx-4 mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
            <Text className="text-sm font-bold text-red-700">
              {error}
            </Text>

            <Pressable
              onPress={() => {
                void refetch();
              }}
              className="mt-3 self-start rounded-xl bg-red-600 px-4 py-2"
            >
              <Text className="text-sm font-bold text-white">
                Retry
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Loading */}

        {isLoading ? (
          <View className="h-64 items-center justify-center">
            <ActivityIndicator
              size="large"
              color="#F0442D"
            />

            <Text className="mt-3 text-sm font-semibold text-textMuted">
              Loading content...
            </Text>
          </View>
        ) : (
          <>
            {/* Live videos carousel */}

            {liveVideos.length > 0 ? (
              <View className="mt-7">
                <SectionHeader
                  title="Live News"
                  onSeeAll={
                    openAllLiveVideos
                  }
                />

                <FlatList
                  ref={liveCarouselRef}
                  data={liveVideos}
                  horizontal
                  pagingEnabled
                  nestedScrollEnabled
                  keyExtractor={(item) =>
                    item.id
                  }
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
                    handleLiveCarouselEnd
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
                      <LiveNewsCarouselCard
                        item={item}
                        width={
                          LIVE_CARD_WIDTH
                        }
                        onPress={() =>
                          openContent(
                            item,
                          )
                        }
                      />
                    </View>
                  )}
                />

                {liveVideos.length >
                1 ? (
                  <View className="mt-4 flex-row items-center justify-center">
                    {liveVideos.map(
                      (
                        item,
                        index,
                      ) => {
                        const isActive =
                          activeLiveIndex ===
                          index;

                        return (
                          <Pressable
                            key={
                              item.id
                            }
                            onPress={() =>
                              scrollToLiveItem(
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
                ) : null}
              </View>
            ) : null}

            {/* Normal news vertical list */}

            <View className="mt-7">
              <SectionHeader
                title={normalNewsTitle}
                onSeeAll={openAllNews}
              />

              {discoverNews.length ===
              0 ? (
                <View className="px-4 pt-4">
                  <EmptyState
                    message={
                      emptyMessage
                    }
                  />
                </View>
              ) : (
                <View className="px-4 pt-4">
                  {discoverNews.map(
                    (item) => (
                      <DiscoverNewsCard
                        key={item.id}
                        item={item}
                        onPress={() =>
                          openContent(
                            item,
                          )
                        }
                      />
                    ),
                  )}
                </View>
              )}
            </View>
          </>
        )}

        {isRefreshing ? (
          <Text className="mt-3 text-center text-xs font-semibold text-textMuted">
            Updating news...
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type LiveNewsCarouselCardProps = {
  item: FeedItem;
  width: number;
  onPress: () => void;
};

function LiveNewsCarouselCard({
  item,
  width,
  onPress,
}: LiveNewsCarouselCardProps) {
  const imageUrl =
    item.thumbnailUrl ??
    item.mediaUrl;

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const publisherName =
  item.author?.trim() ||
  'Live Publisher';

const publisherImage =
  getPublisherImage(
    publisherName,
  );

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-[24px] bg-slate-900 active:opacity-90"
      style={{
        width,
        height: 245,
      }}
    >
      <Image
        source={{
          uri: imageUrl,
        }}
        className="h-full w-full"
        resizeMode="cover"
      />

      <View className="absolute inset-0 bg-black/45" />

      {/* Live badge */}

      <View className="absolute left-4 top-4 flex-row items-center rounded-full bg-[#F0442D] px-3 py-1.5">
        <View className="mr-2 h-2 w-2 rounded-full bg-white" />

        <Text className="text-[11px] font-black text-white">
          LIVE
        </Text>
      </View>

      {/* Play button */}

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

      {/* Details */}

      <View className="absolute bottom-0 left-0 right-0 p-5">
        <Text
          numberOfLines={2}
          className="text-xl font-black leading-7 text-white"
        >
          {item.title}
        </Text>

        <View className="mt-4 flex-row items-center">
          <Image
            source={{
              uri: publisherImage,
            }}
            className="h-9 w-9 rounded-full border border-white/40 bg-slate-200"
            resizeMode="cover"
          />

          <View className="ml-3 flex-1">
            <Text
              numberOfLines={1}
              className="text-xs font-bold text-white"
            >
              {publisherName}
            </Text>

            <View className="mt-1 flex-row items-center">
              <Ionicons
                name="eye-outline"
                size={13}
                color="#FFFFFF"
              />

              <Text className="ml-1 text-xs font-semibold text-white/90">
                {formatViews(
                  item.views ?? 0,
                )}
              </Text>

              <View className="mx-2 h-1 w-1 rounded-full bg-white/70" />

              <Text className="text-xs font-semibold text-white/90">
                {formatPublishedTime(
                  displayDate,
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

type DiscoverNewsCardProps = {
  item: FeedItem;
  onPress: () => void;
};

function DiscoverNewsCard({
  item,
  onPress,
}: DiscoverNewsCardProps) {
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
      {/* News image */}

      <View className="relative">
        <Image
          source={{
            uri: imageUrl,
          }}
          className="h-44 w-full bg-slate-100"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/10" />

        <View className="absolute left-4 top-4 max-w-[70%] rounded-full bg-white/95 px-3 py-1.5">
          <Text
            numberOfLines={1}
            className="text-[10px] font-black uppercase tracking-wide text-[#F0442D]"
          >
            {item.category}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Text
          numberOfLines={3}
          className="text-[15px] font-black leading-6 text-slate-950"
        >
          {item.title}
        </Text>


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

          {/* Saved button */}

          <Pressable
            hitSlop={10}
            onPress={(event) => {
              event.stopPropagation();

              void toggleSaved(item);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              itemIsSaved
                ? 'Remove from saved'
                : 'Save news'
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

      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          hitSlop={10}
          className="flex-row items-center"
        >
          <Text className="text-xs font-bold text-textMuted">
            See All
          </Text>

          <Ionicons
            name="chevron-forward"
            size={14}
            color="#667085"
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function getNewsPriority(
  item: FeedItem,
) {
  if (item.type !== 'news') {
    return 0;
  }

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
