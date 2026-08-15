import { useEffect } from 'react';
import { PhotoItem } from '../types';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

interface PhotoLightboxModalProps {
  photo: PhotoItem | null;
  photosList: PhotoItem[];
  onClose: () => void;
  onNavigatePhoto: (photo: PhotoItem) => void;
}

export function PhotoLightboxModal({
  photo,
  photosList,
  onClose,
  onNavigatePhoto,
}: PhotoLightboxModalProps) {
  if (!photo) return null;

  const currentList = photosList.length > 0 ? photosList : [photo];
  const currentIndex = currentList.findIndex((p) => p.id === photo.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentList, onClose]);

  const handlePrev = () => {
    if (currentList.length <= 1) return;
    if (currentIndex > 0) {
      onNavigatePhoto(currentList[currentIndex - 1]);
    } else {
      onNavigatePhoto(currentList[currentList.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentList.length <= 1) return;
    if (currentIndex < currentList.length - 1) {
      onNavigatePhoto(currentList[currentIndex + 1]);
    } else {
      onNavigatePhoto(currentList[0]);
    }
  };

  return (
    <div
      id="photo-lightbox-backdrop"
      className="fixed inset-0 z-50 bg-[#121110]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in select-none"
      onClick={onClose}
    >
      {/* Top Lightbox Header */}
      <div className="flex items-center justify-between text-[#FAF9F6] z-10">
        <div className="text-xs tracking-[0.2em] uppercase font-mono text-[#ABA79C]">
          {currentIndex >= 0 ? `${currentIndex + 1} / ${currentList.length}` : '1 / 1'}
        </div>

        <button
          id="btn-close-lightbox"
          onClick={onClose}
          className="p-2 text-[#ABA79C] hover:text-white transition rounded-full hover:bg-white/10"
          title="關閉相片檢視 (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          id="lightbox-main-img"
          src={photo.url}
          alt={photo.caption}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1600&q=80';
          }}
          className="max-h-[75vh] max-w-full object-contain shadow-2xl transition-transform duration-300"
        />

        {/* Previous Button */}
        {currentList.length > 1 && (
          <button
            id="btn-lightbox-prev"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white transition backdrop-blur-sm shadow-md"
            title="上一張 (← 方向鍵)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentList.length > 1 && (
          <button
            id="btn-lightbox-next"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/75 text-white transition backdrop-blur-sm shadow-md"
            title="下一張 (→ 方向鍵)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption Bar */}
      <div
        className="text-center text-[#FAF9F6] max-w-2xl mx-auto space-y-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-base sm:text-lg leading-snug">
          {photo.caption}
        </h3>
        <div className="flex items-center justify-center gap-4 text-xs text-[#ABA79C] font-light">
          {photo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D5D2C8]" />
              <span>{photo.location}</span>
            </span>
          )}
          <span>·</span>
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-[#D5D2C8]" />
            <span>DAY {photo.dayNumber}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
