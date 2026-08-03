import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  useAdminPosts,
} from '@/features/admin/hooks/useAdminPosts';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

export default function AdminPostReviewPage() {
  const router = useRouter();

  const {
    id,
    type,
  } =
    useLocalSearchParams<{
      id?: string | string[];
      type?: string | string[];
    }>();

  const {
    items,
    isLoading,
    approvePost,
    rejectPost,
    refresh,
  } = useAdminPosts();

  const [
    activeAction,
    setActiveAction,
  ] = useState<
    'publish' | 'reject' | null
  >(null);

  const postId =
    Array.isArray(id)
      ? id[0]
      : id;

  const postType =
    Array.isArray(type)
      ? type[0]
      : type;

  useEffect(() => {
    refresh();
  }, [refresh]);

  const item =
    useMemo(() => {
      return items.find(
        (post) =>
          post.id === postId &&
          (!postType ||
            post.type ===
              postType),
      );
    }, [
      items,
      postId,
      postType,
    ]);

  const handlePublish =
    async () => {
      if (!item) {
        return;
      }

      try {
        setActiveAction(
          'publish',
        );

        await approvePost(item);

        Toast.show({
          type: 'success',
          text1:
            'Post published',
          text2:
            'This post is now visible to readers.',
          position: 'top',
          visibilityTime: 1500,
        });

        setTimeout(() => {
          router.back();
        }, 500);
      } catch (error) {
        console.error(
          'Publish failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to publish post',
        });
      } finally {
        setActiveAction(null);
      }
    };

  const confirmReject =
    async (
      post: FeedItem,
    ) => {
      try {
        setActiveAction(
          'reject',
        );

        await rejectPost(post);

        Toast.show({
          type: 'success',
          text1:
            'Post rejected',
          text2:
            'The post was moved to the rejected section.',
          position: 'top',
          visibilityTime: 1500,
        });

        setTimeout(() => {
          router.back();
        }, 500);
      } catch (error) {
        console.error(
          'Reject failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to reject post',
          text2:
            error instanceof Error
              ? error.message
              : 'Please try again.',
          position: 'top',
        });
      } finally {
        setActiveAction(null);
      }
    };

  const handleReject =
    () => {
      if (
        !item ||
        activeAction
      ) {
        return;
      }

      if (
        Platform.OS === 'web'
      ) {
        const confirmed =
          window.confirm(
            'Reject this post? It will be moved to the rejected section.',
          );

        if (confirmed) {
          void confirmReject(
            item,
          );
        }

        return;
      }

      Alert.alert(
        'Reject post?',
        'This post will be moved to the rejected section.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Reject',
            style:
              'destructive',
            onPress: () => {
              void confirmReject(
                item,
              );
            },
          },
        ],
      );
    };

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center justify-center bg-slate-50"
      >
        <ActivityIndicator
          size="large"
          color="#F0442D"
        />

        <Text className="mt-3 font-semibold text-textMuted">
          Loading post...
        </Text>
      </SafeAreaView>
    );
  }

  if (!item) {
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
            className="h-10 w-10 items-center justify-center"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#121826"
            />
          </Pressable>

          <Text className="ml-2 text-xl font-black text-textMain">
            Review Post
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="document-outline"
            size={50}
            color="#94A3B8"
          />

          <Text className="mt-4 text-lg font-black text-textMain">
            Post not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPending =
    item.status ===
      'pending' ||
    item.status ===
      'unpublished' ||
    !item.status;

  const isProcessing =
    activeAction !== null;

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
            size={24}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-2 flex-1 text-xl font-black text-textMain">
          Review Post
        </Text>
      </View>

      {isPending ? (
        <View className="flex-row items-center border-b border-orange-100 bg-orange-50 px-4 py-3">
          <Ionicons
            name="time-outline"
            size={20}
            color="#EA580C"
          />

          <Text className="ml-2 text-sm font-bold text-orange-700">
            This post is waiting for your review
          </Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <View className="bg-white">
          {item.mediaUrl ? (
            <Image
              source={{
                uri: item.mediaUrl,
              }}
              resizeMode="cover"
              className="h-64 w-full bg-slate-100"
            />
          ) : (
            <View className="h-64 items-center justify-center bg-slate-100">
              <Ionicons
                name="image-outline"
                size={55}
                color="#94A3B8"
              />
            </View>
          )}

          <View className="p-5">
            <View className="self-start rounded-full bg-indigo-50 px-3 py-1">
              <Text className="text-xs font-black uppercase text-indigo-700">
                {item.type}
              </Text>
            </View>

            <Text className="mt-4 text-2xl font-black leading-8 text-textMain">
              {item.title}
            </Text>

            <View className="mt-4 flex-row items-center">
              <Ionicons
                name="calendar-outline"
                size={17}
                color="#64748B"
              />

              <Text className="ml-2 text-sm text-textMuted">
                {item.createdAt
                  ? new Date(
                      item.createdAt,
                    ).toLocaleString()
                  : 'Recently submitted'}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-4 rounded-3xl border border-borderSoft bg-white p-5">
          <Text className="text-base font-black text-textMain">
            Description
          </Text>

          <Text className="mt-3 text-sm leading-6 text-textMuted">
            {item.description ||
              'No description provided for this post.'}
          </Text>
        </View>

        <View className="mx-4 mt-4 rounded-3xl border border-borderSoft bg-white p-5">
          <Text className="text-base font-black text-textMain">
            Post Information
          </Text>

          <InfoRow
            label="Category"
            value={
              item.category ||
              'General'
            }
          />

          <InfoRow
            label="Type"
            value={item.type}
          />

          <InfoRow
            label="Language"
            value={
              item.language ||
              'Not specified'
            }
          />

          <InfoRow
            label="Status"
            value={
              isPending
                ? 'Pending Approval'
                : item.status ??
                  'Pending Approval'
            }
          />
        </View>
      </ScrollView>

      {isPending ? (
        <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 pb-5 pt-4">
          <View className="flex-row gap-3">
            <Pressable
              onPress={
                handleReject
              }
              disabled={
                isProcessing
              }
              className={`h-14 flex-1 flex-row items-center justify-center rounded-2xl border border-red-300 bg-red-50 ${
                isProcessing
                  ? 'opacity-50'
                  : ''
              }`}
            >
              {activeAction ===
              'reject' ? (
                <ActivityIndicator
                  color="#DC2626"
                />
              ) : (
                <>
                  <Ionicons
                    name="close"
                    size={22}
                    color="#DC2626"
                  />

                  <Text className="ml-2 text-base font-black text-red-600">
                    Reject
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={() => {
                void handlePublish();
              }}
              disabled={
                isProcessing
              }
              className={`h-14 flex-1 flex-row items-center justify-center rounded-2xl bg-green-600 ${
                isProcessing
                  ? 'opacity-50'
                  : ''
              }`}
            >
              {activeAction ===
              'publish' ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-base font-black text-white">
                    Publish
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View className="mt-4 flex-row items-center justify-between">
      <Text className="text-sm font-semibold text-textMuted">
        {label}
      </Text>

      <Text className="max-w-[60%] text-right text-sm font-black capitalize text-textMain">
        {value}
      </Text>
    </View>
  );
}