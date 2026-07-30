import {
  FlatList,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/layout/AppHeader';
import { NewsCard } from '@/components/news/NewsCard';
import { EmptyState } from '@/components/ui/EmptyState';

import { useNews } from '@/features/news/hooks/useNews';
import { useAppLanguage } from '@/hooks/useAppLanguage';

export default function TrendingScreen() {
  const { t } = useTranslation();

  const { currentLanguage } =
    useAppLanguage();

  const { items } =
    useNews(currentLanguage);

  const trendingNews = [...items].sort(
    (firstItem, secondItem) =>
      secondItem.views - firstItem.views,
  );

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <View className="px-4 pb-3 pt-2">
        <Text className="text-2xl font-black text-textMain">
          {t('tabs.trending')}
        </Text>
      </View>

      <FlatList
        data={trendingNews}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState message="No trending news available" />
        }
        renderItem={({ item }) => (
          <NewsCard item={item} />
        )}
      />
    </SafeAreaView>
  );
}