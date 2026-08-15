import { useState, useMemo, MouseEvent, FormEvent } from 'react';
import { Trip, PhotoItem } from '../types';
import { 
  Heart, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Plus, 
  Share2, 
  Compass, 
  SlidersHorizontal,
  Maximize2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoGalleryViewProps {
  trips: Trip[];
  onTogglePhotoLike: (tripId: string, photoId: string) => void;
  onAddPhotoToTrip: (tripId: string, photo: PhotoItem) => void;
  onOpenLightbox: (photo: PhotoItem, allPhotos: PhotoItem[]) => void;
  onOpenShareModal: (trip?: Trip) => void;
  isAuthorMode: boolean;
}

export function PhotoGalleryView({
  trips,
  onTogglePhotoLike,
  onAddPhotoToTrip,
  onOpenLightbox,
  onOpenShareModal,
  isAuthorMode,
}: PhotoGalleryViewProps) {
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);

  // New photo state
  const [targetTripId, setTargetTripId] = useState<string>(trips[0]?.id || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDayNumber, setNewDayNumber] = useState(1);

  // Collect all photos with their parent trip info
  const allPhotosWithTrip = useMemo(() => {
    const list: { photo: PhotoItem; trip: Trip }[] = [];
    trips.forEach((trip) => {
      trip.photos.forEach((photo) => {
        list.push({ photo, trip });
      });
    });
    return list;
  }, [trips]);

  // Filtered photos
  const filteredPhotoItems = useMemo(() => {
    return allPhotosWithTrip.filter(({ photo, trip }) => {
      if (selectedTripFilter !== 'all' && trip.id !== selectedTripFilter) {
        return false;
      }
      if (onlyFavorites && !photo.liked) {
        return false;
      }
      return true;
    });
  }, [allPhotosWithTrip, selectedTripFilter, onlyFavorites]);

  const handleAddPhotoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newCaption.trim()) return;

    const photo: PhotoItem = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newCaption.trim(),
      location: newLocation.trim() || undefined,
      dayNumber: Number(newDayNumber) || 1,
      tags: ['精選', '攝影集'],
      liked: true,
    };

    onAddPhotoToTrip(targetTripId, photo);
    setNewPhotoUrl('');
    setNewCaption('');
    setNewLocation('');
    setIsAddPhotoOpen(false);
    confetti({ particleCount: 30, spread: 60 });
  };

  return (
    <div className="space-y-12 pb-24 text-[#242220]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#EAE7DF]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
            PHOTOGRAPHY EXHIBITION & CURATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] mt-1.5">
            旅行攝影集畫廊
          </h1>
          <p className="text-xs text-[#78756E] mt-1 font-light">
            典藏 {allPhotosWithTrip.length} 張底片與數位光影，記錄旅途中的瞬間視角
          </p>
        </div>

        {isAuthorMode && (
          <button
            onClick={() => setIsAddPhotoOpen(!isAddPhotoOpen)}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-[0.18em] rounded-xs transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增相片</span>
          </button>
        )}
      </div>

      {/* Add Photo Collapsible Drawer - ONLY for Author */}
      {isAuthorMode && isAddPhotoOpen && (
        <form
          onSubmit={handleAddPhotoSubmit}
          className="p-6 bg-[#F5F3EC] border border-[#EAE7DF] space-y-4 max-w-2xl text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E0DDD5]">
            <h3 className="font-serif text-base text-[#1F1E1D]">
              添加照片至旅行相簿
            </h3>
            <button
              type="button"
              onClick={() => setIsAddPhotoOpen(false)}
              className="text-[#88857E] hover:text-[#1F1E1D]"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase text-[#78756E] block mb-1">
                歸屬旅行：
              </label>
              <select
                value={targetTripId}
                onChange={(e) => setTargetTripId(e.target.value)}
                className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.destination} · {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] tracking-wider uppercase text-[#78756E] block mb-1">
                第幾天拍攝 (Day)：
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={newDayNumber}
                onChange={(e) => setNewDayNumber(Number(e.target.value))}
                className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-wider uppercase text-[#78756E] block mb-1">
              照片網址 (Image URL) *：
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase text-[#78756E] block mb-1">
                照片敘述 / 圖說 *：
              </label>
              <input
                type="text"
                placeholder="例：嵐山竹林清晨的第一縷陽光"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] tracking-wider uppercase text-[#78756E] block mb-1">
                拍攝拍攝地點：
              </label>
              <input
                type="text"
                placeholder="例：京都 嵯峨野"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddPhotoOpen(false)}
              className="px-4 py-2 border border-[#D5D2C8] hover:border-[#1F1E1D]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1F1E1D] text-[#FAF9F6] uppercase tracking-wider"
            >
              確認添加
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#EAE7DF] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-[#88857E] mr-1">
            系列輯：
          </span>
          <button
            onClick={() => setSelectedTripFilter('all')}
            className={`px-3 py-1 rounded-xs transition text-xs ${
              selectedTripFilter === 'all'
                ? 'bg-[#1F1E1D] text-[#FAF9F6]'
                : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D]'
            }`}
          >
            全部相片 ({allPhotosWithTrip.length})
          </button>
          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTripFilter(t.id)}
              className={`px-3 py-1 rounded-xs transition text-xs ${
                selectedTripFilter === t.id
                  ? 'bg-[#1F1E1D] text-[#FAF9F6]'
                  : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D]'
              }`}
            >
              <span>{t.destination.split('&')[0].trim()}</span>
              <span className="opacity-60 ml-1 text-[10px]">({t.photos.length})</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`flex items-center gap-1.5 px-3 py-1 border rounded-xs transition text-xs uppercase tracking-wider ${
            onlyFavorites
              ? 'border-[#1F1E1D] bg-[#1F1E1D] text-[#FAF9F6]'
              : 'border-[#D5D2C8] text-[#66635D] hover:border-[#1F1E1D]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
          <span>精選標記</span>
        </button>
      </div>

      {/* GALLERY GRID */}
      {filteredPhotoItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 border border-dashed border-[#D5D2C8]">
          <p className="font-serif text-sm text-[#1F1E1D]">暫無符合條件的照片</p>
          <button
            onClick={() => {
              setSelectedTripFilter('all');
              setOnlyFavorites(false);
            }}
            className="text-xs underline text-[#88857E] hover:text-[#1F1E1D]"
          >
            清除篩選條件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredPhotoItems.map(({ photo, trip }) => (
            <div
              key={photo.id}
              onClick={() => onOpenLightbox(photo, filteredPhotoItems.map((item) => item.photo))}
              className="group cursor-pointer space-y-3"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E6DF]">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Like Button Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePhotoLike(trip.id, photo.id);
                  }}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition backdrop-blur-md ${
                    photo.liked
                      ? 'bg-[#1F1E1D]/80 text-[#FAF9F6]'
                      : 'bg-black/20 text-white/80 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${photo.liked ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#1F1E1D]/75 backdrop-blur-md text-[#FAF9F6] text-[9px] uppercase tracking-widest font-mono">
                  DAY {photo.dayNumber}
                </div>
              </div>

              {/* Photo Typography */}
              <div className="space-y-1">
                <div className="text-[10px] tracking-wider uppercase text-[#88857E] flex items-center justify-between">
                  <span>{trip.destination}</span>
                  {photo.location && <span>{photo.location}</span>}
                </div>

                <h3 className="font-serif text-sm text-[#1F1E1D] group-hover:text-[#55524C] leading-snug line-clamp-2">
                  {photo.caption}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
