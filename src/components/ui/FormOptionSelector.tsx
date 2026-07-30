import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export type FormOption = {
  label: string;
  value: string;
};

type FormOptionSelectorProps = {
  label: string;
  options: FormOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function FormOptionSelector({
  label,
  options,
  value,
  onChange,
  required = false,
}: FormOptionSelectorProps) {
  return (
    <View>
      <Text className="mb-2 text-sm font-bold text-textMain">
        {label}

        {required ? (
          <Text className="text-primary">
            {' '}*
          </Text>
        ) : null}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
        }}
      >
        {options.map((option) => {
          const selected =
            option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() =>
                onChange(option.value)
              }
              className={`rounded-full border px-4 py-2.5 ${
                selected
                  ? 'border-primary bg-primary'
                  : 'border-borderSoft bg-white'
              }`}
            >
              <Text
                className={`text-sm font-bold ${
                  selected
                    ? 'text-white'
                    : 'text-textMain'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}