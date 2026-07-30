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

  if (
    Number.isNaN(date.getTime())
  ) {
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

  if (
    Number.isNaN(date.getTime())
  ) {
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

  if (
    Number.isNaN(date.getTime())
  ) {
    return '';
  }

  const now = new Date();

  const differenceInSeconds =
    Math.floor(
      (now.getTime() -
        date.getTime()) /
        1000,
    );

  if (
    differenceInSeconds < 60
  ) {
    return language === 'ta'
      ? 'சற்றுமுன்'
      : 'Just now';
  }

  const differenceInMinutes =
    Math.floor(
      differenceInSeconds / 60,
    );

  if (
    differenceInMinutes < 60
  ) {
    return language === 'ta'
      ? `${differenceInMinutes} நிமிடங்களுக்கு முன்`
      : `${differenceInMinutes} min ago`;
  }

  const differenceInHours =
    Math.floor(
      differenceInMinutes / 60,
    );

  if (
    differenceInHours < 24
  ) {
    return language === 'ta'
      ? `${differenceInHours} மணி நேரத்திற்கு முன்`
      : `${differenceInHours} hr ago`;
  }

  const differenceInDays =
    Math.floor(
      differenceInHours / 24,
    );

  if (
    differenceInDays < 7
  ) {
    return language === 'ta'
      ? `${differenceInDays} நாட்களுக்கு முன்`
      : `${differenceInDays} days ago`;
  }

  return formatDate(
    date,
    language,
  );
}