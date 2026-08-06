import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { BookmarkButton } from '@/components/interactions/BookmarkButton';
import { CommentButton } from '@/components/interactions/CommentButton';
import { FavoriteButton } from '@/components/interactions/FavoriteButton';
import { InlineComments } from '@/components/interactions/InlineComments';
import { ShareButton } from '@/components/interactions/ShareButton';
import { ErrorView } from '@/components/ui/ErrorView';
import { LoadingView } from '@/components/ui/LoadingView';

import { useCurrentInteractionUser } from '@/features/auth/hooks/useCurrentInteractionUser';
import { useContentInteractions } from '@/features/interactions/hooks/useContentInteractions';
import { useNewsDetails } from '@/features/news/hooks/useNewsDetails';
import type { FeedItem } from '@/features/news/types/news.types';
import { formatRelativeDate } from '@/utils/formatDate';

const CONTENT_MAX_WIDTH = 900;

export default function ArticleDetailsScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const articleId =
    typeof id === 'string'
      ? id
      : '';

  const {
    item,
    isLoading,
    error,
  } = useNewsDetails(articleId);

  const appLanguage: 'en' | 'ta' =
    i18n.resolvedLanguage === 'ta'
      ? 'ta'
      : 'en';

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 bg-white"
      >
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 bg-white"
      >
        <ErrorView
          message={
            error ??
            'Article not found'
          }
        />
      </SafeAreaView>
    );
  }

  if (item.type !== 'news') {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 bg-white"
      >
        <ErrorView message="This content is not a news article." />
      </SafeAreaView>
    );
  }

  return (
    <ArticleContent
      item={item}
      appLanguage={appLanguage}
      onBack={() =>
        router.back()
      }
    />
  );
}

type ArticleContentProps = {
  item: FeedItem;
  appLanguage: 'en' | 'ta';
  onBack: () => void;
};

function ArticleContent({
  item,
  appLanguage,
  onBack,
}: ArticleContentProps) {
  const [
    showComments,
    setShowComments,
  ] = useState(false);

  const {
    currentUser,
    isLoading:
      isCurrentUserLoading,
  } =
    useCurrentInteractionUser();

  const {
    interaction,
    toggleFavorite,
    toggleBookmark,
    addComment,
    deleteComment,
  } = useContentInteractions(
    item.id,
    currentUser,
  );

  const displayDate =
    item.publishedAt ??
    item.createdAt;

  const categoryLabel =
    item.category
      ? item.category.toUpperCase()
      : 'NEWS';

  const newsTypeLabel =
    item.newsType === 'breaking'
      ? 'BREAKING'
      : item.newsType
        ? item.newsType.toUpperCase()
        : categoryLabel;

  const totalLikes =
    (item.likes ?? 0) +
    (interaction.isFavorite
      ? 1
      : 0);

  const handleFavorite =
    async () => {
      try {
        const updated =
          await toggleFavorite();

        Toast.show({
          type: 'success',
          text1:
            updated.isFavorite
              ? 'Added to favorites'
              : 'Removed from favorites',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        console.error(
          'Favorite update failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to update favorite',
          position: 'top',
        });
      }
    };

  const handleBookmark =
    async () => {
      try {
        const updated =
          await toggleBookmark();

        Toast.show({
          type: 'success',
          text1:
            updated.isBookmarked
              ? 'Article bookmarked'
              : 'Bookmark removed',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        console.error(
          'Bookmark update failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to update bookmark',
          position: 'top',
        });
      }
    };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-[#F7F9FC]"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            maxWidth:
              CONTENT_MAX_WIDTH,
          }}
          className="mx-auto w-full bg-white"
        >
          {/* Article image */}

          <View className="relative w-full overflow-hidden bg-slate-100">
            <Image
              source={{
                uri: item.mediaUrl,
              }}
              resizeMode="cover"
              className="h-72 w-full bg-slate-100"
            />

            {/* Header actions */}

            <View className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4 pt-4">
              <Pressable
                onPress={onBack}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                className="h-10 w-10 items-center justify-center rounded-full bg-black/45 active:opacity-75"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>

              <View className="flex-row items-center gap-3">
                <BookmarkButton
                  selected={
                    interaction.isBookmarked
                  }
                  onPress={() =>
                    void handleBookmark()
                  }
                  variant="header"
                />

                <ShareButton
                  title={item.title}
                  description={
                    item.description
                  }
                  variant="header"
                />
              </View>
            </View>

            {/* News type */}

            <View className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1.5">
              <Text className="text-xs font-black text-white">
                {newsTypeLabel}
              </Text>
            </View>
          </View>

          {/* Article content */}

          <View className="px-4 pb-4">
            <Text className="mt-5 text-3xl font-black leading-10 text-textMain">
              {item.title}
            </Text>

            {/* Publisher */}

            <View className="mt-4 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primarySoft">
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#F0442D"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-extrabold text-textMain">
                  {item.author ||
                    'Just Go Real'}
                </Text>

                <Text className="mt-1 text-xs font-medium text-textMuted">
                  {formatRelativeDate(
                    displayDate,
                    appLanguage,
                  )}
                </Text>
              </View>
            </View>

            {/* Description */}

            {item.description ? (
              <Text className="mt-6 text-base leading-8 text-slate-700">
                {
                  item.description
                }
              </Text>
            ) : null}

            {/* Interactions */}

            <View className="mt-8 flex-row items-center justify-between border-t border-borderSoft pt-5">
              <FavoriteButton
                selected={
                  interaction.isFavorite
                }
                count={totalLikes}
                onPress={() =>
                  void handleFavorite()
                }
              />

              <CommentButton
                count={
                  interaction.comments
                    .length
                }
                onPress={() =>
                  setShowComments(
                    (current) =>
                      !current,
                  )
                }
              />

              <ShareButton
                title={item.title}
                description={
                  item.description
                }
              />
            </View>

            {/* Comments */}

            {showComments ? (
              <InlineComments
                comments={
                  interaction.comments
                }
                language={
                  appLanguage
                }
                currentUserId={
                  currentUser?.id
                }
                isAdmin={
                  currentUser?.role ===
                  'admin'
                }
                isUserLoading={
                  isCurrentUserLoading
                }
                onAddComment={
                  addComment
                }
                onDeleteComment={
                  deleteComment
                }
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}