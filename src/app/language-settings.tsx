import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLanguage } from '@/hooks/useAppLanguage';

export default function LanguageSettingsScreen() {
  const router = useRouter();

  const {
    currentLanguage,
    changeLanguage,
  } = useAppLanguage();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-3 text-xl font-black text-textMain">
          Language
        </Text>
      </View>

      <View className="px-4 pt-4">
        <LanguageOption
          label="English"
          selected={currentLanguage === 'en'}
          onPress={() => {
            void changeLanguage('en');
          }}
        />

        <LanguageOption
          label="தமிழ்"
          selected={currentLanguage === 'ta'}
          onPress={() => {
            void changeLanguage('ta');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

type LanguageOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function LanguageOption({
  label,
  selected,
  onPress,
}: LanguageOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
        selected
          ? 'border-[#F0442D] bg-orange-50'
          : 'border-borderSoft bg-white'
      }`}
    >
      <Text
        className={`text-base font-extrabold ${
          selected
            ? 'text-[#F0442D]'
            : 'text-textMain'
        }`}
      >
        {label}
      </Text>

      <Ionicons
        name={
          selected
            ? 'radio-button-on'
            : 'radio-button-off'
        }
        size={22}
        color={
          selected
            ? '#F0442D'
            : '#98A2B3'
        }
      />
    </Pressable>
  );
}