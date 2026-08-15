import { Trip, PhotoItem } from '../types';
import { initialTrips } from '../data/sampleTrips';

const STORAGE_KEY = 'wanderlog_trips_data_v3';
const LEGACY_STORAGE_KEYS = ['wanderlog_trips_data_v2', 'wanderlog_trips_data_v1'];

// Repair any stale or broken photo URLs from previous versions and sync fresh photo collections
function sanitizeTripsData(trips: Trip[]): Trip[] {
  const defaultFallbackPhoto = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';

  return trips.map((trip) => {
    const sampleMatch = initialTrips.find((t) => t.id === trip.id);
    
    // If it's one of the sample trips, sync the curated photos while preserving user's liked status
    if (sampleMatch) {
      const userLikedPhotoIds = new Set(
        (trip.photos || []).filter((p) => p.liked).map((p) => p.id)
      );

      const mergedPhotos = sampleMatch.photos.map((samplePhoto) => ({
        ...samplePhoto,
        liked: userLikedPhotoIds.has(samplePhoto.id) ? true : samplePhoto.liked,
      }));

      // Preserve any custom user-added photos that are not in sample photos
      const samplePhotoIds = new Set(sampleMatch.photos.map((p) => p.id));
      const customAddedPhotos = (trip.photos || []).filter((p) => !samplePhotoIds.has(p.id));

      return {
        ...sampleMatch,
        ...trip,
        coverImage: sampleMatch.coverImage,
        places: sampleMatch.places,
        days: sampleMatch.days,
        photos: [...mergedPhotos, ...customAddedPhotos],
      };
    }

    // For non-sample / custom user-created trips, sanitize invalid or broken URLs
    let coverImage = trip.coverImage;
    if (!coverImage || coverImage.includes('1509142846283')) {
      coverImage = defaultFallbackPhoto;
    }

    const sanitizedPlaces = (trip.places || []).map((pl) => {
      let photoUrl = pl.photoUrl;
      if (photoUrl && (photoUrl.includes('1509142846283') || photoUrl.includes('1558981403'))) {
        photoUrl = defaultFallbackPhoto;
      }
      return { ...pl, photoUrl };
    });

    const sanitizedPhotos = (trip.photos || []).map((ph) => {
      let url = ph.url;
      if (!url || url.includes('1509142846283') || url.includes('1558981403')) {
        url = defaultFallbackPhoto;
      }
      return { ...ph, url };
    });

    return {
      ...trip,
      coverImage,
      places: sanitizedPlaces,
      photos: sanitizedPhotos,
    };
  });
}

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy storage versions
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
          try {
            const legacyParsed = JSON.parse(legacyRaw);
            if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
              const sanitized = sanitizeTripsData(legacyParsed);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
              return sanitized;
            }
          } catch {
            // continue
          }
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrips));
      return initialTrips;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrips));
      return initialTrips;
    }
    const sanitized = sanitizeTripsData(parsed);
    return sanitized;
  } catch (err) {
    console.error('Failed to load trips from storage, fallback to initial data', err);
    return initialTrips;
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips to storage', err);
  }
}

export function getTripById(trips: Trip[], id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

export function saveTrip(trip: Trip): Trip[] {
  const current = loadTrips();
  const existingIdx = current.findIndex((t) => t.id === trip.id);
  let updated: Trip[];
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = {
      ...trip,
      updatedAt: now,
    };
  } else {
    updated = [
      {
        ...trip,
        createdAt: trip.createdAt || now,
        updatedAt: now,
      },
      ...current,
    ];
  }
  saveTrips(updated);
  return updated;
}

export function deleteTrip(tripId: string): Trip[] {
  const current = loadTrips();
  const updated = current.filter((t) => t.id !== tripId);
  saveTrips(updated);
  return updated;
}

export function togglePhotoLike(tripId: string, photoId: string): Trip[] {
  const current = loadTrips();
  const updated = current.map((t) => {
    if (t.id !== tripId) return t;
    const updatedPhotos = t.photos.map((p) => {
      if (p.id === photoId) {
        return { ...p, liked: !p.liked };
      }
      return p;
    });
    return { ...t, photos: updatedPhotos };
  });
  saveTrips(updated);
  return updated;
}

export function toggleTripLike(tripId: string): Trip[] {
  const current = loadTrips();
  const updated = current.map((t) => {
    if (t.id !== tripId) return t;
    const isFav = !t.isFavorite;
    return {
      ...t,
      isFavorite: isFav,
      likesCount: (t.likesCount || 0) + (isFav ? 1 : -1),
    };
  });
  saveTrips(updated);
  return updated;
}

// Generate URL for sharing a trip
export function generateShareUrl(trip: Trip): string {
  const baseUrl = window.location.origin + window.location.pathname;
  // Create a clean URL with query param
  return `${baseUrl}?tripId=${encodeURIComponent(trip.id)}`;
}

// Generate standalone portable payload link (Base64 encoded for sharing without server)
export function generatePortableShareUrl(trip: Trip): string {
  try {
    const minified = {
      id: trip.id,
      title: trip.title,
      subtitle: trip.subtitle,
      destination: trip.destination,
      country: trip.country,
      flag: trip.flag,
      startDate: trip.startDate,
      endDate: trip.endDate,
      daysCount: trip.daysCount,
      coverImage: trip.coverImage,
      summary: trip.summary,
      companions: trip.companions,
      vibe: trip.vibe,
      rating: trip.rating,
      highlights: trip.highlights,
      tips: trip.tips,
      memoriesText: trip.memoriesText,
      days: trip.days,
      photos: trip.photos.slice(0, 15), // keep portable
      places: trip.places,
    };
    const jsonStr = JSON.stringify(minified);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?shareData=${encoded}`;
  } catch {
    return generateShareUrl(trip);
  }
}

// Decode shared trip from URL parameters
export function getSharedTripFromUrl(): { tripId?: string; sharedTrip?: Trip } | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('tripId');
    if (tripId) {
      return { tripId };
    }

    const shareData = params.get('shareData');
    if (shareData) {
      const decoded = decodeURIComponent(atob(shareData));
      const parsed = JSON.parse(decoded);
      return { sharedTrip: parsed as Trip };
    }
  } catch (err) {
    console.error('Failed to parse shared trip from url', err);
  }
  return null;
}

// Export trips as JSON file
export function exportTripsAsJSON(trips: Trip[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trips, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `WanderLog_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Reset data to default samples
export function resetToSampleData(): Trip[] {
  saveTrips(initialTrips);
  return initialTrips;
}

// ----------------------------------------------------
// Country Click Analytics & Counter Tracking
// ----------------------------------------------------
const COUNTRY_CLICKS_STORAGE_KEY = 'wanderlog_country_clicks_v1';

export const DEFAULT_COUNTRY_CLICKS: Record<string, number> = {
  '日本 (Japan)': 48,
  '瑞士 (Switzerland)': 32,
  '冰島 (Iceland)': 29,
  '台灣 (Taiwan)': 64,
};

export function loadCountryClicks(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COUNTRY_CLICKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COUNTRY_CLICKS_STORAGE_KEY, JSON.stringify(DEFAULT_COUNTRY_CLICKS));
      return { ...DEFAULT_COUNTRY_CLICKS };
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return { ...DEFAULT_COUNTRY_CLICKS, ...parsed };
    }
    return { ...DEFAULT_COUNTRY_CLICKS };
  } catch (err) {
    console.error('Failed to load country clicks', err);
    return { ...DEFAULT_COUNTRY_CLICKS };
  }
}

export function saveCountryClicks(counts: Record<string, number>): void {
  try {
    localStorage.setItem(COUNTRY_CLICKS_STORAGE_KEY, JSON.stringify(counts));
  } catch (err) {
    console.error('Failed to save country clicks', err);
  }
}

export function recordCountryClick(country: string): Record<string, number> {
  const current = loadCountryClicks();
  const trimmed = country.trim();
  const existingKey = Object.keys(current).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase() || k.includes(trimmed) || trimmed.includes(k.split('(')[0].trim())
  );

  const keyToUse = existingKey || trimmed;
  const currentCount = current[keyToUse] || 0;
  const updated = {
    ...current,
    [keyToUse]: currentCount + 1,
  };
  saveCountryClicks(updated);
  return updated;
}

export function getCountryClickCount(country: string, countsMap: Record<string, number>): number {
  if (!country) return 0;
  const trimmed = country.trim();
  if (countsMap[trimmed] !== undefined) {
    return countsMap[trimmed];
  }
  const cleanName = trimmed.split('(')[0].trim();
  const matchedKey = Object.keys(countsMap).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase() || k.includes(cleanName) || cleanName.includes(k.split('(')[0].trim())
  );
  if (matchedKey && countsMap[matchedKey] !== undefined) {
    return countsMap[matchedKey];
  }
  return 0;
}

