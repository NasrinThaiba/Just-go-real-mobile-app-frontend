import {
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BookmarkButtonProps = {
  selected: boolean;
  onPress: () => void;
  variant?: 'header' | 'default';
  disabled?: boolean;
};

export function BookmarkButton({
  selected,
  onPress,
  variant = 'default',
  disabled = false,
}: BookmarkButtonProps) {
  const isHeader =
    variant === 'header';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      className={
        isHeader
          ? 'h-10 w-10 items-center justify-center rounded-full bg-black/55 active:opacity-70'
          : 'flex-row items-center active:opacity-60'
      }
    >
      <Ionicons
        name={
          selected
            ? 'bookmark'
            : 'bookmark-outline'
        }
        size={22}
        color={
          selected
            ? '#F0442D'
            : isHeader
              ? '#FFFFFF'
              : '#121826'
        }
      />
    </Pressable>
  );
}