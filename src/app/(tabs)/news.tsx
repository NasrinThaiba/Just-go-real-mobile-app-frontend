import { useMemo } from 'react';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
import {
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/layout/AppHeader';
import { NewsHorizontalCard } from '@/components/news/NewsHorizontalCard';
import { EmptyState } from '@/components/ui/EmptyState';

import { useNews } from '@/features/news/hooks/useNews';
import { useAppLanguage } from '@/hooks/useAppLanguage';

export default function NewsScreen() {
  const { t } = useTranslation();

  const { type } =
    useLocalSearchParams<{
      type?: string;
    }>();

  const { currentLanguage } =
    useAppLanguage();

  const {
    items,
    isLoading,
  } = useNews(currentLanguage);

  const isBreakingView =
    type === 'breaking';

  const newsItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.type === 'news' &&
        item.status === 'published' &&
        item.language ===
          currentLanguage &&
        (isBreakingView
          ? item.newsType ===
            'breaking'
          : true),
    );
  }, [
    items,
    currentLanguage,
    isBreakingView,
  ]);

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <View className="px-4 pb-3 pt-2">
        <Text className="text-2xl font-black text-textMain">
          {isBreakingView
            ? 'Breaking News'
            : t('tabs.news')}
        </Text>
      </View>

      <FlatList
        data={newsItems}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={
          false
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              message={
                isBreakingView
                  ? 'No breaking news available'
                  : 'No news available'
              }
            />
          ) : null
        }
        renderItem={({ item }) => (
          <NewsHorizontalCard
            item={item}
          />
        )}
      />
    </SafeAreaView>
  );
}