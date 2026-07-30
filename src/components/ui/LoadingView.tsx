import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingView({
  message = 'Loading...',
}: {
  message?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#F0442D" />

      <Text className="mt-3 text-sm font-semibold text-textMuted">
        {message}
      </Text>
    </View>
  );
}
