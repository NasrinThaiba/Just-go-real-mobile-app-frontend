import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LanguageSelector } from '@/components/selectors/LanguageSelector';
import { LocationSelector } from '@/components/selectors/LocationSelector';
import ProfileMenu from '@/components/profile/ProfileMenu';

type AppHeaderProps = {
  onMenuPress?: () => void;
};

export function AppHeader({ onMenuPress }: AppHeaderProps) {
  return (
    <View className="bg-white px-4 pb-3 pt-2">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={onMenuPress} hitSlop={10}>
          <Ionicons name="menu-outline" size={28} color="#121826" />
        </Pressable>

        <Text className="text-lg font-black text-navy">
          Just Go <Text className="text-primary">Real</Text>
        </Text>

        <ProfileMenu />
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <View className="flex-1">
          <LocationSelector />
        </View>

        <LanguageSelector />
      </View>
    </View>
  );
}
