import type { ImageSourcePropType } from 'react-native';

export type AdPlacement =
  | 'top'
  | 'home'
  | 'medium'
  | 'large';

export type AdItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  targetUrl?: string;
  placement: AdPlacement;
};