import { useState } from 'react';
import { ActiveTab, Trip } from '../types';
import { Search, Plus, Share2, Compass, ShieldCheck, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onOpenCreate: () => void;
  onOpenShareAll: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAuthorMode: boolean;
  onOpenAuthorModal: () => void;
  shareCount?: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  trips,
  onSelectTrip,
  onOpenCreate,
  onOpenShareAll,
  searchQuery,
  setSearchQuery,
  isAuthorMode,
  onOpenAuthorModal,
  shareCount,
}: NavbarProps) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const matchedTrips = searchQuery.trim()
    ? trips.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAE7DF] text-[#242220] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo - Editorial Serif */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#D5D2C8] flex items-center justify-center text-[#2C2A29] group-hover:border-[#2C2A29] transition-colors">
              <Compass className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl tracking-[0.15em] font-normal text-[#1F1E1D] uppercase">
                WanderLog
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#88857E] font-sans -mt-0.5">
                TRAVEL MONOGRAPH & JOURNAL
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Understated, Fine Typography */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'home'
                  ? 'text-[#1F1E1D] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D]'
                  : 'text-[#7B7870] hover:text-[#1F1E1D]'
              }`}
            >
              首頁 · OVERVIEW
            </button>

            <button
              id="nav-tab-trips"
              onClick={() => setActiveTab('trips')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'trips' || activeTab === 'trip-detail'
                  ? 'text-[#1F1E1D] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D]'
                  : 'text-[#7B7870] hover:text-[#1F1E1D]'
              }`}
            >
              旅行紀錄 · ARCHIVE ({trips.length})
            </button>

            <button
              id="nav-tab-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'gallery'
                  ? 'text-[#1F1E1D] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D]'
                  : 'text-[#7B7870] hover:text-[#1F1E1D]'
              }`}
            >
              攝影集 · GALLERY
            </button>

            <button
              id="nav-tab-map"
              onClick={() => setActiveTab('map')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'map'
                  ? 'text-[#1F1E1D] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D]'
                  : 'text-[#7B7870] hover:text-[#1F1E1D]'
              }`}
            >
              足跡地圖 · MAP
            </button>
          </nav>

          {/* Right Actions: Minimal Search, Share & Add Trip */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden lg:block w-44 xl:w-56">
              <Search className="w-3.5 h-3.5 text-[#9C998F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋旅行、地點..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
                className="w-full bg-[#F4F2EC] text-xs text-[#1F1E1D] placeholder-[#9C998F] pl-8 pr-3 py-1.5 rounded-sm border border-transparent focus:border-[#ABA79C] focus:bg-white focus:outline-none transition"
              />

              {/* Quick Search Dropdown */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute top-full mt-2 w-72 right-0 bg-[#FAF9F6] border border-[#E0DDD5] rounded-sm shadow-xl p-2 z-50">
                  <div className="text-[10px] tracking-wider uppercase text-[#88857E] px-2 py-1">
                    搜尋結果 ({matchedTrips.length})
                  </div>
                  {matchedTrips.length === 0 ? (
                    <div className="p-3 text-xs text-[#88857E] text-center font-light">無符合旅行紀錄</div>
                  ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {matchedTrips.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTrip(t);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 rounded-sm hover:bg-[#F2EFE9] flex items-center gap-2.5 transition"
                        >
                          <img
                            src={t.coverImage}
                            alt={t.title}
                            className="w-8 h-8 rounded-xs object-cover shrink-0 grayscale-[20%]"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-serif text-[#1F1E1D] truncate">
                              {t.title}
                            </div>
                            <div className="text-[10px] text-[#88857E] truncate font-sans">
                              {t.destination} · {t.daysCount} 天
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Share Travel Monograph Link */}
            <button
              id="btn-share-all"
              onClick={onOpenShareAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#F0EEE6] border border-[#DCD9D0] text-[#383633] text-xs tracking-wider uppercase rounded-sm transition font-sans"
              title="分享網站專屬網址（點擊透過 CounterAPI 計數）"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden sm:inline">分享網址</span>
              {typeof shareCount === 'number' && (
                <span className="px-1.5 py-0.5 rounded-xs bg-[#EAE7DF] text-[#4A4742] text-[10px] font-mono leading-none">
                  {shareCount}
                </span>
              )}
            </button>

            {/* Author Mode Indicator & Actions */}
            {isAuthorMode ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-author-indicator"
                  onClick={onOpenAuthorModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#EAE7DF] hover:bg-[#DFDBD0] text-[#2C2A29] text-[11px] uppercase tracking-wider rounded-sm transition font-sans border border-[#D5D2C8]"
                  title="點擊管理創作者狀態"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 stroke-[2]" />
                  <span className="hidden md:inline font-medium">創作者模式</span>
                </button>

                <button
                  id="btn-create-trip"
                  onClick={onOpenCreate}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#232120] hover:bg-[#383633] text-[#FAF9F6] text-xs tracking-widest uppercase rounded-sm transition shadow-sm font-sans"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  <span>新增旅行</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#EAE7DF] text-[11px] uppercase tracking-wider font-sans">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-1 px-2 ${
              activeTab === 'home' ? 'text-[#1F1E1D] font-bold border-b border-[#1F1E1D]' : 'text-[#7B7870]'
            }`}
          >
            首頁
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-1 px-2 ${
              activeTab === 'trips' || activeTab === 'trip-detail'
                ? 'text-[#1F1E1D] font-bold border-b border-[#1F1E1D]'
                : 'text-[#7B7870]'
            }`}
          >
            紀錄 ({trips.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-1 px-2 ${
              activeTab === 'gallery' ? 'text-[#1F1E1D] font-bold border-b border-[#1F1E1D]' : 'text-[#7B7870]'
            }`}
          >
            相簿
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-1 px-2 ${
              activeTab === 'map' ? 'text-[#1F1E1D] font-bold border-b border-[#1F1E1D]' : 'text-[#7B7870]'
            }`}
          >
            地圖
          </button>
        </div>

      </div>
    </header>
  );
}
