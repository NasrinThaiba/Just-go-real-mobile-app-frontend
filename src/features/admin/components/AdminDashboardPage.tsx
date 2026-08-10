import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminPosts } from '@/features/admin/hooks/useAdminPosts';

export default function AdminDashboardPage() {
  const router = useRouter();

  const {
    summary,
    isLoading,
    error,
    refresh,
  } = useAdminPosts();

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
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#121826"
          />
        </Pressable>

        <View className="ml-2 flex-1">
          <Text className="text-xl font-black text-textMain">
            Admin Dashboard
          </Text>
        </View>

        <Pressable
          onPress={refresh}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons
            name="refresh"
            size={22}
            color="#17336B"
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#F0442D"
          />

          <Text className="mt-3 font-semibold text-textMuted">
            Loading dashboard...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={
            false
          }
        >
          <View className="rounded-3xl bg-blue-950 p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Ionicons
                  name="shield-checkmark"
                  size={27}
                  color="#FFFFFF"
                />
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-xl font-black text-white">
                  Admin Control
                </Text>

                <Text className="mt-1 text-sm leading-5 text-blue-100">
                  Review posts and manage application content.
                </Text>
              </View>
            </View>
          </View>

          {error ? (
            <View className="mt-5 rounded-2xl bg-red-50 p-4">
              <Text className="font-bold text-red-700">
                {error}
              </Text>
            </View>
          ) : null}

          <View className="mt-5 flex-row gap-3">
            <SummaryCard
              label="Total Posts"
              value={summary.total}
              icon="documents-outline"
            />

            <SummaryCard
              label="Pending"
              value={summary.pending}
              icon="time-outline"
            />
          </View>

          <View className="mt-3 flex-row gap-3">
            <SummaryCard
              label="Published"
              value={
                summary.published
              }
              icon="checkmark-circle-outline"
            />

            <SummaryCard
              label="Rejected"
              value={summary.rejected}
              icon="close-circle-outline"
            />
          </View>

          <Text className="mb-3 mt-7 text-sm font-extrabold uppercase tracking-wide text-textMuted">
            Management
          </Text>

          <AdminMenuItem
            icon="checkmark-done-outline"
            title="Post Approvals"
            description={`${summary.pending} posts waiting for approval`}
            onPress={() =>
              router.push(
                '/admin/post-approval',
              )
            }
          />

          <AdminMenuItem
            icon="people-outline"
            title="User Management"
            description="View and manage registered users"
            onPress={() =>
              router.push(
                '/admin/users',
              )
            }
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
};

function SummaryCard({
  label,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <View className="flex-1 rounded-2xl border border-borderSoft bg-white p-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
        <Ionicons
          name={icon}
          size={21}
          color="#F0442D"
        />
      </View>

      <Text className="mt-4 text-2xl font-black text-textMain">
        {value}
      </Text>

      <Text className="mt-1 text-sm font-semibold text-textMuted">
        {label}
      </Text>
    </View>
  );
}

type AdminMenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
};

function AdminMenuItem({
  icon,
  title,
  description,
  onPress,
}: AdminMenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-borderSoft bg-white p-4 active:bg-slate-50"
    >
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
        <Ionicons
          name={icon}
          size={24}
          color="#4F46E5"
        />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-black text-textMain">
          {title}
        </Text>

        <Text className="mt-1 text-sm leading-5 text-textMuted">
          {description}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color="#98A2B3"
      />
    </Pressable>
  );
}