import { useState } from 'react';
import { Trip, PhotoItem } from '../types';
import { getCountryClickCount } from '../utils/storage';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Share2, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Globe, 
  Navigation,
  Image as ImageIcon,
  MousePointerClick
} from 'lucide-react';

interface HomeViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip, initialSubTab?: 'story' | 'photos' | 'map') => void;
  onNavigateTab: (tab: 'trips' | 'gallery' | 'map') => void;
  onOpenShareModal: (trip?: Trip) => void;
  onOpenCreateModal: () => void;
  onOpenPhotoLightbox: (photo: PhotoItem, allPhotos: PhotoItem[]) => void;
  isAuthorMode: boolean;
  countryClicks: Record<string, number>;
  onRecordCountryClick: (country: string) => void;
}

export function HomeView({
  trips,
  onSelectTrip,
  onNavigateTab,
  onOpenShareModal,
  onOpenCreateModal,
  onOpenPhotoLightbox,
  isAuthorMode,
  countryClicks,
  onRecordCountryClick,
}: HomeViewProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredTrip = trips[featuredIndex] || trips[0];

  // Aggregate stats
  const uniqueCountries = new Set(trips.map((t) => t.country)).size;
  const totalPlaces = trips.reduce((acc, t) => acc + (t.places?.length || 0), 0);
  const totalPhotos = trips.reduce((acc, t) => acc + (t.photos?.length || 0), 0);
  const totalDays = trips.reduce((acc, t) => acc + (t.daysCount || 0), 0);

  // All photos flat list for preview gallery
  const allCuratedPhotos = trips.flatMap((t) => t.photos).slice(0, 8);

  const vibeLabels: Record<string, string> = {
    adventure: '探索冒險',
    leisure: '靜謐放鬆',
    culture: '人文歷史',
    foodie: '風土美饌',
    roadtrip: '公路漫行',
    nature: '壯麗自然',
    romantic: '浪漫光景',
  };

  return (
    <div className="space-y-20 pb-24 text-[#242220]">
      
      {/* 1. HERO SECTION: Fine Art Magazine Cover Feature */}
      {featuredTrip && (
        <section className="relative group">
          {/* Subtle Top Index Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF] text-xs font-sans">
            <div className="flex items-center gap-3 text-[#78756E] tracking-[0.2em] uppercase text-[11px]">
              <span>FEATURED VOLUME</span>
              <span>—</span>
              <span className="text-[#1F1E1D] font-medium font-serif italic text-sm">{featuredTrip.destination}</span>
            </div>

            {/* Quick Trip Switcher Tabs */}
            <div className="flex items-center gap-2">
              {trips.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-all rounded-xs ${
                    featuredIndex === idx
                      ? 'bg-[#1F1E1D] text-[#FAF9F6] font-medium'
                      : 'text-[#88857E] hover:text-[#1F1E1D] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')} · {t.destination.split('&')[0].split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Photographic Monograph Display */}
          <div className="relative mt-6 overflow-hidden bg-[#181716] text-[#FBFBFA]">
            {/* Image Stage */}
            <div className="relative h-[480px] sm:h-[580px] lg:h-[640px] w-full overflow-hidden">
              <img
                src={featuredTrip.coverImage}
                alt={featuredTrip.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1600&q=80';
                }}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.92]"
              />
              {/* Refined gradient overlay for editorial readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent opacity-85" />
            </div>

            {/* Editorial Typographic Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 md:p-16 z-10">
              
              {/* Top Meta info */}
              <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#DCD9D0]/90">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FAF9F6]" />
                  <span className="font-medium">{featuredTrip.country}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-white/15 text-[11px] font-mono text-[#FAF9F6]">
                    <MousePointerClick className="w-3 h-3 opacity-80" />
                    <span>累計 {getCountryClickCount(featuredTrip.country, countryClicks)} 次點擊</span>
                  </span>
                  <span className="opacity-50">/</span>
                  <span>{featuredTrip.daysCount} DAYS EXPEDITION</span>
                </div>
                <div className="hidden sm:block text-[11px] text-[#ABA79C] font-mono">
                  {featuredTrip.startDate} — {featuredTrip.endDate}
                </div>
              </div>

              {/* Bottom Main Content */}
              <div className="space-y-6 max-w-3xl">
                <div className="space-y-3">
                  <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#C4C0B6] font-sans">
                    {vibeLabels[featuredTrip.vibe] || featuredTrip.vibe}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#FAF9F6] leading-[1.15]">
                    {featuredTrip.title}
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-[#D5D2C8] leading-relaxed line-clamp-2 md:line-clamp-3 font-light max-w-2xl">
                  {featuredTrip.summary}
                </p>

                {/* Minimal Editorial Action Controls */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/15">
                  <button
                    id={`hero-btn-read-${featuredTrip.id}`}
                    onClick={() => onSelectTrip(featuredTrip, 'story')}
                    className="px-6 py-3 bg-[#FAF9F6] hover:bg-white text-[#181716] text-xs font-medium tracking-[0.2em] uppercase rounded-xs transition-colors shadow-sm flex items-center gap-2"
                  >
                    <span>閱讀旅行故事</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`hero-btn-photos-${featuredTrip.id}`}
                    onClick={() => onSelectTrip(featuredTrip, 'photos')}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#FAF9F6] text-xs tracking-[0.15em] uppercase border border-white/20 rounded-xs transition-colors flex items-center gap-2"
                  >
                    <ImageIcon className="w-3.5 h-3.5 opacity-80" />
                    <span>相簿 ({featuredTrip.photos.length})</span>
                  </button>

                  <button
                    id={`hero-btn-map-${featuredTrip.id}`}
                    onClick={() => onSelectTrip(featuredTrip, 'map')}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#FAF9F6] text-xs tracking-[0.15em] uppercase border border-white/20 rounded-xs transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 opacity-80" />
                    <span>足跡 ({featuredTrip.places.length})</span>
                  </button>

                  <button
                    id={`hero-btn-share-${featuredTrip.id}`}
                    onClick={() => onOpenShareModal(featuredTrip)}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#FAF9F6] rounded-xs border border-white/20 transition-colors ml-auto sm:ml-0"
                    title="分享這趟旅程"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. STATS & OVERVIEW: Museum Curated Metrics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#EAE7DF]">
        <div 
          onClick={() => onNavigateTab('map')}
          className="space-y-1 cursor-pointer group"
        >
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#88857E]">
            COUNTRIES
          </div>
          <div className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] group-hover:text-[#4A4742] transition-colors">
            {String(uniqueCountries).padStart(2, '0')}
          </div>
          <div className="text-xs text-[#78756E] font-light">
            個造訪國家與地區
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('map')}
          className="space-y-1 cursor-pointer group"
        >
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#88857E]">
            LANDMARKS
          </div>
          <div className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] group-hover:text-[#4A4742] transition-colors">
            {String(totalPlaces).padStart(2, '0')}
          </div>
          <div className="text-xs text-[#78756E] font-light">
            個打卡座標與私房景點
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('gallery')}
          className="space-y-1 cursor-pointer group"
        >
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#88857E]">
            PHOTOGRAPHS
          </div>
          <div className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] group-hover:text-[#4A4742] transition-colors">
            {String(totalPhotos).padStart(2, '0')}
          </div>
          <div className="text-xs text-[#78756E] font-light">
            張精選攝影作品
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('trips')}
          className="space-y-1 cursor-pointer group"
        >
          <div className="text-[11px] tracking-[0.2em] uppercase text-[#88857E]">
            TOTAL DAYS
          </div>
          <div className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] group-hover:text-[#4A4742] transition-colors">
            {String(totalDays).padStart(2, '0')}
          </div>
          <div className="text-xs text-[#78756E] font-light">
            天旅程回憶記錄
          </div>
        </div>
      </section>

      {/* 3. SELECTED JOURNEYS: Monograph Archive Grid */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between pb-3 border-b border-[#EAE7DF]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
              SELECTED EXPEDITIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] mt-1">
              精選旅行故事
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('trips')}
            className="text-xs uppercase tracking-[0.18em] text-[#55524C] hover:text-[#1F1E1D] flex items-center gap-1 transition"
          >
            <span>全部記錄 ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Monograph Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <article
              key={trip.id}
              id={`trip-card-${trip.id}`}
              onClick={() => onSelectTrip(trip, 'story')}
              className="group cursor-pointer flex flex-col space-y-4"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8E6DF]">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Subtle Overlay badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1F1E1D]/85 backdrop-blur-md text-[#FAF9F6] text-[10px] uppercase tracking-wider font-sans rounded-xs flex items-center gap-1.5 shadow-xs">
                  <span>{trip.country}</span>
                  <span className="opacity-30">|</span>
                  <span className="text-[#D5D2C8] font-mono text-[9px] flex items-center gap-0.5 font-light">
                    <MousePointerClick className="w-2.5 h-2.5 opacity-80" />
                    <span>{getCountryClickCount(trip.country, countryClicks)} 次點擊</span>
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#FAF9F6]/90 backdrop-blur-md text-[#232120] text-[10px] font-mono">
                  {trip.daysCount} DAYS
                </div>
              </div>

              {/* Monograph Metadata */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-[#88857E] flex items-center justify-between">
                    <span>{trip.destination}</span>
                    <span className="font-mono">{trip.startDate.slice(0, 7)}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl text-[#1F1E1D] group-hover:text-[#4A4742] transition-colors leading-snug line-clamp-2">
                    {trip.title}
                  </h3>

                  <p className="text-xs text-[#6B6861] line-clamp-2 leading-relaxed font-light">
                    {trip.summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-[11px] text-[#88857E] font-sans">
                  <div className="flex items-center gap-3">
                    <span>{trip.photos.length} 張照片</span>
                    <span>·</span>
                    <span>{trip.places.length} 個足跡</span>
                  </div>
                  <span className="text-[#1F1E1D] group-hover:translate-x-1 transition-transform">
                    閱讀遊記 →
                  </span>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. PHOTOGRAPHY EXHIBITION STRIP */}
      <section className="space-y-8 pt-6">
        <div className="flex items-baseline justify-between pb-3 border-b border-[#EAE7DF]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
              VISUAL DIARY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] mt-1">
              光影瞬間相簿
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('gallery')}
            className="text-xs uppercase tracking-[0.18em] text-[#55524C] hover:text-[#1F1E1D] flex items-center gap-1 transition"
          >
            <span>瀏覽完整畫廊</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Photos Exhibition Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {allCuratedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onOpenPhotoLightbox(photo, allCuratedPhotos)}
              className="group relative aspect-square overflow-hidden bg-[#E8E6DF] cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Subtle hover overlay with caption */}
              <div className="absolute inset-0 bg-[#121110]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                <p className="text-xs font-serif leading-snug line-clamp-2">
                  {photo.caption}
                </p>
                {photo.location && (
                  <p className="text-[10px] text-[#D5D2C8] tracking-wider uppercase font-sans mt-1">
                    {photo.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CARTOGRAPHIC EXPLORATION BANNER */}
      <section className="border border-[#EAE7DF] bg-[#F4F2EB] p-8 sm:p-12 md:p-16 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
            CARTOGRAPHY & FOOTPRINTS
          </span>
          
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1F1E1D] leading-snug">
            在地圖的經緯間，重溫每一步的感動
          </h2>

          <p className="text-xs sm:text-sm text-[#66635D] leading-relaxed font-light">
            以互動地圖視覺化呈現每一趟旅途的軌跡路線、私房美食與風景座標。
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-6 py-3 bg-[#1F1E1D] hover:bg-[#33302D] text-[#FAF9F6] text-xs tracking-[0.2em] uppercase rounded-xs transition shadow-sm"
            >
              開啟全螢幕地圖
            </button>

            {isAuthorMode ? (
              <button
                onClick={onOpenCreateModal}
                className="px-5 py-3 border border-[#D5D2C8] hover:border-[#1F1E1D] text-[#33302D] text-xs tracking-[0.15em] uppercase transition"
              >
                + 記錄新旅程
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('trips')}
                className="px-5 py-3 border border-[#D5D2C8] hover:border-[#1F1E1D] text-[#33302D] text-xs tracking-[0.15em] uppercase transition"
              >
                瀏覽所有典藏旅程 →
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none hidden md:flex items-center justify-center">
          <Globe className="w-96 h-96 text-[#1F1E1D]" />
        </div>
      </section>

      {/* 6. WHISPER-QUIET SHARE SECTION */}
      <section className="border-t border-[#EAE7DF] pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-[#1F1E1D]">
            分享這本旅行攝影集
          </h3>
          <p className="text-xs text-[#78756E] font-light">
            產生專屬分享網址或 QR Code，朋友可於任何裝置直接沉浸式閱讀。
          </p>
        </div>

        <button
          onClick={() => onOpenShareModal()}
          className="self-start sm:self-auto px-6 py-2.5 bg-[#FAF9F6] hover:bg-[#F2EFE8] border border-[#D5D2C8] text-[#1F1E1D] text-xs uppercase tracking-[0.18em] rounded-xs transition"
        >
          產生分享網址 →
        </button>
      </section>

    </div>
  );
}
