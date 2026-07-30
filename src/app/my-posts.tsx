import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { EmptyState } from '@/components/ui/EmptyState';
import { MyPostCard } from '@/components/posts/MyPostCard';
import { PostSummaryCard } from '@/components/posts/PostSummaryCard';

import {
  useMyPosts,
  type MyPostFilter,
} from '@/features/posts/hooks/useMyPosts';

import {
  deleteCreatedNews,
  updateCreatedNewsStatus,
} from '@/features/news/storage/newsStorage';

import {
  deleteCreatedVideo,
  updateCreatedVideoStatus,
} from '@/features/news/storage/videoStorage';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

const FILTERS: {
  label: string;
  value: MyPostFilter;
}[] = [
  {
    label: 'All Posts',
    value: 'all',
  },
  {
    label: 'News',
    value: 'news',
  },
  {
    label: 'Videos',
    value: 'video',
  },
];

export default function MyPostsScreen() {
  const router = useRouter();

  const {
    items,
    summary,
    isLoading,
    error,
    refetch,
  } = useMyPosts();

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<MyPostFilter>(
      'all',
    );

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const filteredItems =
    useMemo(() => {
      if (
        activeFilter ===
        'all'
      ) {
        return items;
      }

      return items.filter(
        (item) =>
          item.type ===
          activeFilter,
      );
    }, [
      activeFilter,
      items,
    ]);

  const refreshPosts =
    async () => {
      try {
        setIsRefreshing(true);
        await refetch();
      } finally {
        setIsRefreshing(false);
      }
    };

    const handleUnpublish = (
        item: FeedItem,
        ) => {
        Alert.alert(
            'Unpublish post',
            'This post will no longer be public. Only an admin can publish it again.',
            [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Unpublish',
                style: 'destructive',
                onPress: () =>
                void unpublishPost(item),
            },
            ],
        );
        };

        const unpublishPost = async (
        item: FeedItem,
        ) => {
        try {
            if (item.status !== 'published') {
            return;
            }

            if (item.type === 'video') {
            await updateCreatedVideoStatus(
                item.id,
                'unpublished',
            );
            } else {
            await updateCreatedNewsStatus(
                item.id,
                'unpublished',
            );
            }

            await refetch();

            Toast.show({
            type: 'success',
            text1: 'Post unpublished',
            text2:
                'Only an admin can publish this post again.',
            position: 'top',
            visibilityTime: 1800,
            });
        } catch (error) {
            console.error(
            'Post unpublish failed:',
            error,
            );

            Toast.show({
            type: 'error',
            text1: 'Update failed',
            text2:
                'Unable to unpublish the post.',
            position: 'top',
            });
        }
        };


  const confirmDelete = (
    item: FeedItem,
  ) => {
    Alert.alert(
      'Delete post',
      `Delete "${item.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style:
            'destructive',
          onPress: () =>
            void deletePost(
              item,
            ),
        },
      ],
    );
  };

  const deletePost =
    async (
      item: FeedItem,
    ) => {
      try {
        if (
          item.type ===
          'video'
        ) {
          await deleteCreatedVideo(
            item.id,
          );
        } else {
          await deleteCreatedNews(
            item.id,
          );
        }

        await refetch();

        Toast.show({
          type: 'success',
          text1:
            'Post deleted',
          text2:
            'The post was removed successfully.',
          position: 'top',
        });
      } catch (deleteError) {
        console.error(
          'Delete post failed:',
          deleteError,
        );

        Toast.show({
          type: 'error',
          text1:
            'Delete failed',
          text2:
            'Unable to delete the post.',
          position: 'top',
        });
      }
    };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="h-14 flex-row items-center border-b border-borderSoft bg-white px-4">
        <Pressable
          onPress={() =>
            router.back()
          }
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-2 text-xl font-black text-textMain">
          My Posts
        </Text>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({
          item,
        }) => (
          <MyPostCard
            item={item}
            onDelete={confirmDelete}
            onUnpublish={handleUnpublish}
            />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 50,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={() =>
              void refreshPosts()
            }
          />
        }
        ListHeaderComponent={
          <>
            <Text className="text-2xl font-black text-textMain">
              Your Content
            </Text>

            <Text className="mt-1 text-sm text-textMuted">
              Review your submitted
              news and videos.
            </Text>

            <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
              <PostSummaryCard
                title="Total Posts"
                value={
                  summary.totalPosts
                }
                icon="documents-outline"
                iconColor="#F0442D"
                iconBackground="#FFF1ED"
              />

              <PostSummaryCard
                title="Total News"
                value={
                  summary.totalNews
                }
                icon="newspaper-outline"
                iconColor="#2563EB"
                iconBackground="#EFF6FF"
              />

              <PostSummaryCard
                title="Total Videos"
                value={
                  summary.totalVideos
                }
                icon="videocam-outline"
                iconColor="#7C3AED"
                iconBackground="#F5F3FF"
              />

              <PostSummaryCard
                title="Favorites"
                value={
                  summary.totalFavorites
                }
                icon="heart-outline"
                iconColor="#E11D48"
                iconBackground="#FFF1F2"
              />

              <PostSummaryCard
                title="Total Views"
                value={
                  summary.totalViews
                }
                icon="eye-outline"
                iconColor="#059669"
                iconBackground="#ECFDF5"
              />
            </View>

            <View className="mt-6 flex-row rounded-2xl border border-borderSoft bg-white p-1">
              {FILTERS.map(
                (filter) => {
                  const selected =
                    activeFilter ===
                    filter.value;

                  return (
                    <Pressable
                      key={
                        filter.value
                      }
                      onPress={() =>
                        setActiveFilter(
                          filter.value,
                        )
                      }
                      className={`flex-1 items-center rounded-xl py-3 ${
                        selected
                          ? 'bg-primarySoft'
                          : 'bg-white'
                      }`}
                    >
                      <Text
                        className={`text-sm font-extrabold ${
                          selected
                            ? 'text-primary'
                            : 'text-textMuted'
                        }`}
                      >
                        {
                          filter.label
                        }
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>

            <View className="mb-4 mt-5 flex-row items-center justify-between">
              <Text className="text-lg font-black text-textMain">
                Submitted Posts
              </Text>

              <Text className="text-sm font-bold text-textMuted">
                {
                  filteredItems.length
                }
              </Text>
            </View>

            {isLoading ? (
              <View className="items-center py-12">
                <ActivityIndicator
                  color="#F0442D"
                />

                <Text className="mt-3 text-sm font-semibold text-textMuted">
                  Loading posts...
                </Text>
              </View>
            ) : null}

            {error ? (
              <View className="mb-4 rounded-2xl bg-red-50 p-4">
                <Text className="font-bold text-red-600">
                  {error}
                </Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState message="No posts available" />
          ) : null
        }
        showsVerticalScrollIndicator={
          false
        }
      />
    </SafeAreaView>
  );
}