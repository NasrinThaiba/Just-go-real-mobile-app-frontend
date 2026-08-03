import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY =
  '@just-go-real/auth';

export type AuthSession = {
  isAuthenticated: boolean;
  userId: string;
  phone: string;
  loggedInAt: string;
};

export async function getAuthSession(): Promise<
  AuthSession | null
> {
  try {
    const storedValue =
      await AsyncStorage.getItem(
        AUTH_STORAGE_KEY,
      );

    if (!storedValue) {
      return null;
    }

    return JSON.parse(
      storedValue,
    ) as AuthSession;
  } catch (error) {
    console.error(
      'Failed to load auth session:',
      error,
    );

    return null;
  }
}

export async function saveAuthSession(
  session: AuthSession,
): Promise<void> {
  await AsyncStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session),
  );
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(
    AUTH_STORAGE_KEY,
  );
}

export async function isAuthenticated(): Promise<boolean> {
  const session =
    await getAuthSession();

  return (
    session?.isAuthenticated ===
    true
  );
}