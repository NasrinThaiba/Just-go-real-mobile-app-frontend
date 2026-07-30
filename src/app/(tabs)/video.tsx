import {
  FlatList,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/layout/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { VideoCard } from '@/components/video/VideoCard';

import { useNews } from '@/features/news/hooks/useNews';
import { useAppLanguage } from '@/hooks/useAppLanguage';

export default function VideoScreen() {
  const router = useRouter();

  const { t, i18n } = useTranslation();

  const { currentLanguage } =
    useAppLanguage();

  const { items } =
    useNews(currentLanguage);

  const videos = items.filter(
    (item) =>
      item.type === 'video',
  );

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
        ListEmptyComponent={
          <EmptyState message="No videos available" />
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