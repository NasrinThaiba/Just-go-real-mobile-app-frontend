import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useLocationSelector } from '@/features/location/hooks/useLocationSelector';
import type { AppLocation } from '@/features/location/types/location.types';

export function LocationSelector() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const {
    selectedLocation,
    locations,
    searchText,
    isDetecting,
    error,
    setSearchText,
    selectLocation,
    detectCurrentLocation,
  } = useLocationSelector();

  const selectManualLocation = async (
    location: AppLocation,
  ) => {
    await selectLocation(location);
    setVisible(false);
  };

  const selectCurrentLocation = async () => {
    const location = await detectCurrentLocation();

    if (location) {
      setVisible(false);
    }
  };

  const errorMessage =
    error === 'PERMISSION_DENIED'
      ? t('common.permissionDenied')
      : error === 'LOCATION_UNAVAILABLE'
        ? t('common.locationUnavailable')
        : error === 'OUTSIDE_TAMIL_NADU'
          ? t('common.outsideTamilNadu')
          : null;

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-10 flex-row items-center gap-1.5 rounded-full border border-borderSoft bg-white px-3"
      >
        <Ionicons name="location-outline" size={18} color="#F0442D" />

        <Text
          numberOfLines={1}
          className="flex-1 text-xs font-bold text-textMain"
        >
          {selectedLocation?.name ?? t('common.chooseLocation')}
        </Text>

        <Ionicons name="chevron-down" size={14} color="#667085" />
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="h-16 flex-row items-center justify-between border-b border-borderSoft px-5">
            <Text className="text-xl font-black text-textMain">
              {t('common.chooseLocation')}
            </Text>

            <Pressable onPress={() => setVisible(false)}>
              <Ionicons name="close" size={25} color="#121826" />
            </Pressable>
          </View>

          <View className="mx-4 mt-4 h-12 flex-row items-center gap-2 rounded-2xl border border-borderSoft bg-slate-50 px-4">
            <Ionicons name="search-outline" size={20} color="#667085" />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={t('common.searchLocation')}
              placeholderTextColor="#98A2B3"
              autoCorrect={false}
              className="flex-1 text-base text-textMain"
            />

            {searchText.length > 0 ? (
              <Pressable
                onPress={() => setSearchText('')}
                hitSlop={8}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#98A2B3"
                />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            disabled={isDetecting}
            onPress={() => void selectCurrentLocation()}
            className="mx-4 mt-4 flex-row items-center rounded-2xl bg-primarySoft p-4 disabled:opacity-60"
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
              {isDetecting ? (
                <ActivityIndicator color="#F0442D" />
              ) : (
                <Ionicons name="navigate" size={21} color="#F0442D" />
              )}
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-base font-black text-primary">
                {isDetecting
                  ? t('common.detectingLocation')
                  : t('common.useCurrentLocation')}
              </Text>

              <Text className="mt-1 text-xs text-textMuted">
                GPS location
              </Text>
            </View>

            {!isDetecting ? (
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#98A2B3"
              />
            ) : null}
          </Pressable>

          {errorMessage ? (
            <View className="mx-4 mt-3 flex-row rounded-2xl bg-red-50 p-3">
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#DC2626"
              />

              <Text className="ml-2 flex-1 text-sm text-red-600">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Text className="mx-5 mb-2 mt-6 text-base font-black text-textMain">
            {t('common.tamilNaduLocations')}
          </Text>

          <FlatList
            data={locations}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4 pb-10"
            ListEmptyComponent={
              <View className="items-center py-16">
                <Ionicons
                  name="location-outline"
                  size={40}
                  color="#98A2B3"
                />

                <Text className="mt-3 text-center text-textMuted">
                  No Tamil Nadu locations found
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const selected = selectedLocation?.id === item.id;

              return (
                <Pressable
                  onPress={() => void selectManualLocation(item)}
                  className={
                    selected
                      ? 'mb-2 min-h-16 flex-row items-center gap-3 rounded-2xl border border-primary bg-primarySoft px-4'
                      : 'mb-2 min-h-16 flex-row items-center gap-3 rounded-2xl border border-borderSoft bg-white px-4'
                  }
                >
                  <Ionicons
                    name={selected ? 'location' : 'location-outline'}
                    size={20}
                    color={selected ? '#F0442D' : '#667085'}
                  />

                  <View className="flex-1">
                    <Text className="text-base font-bold text-textMain">
                      {item.name}
                    </Text>

                    <Text className="mt-1 text-xs text-textMuted">
                      {item.district}, Tamil Nadu
                    </Text>
                  </View>

                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#F0442D"
                    />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
