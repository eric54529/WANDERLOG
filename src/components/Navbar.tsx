import { useState } from 'react';
import { ActiveTab, Trip, MemberUser } from '../types';
import { Search, Plus, Share2, Compass, ShieldCheck, Lock, Sun, Moon, User, UserCheck, LogOut, Package } from 'lucide-react';

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
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFollowingSystem?: boolean;
  resetToSystemTheme?: () => void;
  currentMember: MemberUser | null;
  onOpenMemberModal: () => void;
  onLogoutMember: () => void;
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
  isDarkMode,
  toggleDarkMode,
  isFollowingSystem,
  resetToSystemTheme,
  currentMember,
  onOpenMemberModal,
  onLogoutMember,
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
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 dark:bg-[#1A1A18]/90 backdrop-blur-md border-b border-[#EAE7DF] dark:border-[#333330] text-[#242220] dark:text-[#E8E5DE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo - Editorial Serif */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#D5D2C8] dark:border-[#444] flex items-center justify-center text-[#2C2A29] dark:text-[#E8E5DE] group-hover:border-[#2C2A29] dark:group-hover:border-[#FAF9F6] transition-colors">
              <Compass className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl tracking-[0.15em] font-normal text-[#1F1E1D] dark:text-[#FAF9F6] uppercase">
                WANDERLOG
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#88857E] font-sans -mt-0.5">
                PERSONAL TRAVEL MAGAZINE & JOURNAL
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Understated, Fine Typography */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'home'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              OVERVIEW
            </button>

            <button
              id="nav-tab-trips"
              onClick={() => setActiveTab('trips')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'trips' || activeTab === 'trip-detail'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              ARCHIVE ({trips.length})
            </button>

            <button
              id="nav-tab-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'gallery'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              GALLERY
            </button>

            <button
              id="nav-tab-map"
              onClick={() => setActiveTab('map')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'map'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              MAP
            </button>

            <button
              id="nav-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#9A8060]" />
              <span>MEMBER</span>
            </button>

            <button
              id="nav-tab-faq"
              onClick={() => setActiveTab('faq')}
              className={`relative py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                activeTab === 'faq'
                  ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#1F1E1D] dark:after:bg-[#FAF9F6]'
                  : 'text-[#7B7870] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-[#FAF9F6]'
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Right Actions: Search, Theme, Share & User Email / Logout */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative hidden xl:block w-40">
              <Search className="w-3.5 h-3.5 text-[#9C998F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
                className="w-full bg-[#F4F2EC] dark:bg-[#262624] text-xs text-[#1F1E1D] dark:text-[#FAF9F6] placeholder-[#9C998F] pl-8 pr-3 py-1.5 rounded-sm border border-transparent focus:border-[#ABA79C] focus:bg-white dark:focus:bg-[#1A1A18] focus:outline-none transition"
              />

              {/* Quick Search Dropdown */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute top-full mt-2 w-72 right-0 bg-[#FAF9F6] dark:bg-[#20201E] border border-[#E0DDD5] dark:border-[#393733] rounded-sm shadow-xl p-2 z-50">
                  <div className="text-[10px] tracking-wider uppercase text-[#88857E] px-2 py-1">
                    Search Results ({matchedTrips.length})
                  </div>
                  {matchedTrips.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
                      {matchedTrips.map((t) => (
                        <div
                          key={t.id}
                          onMouseDown={() => {
                            onSelectTrip(t);
                            setActiveTab('trip-detail');
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-2 p-2 hover:bg-[#EFECE4] dark:hover:bg-[#2A2A27] rounded-xs cursor-pointer text-xs transition"
                        >
                          <span className="text-base">{t.flag}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-[#1F1E1D] dark:text-[#FAF9F6] truncate">{t.title}</p>
                            <p className="text-[10px] text-[#88857E]">{t.destination}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-xs text-[#88857E] text-center font-serif">
                      No trips found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="btn-dark-mode-toggle"
              onClick={toggleDarkMode}
              onDoubleClick={resetToSystemTheme}
              className="p-2 rounded-sm border border-[#DCD9D0] dark:border-[#393733] hover:bg-[#F0EEE6] dark:hover:bg-[#2A2A27] text-[#383633] dark:text-[#E8E5DE] transition-colors relative group"
              title={
                isFollowingSystem
                  ? `Following system theme (${isDarkMode ? 'Dark' : 'Light'}). Click to toggle.`
                  : `Manual theme (${isDarkMode ? 'Dark' : 'Light'}). Click to toggle.`
              }
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#B39A73]" /> : <Moon className="w-4 h-4 text-[#9A8060]" />}
              {isFollowingSystem && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#9A8060] dark:bg-[#B39A73]" title="System Theme" />
              )}
            </button>

            {/* Share Travel Monograph Link */}
            <button
              id="btn-share-all"
              onClick={onOpenShareAll}
              className="p-2 rounded-sm border border-[#DCD9D0] dark:border-[#393733] hover:bg-[#F0EEE6] dark:hover:bg-[#2A2A27] text-[#383633] dark:text-[#E8E5DE] transition-colors relative"
              title="Share Link"
            >
              <Share2 className="w-4 h-4 text-[#9A8060] dark:text-[#B39A73] stroke-[2]" />
              {typeof shareCount === 'number' && shareCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-[#9A8060] text-white text-[9px] font-mono leading-none">
                  {shareCount}
                </span>
              )}
            </button>

            {/* Member Account / Login / Logout Display */}
            {currentMember ? (
              <div className="flex items-center gap-1.5 bg-[#F5F3EC] dark:bg-[#262624] border border-[#D5D2C8] dark:border-[#393733] p-1 pr-1.5 rounded-sm shadow-2xs">
                <button
                  id="btn-member-profile"
                  onClick={onOpenMemberModal}
                  className="flex items-center gap-1.5 px-1.5 py-1 text-[#2C2A29] dark:text-[#E8E5DE] text-xs hover:text-[#9A8060] transition group max-w-[140px] sm:max-w-[180px]"
                  title={`Member: ${currentMember.email} (Click to open Member Profile)`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#9A8060] shrink-0" />
                  <span className="font-mono text-[11px] sm:text-xs truncate">{currentMember.email}</span>
                </button>

                <div className="w-[1px] h-3.5 bg-[#D5D2C8] dark:bg-[#444]" />

                <button
                  id="btn-member-logout"
                  onClick={onLogoutMember}
                  className="p-1 text-[#88857E] hover:text-red-600 dark:hover:text-red-400 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-member-login"
                onClick={onOpenMemberModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-[#D5D2C8] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#20201E] hover:bg-[#F0EEE6] dark:hover:bg-[#2A2A27] text-[#383633] dark:text-[#E8E5DE] text-xs transition shadow-2xs font-sans font-medium"
                title="Sign in with Email"
              >
                <User className="w-3.5 h-3.5 text-[#9A8060] dark:text-[#B39A73]" />
                <span className="hidden sm:inline">Sign In / Join</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Author Mode Indicator & Actions */}
            {isAuthorMode ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-author-indicator"
                  onClick={onOpenAuthorModal}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-[#EAE7DF] dark:bg-[#2A2A27] hover:bg-[#DFDBD0] text-[#2C2A29] dark:text-[#FAF9F6] text-[11px] uppercase tracking-wider rounded-sm transition font-sans border border-[#D5D2C8] dark:border-[#393733]"
                  title="Author Mode Active"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[2]" />
                  <span className="hidden lg:inline font-medium">Author Mode</span>
                </button>

                <button
                  id="btn-create-trip"
                  onClick={onOpenCreate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232120] hover:bg-[#383633] dark:bg-[#FAF9F6] dark:hover:bg-[#EAE7DF] dark:text-[#171716] text-[#FAF9F6] text-xs tracking-widest uppercase rounded-sm transition shadow-sm font-sans"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  <span className="hidden sm:inline">New Trip</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#EAE7DF] dark:border-[#333330] text-[11px] uppercase tracking-wider font-sans overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'home' ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]' : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'trips' || activeTab === 'trip-detail'
                ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]'
                : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            ARCHIVE ({trips.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'gallery' ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]' : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            GALLERY
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'map' ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]' : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            MAP
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'orders' ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]' : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            MEMBER
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-1 px-2 shrink-0 ${
              activeTab === 'faq' ? 'text-[#1F1E1D] dark:text-[#FAF9F6] font-bold border-b border-[#1F1E1D] dark:border-[#FAF9F6]' : 'text-[#7B7870] dark:text-[#A8A49B]'
            }`}
          >
            FAQ
          </button>
        </div>

      </div>
    </header>
  );
}
