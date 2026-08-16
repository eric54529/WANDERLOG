import { useState, useEffect, useRef } from 'react';
import { Trip, PlaceMarker, PhotoItem } from '../types';
import { MapPin, Navigation, Compass, Globe, Image as ImageIcon, ExternalLink } from 'lucide-react';
import L from 'leaflet';

interface TravelMapViewProps {
  trips: Trip[];
  selectedTripId?: string;
  onSelectTrip: (trip: Trip, initialSubTab?: 'story' | 'photos' | 'map') => void;
  onOpenPhotoLightbox: (photo: PhotoItem, allPhotos: PhotoItem[]) => void;
}

export function TravelMapView({
  trips,
  selectedTripId,
  onSelectTrip,
  onOpenPhotoLightbox,
}: TravelMapViewProps) {
  const [activeTripFilter, setActiveTripFilter] = useState<string>(selectedTripId || 'all');
  const [activePlace, setActivePlace] = useState<PlaceMarker | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Compute all places with trip context
  const placesWithTrip = trips.flatMap((trip) =>
    trip.places.map((place) => ({
      ...place,
      tripTitle: trip.title,
      tripDestination: trip.destination,
      tripCountry: trip.country,
      tripId: trip.id,
      tripCover: trip.coverImage,
    }))
  );

  const filteredPlaces = activeTripFilter === 'all'
    ? placesWithTrip
    : placesWithTrip.filter((p) => p.tripId === activeTripFilter);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([35.0116, 135.7681], 5);

      // Elegant Minimal CartoDB Positron / OSM tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update Markers whenever filtered places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (filteredPlaces.length === 0) return;

    const bounds = L.latLngBounds([]);

    filteredPlaces.forEach((place) => {
      bounds.extend([place.lat, place.lng]);

      // Custom understated minimal marker icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: #1F1E1D;
            color: #FAF9F6;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            font-family: serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid #FAF9F6;
          ">
            ${place.dayNumber || '📍'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Noto Serif TC', serif; color: #1F1E1D; min-width: 180px; padding: 4px;">
          <div style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: #88857E; font-family: sans-serif;">
            ${place.tripDestination} · Day ${place.dayNumber}
          </div>
          <h4 style="margin: 4px 0; font-size: 14px; font-weight: 600;">${place.name}</h4>
          ${place.note ? `<p style="font-size: 11px; color: #55524C; margin: 0; line-height: 1.4; font-family: sans-serif;">${place.note}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setActivePlace(place);
      });

      group.addLayer(marker);
    });

    if (filteredPlaces.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [filteredPlaces]);

  const handlePlaceItemClick = (place: PlaceMarker) => {
    setActivePlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 13, { duration: 1.2 });
    }
  };

  return (
    <div className="space-y-8 pb-24 text-[#242220] dark:text-[#E8E5DE]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#EAE7DF] dark:border-[#2C2C29]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] dark:text-[#9A968E] font-sans">
            CARTOGRAPHY & EXPLORATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] dark:text-[#FAF9F6] mt-1.5">
            足跡地圖總覽
          </h1>
          <p className="text-xs text-[#78756E] dark:text-[#A8A49B] mt-1 font-light">
            在地圖上重現每趟旅行的地理經緯度與打卡座標
          </p>
        </div>

        {/* Trip Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] tracking-wider uppercase text-[#88857E] dark:text-[#9A968E] mr-1">
            範圍：
          </span>
          <button
            onClick={() => setActiveTripFilter('all')}
            className={`px-3 py-1 rounded-xs transition text-xs ${
              activeTripFilter === 'all'
                ? 'bg-[#1F1E1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#171716] font-medium'
                : 'bg-[#F4F2EB] dark:bg-[#1C1C1A] text-[#66635D] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
            }`}
          >
            全部足跡 ({placesWithTrip.length})
          </button>
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTripFilter(t.id)}
              className={`px-3 py-1 rounded-xs transition text-xs ${
                activeTripFilter === t.id
                  ? 'bg-[#1F1E1D] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#171716] font-medium'
                  : 'bg-[#F4F2EB] dark:bg-[#1C1C1A] text-[#66635D] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              <span>{t.destination.split('&')[0].trim()}</span>
              <span className="opacity-60 ml-1 text-[10px]">({t.places.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map & Places Sidebar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Map Box */}
        <div className="lg:col-span-2 h-[500px] sm:h-[600px] border border-[#EAE7DF] dark:border-[#2C2C29] relative overflow-hidden bg-[#E8E6DF] dark:bg-[#20201E] rounded-xs">
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>

        {/* Landmarks Sidebar List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#88857E] dark:text-[#9A968E] pb-2 border-b border-[#EAE7DF] dark:border-[#2C2C29]">
            LANDMARK DIRECTORY ({filteredPlaces.length})
          </div>

          <div className="space-y-3">
            {filteredPlaces.map((place, idx) => {
              const isSelected = activePlace?.id === place.id;
              const parentTrip = trips.find((t) => t.id === place.tripId);

              return (
                <div
                  key={place.id || idx}
                  onClick={() => handlePlaceItemClick(place)}
                  className={`p-4 border transition cursor-pointer space-y-1.5 rounded-xs ${
                    isSelected
                      ? 'bg-[#F5F3EC] dark:bg-[#232320] border-[#1F1E1D] dark:border-[#FAF9F6]'
                      : 'bg-white dark:bg-[#1C1C1A] border-[#EAE7DF] dark:border-[#2C2C29] hover:border-[#ABA79C] dark:hover:border-[#55524C]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#88857E] dark:text-[#9A968E] font-mono">
                    <span>DAY {place.dayNumber}</span>
                    <span>{place.tripDestination}</span>
                  </div>

                  <h3 className="font-serif text-sm text-[#1F1E1D] dark:text-[#FAF9F6]">
                    {place.name}
                  </h3>

                  {place.note && (
                    <p className="text-xs text-[#66635D] dark:text-[#A8A49B] line-clamp-2 leading-relaxed font-light">
                      {place.note}
                    </p>
                  )}

                  {parentTrip && (
                    <div className="pt-2 border-t border-[#F0EEE6] dark:border-[#2C2C29] flex items-center justify-between text-[10px] text-[#88857E] dark:text-[#9A968E]">
                      <span>{parentTrip.country}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTrip(parentTrip, 'story');
                        }}
                        className="text-[#1F1E1D] dark:text-[#FAF9F6] hover:underline"
                      >
                        看完整遊記 →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
