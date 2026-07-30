import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useLocationSelector } from '@/features/location/hooks/useLocationSelector';

export default function LocationSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

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

  const errorMessage =
    error === 'PERMISSION_DENIED'
      ? t('common.permissionDenied')
      : error === 'OUTSIDE_TAMIL_NADU'
        ? t('common.outsideTamilNadu')
        : error === 'LOCATION_UNAVAILABLE'
          ? t('common.locationUnavailable')
          : null;

  const handleCurrentLocation = async () => {
    const location =
      await detectCurrentLocation();

    if (location) {
      router.back();
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      {/* HEADER */}
      <View className="h-14 flex-row items-center border-b border-borderSoft px-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-4 text-xl font-black text-textMain">
          {t('common.chooseLocation')}
        </Text>
      </View>

      {/* SEARCH */}
      <View className="mx-4 mt-4 h-12 flex-row items-center gap-2 rounded-2xl border border-borderSoft bg-slate-50 px-4">
        <Ionicons
          name="search-outline"
          size={20}
          color="#667085"
        />

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t(
            'common.searchLocation',
          )}
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

      {/* CURRENT GPS LOCATION */}
      <Pressable
        disabled={isDetecting}
        onPress={() =>
          void handleCurrentLocation()
        }
        className="mx-4 mt-4 flex-row items-center rounded-2xl bg-primarySoft p-4 disabled:opacity-60"
      >
        <View className="h-11 w-11 items-center justify-center rounded-full bg-white">
          {isDetecting ? (
            <ActivityIndicator
              color="#F0442D"
            />
          ) : (
            <Ionicons
              name="navigate"
              size={21}
              color="#F0442D"
            />
          )}
        </View>

        <View className="ml-3 flex-1">
          <Text className="text-base font-black text-primary">
            {isDetecting
              ? t(
                  'common.detectingLocation',
                )
              : t(
                  'common.useCurrentLocation',
                )}
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

      {/* ERROR */}
      {errorMessage ? (
        <View className="mx-4 mt-3 flex-row items-start rounded-2xl bg-red-50 p-3">
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color="#DC2626"
          />

          <Text className="ml-2 flex-1 text-sm font-medium leading-5 text-red-600">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {/* SELECTED LOCATION */}
      {selectedLocation ? (
        <View className="mx-4 mt-4 rounded-2xl border border-primary/20 bg-primarySoft p-4">
          <Text className="text-xs font-extrabold uppercase tracking-wide text-primary">
            Selected location
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="location"
              size={20}
              color="#F0442D"
            />

            <View className="ml-2 flex-1">
              <Text className="text-base font-black text-textMain">
                {selectedLocation.name}
              </Text>

              <Text className="mt-1 text-xs text-textMuted">
                {selectedLocation.district},
                Tamil Nadu
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* LOCATION LIST TITLE */}
      <Text className="mx-5 mb-2 mt-6 text-base font-black text-textMain">
        {t(
          'common.tamilNaduLocations',
        )}
      </Text>

      {/* TAMIL NADU LOCATION LIST */}
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

            <Text className="mt-3 text-center text-sm text-textMuted">
              No Tamil Nadu locations found
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const selected =
            selectedLocation?.id === item.id;

          return (
            <Pressable
              onPress={async () => {
                await selectLocation(item);
                router.back();
              }}
              className={
                selected
                  ? 'mb-2 min-h-16 flex-row items-center gap-3 rounded-2xl border border-primary bg-primarySoft px-4'
                  : 'mb-2 min-h-16 flex-row items-center gap-3 rounded-2xl border border-borderSoft bg-white px-4'
              }
            >
              <View
                className={
                  selected
                    ? 'h-10 w-10 items-center justify-center rounded-full bg-white'
                    : 'h-10 w-10 items-center justify-center rounded-full bg-slate-100'
                }
              >
                <Ionicons
                  name={
                    selected
                      ? 'location'
                      : 'location-outline'
                  }
                  size={20}
                  color={
                    selected
                      ? '#F0442D'
                      : '#667085'
                  }
                />
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-textMain">
                  {item.name}
                </Text>

                <Text className="mt-1 text-xs text-textMuted">
                  {item.district},
                  Tamil Nadu
                </Text>
              </View>

              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={23}
                  color="#F0442D"
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color="#98A2B3"
                />
              )}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}