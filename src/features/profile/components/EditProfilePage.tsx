// src/features/profile/components/EditProfilePage.tsx

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useProfile } from '@/features/profile/hooks/useProfile';
import type {
  ProfileRole,
} from '@/features/profile/types/profile.types';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=17336B&color=ffffff';

export default function EditProfilePage() {
  const router = useRouter();

  const {
    profile,
    updateProfile,
    isLoading,
  } = useProfile();

  const [name, setName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [role, setRole] =
    useState<ProfileRole>('reader');

  const [
    profileImage,
    setProfileImage,
  ] = useState('');

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  useEffect(() => {
    setName(
      profile.name ?? '',
    );

    setPhone(
      profile.phone ?? '',
    );

    setEmail(
      profile.email ?? '',
    );

    setRole(
      profile.role ??
        'reader',
    );

    setProfileImage(
      profile.profileImage ??
        '',
    );
  }, [profile]);

  const pickProfileImage =
    async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (
          !permission.granted
        ) {
          Toast.show({
            type: 'error',
            text1:
              'Permission required',
            text2:
              'Allow gallery access to select a profile image.',
            position: 'top',
          });

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync(
            {
              mediaTypes:
                ImagePicker.MediaTypeOptions.Images,

              allowsEditing:
                true,

              aspect:
                [1, 1],

              quality:
                0.8,
            },
          );

        if (
          result.canceled ||
          !result
            .assets[0]
            ?.uri
        ) {
          return;
        }

        setProfileImage(
          result.assets[0].uri,
        );
      } catch (error) {
        console.error(
          'Image selection failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to select image',
          position: 'top',
        });
      }
    };

  const saveChanges =
    async () => {
      if (
        !name.trim()
      ) {
        Toast.show({
          type: 'error',
          text1:
            'Name required',
          text2:
            'Enter your name.',
          position: 'top',
        });

        return;
      }

      try {
        setIsSaving(true);

        await updateProfile({
          name:
            name.trim(),

          email:
            email.trim(),

          profileImage,
        });

        Toast.show({
          type: 'success',
          text1:
            'Profile updated',
          text2:
            'Your changes were saved.',
          visibilityTime:
            1400,
          position: 'top',
        });

        setTimeout(
          () => {
            router.back();
          },
          500,
        );
      } catch (error) {
        console.error(
          'Profile update failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Update failed',
          text2:
            'Unable to save the profile.',
          position: 'top',
        });
      } finally {
        setIsSaving(false);
      }
    };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-50"
    >
      {/* Header */}
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
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 50,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Profile Image */}
          <View className="items-center rounded-3xl border border-borderSoft bg-white p-6">
            <Pressable
              onPress={() =>
                void pickProfileImage()
              }
              className="relative"
            >
              <Image
                source={{
                  uri:
                    profileImage ||
                    DEFAULT_AVATAR,
                }}
                resizeMode="cover"
                className="h-28 w-28 rounded-full bg-slate-100"
              />

              <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary">
                <Ionicons
                  name="camera-outline"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
            </Pressable>

            <Text className="mt-4 text-sm font-bold text-textMuted">
              Tap to change
              photo
            </Text>
          </View>

          {/* Profile Fields */}
          <View className="mt-5 rounded-3xl border border-borderSoft bg-white p-5">
            {/* Name */}
            <ProfileInput
              label="Name"
              value={name}
              onChangeText={
                setName
              }
              placeholder="Enter your name"
              icon="person-outline"
            />

            {/* Phone */}
            <View className="mt-5">
              <Text className="mb-2 text-sm font-extrabold text-textMain">
                Phone
              </Text>

              <View className="h-14 flex-row items-center rounded-2xl border border-borderSoft bg-slate-100 px-4">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#667085"
                />

                <Text
                  numberOfLines={
                    1
                  }
                  className="ml-3 flex-1 text-base font-semibold text-slate-500"
                >
                  {phone ||
                    'No phone number'}
                </Text>
              </View>

              <View className="mt-2 flex-row items-center">
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color="#667085"
                />
              </View>
            </View>

            {/* Email */}
            <View className="mt-5">
              <ProfileInput
                label="Email"
                value={email}
                onChangeText={
                  setEmail
                }
                placeholder="Enter email address"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Role */}
            <View className="mt-5">
              <Text className="mb-2 text-sm font-extrabold text-textMain">
                Role
              </Text>

              <View className="h-14 flex-row items-center rounded-2xl border border-borderSoft bg-slate-100 px-4">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#667085"
                />

                <Text className="ml-3 flex-1 text-base font-semibold capitalize text-slate-500">
                  {role}
                </Text>

                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color="#94A3B8"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={() =>
              void saveChanges()
            }
            disabled={
              isSaving ||
              isLoading
            }
            className={`mt-6 h-14 flex-row items-center justify-center rounded-2xl bg-primary ${
              isSaving ||
              isLoading
                ? 'opacity-60'
                : ''
            }`}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text className="ml-2 text-base font-black text-white">
              {isSaving
                ? 'Saving...'
                : 'Save Changes'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type ProfileInputProps = {
  label: string;
  value: string;
  placeholder: string;

  icon:
    keyof typeof Ionicons.glyphMap;

  onChangeText: (
    value: string,
  ) => void;

  keyboardType?:
    | 'default'
    | 'phone-pad'
    | 'email-address';

  autoCapitalize?:
    | 'none'
    | 'sentences'
    | 'words';
};

function ProfileInput({
  label,
  value,
  placeholder,
  icon,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: ProfileInputProps) {
  return (
    <>
      <Text className="mb-2 text-sm font-extrabold text-textMain">
        {label}
      </Text>

      <View className="h-14 flex-row items-center rounded-2xl border border-borderSoft bg-slate-50 px-4">
        <Ionicons
          name={icon}
          size={20}
          color="#667085"
        />

        <TextInput
          value={value}
          onChangeText={
            onChangeText
          }
          placeholder={
            placeholder
          }
          placeholderTextColor="#94A3B8"
          keyboardType={
            keyboardType
          }
          autoCapitalize={
            autoCapitalize
          }
          className="ml-3 flex-1 text-base font-semibold text-textMain"
        />
      </View>
    </>
  );
}