import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setStorageItem<T>(
  key: string,
  value: T,
): Promise<void> {
  try {
    const serializedValue =
      JSON.stringify(value);

    await AsyncStorage.setItem(
      key,
      serializedValue,
    );
  } catch (error) {
    console.error(
      `Failed to store ${key}:`,
      error,
    );

    throw error;
  }
}

export async function getStorageItem<T>(
  key: string,
): Promise<T | null> {
  try {
    const storedValue =
      await AsyncStorage.getItem(key);

    if (!storedValue) {
      return null;
    }

    return JSON.parse(
      storedValue,
    ) as T;
  } catch (error) {
    console.error(
      `Failed to read ${key}:`,
      error,
    );

    throw error;
  }
}

export async function removeStorageItem(
  key: string,
): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(
      `Failed to remove ${key}:`,
      error,
    );

    throw error;
  }
}