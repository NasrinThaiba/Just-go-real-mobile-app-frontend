import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  Text,
  View,
} from 'react-native';

type CommentButtonProps = {
  count: number;
  onPress: () => void;
};

export function CommentButton({
  count,
  onPress,
}: CommentButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Open ${count} comments`}
      className="flex-row items-center rounded-full px-2 py-2 active:opacity-60"
    >
      <Ionicons
        name="chatbubble-outline"
        size={20}
        color="#121826"
      />

      <View className="ml-2 flex-row items-center">
        <Text className="text-sm font-black text-textMain">
          Comments
        </Text>

        <Text className="ml-1.5 text-sm font-semibold text-textMuted">
          {formatCommentCount(count)}
        </Text>
      </View>
    </Pressable>
  );
}

function formatCommentCount(
  count: number,
): string {
  const safeCount =
    Number.isFinite(count) &&
    count > 0
      ? count
      : 0;

  if (safeCount >= 1_000_000) {
    return `${Number(
      (
        safeCount /
        1_000_000
      ).toFixed(1),
    )}M`;
  }

  if (safeCount >= 1_000) {
    return `${Number(
      (
        safeCount /
        1_000
      ).toFixed(1),
    )}K`;
  }

  return String(
    Math.floor(safeCount),
  );
}