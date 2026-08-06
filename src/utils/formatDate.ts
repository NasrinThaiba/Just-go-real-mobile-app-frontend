import type {
  SupportedLanguage,
} from '@/types/common.types';

export function formatDate(
  value: string | Date,
  language: SupportedLanguage = 'en',
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(
    language === 'ta'
      ? 'ta-IN'
      : 'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}

export function formatDateTime(
  value: string | Date,
  language: SupportedLanguage = 'en',
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(
    language === 'ta'
      ? 'ta-IN'
      : 'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

export function formatRelativeDate(
  value: string | Date,
  language: SupportedLanguage = 'en',
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const differenceInSeconds = Math.max(
    Math.floor(
      (Date.now() - date.getTime()) /
        1000,
    ),
    0,
  );

  if (differenceInSeconds < 60) {
    return language === 'ta'
      ? 'சற்றுமுன்'
      : 'Just now';
  }

  const differenceInMinutes =
    Math.floor(
      differenceInSeconds / 60,
    );

  if (differenceInMinutes < 60) {
    if (language === 'ta') {
      return `${differenceInMinutes} நிமிடங்களுக்கு முன்`;
    }

    return differenceInMinutes === 1
      ? '1 min ago'
      : `${differenceInMinutes} mins ago`;
  }

  const differenceInHours =
    Math.floor(
      differenceInMinutes / 60,
    );

  // 24 hours complete ஆகும் வரை hours மட்டும்
  if (differenceInHours < 24) {
    if (language === 'ta') {
      return `${differenceInHours} மணி நேரத்திற்கு முன்`;
    }

    return differenceInHours === 1
      ? '1 hr ago'
      : `${differenceInHours} hrs ago`;
  }

  // 24 hours complete ஆன பிறகு days
  const differenceInDays =
    Math.floor(
      differenceInHours / 24,
    );

  if (differenceInDays < 7) {
    if (language === 'ta') {
      return differenceInDays === 1
        ? '1 நாளுக்கு முன்'
        : `${differenceInDays} நாட்களுக்கு முன்`;
    }

    return differenceInDays === 1
      ? '1 day ago'
      : `${differenceInDays} days ago`;
  }

  return formatDate(
    date,
    language,
  );
}