// src/features/admin/components/AdminPostCard.tsx

import {
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

type AdminPostCardProps = {
  item: FeedItem;
  onApprove: (
    item: FeedItem,
  ) => void;
  onReject: (
    item: FeedItem,
  ) => void;
  onUnpublish: (
    item: FeedItem,
  ) => void;
  onDelete: (
    item: FeedItem,
  ) => void;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80';

function getStatusStyle(
  status: PostStatus,
) {
  switch (status) {
    case 'published':
      return {
        label: 'Published',
        container:
          'bg-green-50',
        text: 'text-green-700',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        container: 'bg-red-50',
        text: 'text-red-700',
      };

    case 'unpublished':
      return {
        label: 'Unpublished',
        container:
          'bg-slate-100',
        text: 'text-slate-600',
      };

    case 'draft':
      return {
        label: 'Draft',
        container: 'bg-blue-50',
        text: 'text-blue-700',
      };

    default:
      return {
        label:
          'Pending Approval',
        container: 'bg-amber-50',
        text: 'text-amber-700',
      };
  }
}

export function AdminPostCard({
  item,
  onApprove,
  onReject,
  onUnpublish,
  onDelete,
}: AdminPostCardProps) {
  const router = useRouter();

  const isVideo =
    item.type === 'video';

  const status =
    item.status ?? 'pending';

  const statusStyle =
    getStatusStyle(status);

  const imageUrl =
    item.thumbnailUrl?.trim() ||
    item.mediaUrl?.trim() ||
    FALLBACK_IMAGE;

  const openPost = () => {
    if (isVideo) {
      router.push({
        pathname: '/video/[id]',
        params: {
          id: item.id,
        },
      });

      return;
    }

    router.push({
      pathname: '/article/[id]',
      params: {
        id: item.id,
      },
    });
  };

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-borderSoft bg-white">
      <Pressable
        onPress={openPost}
        className="flex-row active:opacity-75"
      >
        <View
          style={{
            width: 125,
            minHeight: 120,
            backgroundColor:
              '#E2E8F0',
          }}
        >
          <Image
            source={{
              uri: imageUrl,
            }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          {isVideo ? (
            <View className="absolute inset-0 items-center justify-center bg-black/25">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-black/70">
                <Ionicons
                  name="play"
                  size={21}
                  color="#FFFFFF"
                />
              </View>
            </View>
          ) : null}
        </View>

        <View className="min-w-0 flex-1 p-4">
          <View className="flex-row items-center justify-between gap-2">
            <View
              className={`rounded-full px-3 py-1 ${
                isVideo
                  ? 'bg-purple-50'
                  : 'bg-blue-50'
              }`}
            >
              <Text
                className={`text-xs font-extrabold ${
                  isVideo
                    ? 'text-purple-700'
                    : 'text-blue-700'
                }`}
              >
                {isVideo
                  ? 'VIDEO'
                  : 'NEWS'}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${statusStyle.container}`}
            >
              <Text
                className={`text-xs font-extrabold ${statusStyle.text}`}
              >
                {
                  statusStyle.label
                }
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            className="mt-3 text-base font-black leading-6 text-textMain"
          >
            {item.title}
          </Text>

          <View className="mt-3 flex-row items-center">
            <Ionicons
              name="eye-outline"
              size={14}
              color="#667085"
            />

            <Text className="ml-1 text-xs font-semibold text-textMuted">
              {item.views ?? 0}
            </Text>

            <View className="mx-2 h-1 w-1 rounded-full bg-slate-400" />

            <Ionicons
              name="heart-outline"
              size={14}
              color="#667085"
            />

            <Text className="ml-1 text-xs font-semibold text-textMuted">
              {item.likes ?? 0}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="h-px bg-borderSoft" />

      {status === 'pending' ? (
        <View className="flex-row">
          <Pressable
            onPress={() =>
              onApprove(item)
            }
            className="flex-1 flex-row items-center justify-center py-4 active:bg-green-50"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#16A34A"
            />

            <Text className="ml-2 text-sm font-extrabold text-green-700">
              Approve
            </Text>
          </Pressable>

          <View className="w-px bg-borderSoft" />

          <Pressable
            onPress={() =>
              onReject(item)
            }
            className="flex-1 flex-row items-center justify-center py-4 active:bg-red-50"
          >
            <Ionicons
              name="close-circle-outline"
              size={20}
              color="#DC2626"
            />

            <Text className="ml-2 text-sm font-extrabold text-red-600">
              Reject
            </Text>
          </Pressable>
        </View>
      ) : null}

      {status === 'published' ? (
        <Pressable
          onPress={() =>
            onUnpublish(item)
          }
          className="flex-row items-center justify-center py-4 active:bg-slate-50"
        >
          <Ionicons
            name="cloud-offline-outline"
            size={20}
            color="#475569"
          />

          <Text className="ml-2 text-sm font-extrabold text-slate-700">
            Unpublish
          </Text>
        </Pressable>
      ) : null}

      {status === 'rejected' ||
      status === 'unpublished' ? (
        <View className="flex-row">
          <Pressable
            onPress={() =>
              onApprove(item)
            }
            className="flex-1 flex-row items-center justify-center py-4 active:bg-green-50"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#16A34A"
            />

            <Text className="ml-2 text-sm font-extrabold text-green-700">
              Publish
            </Text>
          </Pressable>

          <View className="w-px bg-borderSoft" />

          <Pressable
            onPress={() =>
              onDelete(item)
            }
            className="flex-1 flex-row items-center justify-center py-4 active:bg-red-50"
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#DC2626"
            />

            <Text className="ml-2 text-sm font-extrabold text-red-600">
              Delete
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}