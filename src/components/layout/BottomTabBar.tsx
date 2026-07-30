import { Text, View } from 'react-native';

export function BottomTabBar() {
  return (
    <View className="border-t border-borderSoft bg-white px-4 py-3">
      <Text className="text-center text-xs text-textMuted">
        Expo Router manages the tab bar in src/app/(tabs)/_layout.tsx
      </Text>
    </View>
  );
}
