// src/features/posts/components/PostDashboard.tsx

import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EmptyState } from '@/components/ui/EmptyState';

import { MyPostCard } from '@/features/posts/components/MyPostCard';
import { PostSummary } from '@/features/posts/components/PostSummary';

import {
  type MyPostFilter,
  useMyPosts,
} from '@/features/posts/hooks/useMyPosts';

import { useProfile } from '@/features/profile/hooks/useProfile';

import {
  deleteCreatedNews,
  updateCreatedNewsStatus,
} from '@/features/news/storage/newsStorage';

import {
  deleteCreatedVideo,
  updateCreatedVideoStatus,
} from '@/features/videos/storage/videoStorage';

import type { FeedItem } from '@/features/news/types/news.types';

export function PostDashboard() {
  const router = useRouter();

  const { profile } = useProfile();

  const isAdmin =
    profile?.role === 'admin';

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
  ] = useState<MyPostFilter>('all');

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items;
    }

    return items.filter(
      (item) =>
        item.type === activeFilter,
    );
  }, [activeFilter, items]);

  const refreshPosts =
    useCallback(async () => {
      try {
        setIsRefreshing(true);

        await refetch();
      } catch (refreshError) {
        console.error(
          'Refresh posts failed:',
          refreshError,
        );
      } finally {
        setIsRefreshing(false);
      }
    }, [refetch]);

  const handlePublish =
    useCallback(
      async (item: FeedItem) => {
        if (!isAdmin) {
          Toast.show({
            type: 'error',
            text1:
              'Admin access required',
            text2:
              'Only an admin can publish this post.',
            position: 'top',
          });

          return;
        }

        try {
          if (item.type === 'video') {
            await updateCreatedVideoStatus(
              item.id,
              'published',
            );
          } else {
            await updateCreatedNewsStatus(
              item.id,
              'published',
            );
          }

          await refetch();

          Toast.show({
            type: 'success',
            text1: 'Post published',
            text2:
              'The post is now visible to users.',
            position: 'top',
            visibilityTime: 1800,
          });
        } catch (publishError) {
          console.error(
            'Publish post failed:',
            publishError,
          );

          Toast.show({
            type: 'error',
            text1: 'Publish failed',
            text2:
              'Unable to publish the post.',
            position: 'top',
          });
        }
      },
      [isAdmin, refetch],
    );

  const unpublishPost =
    useCallback(
      async (item: FeedItem) => {
        if (!isAdmin) {
          Toast.show({
            type: 'error',
            text1:
              'Admin access required',
            text2:
              'Only an admin can unpublish this post.',
            position: 'top',
          });

          return;
        }

        if (
          item.status !== 'published'
        ) {
          return;
        }

        try {
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
            text1:
              'Post unpublished',
            text2:
              'The post is no longer visible to users.',
            position: 'top',
            visibilityTime: 1800,
          });
        } catch (unpublishError) {
          console.error(
            'Post unpublish failed:',
            unpublishError,
          );

          Toast.show({
            type: 'error',
            text1: 'Update failed',
            text2:
              'Unable to unpublish the post.',
            position: 'top',
          });
        }
      },
      [isAdmin, refetch],
    );

  const deletePost =
    useCallback(
      async (item: FeedItem) => {
        try {
          if (item.type === 'video') {
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
            text1: 'Post deleted',
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
            text1: 'Delete failed',
            text2:
              'Unable to delete the post.',
            position: 'top',
          });
        }
      },
      [refetch],
    );

  const confirmDelete =
    useCallback(
      (item: FeedItem) => {
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
              style: 'destructive',
              onPress: () => {
                void deletePost(item);
              },
            },
          ],
        );
      },
      [deletePost],
    );

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-50"
    >
      <View className="h-14 flex-row items-center border-b border-borderSoft bg-white px-4">
        <Pressable
          onPress={() =>
            router.back()
          }
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#121826"
          />
        </Pressable>

        <View className="ml-2 flex-1">
          <Text className="text-xl font-black text-textMain">
            My Posts
          </Text>
        </View>

        {isAdmin ? (
          <View className="rounded-full bg-indigo-50 px-3 py-1.5">
            <Text className="text-xs font-extrabold text-indigo-700">
              ADMIN
            </Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <MyPostCard
            item={item}
            isAdmin={isAdmin}
            onPublish={
              handlePublish
            }
            onUnpublish={
              unpublishPost
            }
            onDelete={
              confirmDelete
            }
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
            onRefresh={() => {
              void refreshPosts();
            }}
            tintColor="#F0442D"
            colors={['#F0442D']}
          />
        }
        ListHeaderComponent={
          <>
            <PostSummary
              summary={summary}
              activeFilter={
                activeFilter
              }
              filteredCount={
                filteredItems.length
              }
              onFilterChange={
                setActiveFilter
              }
            />

            {isLoading ? (
              <View className="items-center py-12">
                <ActivityIndicator
                  size="large"
                  color="#F0442D"
                />

                <Text className="mt-3 text-sm font-semibold text-textMuted">
                  Loading posts...
                </Text>
              </View>
            ) : null}

            {error ? (
              <View className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                <Text className="font-bold text-red-600">
                  {error}
                </Text>

                <Pressable
                  onPress={() => {
                    void refetch();
                  }}
                  className="mt-3 self-start rounded-xl bg-red-600 px-4 py-2"
                >
                  <Text className="font-bold text-white">
                    Retry
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !isLoading &&
          !error ? (
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