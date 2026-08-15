import { useState, useMemo } from 'react';
import { Trip } from '../types';
import { getCountryClickCount } from '../utils/storage';
import { 
  Search, 
  Plus, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  Edit3, 
  Trash2, 
  Share2,
  MapPin,
  Calendar,
  BookOpen,
  MousePointerClick,
  Sparkles
} from 'lucide-react';

interface TripsListViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip, initialSubTab?: 'story' | 'photos' | 'map') => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onOpenShareModal: (trip: Trip) => void;
  onOpenCreateModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthorMode: boolean;
  countryClicks: Record<string, number>;
  onRecordCountryClick: (country: string) => void;
}

export function TripsListView({
  trips,
  onSelectTrip,
  onEditTrip,
  onDeleteTrip,
  onOpenShareModal,
  onOpenCreateModal,
  searchQuery,
  setSearchQuery,
  isAuthorMode,
  countryClicks,
  onRecordCountryClick,
}: TripsListViewProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'days-desc' | 'rating-desc'>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set(trips.map((t) => t.country));
    return Array.from(set);
  }, [trips]);

  // Filtered and sorted trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = trip.title.toLowerCase().includes(q);
          const matchesDest = trip.destination.toLowerCase().includes(q);
          const matchesCountry = trip.country.toLowerCase().includes(q);
          const matchesSummary = trip.summary.toLowerCase().includes(q);
          const matchesHighlight = trip.highlights?.some((h) => h.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDest && !matchesCountry && !matchesSummary && !matchesHighlight) {
            return false;
          }
        }
        if (selectedCountry !== 'all' && trip.country !== selectedCountry) {
          return false;
        }
        if (selectedVibe !== 'all' && trip.vibe !== selectedVibe) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        if (sortBy === 'days-desc') {
          return b.daysCount - a.daysCount;
        }
        if (sortBy === 'rating-desc') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [trips, searchQuery, selectedCountry, selectedVibe, sortBy]);

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
    <div className="space-y-12 pb-24 text-[#242220]">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#EAE7DF]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
            TRAVEL ARCHIVE & CHRONICLES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] mt-1.5">
            旅行紀錄典藏
          </h1>
          <p className="text-xs text-[#78756E] mt-1 font-light">
            共收錄 {trips.length} 趟精選行旅紀錄，記錄途中的足跡與光影
          </p>
        </div>

        {isAuthorMode && (
          <button
            onClick={onOpenCreateModal}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-[0.18em] rounded-xs transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>記錄新旅行</span>
          </button>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-[#9C998F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋旅行標題、城市或關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F2EB] text-xs text-[#1F1E1D] placeholder-[#9C998F] pl-8 pr-8 py-2 rounded-xs border border-transparent focus:border-[#ABA79C] focus:bg-white focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#88857E] hover:text-[#1F1E1D] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort and View Mode */}
          <div className="flex items-center gap-4 justify-between md:justify-end text-xs">
            <div className="flex items-center gap-2 text-[#78756E]">
              <span className="text-[11px] uppercase tracking-wider">排序方式：</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F4F2EB] border-none rounded-xs px-2.5 py-1.5 text-xs text-[#1F1E1D] focus:outline-none focus:ring-1 focus:ring-[#ABA79C]"
              >
                <option value="date-desc">最新出發日期</option>
                <option value="date-asc">最舊出發日期</option>
                <option value="days-desc">旅行天數多到少</option>
                <option value="rating-desc">推薦評分</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center border border-[#E0DDD5] rounded-xs overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition ${
                  viewMode === 'grid' ? 'bg-[#1F1E1D] text-[#FAF9F6]' : 'text-[#78756E] hover:bg-[#F2EFE8]'
                }`}
                title="網格檢視"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition ${
                  viewMode === 'list' ? 'bg-[#1F1E1D] text-[#FAF9F6]' : 'text-[#78756E] hover:bg-[#F2EFE8]'
                }`}
                title="清單檢視"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EAE7DF] text-xs">
          <span className="text-[11px] uppercase tracking-wider text-[#88857E] mr-1">
            國家：
          </span>
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-3 py-1.5 rounded-xs transition text-xs ${
              selectedCountry === 'all'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] font-medium'
                : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D]'
            }`}
          >
            全部 ({trips.length})
          </button>
          {countries.map((c) => {
            const count = trips.filter((t) => t.country === c).length;
            const clickCount = getCountryClickCount(c, countryClicks);
            const isSelected = selectedCountry === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setSelectedCountry(c);
                  onRecordCountryClick(c);
                }}
                className={`px-3 py-1.5 rounded-xs transition text-xs flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1F1E1D] text-[#FAF9F6] font-medium shadow-xs'
                    : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D] hover:bg-[#EAE7DF]'
                }`}
                title={`點擊查看${c}旅行紀錄（累計 ${clickCount} 次點擊）`}
              >
                <span>{c.split('(')[0].trim()}</span>
                <span className="opacity-60 text-[10px]">({count}篇)</span>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs text-[10px] font-mono ${
                  isSelected ? 'bg-white/20 text-[#FAF9F6]' : 'bg-[#E5E2D9] text-[#4A4742]'
                }`}>
                  <MousePointerClick className="w-2.5 h-2.5 opacity-70" />
                  <span>{clickCount} 次點擊</span>
                </span>
              </button>
            );
          })}

          <div className="h-3 w-px bg-[#D5D2C8] mx-2 hidden sm:block" />

          <span className="text-[11px] uppercase tracking-wider text-[#88857E] mr-1 hidden sm:inline">
            風格：
          </span>
          <button
            onClick={() => setSelectedVibe('all')}
            className={`px-3 py-1 rounded-xs transition text-xs ${
              selectedVibe === 'all'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] font-medium'
                : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D]'
            }`}
          >
            全部風格
          </button>
          {['culture', 'nature', 'roadtrip', 'leisure'].map((vibeKey) => (
            <button
              key={vibeKey}
              onClick={() => setSelectedVibe(selectedVibe === vibeKey ? 'all' : vibeKey)}
              className={`px-3 py-1 rounded-xs transition text-xs ${
                selectedVibe === vibeKey
                  ? 'bg-[#1F1E1D] text-[#FAF9F6] font-medium'
                  : 'bg-[#F4F2EB] text-[#66635D] hover:text-[#1F1E1D]'
              }`}
            >
              {vibeLabels[vibeKey]}
            </button>
          ))}
        </div>
      </div>

      {/* TRIPS ARCHIVE LISTINGS */}
      {filteredTrips.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-dashed border-[#D5D2C8] rounded-xs">
          <div className="text-sm font-serif text-[#1F1E1D]">無符合條件的旅行紀錄</div>
          <p className="text-xs text-[#88857E] font-light max-w-sm mx-auto">
            可嘗試重設篩選條件，或建立一段全新的旅行遊記。
          </p>
          <button
            onClick={() => {
              setSelectedCountry('all');
              setSelectedVibe('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 border border-[#D5D2C8] text-xs uppercase tracking-wider hover:border-[#1F1E1D]"
          >
            重設篩選
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTrips.map((trip) => (
            <article
              key={trip.id}
              className="group flex flex-col space-y-4"
            >
                {/* Photo Frame */}
                <div 
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8E6DF] cursor-pointer"
                  onClick={() => {
                    onRecordCountryClick(trip.country);
                    onSelectTrip(trip, 'story');
                  }}
                >
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCountry(trip.country);
                      onRecordCountryClick(trip.country);
                    }}
                    className="absolute top-3 left-3 px-2.5 py-1 bg-[#1F1E1D]/85 hover:bg-[#1F1E1D] backdrop-blur-md text-[#FAF9F6] text-[10px] uppercase tracking-wider font-sans rounded-xs flex items-center gap-1.5 transition cursor-pointer z-10 shadow-sm"
                    title="點擊依此國家篩選（增加點擊次數）"
                  >
                    <span>{trip.country}</span>
                    <span className="opacity-30">|</span>
                    <span className="text-[#E0DDD5] font-mono text-[9px] flex items-center gap-0.5 font-light">
                      <MousePointerClick className="w-2.5 h-2.5 opacity-80" />
                      <span>{getCountryClickCount(trip.country, countryClicks)} 次點擊</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#FAF9F6]/90 backdrop-blur-md text-[#232120] text-[10px] font-mono">
                    {trip.daysCount} DAYS
                  </div>
                </div>

              {/* Body */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-[#88857E] flex items-center justify-between">
                    <span>{trip.destination}</span>
                    <span className="font-mono">{trip.startDate}</span>
                  </div>

                  <h2 
                    onClick={() => onSelectTrip(trip, 'story')}
                    className="font-serif text-lg sm:text-xl text-[#1F1E1D] group-hover:text-[#55524C] transition-colors leading-snug cursor-pointer line-clamp-2"
                  >
                    {trip.title}
                  </h2>

                  <p className="text-xs text-[#66635D] line-clamp-2 leading-relaxed font-light">
                    {trip.summary}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-[#88857E]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectTrip(trip, 'story')}
                      className="text-[#1F1E1D] hover:underline font-medium"
                    >
                      閱讀故事 →
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenShareModal(trip)}
                      className="p-1.5 hover:text-[#1F1E1D] transition"
                      title="分享網址"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {isAuthorMode && (
                      <>
                        <button
                          onClick={() => onEditTrip(trip)}
                          className="p-1.5 hover:text-[#1F1E1D] transition"
                          title="編輯紀錄"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`確定要刪除「${trip.title}」這趟旅行紀錄嗎？`)) {
                              onDeleteTrip(trip.id);
                            }
                          }}
                          className="p-1.5 hover:text-red-700 transition"
                          title="刪除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      ) : (
        /* LIST MODE */
        <div className="divide-y divide-[#EAE7DF] border-y border-[#EAE7DF]">
          {filteredTrips.map((trip) => (
            <article
              key={trip.id}
              className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
            >
              <div 
                className="flex items-center gap-6 cursor-pointer flex-1 min-w-0"
                onClick={() => {
                  onRecordCountryClick(trip.country);
                  onSelectTrip(trip, 'story');
                }}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-[#E8E6DF] shrink-0">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-[#88857E] flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCountry(trip.country);
                        onRecordCountryClick(trip.country);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F0EDE5] hover:bg-[#E4E0D6] text-[#2C2A28] rounded-xs font-mono text-[10px] transition"
                      title="點擊依此國家篩選"
                    >
                      <span>{trip.country}</span>
                      <span className="text-[#88857E]">·</span>
                      <span className="text-[#55524C] font-medium flex items-center gap-0.5">
                        <MousePointerClick className="w-2.5 h-2.5 opacity-70" />
                        {getCountryClickCount(trip.country, countryClicks)} 次點擊
                      </span>
                    </button>
                    <span>·</span>
                    <span>{trip.destination}</span>
                    <span>·</span>
                    <span className="font-mono">{trip.daysCount} DAYS</span>
                  </div>

                  <h2 className="font-serif text-lg text-[#1F1E1D] group-hover:text-[#55524C] transition-colors truncate">
                    {trip.title}
                  </h2>

                  <p className="text-xs text-[#66635D] line-clamp-1 font-light">
                    {trip.summary}
                  </p>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
                <button
                  onClick={() => onSelectTrip(trip, 'story')}
                  className="px-4 py-2 bg-[#1F1E1D] text-[#FAF9F6] text-xs uppercase tracking-wider rounded-xs transition"
                >
                  瀏覽遊記
                </button>
                <button
                  onClick={() => onOpenShareModal(trip)}
                  className="p-2 border border-[#E0DDD5] hover:border-[#1F1E1D] text-[#55524C] rounded-xs transition"
                  title="分享"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                {isAuthorMode && (
                  <>
                    <button
                      onClick={() => onEditTrip(trip)}
                      className="p-2 border border-[#E0DDD5] hover:border-[#1F1E1D] text-[#55524C] rounded-xs transition"
                      title="編輯"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`確定要刪除「${trip.title}」這趟旅行紀錄嗎？`)) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                      className="p-2 border border-[#E0DDD5] hover:border-red-700 text-red-600 rounded-xs transition"
                      title="刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}
