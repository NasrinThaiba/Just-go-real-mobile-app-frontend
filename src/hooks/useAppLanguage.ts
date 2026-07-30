import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { SupportedLanguage } from '@/types/common.types';

export function useAppLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage: SupportedLanguage =
    i18n.resolvedLanguage === 'ta' ? 'ta' : 'en';

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      await i18n.changeLanguage(language);
    },
    [i18n],
  );

  const toggleLanguage = useCallback(async () => {
    const nextLanguage: SupportedLanguage =
      currentLanguage === 'en' ? 'ta' : 'en';

    await i18n.changeLanguage(nextLanguage);
  }, [currentLanguage, i18n]);

  return {
    currentLanguage,
    isEnglish: currentLanguage === 'en',
    isTamil: currentLanguage === 'ta',
    changeLanguage,
    toggleLanguage,
  };
}