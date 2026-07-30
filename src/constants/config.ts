export const CONFIG = {
  appName: 'Just Go Real',

  defaultLanguage: 'en' as const,

  supportedLanguages: ['en', 'ta'] as const,

  supportedState: 'Tamil Nadu',

  showAds: true,

  breakingIntervalMs: 3000,

  adIntervalMs: 10000,

  maxBreakingItems: 5,

  maxImageUploadSizeMb: 5,

  defaultAvatarUrl:
    'https://ui-avatars.com/api/?name=User&background=17336B&color=ffffff',

  fallbackNewsImage:
    'https://placehold.co/800x450',

  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_URL ??
    'https://example.com/api/v1',
} as const;