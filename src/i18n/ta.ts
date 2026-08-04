export const ta = {
  common: {
    language: 'மொழி',
    english: 'English',
    tamil: 'தமிழ்',

    chooseLocation: 'இடத்தை தேர்வு செய்க',
    searchLocation: 'நகரம் அல்லது மாவட்டத்தை தேடவும்',
    useCurrentLocation: 'தற்போதைய இடத்தை பயன்படுத்தவும்',
    detectingLocation: 'இடம் கண்டறியப்படுகிறது...',
    tamilNaduLocations: 'தமிழ்நாடு இடங்கள்',

    permissionDenied: 'இட அனுமதி மறுக்கப்பட்டது.',
    outsideTamilNadu: 'தமிழ்நாடு இடங்கள் மட்டும் ஆதரிக்கப்படுகின்றன.',
    locationUnavailable: 'உங்கள் இடத்தை கண்டறிய முடியவில்லை.',

    loading: 'ஏற்றப்படுகிறது...',
    retry: 'மீண்டும் முயற்சி',
    close: 'மூடு',
    save: 'சேமிக்க',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பிக்க',
    viewAll: 'அனைத்தையும் காண்க',
    noData: 'தரவு இல்லை',
    advertisementClosed: 'விளம்பரம் மூடப்பட்டது',
  },

  tabs: {
    home: 'முகப்பு',
    discover: 'கண்டறிய',
    video: 'வீடியோ',
    saved: 'சேமித்தவை',
    activity: 'செயல்பாடுகள்',
  },

  home: {
    breaking: 'உடனடி செய்திகள்',
    business: 'வணிகம்',
    science: 'அறிவியல்',
    sports: 'விளையாட்டு',
    latestNews: 'சமீபத்திய செய்திகள்',
    topStories: 'முக்கிய செய்திகள்',
  },

  profile: {
    guest: 'விருந்தினர்',
    role: 'விருந்தினர்',
    changePhoto: 'புகைப்படத்தை மாற்று',
    editProfile: 'சுயவிவரத்தை திருத்து',
    language: 'மொழி',
    location: 'இருப்பிடம்',
    setLocation: 'இருப்பிடத்தை அமைக்கவும்',
    logout: 'வெளியேறு',
    fullName: 'முழுப் பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    saveProfile: 'சுயவிவரத்தை சேமிக்கவும்',
    profileUpdated: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
  },

  login: {
    title: 'Just Go Real-க்கு வரவேற்கிறோம்',
    subtitle: 'உள்ளூர் செய்திகள் மற்றும் புதுப்பிப்புகளைப் பார்க்க உள்நுழைக.',
    phoneNumber: 'தொலைபேசி எண்',
    enterPhoneNumber: 'தொலைபேசி எண்ணை உள்ளிடவும்',
    continue: 'தொடரவும்',
    invalidPhone: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.',
  },

  createNews: {
    title: 'செய்தி உருவாக்கு',
    newsTitle: 'செய்தி தலைப்பு',
    category: 'வகை',
    description: 'விளக்கம்',
    coverImage: 'முகப்பு படம்',
    selectImage: 'படத்தை தேர்வு செய்க',
    publishNews: 'செய்தியை வெளியிடு',
    success: 'செய்தி வெற்றிகரமாக உருவாக்கப்பட்டது.',
    missingFields: 'அனைத்து தேவையான தகவல்களையும் நிரப்பவும்.',
  },

  createVideo: {
    title: 'வீடியோ உருவாக்கு',
    videoTitle: 'வீடியோ தலைப்பு',
    videoUrl: 'வீடியோ URL',
    description: 'விளக்கம்',
    publishVideo: 'வீடியோவை வெளியிடு',
    success: 'வீடியோ வெற்றிகரமாக உருவாக்கப்பட்டது.',
    missingFields: 'வீடியோ தலைப்பு மற்றும் URL-ஐ உள்ளிடவும்.',
  },

  article: {
    views: 'பார்வைகள்',
    comment: 'கருத்து',
    articleNotFound: 'செய்தி கிடைக்கவில்லை',
  },

  video: {
    videoNotFound: 'வீடியோ கிடைக்கவில்லை',
    openYoutube: 'இந்த வீடியோவை YouTube-ல் திறக்கவும்.',
  },

  empty: {
    noNews: 'செய்திகள் இல்லை',
    noTrending: 'பிரபலமான செய்திகள் இல்லை',
    noVideos: 'வீடியோக்கள் இல்லை',
    noLocations: 'தமிழ்நாடு இடங்கள் கிடைக்கவில்லை',
  },
} as const;