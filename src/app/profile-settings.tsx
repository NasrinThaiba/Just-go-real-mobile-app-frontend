import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { useProfile } from '@/features/profile/hooks/useProfile';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=17336B&color=ffffff';

export default function ProfileSettingsScreen() {
  const router = useRouter();

  const {
    profile,
    isLoading,
    updateProfile,
  } = useProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [profileImage, setProfileImage] =
    useState(DEFAULT_AVATAR);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setName(profile.name ?? '');
    setPhone(profile.phone ?? '');

    setProfileImage(
      profile.profileImage ||
        DEFAULT_AVATAR,
    );
  }, [profile]);

  const chooseImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission required',
          'Allow photo-library access to select a profile image.',
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets[0]?.uri
      ) {
        setProfileImage(
          result.assets[0].uri,
        );
      }
    } catch (error) {
      console.error(
        'Image selection failed:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Image selection failed',
        text2: 'Unable to select the image.',
        position: 'top',
      });
    }
  };

  const saveProfile = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      Toast.show({
        type: 'error',
        text1: 'Name required',
        text2: 'Enter your name.',
        position: 'top',
      });

      return;
    }

    try {
      setIsSaving(true);

      await updateProfile({
        name: trimmedName,
        phone: trimmedPhone,
        profileImage,
      });

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
        text2:
          'Your profile was saved successfully.',
        position: 'top',
        visibilityTime: 1500,
      });

      setTimeout(() => {
        router.back();
      }, 800);
    } catch (error) {
      console.error(
        'Profile update failed:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2:
          error instanceof Error
            ? error.message
            : 'Unable to save your profile.',
        position: 'top',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-14 flex-row items-center border-b border-borderSoft px-4">
        <Pressable
          onPress={() => router.back()}
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
          Profile Settings
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center py-8">
            <Image
              source={{
                uri: profileImage,
              }}
              className="h-28 w-28 rounded-full bg-slate-100"
            />

            <Pressable
              onPress={() =>
                void chooseImage()
              }
              className="mt-4 flex-row items-center gap-2 rounded-full bg-primarySoft px-4 py-2.5"
            >
              <Ionicons
                name="camera-outline"
                size={19}
                color="#F0442D"
              />

              <Text className="font-extrabold text-primary">
                Change Photo
              </Text>
            </Pressable>
          </View>

          <Text className="mb-2 text-sm font-bold text-textMain">
            Full name
          </Text>

          <AppInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            editable={
              !isLoading && !isSaving
            }
            autoCapitalize="words"
          />

          <Text className="mb-2 mt-5 text-sm font-bold text-textMain">
            Phone number
          </Text>

          <AppInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            editable={
              !isLoading && !isSaving
            }
          />

          <View className="mt-7">
            <AppButton
              title="Save Profile"
              onPress={saveProfile}
              loading={isSaving}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}