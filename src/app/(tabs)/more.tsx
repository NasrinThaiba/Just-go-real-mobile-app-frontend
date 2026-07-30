import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/layout/AppHeader';

export default function MoreScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <AppHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pb-3 pt-2">
          <Text className="text-2xl font-black text-textMain">
            {t('tabs.more')}
          </Text>

          <Text className="mt-1 text-sm text-textMuted">
            Manage your profile, content and settings
          </Text>
        </View>

        <View className="mt-3 px-4">
          <Text className="mb-3 text-sm font-extrabold uppercase tracking-wide text-textMuted">
            Account
          </Text>

          <View className="overflow-hidden rounded-2xl border border-borderSoft bg-white">
            <MenuItem
              icon="person-outline"
              label="Profile Settings"
              description="Update your name, phone and profile photo"
              iconBackground="bg-blue-50"
              iconColor="#2563EB"
              onPress={() =>
                router.push('/profile-settings')
              }
            />

            <MenuItem
              icon="location-outline"
              label="Location Settings"
              description="Choose your preferred Tamil Nadu location"
              iconBackground="bg-green-50"
              iconColor="#16A34A"
              onPress={() =>
                router.push('/location-settings')
              }
              showBorder={false}
            />
          </View>

          <Text className="mb-3 mt-6 text-sm font-extrabold uppercase tracking-wide text-textMuted">
            Content
          </Text>

          <View className="overflow-hidden rounded-2xl border border-borderSoft bg-white">
            <MenuItem
              icon="documents-outline"
              label="My Posts"
              description="View news, videos, favorites and analytics"
              iconBackground="bg-orange-50"
              iconColor="#F0442D"
              onPress={() =>
                router.push('/my-posts')
              }
            />

            <MenuItem
              icon="create-outline"
              label="Create News"
              description="Publish a new article or breaking news"
              iconBackground="bg-purple-50"
              iconColor="#7C3AED"
              onPress={() =>
                router.push('/create-news')
              }
            />

            <MenuItem
              icon="videocam-outline"
              label="Create Video"
              description="Upload and publish a news video"
              iconBackground="bg-red-50"
              iconColor="#DC2626"
              onPress={() =>
                router.push('/create-video')
              }
              showBorder={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  iconColor?: string;
  iconBackground?: string;
  showBorder?: boolean;
  onPress: () => void;
};

function MenuItem({
  icon,
  label,
  description,
  iconColor = '#F0442D',
  iconBackground = 'bg-orange-50',
  showBorder = true,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between bg-white px-4 py-4 active:bg-slate-50 ${
        showBorder
          ? 'border-b border-borderSoft'
          : ''
      }`}
    >
      <View className="flex-1 flex-row items-center">
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Ionicons
            name={icon}
            size={23}
            color={iconColor}
          />
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-base font-extrabold text-textMain">
            {label}
          </Text>

          {description ? (
            <Text
              numberOfLines={2}
              className="mt-1 text-sm leading-5 text-textMuted"
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color="#98A2B3"
      />
    </Pressable>
  );
}