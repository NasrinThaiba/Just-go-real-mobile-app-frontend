import { View } from 'react-native';

import { NewsCard } from '@/components/news/NewsCard';
import { SectionHeader } from '@/components/news/SectionHeader';
import type { FeedItem } from '@/features/news/types/news.types';

type NewsSectionProps = {
  title: string;
  news: FeedItem[];
  onViewAllPress?: () => void;
};

export function NewsSection({
  title,
  news,
  onViewAllPress,
}: NewsSectionProps) {
  if (!news.length) {
    return null;
  }

  return (
    <View>
      <SectionHeader
        title={title}
        onActionPress={onViewAllPress}
      />

      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </View>
  );
}
