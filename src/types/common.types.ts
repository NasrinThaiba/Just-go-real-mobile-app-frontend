export type SupportedLanguage =
  | 'en'
  | 'ta';

export type LoadingStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export type SelectOption<
  TValue extends string = string,
> = {
  label: string;
  value: TValue;
};

export type Nullable<T> =
  T | null;

export type Optional<T> =
  T | undefined;

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export type EntityId =
  string;

export type TimestampFields = {
  createdAt: string;
  updatedAt: string;
};