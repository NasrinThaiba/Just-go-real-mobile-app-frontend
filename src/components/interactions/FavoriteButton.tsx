import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  Text,
} from 'react-native';

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
  const displayCount =
    Math.max(0, count);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        selected
          ? `Remove from favorites. ${displayCount} favorites`
          : `Add to favorites. ${displayCount} favorites`
      }
      accessibilityState={{
        selected,
        disabled,
      }}
      className={`flex-row items-center rounded-full px-2 py-1 active:opacity-60 ${
        disabled
          ? 'opacity-40'
          : ''
      }`}
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
        {displayCount}
      </Text>
    </Pressable>
  );
}