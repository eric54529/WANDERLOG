export type TravelVibe = 'adventure' | 'leisure' | 'culture' | 'foodie' | 'roadtrip' | 'nature' | 'romantic';

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  location?: string;
  dayNumber?: number;
  date?: string;
  tags: string[];
  isCover?: boolean;
  liked?: boolean;
  aspect?: 'landscape' | 'portrait' | 'square';
}

export interface PlaceMarker {
  id: string;
  name: string;
  category: 'sight' | 'food' | 'stay' | 'transport' | 'nature' | 'photo_spot' | 'culture';
  lat: number;
  lng: number;
  dayNumber: number;
  note?: string;
  photoUrl?: string;
  rating?: number;
  address?: string;
  timeSpent?: string;
}

export interface DayStop {
  id: string;
  time?: string;
  placeName: string;
  description: string;
  photoUrl?: string;
  category?: 'sight' | 'food' | 'stay' | 'transport' | 'nature' | 'photo_spot' | 'culture';
  cost?: string;
  tips?: string;
  locationName?: string;
  lat?: number;
  lng?: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  highlight?: string;
  journalText: string;
  mood?: string; // e.g. ☀️ 晴朗興奮, 🌸 愜意舒適
  weather?: string;
  stops: DayStop[];
}

export interface Trip {
  id: string;
  title: string;
  subtitle?: string;
  destination: string;
  country: string;
  countryCode: string;
  flag: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  coverImage: string;
  summary: string;
  companions: string[];
  budget?: {
    currency: string;
    totalAmount: number;
    perPerson?: number;
    breakdown?: {
      transport?: number;
      stay?: number;
      food?: number;
      tickets?: number;
      shopping?: number;
    };
  };
  vibe: TravelVibe;
  rating: number; // 1-5
  days: DayPlan[];
  photos: PhotoItem[];
  places: PlaceMarker[];
  highlights: string[];
  tips: string[];
  memoriesText?: string;
  isFavorite?: boolean;
  viewsCount?: number;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'home' | 'trips' | 'trip-detail' | 'gallery' | 'map' | 'faq' | 'share';
