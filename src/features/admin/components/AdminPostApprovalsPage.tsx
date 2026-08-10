import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useAdminPosts,
  type AdminPostFilter,
} from '@/features/admin/hooks/useAdminPosts';

import type {
  FeedItem,
} from '@/features/news/types/news.types';

const FILTERS: {
  label: string;
  value: AdminPostFilter;
}[] = [
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
  {
    label: 'All',
    value: 'all',
  },
];

export default function AdminPostApprovalsPage() {
  const router = useRouter();

  const {
    filteredItems,
    filter,
    summary,
    isLoading,
    isRefreshing,
    error,
    setFilter,
    refresh,
  } = useAdminPosts();

  const openPost = (
    item: FeedItem,
  ) => {
    router.push({
      pathname:
        '/admin/post/[id]',
      params: {
        id: item.id,
        type: item.type,
      },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-50"
    >
      <View className="h-16 flex-row items-center border-b border-borderSoft bg-white px-4">
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

        <View className="ml-2 flex-1">
          <Text className="text-xl font-black text-textMain">
            Post Approvals
          </Text>

          <Text className="mt-0.5 text-xs font-medium text-textMuted">
            Review and manage submitted posts
          </Text>
        </View>

        <Pressable
          onPress={refresh}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color="#17336B"
          />
        </Pressable>
      </View>

      <View className="border-b border-slate-200 bg-white px-4 py-3">
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 8}}
          renderItem={({
            item,
          }) => {
            const isSelected =
              filter === item.value;

            let count = summary.total;

            if (
              item.value === 'pending'
            ) {
              count = summary.pending;
            }

            if (
              item.value === 'published'
            ) {
              count = summary.published;
            }

            if (
              item.value === 'rejected'
            ) {
              count = summary.rejected;
            }

            return (
              <Pressable
                onPress={() =>
                  setFilter(
                    item.value,
                  )
                 }
                className={`flex-row items-center rounded-xl px-4 py-2.5 ${
                  isSelected
                    ? 'bg-primary'
                    : 'bg-slate-100'
                }`}
              >
                <Text
                  className={`text-sm font-extrabold ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </Text>

                <View
                  className={`ml-2 min-w-6 items-center rounded-full px-1.5 py-0.5 ${
                    isSelected
                      ? 'bg-white/20'
                      : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${
                      isSelected
                        ? 'text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#F0442D"
          />

          <Text className="mt-3 text-sm font-semibold text-textMuted">
            Loading posts...
          </Text>
        </View>
      ) : error ? (
        <View className="m-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <Text className="font-bold text-red-700">
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(
            item,
          ) => `${item.type}-${item.id}`}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 50,
            flexGrow: 1,
          }}
          refreshing={
            isRefreshing
          }
          onRefresh={refresh}
          showsVerticalScrollIndicator={
            false
          }
          renderItem={({
            item,
          }) => (
            <AdminReviewCard
              item={item}
              onPress={() =>
                openPost(item)
              }
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <Ionicons
                  name="checkmark-done-outline"
                  size={30}
                  color="#16A34A"
                />
              </View>

              <Text className="mt-4 text-lg font-black text-textMain">
                No posts found
              </Text>

              <Text className="mt-2 text-center text-sm text-textMuted">
                No posts are available under this status.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

type AdminReviewCardProps = {
  item: FeedItem;
  onPress: () => void;
};

function AdminReviewCard({
  item,
  onPress,
}: AdminReviewCardProps) {
  const status =
    item.status ??
    'pending';

  const displayStatus =
    status ===
    'unpublished'
      ? 'Pending Approval'
      : status ===
          'pending'
        ? 'Pending Approval'
        : status;

  const statusStyle =
    status ===
    'published'
      ? {
          wrapper:
            'bg-green-50',
          text:
            'text-green-700',
        }
      : status ===
          'rejected'
        ? {
            wrapper:
              'bg-red-50',
            text:
              'text-red-700',
          }
        : {
            wrapper:
              'bg-orange-50',
            text:
              'text-orange-700',
          };

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-3xl border border-borderSoft bg-white active:opacity-75"
    >
      <View className="flex-row">
        <View className="h-36 w-32 bg-slate-100">
          {item.mediaUrl ? (
            <Image
              source={{
                uri: item.mediaUrl,
              }}
              resizeMode="cover"
              className="h-full w-full"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons
                name="image-outline"
                size={32}
                color="#94A3B8"
              />
            </View>
          )}
        </View>

        <View className="flex-1 p-4">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-indigo-50 px-3 py-1">
              <Text className="text-[11px] font-black uppercase text-indigo-700">
                {item.type}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${statusStyle.wrapper}`}
            >
              <Text
                className={`text-[10px] font-black capitalize ${statusStyle.text}`}
              >
                {displayStatus}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            className="mt-3 text-base font-black leading-5 text-textMain"
          >
            {item.title}
          </Text>

          <View className="mt-3 flex-row items-center">
            <Ionicons
              name="eye-outline"
              size={15}
              color="#64748B"
            />

            <Text className="ml-1 text-xs text-textMuted">
              0 views
            </Text>

            <View className="mx-2 h-1 w-1 rounded-full bg-slate-400" />

            <Ionicons
              name="heart-outline"
              size={14}
              color="#64748B"
            />

            <Text className="ml-1 text-xs text-textMuted">
              0 likes
            </Text>
          </View>

          <View className="mt-4 flex-row items-center">
            <Text className="text-sm font-black text-primary">
              Review post
            </Text>

            <Ionicons
              name="chevron-forward"
              size={17}
              color="#F0442D"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}