import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoCard } from '@/features/videos/components/VideoCard';

import { useNews } from '@/features/news/hooks/useNews';
import { useAppLanguage } from '@/hooks/useAppLanguage';
import { usePublishedVideos } from '@/features/videos/hooks/usePublishedVideos';

import type { FeedItem } from '@/features/news/types/news.types';

export default function VideoScreen() {
  const router = useRouter();

  const { t, i18n } = useTranslation();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading: isNewsLoading,
  } = useNews(currentLanguage);

  const {
    videos: publishedLocalVideos,
    isLoading: isLocalVideosLoading,
    refetch,
  } = usePublishedVideos();

  const apiVideos =
    items.filter(
      (item) =>
        item.type === 'video',
    );

  const videos: FeedItem[] = [
    ...publishedLocalVideos,
    ...apiVideos.filter(
      (apiVideo) =>
        !publishedLocalVideos.some(
          (localVideo) =>
            localVideo.id ===
            apiVideo.id,
        ),
    ),
  ];

  const isLoading =
    isNewsLoading ||
    isLocalVideosLoading;

  const appLanguage: 'en' | 'ta' =
    i18n.resolvedLanguage === 'ta'
      ? 'ta'
      : 'en';

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <View className="px-4 pb-3 pt-2">
        <Text className="text-2xl font-black text-textMain">
          {t('tabs.video')}
        </Text>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={
          false
        }
        refreshing={isLoading}
        onRefresh={() => {
          void refetch();
        }}
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center py-16">
              <ActivityIndicator
                size="large"
                color="#F0442D"
              />

              <Text className="mt-3 text-sm font-semibold text-textMuted">
                Loading videos...
              </Text>
            </View>
          ) : (
            <EmptyState message="No videos available" />
          )
        }
        renderItem={({ item }) => (
          <VideoCard
            item={item}
            language={
              appLanguage
            }
            onPress={() =>
              router.push({
                pathname:
                  '/video/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}