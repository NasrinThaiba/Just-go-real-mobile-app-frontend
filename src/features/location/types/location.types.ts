export type LocationSource =
  | 'manual'
  | 'current';

export type AppLocation = {
  id: string;
  name: string;
  district: string;
  state: 'Tamil Nadu';
  country: 'India';
  latitude: number;
  longitude: number;
  source: LocationSource;
  postalCode?: string | null;
  formattedAddress?: string | null;
};

export type LocationError =
  | 'PERMISSION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'OUTSIDE_TAMIL_NADU'
  | null;
