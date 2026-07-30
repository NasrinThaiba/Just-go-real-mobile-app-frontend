import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useAppLanguage } from '@/hooks/useAppLanguage';
import type { SupportedLanguage } from '@/types/common.types';

export function LanguageSelector() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { currentLanguage, changeLanguage } = useAppLanguage();

  const selectLanguage = async (
    language: SupportedLanguage,
  ) => {
    await changeLanguage(language);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-10 flex-row items-center gap-1.5 rounded-full border border-borderSoft bg-white px-3"
      >
        <Ionicons name="language-outline" size={18} color="#121826" />

        <Text className="text-xs font-bold text-textMain">
          {currentLanguage === 'ta' ? 'தமிழ்' : 'English'}
        </Text>

        <Ionicons name="chevron-down" size={14} color="#667085" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 justify-center bg-black/50 px-6"
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="rounded-3xl bg-white p-5"
          >
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-xl font-black text-textMain">
                {t('common.language')}
              </Text>

              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#121826" />
              </Pressable>
            </View>

            {([
              ['en', t('common.english')],
              ['ta', t('common.tamil')],
            ] as const).map(([code, label]) => (
              <Pressable
                key={code}
                onPress={() => void selectLanguage(code)}
                className="h-14 flex-row items-center justify-between border-b border-slate-100 px-2"
              >
                <Text className="text-base font-bold text-textMain">
                  {label}
                </Text>

                {currentLanguage === code ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={23}
                    color="#F0442D"
                  />
                ) : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
