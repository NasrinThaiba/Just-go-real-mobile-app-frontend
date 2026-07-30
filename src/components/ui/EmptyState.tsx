import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateProps = {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function EmptyState({
  message,
  icon = 'newspaper-outline',
}: EmptyStateProps) {
  return (
    <View className="items-center py-16">
      <Ionicons name={icon} size={42} color="#98A2B3" />

      <Text className="mt-3 text-center text-sm text-textMuted">
        {message}
      </Text>
    </View>
  );
}
