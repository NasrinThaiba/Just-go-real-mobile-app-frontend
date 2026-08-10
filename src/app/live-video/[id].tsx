import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import YoutubePlayer from 'react-native-youtube-iframe';

import { CommentButton } from '@/components/interactions/CommentButton';
import { FavoriteButton } from '@/components/interactions/FavoriteButton';
import { InlineComments } from '@/components/interactions/InlineComments';
import { ShareButton } from '@/components/interactions/ShareButton';

import { useCurrentInteractionUser } from '@/features/auth/hooks/useCurrentInteractionUser';
import { useContentInteractions } from '@/features/interactions/hooks/useContentInteractions';
import { useNews } from '@/features/news/hooks/useNews';

import { useAppLanguage } from '@/hooks/useAppLanguage';

import {
  formatPublishedTime,
  formatViews,
} from '@/utils/content-formatters';

export default function LiveVideoDetailsScreen() {
  const router = useRouter();

  const {
    currentLanguage,
  } = useAppLanguage();

  const {
    id,
  } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const liveVideoId =
    typeof id === 'string'
      ? id
      : '';

  const {
    items,
    isLoading,
  } = useNews(
    currentLanguage,
  );

  const liveVideo =
    useMemo(() => {
      return items.find(
        (item) =>
          item.id ===
            liveVideoId &&
          item.type ===
            'video' &&
          item.videoType ===
            'live' &&
          item.status ===
            'published',
      );
    }, [
      items,
      liveVideoId,
    ]);

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center justify-center bg-white"
      >
        <Text className="text-sm font-semibold text-textMuted">
          Loading live video...
        </Text>
      </SafeAreaView>
    );
  }

  if (!liveVideo) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 bg-white"
      >
        <View className="flex-row items-center px-4 py-4">
          <Pressable
            onPress={() =>
              router.back()
            }
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#121826"
            />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="radio-outline"
            size={44}
            color="#98A2B3"
          />

          <Text className="mt-4 text-lg font-black text-textMain">
            Live video not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LiveVideoContent
      liveVideo={liveVideo}
      onBack={() =>
        router.back()
      }
      language={currentLanguage}
    />
  );
}

type LiveVideoContentProps = {
  liveVideo: any;
  onBack: () => void;
  language: 'en' | 'ta';
};

function LiveVideoContent({
  liveVideo,
  onBack,
  language,
}: LiveVideoContentProps) {
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
    addComment,
    deleteComment,
  } = useContentInteractions(
    liveVideo.id,
    currentUser,
  );

  const totalFavorites =
    (liveVideo.likes ?? 0) +
    (interaction.isFavorite
      ? 1
      : 0);

  const displayDate =
    liveVideo.publishedAt ??
    liveVideo.createdAt;

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
        Toast.show({
          type: 'error',
          text1:
            'Unable to update favorite',
          position: 'top',
        });
      }
    };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
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
        {/* Header */}

        <View className="flex-row items-center border-b border-slate-100 px-4 py-4">
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#121826"
            />
          </Pressable>

          <View className="ml-3 flex-1">
            <Text className="text-lg font-black text-textMain">
              Live News
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-red-50 px-3 py-1.5">
            <View className="mr-2 h-2 w-2 rounded-full bg-red-500" />

            <Text className="text-[11px] font-black text-red-600">
              LIVE
            </Text>
          </View>
        </View>

        {/* Player */}

        <View className="bg-black">
          {liveVideo.youtubeVideoId ? (
            <YoutubePlayer
              height={230}
              play
              videoId={
                liveVideo.youtubeVideoId
              }
            />
          ) : (
            <View className="h-56 items-center justify-center bg-black">
              <Ionicons
                name="videocam-off-outline"
                size={40}
                color="#FFFFFF"
              />

              <Text className="mt-3 text-sm font-semibold text-white">
                Live stream unavailable
              </Text>
            </View>
          )}
        </View>

        {/* Details */}

        <View className="px-4 py-5">
          <View className="self-start flex-row items-center rounded-full bg-[#F0442D] px-3 py-1.5">
            <View className="mr-2 h-2 w-2 rounded-full bg-white" />

            <Text className="text-[11px] font-black text-white">
              LIVE NOW
            </Text>
          </View>

          <Text className="mt-4 text-2xl font-black leading-8 text-textMain">
            {liveVideo.title}
          </Text>

          {liveVideo.description ? (
            <Text className="mt-4 text-base leading-7 text-slate-700">
              {
                liveVideo.description
              }
            </Text>
          ) : null}

          {/* Publisher */}

          <View className="mt-5 flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-[#FFF1EE]">
              <Ionicons
                name="radio-outline"
                size={21}
                color="#F0442D"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text
                numberOfLines={1}
                className="text-[15px] font-extrabold text-textMain"
              >
                {liveVideo.author ||
                  'Live News'}
              </Text>

              <View className="mt-1.5 flex-row items-center">
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color="#667085"
                  />

                  <Text className="ml-1 text-[12px] font-semibold text-textMuted">
                    {formatPublishedTime(
                      displayDate,
                    )}
                  </Text>
                </View>

                <View className="mx-2 h-1 w-1 rounded-full bg-slate-300" />

                <View className="flex-row items-center">
                  <Ionicons
                    name="eye-outline"
                    size={14}
                    color="#667085"
                  />

                  <Text className="ml-1 text-[12px] font-semibold text-textMuted">
                    {formatViews(
                      liveVideo.views ?? 0,
                    )}{' '}
                    views
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Like / Comment / Share */}

          <View className="mt-8 flex-row items-center justify-between border-t border-borderSoft pt-5">
            <FavoriteButton
              selected={
                interaction.isFavorite
              }
              count={
                totalFavorites
              }
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
              title={
                liveVideo.title
              }
              description={
                liveVideo.description
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
                language
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
      </ScrollView>
    </SafeAreaView>
  );
}