import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

type SavedTab = 'news' | 'videos';

type SavedNewsItem = {
  id: string;
  category: string;
  title: string;
  publisher: string;
  time: string;
  image: string;
};

type SavedVideoItem = {
  id: string;
  category: string;
  title: string;
  publisher: string;
  views: string;
  duration: string;
  image: string;
};

const savedNews: SavedNewsItem[] = [
  {
    id: 'news-1',
    category: 'Technology',
    title: 'New technology transforms the way people access information',
    publisher: 'Just Go Real',
    time: '20m ago',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  },
  {
    id: 'news-2',
    category: 'Business',
    title: 'Local businesses record strong growth this quarter',
    publisher: 'Business Today',
    time: '1h ago',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  },
  {
    id: 'news-3',
    category: 'Sports',
    title: 'Young players deliver an impressive performance',
    publisher: 'Sports Daily',
    time: '2h ago',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
  },
];

const savedVideos: SavedVideoItem[] = [
  {
    id: 'video-1',
    category: 'Live News',
    title: 'Watch the complete report from today’s major event',
    publisher: 'Just Go Real',
    views: '24K views',
    duration: '04:32',
    image:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
  },
  {
    id: 'video-2',
    category: 'Politics',
    title: 'Important political updates explained in detail',
    publisher: 'News Network',
    views: '18K views',
    duration: '08:15',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
  },
];

export default function SavedScreen() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<SavedTab>('news');
  const [savedNewsItems, setSavedNewsItems] = useState(savedNews);
  const [savedVideoItems, setSavedVideoItems] = useState(savedVideos);

  const isEmpty = useMemo(() => {
    return activeTab === 'news'
      ? savedNewsItems.length === 0
      : savedVideoItems.length === 0;
  }, [activeTab, savedNewsItems.length, savedVideoItems.length]);

  const removeNewsItem = (id: string) => {
    setSavedNewsItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  const removeVideoItem = (id: string) => {
    setSavedVideoItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[30px] font-black text-slate-950">
                Saved
              </Text>

              <Text className="mt-1 text-sm font-medium text-slate-500">
                Your saved news and videos
              </Text>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FFF1EE]">
              <Ionicons name="bookmark" size={22} color="#F0442D" />
            </View>
          </View>

          {/* News / Videos tabs */}
          <View className="mt-6 flex-row rounded-2xl bg-slate-100 p-1">
            <SavedTabButton
              label="News"
              icon="newspaper-outline"
              isActive={activeTab === 'news'}
              onPress={() => setActiveTab('news')}
            />

            <SavedTabButton
              label="Videos"
              icon="play-circle-outline"
              isActive={activeTab === 'videos'}
              onPress={() => setActiveTab('videos')}
            />
          </View>
        </View>

        {isEmpty ? (
          <EmptySavedState activeTab={activeTab} />
        ) : activeTab === 'news' ? (
          <FlatList
            data={savedNewsItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 32,
            }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => (
              <SavedNewsCard
                item={item}
                onRemove={() => removeNewsItem(item.id)}
              />
            )}
          />
        ) : (
          <FlatList
            data={savedVideoItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 32,
            }}
            ItemSeparatorComponent={() => <View className="h-5" />}
            renderItem={({ item }) => (
              <SavedVideoCard
                item={item}
                onRemove={() => removeVideoItem(item.id)}
              />
            )}
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
        isActive ? 'bg-white' : 'bg-transparent'
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
        color={isActive ? '#F0442D' : '#667085'}
      />

      <Text
        className={`ml-2 text-sm font-black ${
          isActive ? 'text-[#F0442D]' : 'text-slate-500'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type SavedNewsCardProps = {
  item: SavedNewsItem;
  onRemove: () => void;
};

function SavedNewsCard({ item, onRemove }: SavedNewsCardProps) {
  return (
    <Pressable className="flex-row rounded-[20px] border border-slate-100 bg-white p-3">
      <Image
        source={{ uri: item.image }}
        className="h-28 w-28 rounded-2xl"
        resizeMode="cover"
      />

      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="text-[11px] font-black uppercase text-[#F0442D]">
            {item.category}
          </Text>

          <Pressable
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove saved news"
            hitSlop={8}
          >
            <Ionicons name="bookmark" size={20} color="#F0442D" />
          </Pressable>
        </View>

        <Text
          numberOfLines={3}
          className="mt-1.5 text-sm font-black leading-5 text-slate-950"
        >
          {item.title}
        </Text>

        <Text className="mt-auto text-[11px] font-medium text-slate-500">
          {item.publisher} · {item.time}
        </Text>
      </View>
    </Pressable>
  );
}

type SavedVideoCardProps = {
  item: SavedVideoItem;
  onRemove: () => void;
};

function SavedVideoCard({ item, onRemove }: SavedVideoCardProps) {
  return (
    <Pressable>
      <View className="overflow-hidden rounded-[22px]">
        <Image
          source={{ uri: item.image }}
          className="h-52 w-full"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute inset-0 items-center justify-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white/95">
            <Ionicons name="play" size={26} color="#F0442D" />
          </View>
        </View>

        <View className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-1">
          <Text className="text-[11px] font-bold text-white">
            {item.duration}
          </Text>
        </View>

        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove saved video"
          className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-white/95"
        >
          <Ionicons name="bookmark" size={19} color="#F0442D" />
        </Pressable>
      </View>

      <Text className="mt-3 text-[11px] font-black uppercase text-[#F0442D]">
        {item.category}
      </Text>

      <Text
        numberOfLines={2}
        className="mt-1 text-base font-black leading-6 text-slate-950"
      >
        {item.title}
      </Text>

      <Text className="mt-1.5 text-xs font-medium text-slate-500">
        {item.publisher} · {item.views}
      </Text>
    </Pressable>
  );
}

type EmptySavedStateProps = {
  activeTab: SavedTab;
};

function EmptySavedState({ activeTab }: EmptySavedStateProps) {
  const isNewsTab = activeTab === 'news';

  return (
    <View className="flex-1 items-center justify-center px-8 pb-20">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-[#FFF1EE]">
        <Ionicons
          name={isNewsTab ? 'newspaper-outline' : 'play-circle-outline'}
          size={42}
          color="#F0442D"
        />
      </View>

      <Text className="mt-6 text-xl font-black text-slate-950">
        {isNewsTab ? 'No saved news' : 'No saved videos'}
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
        {isNewsTab
          ? 'Save news articles and read them later from this screen.'
          : 'Save videos and watch them later from this screen.'}
      </Text>
    </View>
  );
}