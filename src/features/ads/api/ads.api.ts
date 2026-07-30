import { API_BASE_URL } from '@/services/apiClient';
import { dummyAds } from '@/data/dummyAds';
import type { AdItem } from '@/features/ads/types/ads.types';

type AdsResponse = {
  items: AdItem[];
};

export async function getAds(): Promise<AdItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/ads`);

    if (!response.ok) {
      throw new Error(`Unable to fetch ads: ${response.status}`);
    }

    const data = (await response.json()) as AdsResponse | AdItem[];

    return Array.isArray(data) ? data : data.items;
  } catch {
    return dummyAds;
  }
}
