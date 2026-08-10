import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/selectors/LanguageSelector';
import { LocationSelector } from '@/components/selectors/LocationSelector';
import ProfileMenu from '@/features/profile/components/ProfileMenu';

type AppHeaderProps = {
  onMenuPress?: () => void;
};

export function AppHeader({
  onMenuPress,
}: AppHeaderProps) {
  return (
    <View className="border-b border-slate-100 bg-[#FFF8F6] px-4 pb-3 pt-2">
      <View className="relative h-14 flex-row items-center">
        <Pressable
          onPress={onMenuPress}
          hitSlop={10}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"
        >
          <Ionicons
            name="menu-outline"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>

      <View
        pointerEvents="none"
        className="absolute left-0 right-0 items-center"
      >
        <View className="flex-row items-center">
          <Text className="text-[19px] font-black text-slate-900">
            Just Go
          </Text>

          <Text className="ml-1 text-[19px] font-black text-primary">
            Real
          </Text>
        </View>
      </View>

      <View className="ml-auto">
        <ProfileMenu />
      </View>
    </View>

    </View>
  );
}