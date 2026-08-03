import {
  Pressable,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export function ProfileAction({
  icon,
  label,
  onPress,
  destructive = false,
}: ProfileActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="min-h-12 flex-row items-center gap-3 rounded-2xl px-3 active:bg-slate-100"
    >
      <Ionicons
        name={icon}
        size={21}
        color={destructive ? '#DC2626' : '#10294A'}
      />

      <Text
        className={
          destructive
            ? 'text-sm font-extrabold text-red-600'
            : 'text-sm font-bold text-slate-800'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
