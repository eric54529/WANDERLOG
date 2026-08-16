import { useState, useEffect } from 'react';
import { ActiveTab, Trip, MemberUser } from '../types';
import { 
  Search, 
  Plus, 
  Share2, 
  Compass, 
  ShieldCheck, 
  Sun, 
  Moon, 
  User, 
  UserCheck, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  BookOpen, 
  Image as GalleryIcon, 
  MapPin, 
  HelpCircle, 
  LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when escape key pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMobileNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

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
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo - Editorial Serif */}
          <div
            id="brand-logo"
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-full border border-[#D5D2C8] dark:border-[#444] flex items-center justify-center text-[#2C2A29] dark:text-[#E8E5DE] group-hover:border-[#2C2A29] dark:group-hover:border-[#FAF9F6] transition-colors">
              <Compass className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <div className="font-serif text-lg sm:text-2xl tracking-[0.15em] font-normal text-[#1F1E1D] dark:text-[#FAF9F6] uppercase">
                WANDERLOG
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-[#88857E] font-sans -mt-0.5 hidden xs:block">
                PERSONAL TRAVEL MAGAZINE & JOURNAL
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs - Understated, Fine Typography */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop Search Input */}
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

            {/* Desktop Member Account Button */}
            <div className="hidden sm:flex items-center">
              {currentMember ? (
                <div className="flex items-center gap-1.5 bg-[#F5F3EC] dark:bg-[#262624] border border-[#D5D2C8] dark:border-[#393733] p-1 pr-1.5 rounded-sm shadow-2xs">
                  <button
                    id="btn-member-profile"
                    onClick={onOpenMemberModal}
                    className="flex items-center gap-1.5 px-1.5 py-1 text-[#2C2A29] dark:text-[#E8E5DE] text-xs hover:text-[#9A8060] transition group max-w-[140px] md:max-w-[180px]"
                    title={`Member: ${currentMember.email} (Click to open Member Profile)`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#9A8060] shrink-0" />
                    <span className="font-mono text-[11px] md:text-xs truncate">{currentMember.email}</span>
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
                  <span>Sign In / Join</span>
                </button>
              )}
            </div>

            {/* Author Mode Indicator & Actions on Desktop */}
            {isAuthorMode ? (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  id="btn-author-indicator"
                  onClick={onOpenAuthorModal}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-[#EAE7DF] dark:bg-[#2A2A27] hover:bg-[#DFDBD0] text-[#2C2A29] dark:text-[#FAF9F6] text-[11px] uppercase tracking-wider rounded-sm transition font-sans border border-[#D5D2C8] dark:border-[#393733]"
                  title="Author Mode Active"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[2]" />
                  <span className="font-medium">Author Mode</span>
                </button>

                <button
                  id="btn-create-trip"
                  onClick={onOpenCreate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232120] hover:bg-[#383633] dark:bg-[#FAF9F6] dark:hover:bg-[#EAE7DF] dark:text-[#171716] text-[#FAF9F6] text-xs tracking-widest uppercase rounded-sm transition shadow-sm font-sans"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  <span>New Trip</span>
                </button>
              </div>
            ) : null}

            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-sm border border-[#DCD9D0] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#20201E] hover:bg-[#F0EEE6] dark:hover:bg-[#2A2A27] text-[#2C2A29] dark:text-[#E8E5DE] transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#1F1E1D] dark:text-[#FAF9F6]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1F1E1D] dark:text-[#FAF9F6]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-[65px] bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Dropdown Content */}
            <motion.div
              id="mobile-drawer-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-50 md:hidden bg-[#FAF9F6] dark:bg-[#1E1E1C] border-b border-[#EAE7DF] dark:border-[#333330] shadow-xl px-5 py-5 overflow-hidden"
            >
              {/* Mobile Search Bar */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-[#9C998F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search destinations, trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F2EFE9] dark:bg-[#282825] text-sm text-[#1F1E1D] dark:text-[#FAF9F6] placeholder-[#9C998F] pl-9 pr-3 py-2.5 rounded-sm border border-[#D5D2C8] dark:border-[#393733] focus:border-[#ABA79C] focus:outline-none"
                />
                {searchQuery.trim() && matchedTrips.length > 0 && (
                  <div className="mt-2 bg-white dark:bg-[#252523] border border-[#E0DDD5] dark:border-[#393733] rounded-sm p-1.5 max-h-44 overflow-y-auto divide-y divide-[#EAE7DF] dark:divide-[#333]">
                    {matchedTrips.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectTrip(t);
                          setActiveTab('trip-detail');
                          setSearchQuery('');
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-2 flex items-center gap-2.5 text-xs text-[#2C2A29] dark:text-[#E8E5DE] cursor-pointer hover:bg-[#F5F3EC] dark:hover:bg-[#30302D]"
                      >
                        <span className="text-base">{t.flag}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{t.title}</p>
                          <p className="text-[10px] text-[#88857E]">{t.destination}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Items List */}
              <div className="space-y-1">
                <button
                  id="mobile-nav-home"
                  onClick={() => handleMobileNavClick('home')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'home'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-[#9A8060]" />
                    <span>OVERVIEW</span>
                  </div>
                  {activeTab === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] dark:bg-[#FAF9F6]" />}
                </button>

                <button
                  id="mobile-nav-trips"
                  onClick={() => handleMobileNavClick('trips')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'trips' || activeTab === 'trip-detail'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#9A8060]" />
                    <span>ARCHIVE</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#DFDBD0] dark:bg-[#383834] text-[#444] dark:text-[#CCC]">
                    {trips.length}
                  </span>
                </button>

                <button
                  id="mobile-nav-gallery"
                  onClick={() => handleMobileNavClick('gallery')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'gallery'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GalleryIcon className="w-4 h-4 text-[#9A8060]" />
                    <span>GALLERY</span>
                  </div>
                  {activeTab === 'gallery' && <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] dark:bg-[#FAF9F6]" />}
                </button>

                <button
                  id="mobile-nav-map"
                  onClick={() => handleMobileNavClick('map')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'map'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#9A8060]" />
                    <span>MAP</span>
                  </div>
                  {activeTab === 'map' && <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] dark:bg-[#FAF9F6]" />}
                </button>

                <button
                  id="mobile-nav-orders"
                  onClick={() => handleMobileNavClick('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'orders'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#9A8060]" />
                    <span>MEMBER</span>
                  </div>
                  {activeTab === 'orders' && <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] dark:bg-[#FAF9F6]" />}
                </button>

                <button
                  id="mobile-nav-faq"
                  onClick={() => handleMobileNavClick('faq')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-sm text-xs uppercase tracking-[0.16em] transition font-sans ${
                    activeTab === 'faq'
                      ? 'bg-[#EAE7DF] dark:bg-[#2C2C29] text-[#1F1E1D] dark:text-[#FAF9F6] font-semibold'
                      : 'text-[#65625A] dark:text-[#AAA69D] hover:bg-[#F2EFE9] dark:hover:bg-[#262623]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#9A8060]" />
                    <span>FAQ</span>
                  </div>
                  {activeTab === 'faq' && <span className="w-1.5 h-1.5 rounded-full bg-[#1F1E1D] dark:bg-[#FAF9F6]" />}
                </button>
              </div>

              {/* Mobile Member & Author Actions */}
              <div className="mt-4 pt-4 border-t border-[#EAE7DF] dark:border-[#333330] space-y-2.5">
                {currentMember ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#F2EFE9] dark:bg-[#262624] rounded-sm border border-[#D5D2C8] dark:border-[#393733]">
                    <button
                      onClick={() => {
                        onOpenMemberModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-xs text-[#2C2A29] dark:text-[#E8E5DE] truncate font-mono"
                    >
                      <UserCheck className="w-4 h-4 text-[#9A8060] shrink-0" />
                      <span className="truncate">{currentMember.email}</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogoutMember();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs text-red-600 dark:text-red-400 font-sans uppercase tracking-wider px-2 py-1 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenMemberModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm border border-[#D5D2C8] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#20201E] text-xs uppercase tracking-wider text-[#2C2A29] dark:text-[#E8E5DE] font-medium"
                  >
                    <User className="w-4 h-4 text-[#9A8060]" />
                    <span>Sign In / Member Join</span>
                  </button>
                )}

                {isAuthorMode && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onOpenAuthorModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-[#EAE7DF] dark:bg-[#2A2A27] text-[#2C2A29] dark:text-[#FAF9F6] text-[11px] uppercase tracking-wider"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Author</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCreate();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-[#232120] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#171716] text-[11px] uppercase tracking-wider font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Trip</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

