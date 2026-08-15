import { useState, FormEvent } from 'react';
import { Trip, DayPlan, PhotoItem } from '../types';
import { getCountryClickCount } from '../utils/storage';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Compass, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2,
  Quote,
  MessageSquare,
  Send,
  User,
  Lightbulb,
  MousePointerClick,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TripDetailViewProps {
  trip: Trip;
  onBack: () => void;
  onNavigateHome?: () => void;
  onOpenShareModal: (trip: Trip) => void;
  onOpenPhotoLightbox: (photo: PhotoItem, allPhotos: PhotoItem[]) => void;
  onToggleTripLike: (tripId: string) => void;
  initialSubTab?: 'story' | 'photos' | 'map';
  countryClicks?: Record<string, number>;
}

interface GuestbookNote {
  id: string;
  author: string;
  comment: string;
  date: string;
}

export function TripDetailView({
  trip,
  onBack,
  onNavigateHome,
  onOpenShareModal,
  onOpenPhotoLightbox,
  onToggleTripLike,
  initialSubTab = 'story',
  countryClicks = {},
}: TripDetailViewProps) {
  const [subTab, setSubTab] = useState<'story' | 'photos' | 'map' | 'tips'>(initialSubTab);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | 'all'>('all');
  
  // Interactive guestbook for friends
  const [guestNotes, setGuestNotes] = useState<GuestbookNote[]>([
    {
      id: 'g-1',
      author: '好友 廷廷',
      comment: '這趟旅行的照片光影真的太美了！尤其是嵐山竹林和湖畔晨霧那一張，完全像攝影展的作品！',
      date: '2026-03-28'
    },
    {
      id: 'g-2',
      author: '旅伴 小涵',
      comment: '好懷念第三天下午一起在咖啡館躲雨聊天的時光，期待我們下一次的冒險！✨',
      date: '2026-04-02'
    }
  ]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const note: GuestbookNote = {
      id: `g-${Date.now()}`,
      author: newAuthor.trim() || '匿名的旅行好友',
      comment: newComment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setGuestNotes([note, ...guestNotes]);
    setNewComment('');
    setNewAuthor('');
    confetti({ particleCount: 25, spread: 50 });
  };

  const filteredDays = selectedDayNumber === 'all'
    ? trip.days
    : trip.days.filter((d) => d.dayNumber === selectedDayNumber);

  return (
    <div className="space-y-16 pb-28 text-[#242220]">
      
      {/* 1. TOP NAV & BREADCRUMBS & BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE7DF] text-xs font-sans">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-detail-return-home"
            onClick={onNavigateHome || onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EDE5] hover:bg-[#E4E0D6] text-[#2C2A28] transition rounded-xs text-[11px] font-medium tracking-wider uppercase border border-[#DCD9D0]"
            title="回到網站總覽首頁"
          >
            <Home className="w-3.5 h-3.5" />
            <span>返回首頁</span>
          </button>

          <span className="text-[#CCC9C0]">/</span>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#6B6861] hover:text-[#1F1E1D] transition uppercase tracking-widest text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>旅行紀錄 ({trip.country})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Like Heart */}
          <button
            onClick={() => {
              onToggleTripLike(trip.id);
              confetti({ particleCount: 20, spread: 40 });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xs transition text-xs tracking-wider uppercase ${
              trip.isFavorite
                ? 'border-[#242220] bg-[#242220] text-[#FAF9F6]'
                : 'border-[#D5D2C8] text-[#55524C] hover:border-[#1F1E1D]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${trip.isFavorite ? 'fill-current' : ''}`} />
            <span>{trip.likesCount > 0 ? trip.likesCount : '喜歡'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onOpenShareModal(trip)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] rounded-xs transition text-xs uppercase tracking-widest"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享此篇</span>
          </button>
        </div>
      </div>

      {/* 2. EDITORIAL COVER ESSAY HEADER */}
      <header className="space-y-8">
        {/* Full-Bleed Photograph Stage */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[580px] w-full overflow-hidden bg-[#181716]">
          <img
            src={trip.coverImage}
            alt={trip.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1600&q=80';
            }}
            className="w-full h-full object-cover object-center brightness-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/30 to-transparent" />
          
          {/* Cover Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 text-[#FAF9F6] space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#D5D2C8]">
              <span className="font-medium text-[#FAF9F6]">{trip.country}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-white/15 text-[11px] font-mono text-[#FAF9F6] lowercase tracking-normal">
                <MousePointerClick className="w-3 h-3 opacity-80" />
                <span>累計點擊 {getCountryClickCount(trip.country, countryClicks)} 次</span>
              </span>
              <span>·</span>
              <span>{trip.destination}</span>
              <span>·</span>
              <span className="font-mono">{trip.daysCount} DAYS</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF9F6] font-normal leading-[1.15] max-w-4xl">
              {trip.title}
            </h1>

            {trip.subtitle && (
              <p className="text-sm sm:text-base text-[#D5D2C8] font-light max-w-2xl">
                {trip.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Editorial Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#EAE7DF] text-xs">
          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#88857E]">
              EXPEDITION PERIOD
            </div>
            <div className="font-mono text-[#1F1E1D]">
              {trip.startDate} ~ {trip.endDate}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#88857E]">
              COMPANIONS
            </div>
            <div className="text-[#1F1E1D]">
              {trip.companions?.length ? trip.companions.join('、') : '獨旅探尋'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#88857E]">
              PHOTO GALLERY
            </div>
            <div className="text-[#1F1E1D]">
              {trip.photos.length} 張精選光影
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#88857E]">
              FOOTPRINT
            </div>
            <div className="text-[#1F1E1D]">
              {trip.places.length} 處地標記錄
            </div>
          </div>
        </div>

        {/* Story Intro / Summary */}
        <div className="max-w-3xl space-y-6 pt-2">
          <p className="font-serif text-lg sm:text-xl text-[#383531] leading-relaxed font-light">
            {trip.summary}
          </p>

          {/* Highlights Highlights */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#EAE7DF]">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
                TRIP HIGHLIGHTS
              </div>
              <ul className="space-y-1.5 text-xs text-[#55524C]">
                {trip.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#1F1E1D] font-mono mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* 3. EDITORIAL SECTION TABS */}
      <div className="sticky top-20 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE7DF] -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-8 text-xs uppercase tracking-[0.18em]">
          <button
            onClick={() => setSubTab('story')}
            className={`py-3.5 transition ${
              subTab === 'story'
                ? 'text-[#1F1E1D] font-semibold border-b-2 border-[#1F1E1D]'
                : 'text-[#88857E] hover:text-[#1F1E1D]'
            }`}
          >
            每日遊記 · DIARY ({trip.days.length})
          </button>

          <button
            onClick={() => setSubTab('photos')}
            className={`py-3.5 transition ${
              subTab === 'photos'
                ? 'text-[#1F1E1D] font-semibold border-b-2 border-[#1F1E1D]'
                : 'text-[#88857E] hover:text-[#1F1E1D]'
            }`}
          >
            相簿專欄 · GALLERY ({trip.photos.length})
          </button>

          <button
            onClick={() => setSubTab('map')}
            className={`py-3.5 transition ${
              subTab === 'map'
                ? 'text-[#1F1E1D] font-semibold border-b-2 border-[#1F1E1D]'
                : 'text-[#88857E] hover:text-[#1F1E1D]'
            }`}
          >
            路線足跡 · FOOTPRINTS ({trip.places.length})
          </button>

          <button
            onClick={() => setSubTab('tips')}
            className={`py-3.5 transition ${
              subTab === 'tips'
                ? 'text-[#1F1E1D] font-semibold border-b-2 border-[#1F1E1D]'
                : 'text-[#88857E] hover:text-[#1F1E1D]'
            }`}
          >
            備忘貼士 · TIPS
          </button>
        </div>
      </div>

      {/* 4. SUB-TAB CONTENT: STORY CHRONICLE */}
      {subTab === 'story' && (
        <div className="space-y-16">
          {/* Day Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] tracking-wider uppercase text-[#88857E] mr-1">
              天數跳轉：
            </span>
            <button
              onClick={() => setSelectedDayNumber('all')}
              className={`px-3 py-1 text-xs uppercase tracking-wider rounded-xs transition ${
                selectedDayNumber === 'all'
                  ? 'bg-[#1F1E1D] text-[#FAF9F6]'
                  : 'bg-[#F2EFE8] text-[#66635D] hover:text-[#1F1E1D]'
              }`}
            >
              全部天數 ({trip.days.length})
            </button>
            {trip.days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDayNumber(d.dayNumber)}
                className={`px-3 py-1 text-xs uppercase tracking-wider rounded-xs transition ${
                  selectedDayNumber === d.dayNumber
                    ? 'bg-[#1F1E1D] text-[#FAF9F6]'
                    : 'bg-[#F2EFE8] text-[#66635D] hover:text-[#1F1E1D]'
                }`}
              >
                Day {d.dayNumber}
              </button>
            ))}
          </div>

          {/* Days Articles Flow */}
          <div className="space-y-20">
            {filteredDays.map((day) => {
              // Photos belonging to this day
              const dayPhotos = trip.photos.filter((p) => p.dayNumber === day.dayNumber);

              return (
                <article
                  key={day.dayNumber}
                  id={`day-${day.dayNumber}`}
                  className="space-y-8 pt-8 border-t border-[#EAE7DF] first:border-t-0 first:pt-0"
                >
                  {/* Day Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#88857E]">
                      <span className="font-mono font-medium text-[#1F1E1D]">DAY {String(day.dayNumber).padStart(2, '0')}</span>
                      <span>—</span>
                      <span className="font-mono">{day.date}</span>
                      {day.weather && (
                        <>
                          <span>·</span>
                          <span>{day.weather}</span>
                        </>
                      )}
                      {day.mood && (
                        <>
                          <span>·</span>
                          <span>{day.mood}</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D]">
                      {day.title}
                    </h2>
                  </div>

                  {/* Day Journal Body Text */}
                  <div className="max-w-3xl">
                    <p className="text-sm sm:text-base text-[#3D3A36] leading-loose font-light whitespace-pre-line">
                      {day.journalText}
                    </p>
                  </div>

                  {/* Day Stops / Timeline (Fine-line minimalist layout) */}
                  {day.stops && day.stops.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <div className="text-[10px] tracking-[0.25em] uppercase text-[#88857E]">
                        DAILY ITINERARY STOPS
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {day.stops.map((stop) => (
                          <div
                            key={stop.id}
                            className="p-4 bg-[#F5F3EC] border-l-2 border-[#1F1E1D] space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#88857E]">
                              <span>{stop.time}</span>
                            </div>
                            <h4 className="font-serif text-sm text-[#1F1E1D]">
                              {stop.placeName}
                            </h4>
                            {stop.description && (
                              <p className="text-xs text-[#66635D] leading-relaxed font-light">
                                {stop.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Day Photos Grid */}
                  {dayPhotos.length > 0 && (
                    <div className="space-y-3 pt-4">
                      <div className="text-[10px] tracking-[0.25em] uppercase text-[#88857E]">
                        DAY {day.dayNumber} PHOTOGRAPHS ({dayPhotos.length})
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {dayPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => onOpenPhotoLightbox(photo, trip.photos)}
                            className="group cursor-pointer space-y-2"
                          >
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
                            </div>
                            <div className="text-xs text-[#66635D] leading-snug">
                              <p className="font-serif text-[#1F1E1D] line-clamp-1">{photo.caption}</p>
                              {photo.location && (
                                <p className="text-[10px] text-[#88857E] uppercase tracking-wider mt-0.5">{photo.location}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </article>
              );
            })}
          </div>

          {/* Fine Editorial Pull Quote */}
          {trip.memoriesText && (
            <div className="p-8 sm:p-12 bg-[#F5F3EC] border-y border-[#EAE7DF] text-center space-y-4 my-12">
              <Quote className="w-6 h-6 mx-auto text-[#ABA79C]" />
              <blockquote className="font-serif italic text-lg sm:text-2xl text-[#1F1E1D] max-w-2xl mx-auto leading-relaxed">
                {trip.memoriesText}
              </blockquote>
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#88857E]">
                — TRAVEL REFLECTION
              </div>
            </div>
          )}

        </div>
      )}

      {/* 5. SUB-TAB CONTENT: PHOTO GALLERY MONOGRAPH */}
      {subTab === 'photos' && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between pb-3 border-b border-[#EAE7DF]">
            <h3 className="font-serif text-xl text-[#1F1E1D]">
              全相簿光影記錄 ({trip.photos.length} 張)
            </h3>
            <span className="text-xs text-[#88857E] font-light">
              點擊照片即可進入暗房畫廊檢視
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {trip.photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onOpenPhotoLightbox(photo, trip.photos)}
                className="group cursor-pointer space-y-2.5"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-[#E8E6DF]">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {photo.isCover && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#1F1E1D]/80 text-[#FAF9F6] text-[9px] uppercase tracking-widest font-sans">
                      COVER
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#88857E] font-mono">
                    <span>DAY {photo.dayNumber}</span>
                    {photo.location && <span>{photo.location}</span>}
                  </div>
                  <h4 className="font-serif text-xs text-[#1F1E1D] leading-snug">
                    {photo.caption}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUB-TAB CONTENT: MAP FOOTPRINTS */}
      {subTab === 'map' && (
        <div className="space-y-8">
          <div className="flex items-baseline justify-between pb-3 border-b border-[#EAE7DF]">
            <h3 className="font-serif text-xl text-[#1F1E1D]">
              旅程軌跡與打卡座標 ({trip.places.length} 個景點)
            </h3>
            <span className="text-xs text-[#88857E] font-light">
              按地理經緯度記錄的地標清單
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {trip.places.map((place) => (
              <div
                key={place.id}
                className="p-5 bg-[#F5F3EC] border border-[#EAE7DF] space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] text-[#88857E] uppercase tracking-wider">
                  <span>DAY {place.dayNumber}</span>
                  <span className="font-mono">{place.lat.toFixed(3)}, {place.lng.toFixed(3)}</span>
                </div>
                <h4 className="font-serif text-base text-[#1F1E1D]">
                  {place.name}
                </h4>
                {place.note && (
                  <p className="text-xs text-[#66635D] leading-relaxed font-light">
                    {place.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUB-TAB CONTENT: TIPS */}
      {subTab === 'tips' && (
        <div className="space-y-8 max-w-3xl">
          <div className="pb-3 border-b border-[#EAE7DF]">
            <h3 className="font-serif text-xl text-[#1F1E1D]">
              旅行實用筆記與貼士
            </h3>
          </div>

          <div className="space-y-4">
            {trip.tips && trip.tips.length > 0 ? (
              trip.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F5F3EC] border-l-2 border-[#1F1E1D] text-xs text-[#383531] leading-relaxed"
                >
                  {tip}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#88857E]">暫無特別備忘。</p>
            )}
          </div>
        </div>
      )}

      {/* 8. INTERACTIVE GUESTBOOK: Leave notes for friends */}
      <section className="pt-12 border-t border-[#EAE7DF] space-y-8 max-w-3xl">
        <div className="space-y-1">
          <div className="text-[10px] tracking-[0.25em] uppercase text-[#88857E]">
            READER GUESTBOOK
          </div>
          <h3 className="font-serif text-2xl text-[#1F1E1D]">
            好友留言與共鳴
          </h3>
          <p className="text-xs text-[#78756E] font-light">
            看完了這趟旅行？留下你的想法或回憶，與作者一起分享感動。
          </p>
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddComment} className="space-y-3 p-5 bg-[#F5F3EC] border border-[#EAE7DF]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="你的稱呼 / 旅伴姓名 (例：小明)"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="bg-white border border-[#E0DDD5] text-xs text-[#1F1E1D] p-2.5 focus:outline-none focus:border-[#1F1E1D]"
            />
          </div>
          <textarea
            rows={3}
            placeholder="寫下你的留言或對這趟旅行的感受..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-white border border-[#E0DDD5] text-xs text-[#1F1E1D] p-2.5 focus:outline-none focus:border-[#1F1E1D] leading-relaxed"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-wider transition"
            >
              傳送留言
            </button>
          </div>
        </form>

        {/* Existing Guestbook Notes */}
        <div className="space-y-4">
          {guestNotes.map((note) => (
            <div key={note.id} className="p-4 bg-white border border-[#EAE7DF] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#88857E]">
                <span className="font-serif text-[#1F1E1D] font-medium">{note.author}</span>
                <span className="font-mono">{note.date}</span>
              </div>
              <p className="text-xs text-[#55524C] leading-relaxed font-light">
                {note.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM NAVIGATION ACTIONS */}
      <div className="pt-8 border-t border-[#EAE7DF] flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onNavigateHome || onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F0EDE5] hover:bg-[#E4E0D6] text-[#1F1E1D] text-xs uppercase tracking-wider rounded-xs transition font-medium border border-[#D5D2C8]"
        >
          <Home className="w-4 h-4" />
          <span>返回網站總覽首頁</span>
        </button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-wider rounded-xs transition font-medium"
        >
          <span>瀏覽更多旅行紀錄 ({trip.country}) →</span>
        </button>
      </div>

    </div>
  );
}
