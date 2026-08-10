import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useVideoPlayer,
  VideoView,
} from 'expo-video';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import YoutubePlayer from 'react-native-youtube-iframe';

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
const VIDEO_ASPECT_RATIO =
  16 / 9;

type ExpoVideoPlayerProps = {
  uri: string;
  width: number;
};

function ExpoVideoPlayer({
  uri,
  width,
}: ExpoVideoPlayerProps) {
  const player = useVideoPlayer(
    uri,
    (videoPlayer) => {
      videoPlayer.loop = false;
    },
  );

  const playerHeight =
    width > 0
      ? width /
        VIDEO_ASPECT_RATIO
      : 300;

  return (
    <View
      style={{
        width: '100%',
        height: playerHeight,
      }}
      className="overflow-hidden bg-black"
    >
      <VideoView
        player={player}
        nativeControls
        contentFit="contain"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </View>
  );
}

type YouTubeVideoPlayerProps = {
  videoId: string;
  playing?: boolean;
  width: number;
};

function YouTubeVideoPlayer({
  videoId,
  playing = false,
  width,
}: YouTubeVideoPlayerProps) {
  const playerHeight =
    width > 0
      ? width /
        VIDEO_ASPECT_RATIO
      : 300;

  return (
    <View
      style={{
        width: '100%',
        height: playerHeight,
      }}
      className="overflow-hidden bg-black"
    >
      {width > 0 ? (
        <YoutubePlayer
          width={width}
          height={playerHeight}
          play={playing}
          videoId={videoId}
          webViewStyle={{
            width: '100%',
            height: '100%',
            backgroundColor:
              '#000000',
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: playerHeight,
          }}
          className="bg-black"
        />
      )}
    </View>
  );
}

export default function VideoDetailsScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { id } = useLocalSearchParams<{id?: string}>();
  const videoId = typeof id === 'string' ? id : '';
  const { item, isLoading, error } = useNewsDetails(videoId);
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
          message={ error ?? 'Video not found'}
        />
      </SafeAreaView>
    );
  }

  if (item.type !== 'video') {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 bg-white"
      >
        <ErrorView message="This content is not a video." />
      </SafeAreaView>
    );
  }

  return (
    <DirectVideoScreen
      item={item}
      appLanguage={appLanguage}
      onBack={() =>
        router.back()
      }
    />
  );
}

type DirectVideoScreenProps = {
  item: FeedItem;
  appLanguage: 'en' | 'ta';
  onBack: () => void;
};

function DirectVideoScreen({
  item,
  appLanguage,
  onBack,
}: DirectVideoScreenProps) {
  const [ showComments, setShowComments ] = useState(false);
  const [ playerWidth, setPlayerWidth ] = useState(0);
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentInteractionUser();
  const {
    interaction,
    toggleFavorite,
    toggleBookmark,
    addComment,
    deleteComment,
  } = useContentInteractions( item.id, currentUser );

  const displayDate = item.publishedAt ?? item.createdAt;
  const totalFavorites =
  (item.likes ?? 0) +
  (interaction.isFavorite
    ? 1
    : 0);

  const isYouTubeVideo =
    item.videoSource === 'youtube' &&
    Boolean( item.youtubeVideoId);

  const handlePlayerLayout = (
    event: LayoutChangeEvent,
  ) => {
    const measuredWidth =
      event.nativeEvent.layout.width;

    if (
      measuredWidth > 0 &&
      Math.abs( measuredWidth - playerWidth) > 1
    ) {
      setPlayerWidth(measuredWidth);
    }
  };

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
        console.error( 'Favorite update failed:', error);

        Toast.show({
          type: 'error',
          text1: 'Unable to update favorite',
          position: 'top',
        });
      }
    };

  const handleBookmark =
    async () => {
      try {
        const updated = await toggleBookmark();
        Toast.show({
          type: 'success',
          text1:
            updated.isBookmarked
              ? 'Video bookmarked'
              : 'Bookmark removed',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        console.error('Bookmark update failed:', error);
        Toast.show({
          type: 'error',
          text1:'Unable to update bookmark',
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
        contentContainerStyle={{paddingBottom: 40}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{maxWidth:CONTENT_MAX_WIDTH}}
          className="mx-auto w-full bg-white"
        >
          {/* Video */}

          <View
            onLayout={handlePlayerLayout}
            className="relative w-full overflow-hidden bg-black"
          >
            {isYouTubeVideo &&
            item.youtubeVideoId ? (
              <YouTubeVideoPlayer
                videoId={item.youtubeVideoId}
                width={playerWidth}
                playing
              />
            ) : (
              <ExpoVideoPlayer
                uri={item.mediaUrl}
                width={playerWidth}
              />
            )}

            {/* Header actions */}

            <View className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4 pt-4">
              <Pressable
                onPress={onBack}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                className="h-10 w-10 items-center justify-center rounded-full bg-black/55 active:opacity-75"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>

              <View className="flex-row items-center gap-3">
                <BookmarkButton
                  selected={interaction.isBookmarked}
                  onPress={() =>void handleBookmark()}
                  variant="header"
                />

                <ShareButton
                  title={item.title}
                  description={item.description}
                  variant="header"
                />
              </View>
            </View>
          </View>

          {/* Video details */}

          <View className="px-4 pb-4">
            {/* Badges */}

            <View className="mt-5 flex-row flex-wrap gap-2">
              {item.videoType ? (
                <View className="rounded-full bg-primarySoft px-3 py-1.5">
                  <Text className="text-xs font-extrabold capitalize text-primary">
                    {item.videoType}
                  </Text>
                </View>
              ) : null}

              {item.category ? (
                <View className="rounded-full bg-blue-50 px-3 py-1.5">
                  <Text className="text-xs font-extrabold capitalize text-blue-700">
                    {item.category}
                  </Text>
                </View>
              ) : null}

              {item.location ? (
                <View className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-xs font-bold capitalize text-textMuted">
                    {item.location.replace(/-/g,' ', )}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Title */}

            <Text className="mt-5 text-3xl font-black leading-10 text-textMain">
              {item.title}
            </Text>

            {/* Publisher */}

            <View className="mt-4 flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primarySoft">
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="#F0442D"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-sm font-extrabold text-textMain">
                  {item.author ||'Just Go Real'}
                </Text>

                <Text className="mt-1 text-xs font-medium text-textMuted">
                  {formatRelativeDate(displayDate,appLanguage)}
                </Text>
              </View>
            </View>

            {/* Description */}

            {item.description ? (
              <Text className="mt-6 text-base leading-8 text-slate-700">
                {item.description}
              </Text>
            ) : null}

            {/* Interactions */}

            <View className="mt-8 flex-row items-center justify-between border-t border-borderSoft pt-5">
              <FavoriteButton
                selected={interaction.isFavorite}
                count={totalFavorites}
                onPress={() =>
                  void handleFavorite()
                }
              />

              <CommentButton
                count={interaction.comments.length}
                onPress={() =>
                  setShowComments(
                    (current) =>!current,
                  )
                }
              />

              <ShareButton
                title={item.title}
                description={item.description}
              />
            </View>

            {/* Comments */}

            {showComments ? (
              <InlineComments
                comments={ interaction.comments }
                language={ appLanguage }
                currentUserId={ currentUser?.id }
                isAdmin={ currentUser?.role === 'admin'}
                isUserLoading={ isCurrentUserLoading }
                onAddComment={ addComment }
                onDeleteComment={ deleteComment }
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}