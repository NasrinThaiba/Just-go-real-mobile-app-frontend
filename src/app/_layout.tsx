// src/app/_layout.tsx

import '../../global.css';
import '@/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="article/[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="video/[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="admin"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Toast />
    </>
  );
}