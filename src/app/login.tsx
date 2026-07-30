import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';

export default function LoginScreen() {
  const router = useRouter();

  const [phone, setPhone] =
    useState('');

  const handleLogin = () => {
    const cleanedPhone =
      phone.replace(/\D/g, '');

    if (cleanedPhone.length !== 10) {
      Alert.alert(
        'Invalid phone',
        'Enter a valid 10-digit phone number.',
      );

      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        className="flex-1 justify-center px-6"
      >
        <Text className="text-center text-3xl font-black text-navy">
          Just Go{' '}
          <Text className="text-primary">
            Real
          </Text>
        </Text>

        <Text className="mt-3 text-center text-textMuted">
          Login to access local news and
          updates.
        </Text>

        <View className="mt-10">
          <Text className="mb-2 text-sm font-bold text-textMain">
            Phone number
          </Text>

          <AppInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View className="mt-5">
          <AppButton
            title="Continue"
            onPress={handleLogin}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}