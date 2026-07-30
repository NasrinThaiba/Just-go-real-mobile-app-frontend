import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n, {
  type LanguageDetectorAsyncModule,
} from 'i18next';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { en } from '@/i18n/en';
import { ta } from '@/i18n/ta';
import type { SupportedLanguage } from '@/types/common.types';

function normalizeLanguage(
  language?: string | null,
): SupportedLanguage {
  return language
    ?.trim()
    .toLowerCase()
    .startsWith('ta')
    ? 'ta'
    : 'en';
}

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,

  init: () => undefined,

  detect: async (callback) => {
    try {
      const storedLanguage =
        await AsyncStorage.getItem(
          STORAGE_KEYS.LANGUAGE,
        );

      if (
        storedLanguage === 'en' ||
        storedLanguage === 'ta'
      ) {
        callback(storedLanguage);
        return;
      }

      const deviceLanguage =
        getLocales()[0]?.languageCode;

      callback(
        normalizeLanguage(deviceLanguage),
      );
    } catch {
      callback('en');
    }
  },

  cacheUserLanguage: async (
    language,
  ) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LANGUAGE,
      normalizeLanguage(language),
    );
  },
};

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ta: {
        translation: ta,
      },
    },

    supportedLngs: ['en', 'ta'],
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    compatibilityJSON: 'v4',

    returnNull: false,

    debug: __DEV__,
  });

export default i18n;