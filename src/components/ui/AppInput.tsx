import type { TextInputProps } from 'react-native';
import { TextInput, View } from 'react-native';

type AppInputProps = TextInputProps & {
  containerClassName?: string;
};

export function AppInput({
  containerClassName = '',
  className = '',
  multiline,
  ...props
}: AppInputProps) {
  return (
    <View className={containerClassName}>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#98A2B3"
        className={`rounded-2xl border border-borderSoft bg-white px-4 text-base text-textMain ${
          multiline ? 'min-h-32 py-4' : 'h-12'
        } ${className}`}
      />
    </View>
  );
}
