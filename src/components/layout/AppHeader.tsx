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
    <View className="overflow-hidden border-b border-slate-100 bg-[#FFF8F6] pb-3">
      {/* Top row */}

      <View className="min-h-[74px] flex-row items-center">
        {/* Red menu section */}

        <View className="h-full w-[72px] items-center justify-center rounded-br-[36px] bg-primary">
          <Pressable
            onPress={onMenuPress}
            hitSlop={10}
            className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
          >
            <Ionicons
              name="menu-outline"
              size={27}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Brand */}

        <View className="ml-4 flex-1 flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Text className="text-lg font-black text-white">
              J
            </Text>
          </View>

          <View className="ml-3 flex-row items-center">
            <Text className="text-[20px] font-black text-[#0F172A]">
              Just Go
            </Text>

            <Text className="ml-1 text-[20px] font-black text-primary">
              Real
            </Text>
          </View>
        </View>

        {/* Language and profile */}

        <View className="mr-4 flex-row items-center gap-2">
          <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <LanguageSelector />
          </View>

          <ProfileMenu />
        </View>
      </View>

      {/* Location row */}

      <View className="mx-4 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LocationSelector />
      </View>
    </View>
  );
}