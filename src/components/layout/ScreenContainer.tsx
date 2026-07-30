import type { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function ScreenContainer({
  children,
  className = '',
}: ScreenContainerProps) {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`}>
      {children}
    </SafeAreaView>
  );
}
