import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import type {
  FeedItem,
  PostStatus,
} from '@/features/news/types/news.types';

type MyPostCardProps = {
  item: FeedItem;
  onDelete: (item: FeedItem) => void;
  onUnpublish: (item: FeedItem) => void;
};

type StatusDetails = {
  label: string;
  containerClass: string;
  textClass: string;
};

function getStatusDetails(
  status: PostStatus,
): StatusDetails {
  switch (status) {
    case 'published':
      return {
        label: 'Published',
        containerClass: 'bg-green-50',
        textClass: 'text-green-700',
      };

    case 'unpublished':
      return {
        label: 'Unpublished',
        containerClass: 'bg-slate-100',
        textClass: 'text-slate-600',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        containerClass: 'bg-red-50',
        textClass: 'text-red-700',
      };

    case 'draft':
      return {
        label: 'Draft',
        containerClass: 'bg-blue-50',
        textClass: 'text-blue-700',
      };

    case 'withdrawn':
      return {
        label: 'Withdrawn',
        containerClass: 'bg-slate-100',
        textClass: 'text-slate-600',
      };

    case 'pending':
    default:
      return {
        label: 'Pending Approval',
        containerClass: 'bg-amber-50',
        textClass: 'text-amber-700',
      };
  }
}

export function MyPostCard({
  item,
  onDelete,
  onUnpublish,
}: MyPostCardProps) {
  const router = useRouter();

  const isVideo =
    item.type === 'video';

  const currentStatus =
    item.status ?? 'pending';

  const statusDetails =
    getStatusDetails(currentStatus);

  const isPublished =
    currentStatus === 'published';

  /*
   * Only a published post can be switched off.
   * Pending/unpublished posts cannot be switched on by the user.
   */
  const canUnpublish = isPublished;

  const editPost = () => {
    if (isVideo) {
      router.push({
        pathname: '/create-video',
        params: {
          id: item.id,
          mode: 'edit',
        },
      });

      return;
    }

    router.push({
      pathname: '/create-news',
      params: {
        id: item.id,
        mode: 'edit',
      },
    });
  };

  const handlePublishSwitch = (
    enabled: boolean,
  ) => {
    // The user cannot publish a post.
    if (enabled) {
      return;
    }

    if (isPublished) {
      onUnpublish(item);
    }
  };

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-borderSoft bg-white">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View
            className={`rounded-full px-3 py-1.5 ${
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
            className={`rounded-full px-3 py-1.5 ${statusDetails.containerClass}`}
          >
            <Text
              className={`text-xs font-extrabold ${statusDetails.textClass}`}
            >
              {statusDetails.label}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          className="mt-4 text-lg font-black leading-6 text-textMain"
        >
          {item.title}
        </Text>
      </View>

      <View className="h-px bg-borderSoft" />

      <View className="flex-row">
        <View className="flex-1 flex-row items-center justify-center px-3 py-3.5">
          <Text
            className={`mr-3 text-sm font-bold ${
              isPublished
                ? 'text-green-700'
                : 'text-textMuted'
            }`}
          >
            {isPublished
              ? 'Published'
              : 'Unpublished'}
          </Text>

          <Switch
            value={isPublished}
            disabled={!canUnpublish}
            onValueChange={
              handlePublishSwitch
            }
            trackColor={{
              false: '#CBD5E1',
              true: '#86EFAC',
            }}
            thumbColor={
              isPublished
                ? '#16A34A'
                : '#F8FAFC'
            }
          />
        </View>

        <View className="w-px bg-borderSoft" />

        <Pressable
          onPress={editPost}
          disabled={isPublished}
          className={`flex-1 flex-row items-center justify-center py-3.5 ${
            isPublished
              ? 'opacity-40'
              : ''
          }`}
        >
          <Ionicons
            name="create-outline"
            size={19}
            color="#17336B"
          />

          <Text className="ml-2 text-sm font-bold text-blue-900">
            Edit
          </Text>
        </Pressable>

        <View className="w-px bg-borderSoft" />

        <Pressable
          onPress={() =>
            onDelete(item)
          }
          className="flex-1 flex-row items-center justify-center py-3.5"
        >
          <Ionicons
            name="trash-outline"
            size={19}
            color="#DC2626"
          />

          <Text className="ml-2 text-sm font-bold text-red-600">
            Delete
          </Text>
        </Pressable>
      </View>

      {currentStatus === 'pending' ? (
        <View className="border-t border-borderSoft bg-amber-50 px-4 py-3">
          <Text className="text-xs font-semibold leading-5 text-amber-700">
            Waiting for admin approval. You cannot publish this post.
          </Text>
        </View>
      ) : null}

      {currentStatus === 'unpublished' ? (
        <View className="border-t border-borderSoft bg-slate-50 px-4 py-3">
          <Text className="text-xs font-semibold leading-5 text-slate-600">
            You unpublished this post. Only an admin can publish it again.
          </Text>
        </View>
      ) : null}
    </View>
  );
}