import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ErrorViewProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorView({
  message,
  onRetry,
}: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Ionicons
        name="alert-circle-outline"
        size={46}
        color="#DC2626"
      />

      <Text className="mt-4 text-center text-base font-semibold text-red-600">
        {message}
      </Text>

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-2xl bg-primary px-5 py-3"
        >
          <Text className="font-extrabold text-white">
            Retry
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
