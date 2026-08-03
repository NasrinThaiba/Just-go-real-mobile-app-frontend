import { Pressable, Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  actionLabel = 'View all',
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between">
      <Text className="text-xl font-black text-textMain">
        {title}
      </Text>

      {onActionPress ? (
        <Pressable onPress={onActionPress}>
          <Text className="text-xs font-bold text-textMuted">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
