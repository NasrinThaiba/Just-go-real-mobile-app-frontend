import {
  Pressable,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FavoriteButtonProps = {
  selected: boolean;
  count: number;
  onPress: () => void;
  disabled?: boolean;
};

export function FavoriteButton({
  selected,
  count,
  onPress,
  disabled = false,
}: FavoriteButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      className="flex-row items-center active:opacity-60"
    >
      <Ionicons
        name={
          selected
            ? 'heart'
            : 'heart-outline'
        }
        size={23}
        color={
          selected
            ? '#F0442D'
            : '#121826'
        }
      />

      <Text
        className={`ml-2 text-sm font-bold ${
          selected
            ? 'text-primary'
            : 'text-textMain'
        }`}
      >
        {count}
      </Text>
    </Pressable>
  );
}