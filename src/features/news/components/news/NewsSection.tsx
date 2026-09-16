// src/features/news/components/news/NewsSection.tsx

import {
  View,
} from 'react-native';

import {
  NewsCard,
} from '@/features/news/components/news/NewsCard';

import {
  SectionHeader,
} from '@/features/news/components/news/SectionHeader';

import type {
  FeedItem,
} from '@/features/news/types/news.types';


type Props = {
  title: string;

  news: FeedItem[];

  onViewAllPress?: () => void;
};


export function NewsSection({
  title,
  news,
  onViewAllPress,
}: Props) {

  if (!news.length) {
    return null;
  }


  return (

    <View>

      <SectionHeader
        title={title}
        onActionPress={
          onViewAllPress
        }
      />


      {news.map(
        (item) => (

          <NewsCard
            key={item.id}
            item={item}
          />

        ),
      )}

    </View>

  );

}