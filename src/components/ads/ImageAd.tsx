import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CONFIG } from '@/constants/config';
import type { AdItem } from '@/features/ads/types/ads.types';

type ImageAdProps = {
  ads: AdItem[];
  size?: 'top' | 'home' | 'medium' | 'large';
  className?: string;
};

const HEIGHT_BY_SIZE = {
  top: 120,
  home: 180,
  medium: 250,
  large: 300,
} as const;

export default function ImageAd({
  ads,
  size = 'home',
  className = '',
}: ImageAdProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const currentAd = ads[adIndex];
  const height = HEIGHT_BY_SIZE[size];

  useEffect(() => {
  setIsReady(false);
  }, [currentAd?.id]);

  useEffect(() => {
    if (isClosed || ads.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setAdIndex((currentIndex) => (currentIndex + 1) % ads.length);
    }, CONFIG.adIntervalMs);

    return () => clearInterval(interval);
  }, [ads.length, isClosed]);

  if (!CONFIG.showAds || !ads.length) {
    return null;
  }

  if (isClosed) {
    return (
      <View
        style={{ height }}
        className={`items-center justify-center rounded-2xl border border-borderSoft bg-slate-100 ${className}`}
      >
        <Text className="text-xs font-semibold text-slate-400">
          Advertisement closed
        </Text>
      </View>
    );
  }

  const openAdvertisement = async () => {
    if (!currentAd.targetUrl) {
      return;
    }

    const supported = await Linking.canOpenURL(currentAd.targetUrl);

    if (supported) {
      await Linking.openURL(currentAd.targetUrl);
    }
  };

  return (
    <Pressable
      onPress={() => void openAdvertisement()}
      style={{ height }}
      className={`relative overflow-hidden rounded-2xl border border-borderSoft bg-slate-100 ${className}`}
    >
      <View className="absolute left-2 top-2 z-20 rounded-full bg-black/65 px-2.5 py-1">
        <Text className="text-[10px] font-extrabold uppercase text-white">
          Ad
        </Text>
      </View>

      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          setIsClosed(true);
        }}
        hitSlop={8}
        className="absolute right-2 top-2 z-20 h-8 w-8 items-center justify-center rounded-full bg-black/70"
      >
        <Ionicons name="close" size={18} color="#FFFFFF" />
      </Pressable>

      {!isReady ? (
        <View className="absolute inset-0 z-10 items-center justify-center bg-slate-100">
          <ActivityIndicator color="#F0442D" />
          <Text className="mt-2 text-xs font-semibold text-slate-400">
            Loading ad...
          </Text>
        </View>
      ) : null}

      <Image
        source={currentAd.image}
        resizeMode="contain"
        onLoad={() => setIsReady(true)}
        onError={() => setIsReady(true)}
        className="h-full w-full"
      />
    </Pressable>
  );
}
