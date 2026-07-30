import {
  Pressable,
  Share,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

type ShareButtonProps = {
  title: string;
  description?: string;
  url?: string;
  variant?: 'header' | 'default';
};

export function ShareButton({
  title,
  description = '',
  url,
  variant = 'default',
}: ShareButtonProps) {
  const isHeader =
    variant === 'header';

  const shareContent = async () => {
    try {
      const parts = [
        title,
        description,
        url,
      ].filter(Boolean);

      await Share.share({
        title,
        message:
          parts.join('\n\n'),
        url,
      });
    } catch (error) {
      console.error(
        'Share failed:',
        error,
      );

      Toast.show({
        type: 'error',
        text1: 'Share failed',
        text2:
          'Unable to share this content.',
        position: 'top',
      });
    }
  };

  return (
    <Pressable
      onPress={() =>
        void shareContent()
      }
      hitSlop={10}
      className={
        isHeader
          ? 'h-10 w-10 items-center justify-center rounded-full bg-black/55 active:opacity-70'
          : 'flex-row items-center active:opacity-60'
      }
    >
      <Ionicons
        name="share-social-outline"
        size={22}
        color={
          isHeader
            ? '#FFFFFF'
            : '#121826'
        }
      />

      {!isHeader ? (
        <Text className="ml-2 text-sm font-bold text-textMain">
          Share
        </Text>
      ) : null}
    </Pressable>
  );
}