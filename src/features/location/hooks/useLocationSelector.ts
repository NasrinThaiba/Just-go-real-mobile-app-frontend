import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoLocation from 'expo-location';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import { TAMIL_NADU_LOCATIONS } from '@/features/location/constants/tamilNaduLocations';
import type {
  AppLocation,
  LocationError,
} from '@/features/location/types/location.types';

export function useLocationSelector() {
  const [selectedLocation, setSelectedLocation] =
    useState<AppLocation | null>(null);

  const [searchText, setSearchText] =
    useState('');

  const [isDetecting, setIsDetecting] =
    useState(false);

  const [error, setError] =
    useState<LocationError>(null);

  useEffect(() => {
    void (async () => {
      const stored = await AsyncStorage.getItem(
        STORAGE_KEYS.SELECTED_LOCATION,
      );

      if (!stored) return;

      try {
        setSelectedLocation(
          JSON.parse(stored) as AppLocation,
        );
      } catch {
        await AsyncStorage.removeItem(
          STORAGE_KEYS.SELECTED_LOCATION,
        );
      }
    })();
  }, []);

  const locations = useMemo(() => {
    const query =
      searchText.trim().toLowerCase();

    if (!query) {
      return TAMIL_NADU_LOCATIONS;
    }

    return TAMIL_NADU_LOCATIONS.filter(
      (location) =>
        `${location.name} ${location.district}`
          .toLowerCase()
          .includes(query),
    );
  }, [searchText]);

  const selectLocation = useCallback(
    async (location: AppLocation) => {
      setSelectedLocation(location);
      setError(null);

      await AsyncStorage.setItem(
        STORAGE_KEYS.SELECTED_LOCATION,
        JSON.stringify(location),
      );
    },
    [],
  );

  const detectCurrentLocation =
    useCallback(async () => {
      try {
        setIsDetecting(true);
        setError(null);

        const permission =
          await ExpoLocation.requestForegroundPermissionsAsync();

        if (
          permission.status !== 'granted'
        ) {
          setError('PERMISSION_DENIED');
          return null;
        }

        const currentPosition =
          await ExpoLocation.getCurrentPositionAsync(
            {
              accuracy:
                ExpoLocation.Accuracy.Balanced,
            },
          );

        const {
          latitude,
          longitude,
        } = currentPosition.coords;

        const addresses =
          await ExpoLocation.reverseGeocodeAsync(
            {
              latitude,
              longitude,
            },
          );

        const address = addresses[0];

        if (!address) {
          setError('LOCATION_UNAVAILABLE');
          return null;
        }

        const region =
          address.region
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, ' ') ?? '';

        if (
          region !== 'tamil nadu' &&
          region !== 'tamilnadu'
        ) {
          setError('OUTSIDE_TAMIL_NADU');
          return null;
        }

        const name =
          address.city ??
          address.district ??
          address.subregion ??
          'Current Location';

        const currentLocation: AppLocation =
          {
            id: `current-${latitude}-${longitude}`,
            name,
            district:
              address.district ??
              address.subregion ??
              name,
            state: 'Tamil Nadu',
            country: 'India',
            latitude,
            longitude,
            source: 'current',
            postalCode:
              address.postalCode ?? null,
            formattedAddress: [
              address.name,
              address.street,
              address.city,
              address.district,
              address.region,
              address.postalCode,
            ]
              .filter(Boolean)
              .join(', '),
          };

        await selectLocation(
          currentLocation,
        );

        return currentLocation;
      } catch {
        setError('LOCATION_UNAVAILABLE');
        return null;
      } finally {
        setIsDetecting(false);
      }
    }, [selectLocation]);

  return {
    selectedLocation,
    locations,
    searchText,
    isDetecting,
    error,
    setSearchText,
    selectLocation,
    detectCurrentLocation,
  };
}
