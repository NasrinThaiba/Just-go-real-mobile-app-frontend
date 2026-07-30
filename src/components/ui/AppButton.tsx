import type {
  PressableProps,
} from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';

type AppButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function AppButton({
  title,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  onPress,
  ...props
}: AppButtonProps) {
  const isDisabled =
    disabled || loading;

  const backgroundClass =
    variant === 'primary'
      ? 'bg-primary'
      : 'border border-primary bg-white';

  const textClass =
    variant === 'primary'
      ? 'text-white'
      : 'text-primary';

  return (
    <Pressable
      {...props}
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-5 ${backgroundClass} ${
        isDisabled
          ? 'opacity-50'
          : 'active:opacity-80'
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? '#FFFFFF'
              : '#F0442D'
          }
        />
      ) : (
        <Text
          className={`text-base font-extrabold ${textClass}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}