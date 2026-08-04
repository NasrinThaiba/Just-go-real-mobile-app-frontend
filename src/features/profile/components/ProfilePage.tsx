import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfile } from '@/features/profile/hooks/useProfile';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=17336B&color=ffffff';

export default function ProfilePage() {
  const router = useRouter();
  const { profile } =
    useProfile();

  const profileImage =
    profile.profileImage ||
    DEFAULT_AVATAR;

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
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-2 text-xl font-black text-textMain">
          Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        <View className="items-center rounded-3xl border border-borderSoft bg-white p-6">
          <Image
            source={{
              uri: profileImage,
            }}
            resizeMode="cover"
            className="h-28 w-28 rounded-full bg-slate-100"
          />

          <Text className="mt-4 text-2xl font-black text-textMain">
            {profile.name}
          </Text>

          <View className="mt-2 rounded-full bg-primarySoft px-4 py-1.5">
            <Text className="text-xs font-extrabold uppercase text-primary">
              {profile.role}
            </Text>
          </View>

          {profile.locationName ? (
            <View className="mt-4 flex-row items-center">
              <Ionicons
                name="location-outline"
                size={18}
                color="#667085"
              />

              <Text className="ml-2 text-sm font-semibold text-textMuted">
                {profile.locationName}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={() =>
            router.push(
              '/profile/profile-settings',
            )
          }
          className="mt-5 flex-row items-center rounded-2xl border border-borderSoft bg-white p-4 active:opacity-70"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-primarySoft">
            <Ionicons
              name="pencil-outline"
              size={21}
              color="#F0442D"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-extrabold text-textMain">
              Edit Profile
            </Text>

            <Text className="mt-1 text-xs text-textMuted">
              Update name, role and photo
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#667085"
          />
        </Pressable>

        <Pressable
          onPress={() =>
            router.push(
              '/location-settings',
            )
          }
          className="mt-3 flex-row items-center rounded-2xl border border-borderSoft bg-white p-4 active:opacity-70"
        >
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Ionicons
              name="location-outline"
              size={21}
              color="#2563EB"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-extrabold text-textMain">
              Location
            </Text>

            <Text className="mt-1 text-xs text-textMuted">
              Change your preferred location
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#667085"
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
