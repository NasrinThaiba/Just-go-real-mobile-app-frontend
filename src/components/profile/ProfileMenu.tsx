import { useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useProfile } from '@/features/profile/hooks/useProfile';
import { logoutUser } from '@/features/profile/storage/profileStorage';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=17336B&color=ffffff';

export default function ProfileMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const { profile, updateProfile } = useProfile();

  const profileImage =
    profile.profileImage || DEFAULT_AVATAR;

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const selectedImage = result.assets[0]?.uri;

    if (!selectedImage) {
      return;
    }

    await updateProfile({
      profileImage: selectedImage,
    });
  };

  const handleLogout = async () => {
    await logoutUser();
    setVisible(false);
    router.replace('/login');
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-11 w-11 overflow-hidden rounded-full border-2 border-white bg-white"
      >
        <Image
          source={{ uri: profileImage }}
          resizeMode="cover"
          className="h-full w-full"
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 items-end bg-black/45 px-4 pt-16"
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-[32px] bg-[#10294A]"
          >
            <Pressable
              onPress={() => setVisible(false)}
              className="absolute right-4 top-4 z-20 h-8 w-8 items-center justify-center rounded-full bg-white/10"
            >
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </Pressable>

            <View className="flex-row items-center gap-4 p-6">
              <Image
                source={{ uri: profileImage }}
                resizeMode="cover"
                className="h-20 w-20 rounded-full border-2 border-white/40 bg-white"
              />

              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className="text-xl font-extrabold text-white"
                >
                  {profile.name}
                </Text>

                <View className="mt-2 self-start rounded-full bg-primary px-4 py-1">
                  <Text className="text-xs font-extrabold uppercase text-white">
                    {profile.role}
                  </Text>
                </View>

                {profile.locationName ? (
                  <View className="mt-2 flex-row items-center gap-1">
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color="#CBD5E1"
                    />

                    <Text
                      numberOfLines={1}
                      className="text-xs text-slate-300"
                    >
                      {profile.locationName}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View className="bg-white px-5 py-4">
              <ProfileAction
                icon="camera-outline"
                label={t('profile.changePhoto')}
                onPress={() => void pickProfileImage()}
              />

              <ProfileAction
                icon="pencil-outline"
                label={t('profile.editProfile')}
                onPress={() => {
                  setVisible(false);
                  router.push('/profile-settings');
                }}
              />

              <ProfileAction
                icon="location-outline"
                label={t('profile.setLocation')}
                onPress={() => {
                  setVisible(false);
                  router.push('/location-settings');
                }}
              />

              <ProfileAction
                icon="log-out-outline"
                label={t('profile.logout')}
                destructive
                onPress={() => void handleLogout()}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

type ProfileActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function ProfileAction({
  icon,
  label,
  onPress,
  destructive = false,
}: ProfileActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-12 flex-row items-center gap-3 rounded-2xl px-3 active:bg-slate-100"
    >
      <Ionicons
        name={icon}
        size={21}
        color={destructive ? '#DC2626' : '#10294A'}
      />

      <Text
        className={
          destructive
            ? 'text-sm font-extrabold text-red-600'
            : 'text-sm font-bold text-slate-800'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
