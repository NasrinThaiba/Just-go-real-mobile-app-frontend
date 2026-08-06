import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SESSION_KEY =
  '@just_go_real/auth_session';

export type AuthSession = {
  isAuthenticated: boolean;
  userId: string;
  phone: string;
  loggedInAt: string;
};

export async function saveAuthSession(
  session: AuthSession,
): Promise<void> {
  await AsyncStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify(session),
  );
}

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const storedSession =
      await AsyncStorage.getItem(
        AUTH_SESSION_KEY,
      );

    if (!storedSession) {
      return null;
    }

    const parsedSession =
      JSON.parse(
        storedSession,
      ) as Partial<AuthSession>;

    if (
      !parsedSession.isAuthenticated ||
      !parsedSession.userId ||
      !parsedSession.phone
    ) {
      return null;
    }

    return {
      isAuthenticated: true,
      userId:
        parsedSession.userId,
      phone:
        parsedSession.phone,
      loggedInAt:
        parsedSession.loggedInAt ??
        new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      'Failed to get auth session:',
      error,
    );

    return null;
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  const session =
    await getAuthSession();

  return Boolean(
    session?.isAuthenticated &&
      session.userId,
  );
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(
    AUTH_SESSION_KEY,
  );
}