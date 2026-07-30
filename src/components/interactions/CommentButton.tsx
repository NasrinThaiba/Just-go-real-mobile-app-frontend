import {
  Pressable,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      className="flex-row items-center active:opacity-60"
    >
      <Ionicons
        name="chatbubble-outline"
        size={21}
        color="#121826"
      />

      <Text className="ml-2 text-sm font-bold text-textMain">
        {count}
      </Text>
    </Pressable>
  );
}