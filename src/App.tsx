import { useState, useEffect } from 'react';
import { ActiveTab, Trip, PhotoItem } from './types';
import { 
  loadTrips, 
  saveTrip, 
  deleteTrip, 
  toggleTripLike, 
  togglePhotoLike, 
  getSharedTripFromUrl,
  resetToSampleData,
  loadCountryClicks,
  recordCountryClick
} from './utils/storage';
import { getShareCounter, incrementShareCounter } from './utils/counterApi';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TripsListView } from './components/TripsListView';
import { TripDetailView } from './components/TripDetailView';
import { PhotoGalleryView } from './components/PhotoGalleryView';
import { TravelMapView } from './components/TravelMapView';
import { ShareModal } from './components/ShareModal';
import { TripEditorModal } from './components/TripEditorModal';
import { AuthorAuthModal } from './components/AuthorAuthModal';
import { PhotoLightboxModal } from './components/PhotoLightboxModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Compass, Sparkles, CheckCircle2, Lock, ShieldCheck, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(loadTrips);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripDetailInitialSubTab, setTripDetailInitialSubTab] = useState<'story' | 'photos' | 'map'>('story');
  
  // Author / Admin Mode state
  const [isAuthorMode, setIsAuthorMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wanderlog_is_author_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthorAuthModalOpen, setIsAuthorAuthModalOpen] = useState(false);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetTrip, setShareTargetTrip] = useState<Trip | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Global Photo Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [lightboxPhotosList, setLightboxPhotosList] = useState<PhotoItem[]>([]);

  // Share Counter Tracking (CounterAPI)
  const [shareCount, setShareCount] = useState<number>(0);

  // Country Click Counter Tracking
  const [countryClicks, setCountryClicks] = useState<Record<string, number>>(loadCountryClicks);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shared Toast notification
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  // Load initial CounterAPI value on startup
  useEffect(() => {
    getShareCounter().then((val) => {
      if (typeof val === 'number') {
        setShareCount(val);
      }
    });
  }, []);

  // Parse Shared Trip on startup
  useEffect(() => {
    const shared = getSharedTripFromUrl();
    if (shared) {
      if (shared.tripId) {
        const found = trips.find((t) => t.id === shared.tripId);
        if (found) {
          setSelectedTrip(found);
          setActiveTab('trip-detail');
          setSharedToast(`已為您開啟【${found.title}】`);
          confetti({ particleCount: 30, spread: 60 });
        }
      } else if (shared.sharedTrip) {
        const newTrip = shared.sharedTrip;
        setTrips((prev) => {
          const exists = prev.some((t) => t.id === newTrip.id);
          return exists ? prev : [newTrip, ...prev];
        });
        setSelectedTrip(newTrip);
        setActiveTab('trip-detail');
        setSharedToast(`已成功載入好友分享的【${newTrip.title}】！`);
        confetti({ particleCount: 40, spread: 70 });
      }
    }
  }, []);

  const handleSetAuthorMode = (active: boolean) => {
    setIsAuthorMode(active);
    try {
      localStorage.setItem('wanderlog_is_author_mode', String(active));
    } catch {
      // ignore
    }
  };

  // Handlers
  const handleRecordCountryClick = (country: string) => {
    if (!country) return;
    const updated = recordCountryClick(country);
    setCountryClicks(updated);
  };

  // Tab Navigation with clean state and history
  const handleNavigateTab = (tab: 'home' | 'trips' | 'gallery' | 'map' | 'trip-detail') => {
    setActiveTab(tab);
    if (tab === 'home') {
      setSelectedTrip(null);
    }
    // Clear URL query params when navigating back to general tabs so user is not stuck on a shared trip ID
    if (typeof window !== 'undefined' && window.location.search) {
      try {
        window.history.pushState({}, '', window.location.pathname);
      } catch {
        // ignore
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTrip = (trip: Trip, initialSubTab: 'story' | 'photos' | 'map' = 'story') => {
    handleRecordCountryClick(trip.country);
    setSelectedTrip(trip);
    setTripDetailInitialSubTab(initialSubTab);
    setActiveTab('trip-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShare = (trip?: Trip) => {
    setShareTargetTrip(trip || selectedTrip || trips[0] || null);
    setIsShareModalOpen(true);
    // Increment CounterAPI when "分享網址" is clicked
    incrementShareCounter().then((newVal) => {
      if (typeof newVal === 'number') {
        setShareCount(newVal);
      }
    });
  };

  const handleOpenCreate = () => {
    setTripToEdit(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEdit = (trip: Trip) => {
    setTripToEdit(trip);
    setIsEditorModalOpen(true);
  };

  const handleSaveTrip = (saved: Trip) => {
    const updated = saveTrip(saved);
    setTrips(updated);
    if (selectedTrip?.id === saved.id) {
      setSelectedTrip(saved);
    }
    setIsEditorModalOpen(false);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = deleteTrip(tripId);
    setTrips(updated);
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
      setActiveTab('trips');
    }
  };

  const handleToggleTripLike = (tripId: string) => {
    const updated = toggleTripLike(tripId);
    setTrips(updated);
    if (selectedTrip?.id === tripId) {
      const current = updated.find((t) => t.id === tripId);
      if (current) setSelectedTrip(current);
    }
  };

  const handleTogglePhotoLike = (tripId: string, photoId: string) => {
    const updated = togglePhotoLike(tripId, photoId);
    setTrips(updated);
    if (selectedTrip?.id === tripId) {
      const current = updated.find((t) => t.id === tripId);
      if (current) setSelectedTrip(current);
    }
  };

  const handleUpdateTripCover = (tripId: string, newCoverUrl: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const updatedTrip = { ...trip, coverImage: newCoverUrl };
    const updated = saveTrip(updatedTrip);
    setTrips(updated);
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(updatedTrip);
    }
    setSharedToast('已成功更新封面照片！');
  };

  const handleAddPhotoToTrip = (tripId: string, photo: PhotoItem) => {
    const target = trips.find((t) => t.id === tripId);
    if (!target) return;
    const updatedTrip: Trip = {
      ...target,
      photos: [photo, ...target.photos],
    };
    handleSaveTrip(updatedTrip);
    setSharedToast('已成功新增相片！');
  };

  const handleUpdatePhoto = (tripId: string, updatedPhoto: PhotoItem) => {
    const target = trips.find((t) => t.id === tripId);
    if (!target) return;
    const updatedTrip: Trip = {
      ...target,
      photos: target.photos.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
    };
    handleSaveTrip(updatedTrip);
    setSharedToast('已成功更新相片資訊！');
  };

  const handleDeletePhoto = (tripId: string, photoId: string) => {
    const target = trips.find((t) => t.id === tripId);
    if (!target) return;
    const updatedTrip: Trip = {
      ...target,
      photos: target.photos.filter((p) => p.id !== photoId),
    };
    handleSaveTrip(updatedTrip);
    setSharedToast('已成功刪除相片！');
  };

  const handleOpenLightbox = (photo: PhotoItem, allPhotos: PhotoItem[]) => {
    setLightboxPhoto(photo);
    setLightboxPhotosList(allPhotos);
  };

  const handleCloseLightbox = () => {
    setLightboxPhoto(null);
    setLightboxPhotosList([]);
  };

  const handleResetData = () => {
    setIsResetConfirmOpen(true);
  };

  const handleExecuteReset = () => {
    const initial = resetToSampleData();
    setTrips(initial);
    setSelectedTrip(null);
    setActiveTab('home');
    setIsResetConfirmOpen(false);
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#242220] flex flex-col selection:bg-[#2C2A29] selection:text-[#FAF9F6]">
      
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        trips={trips}
        onSelectTrip={handleSelectTrip}
        onOpenCreate={handleOpenCreate}
        onOpenShareAll={() => handleOpenShare()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthorMode={isAuthorMode}
        onOpenAuthorModal={() => setIsAuthorAuthModalOpen(true)}
        shareCount={shareCount}
      />

      {/* Author Mode Top Floating Bar if Active */}
      {isAuthorMode && (
        <div className="bg-[#242220] text-[#FAF9F6] px-4 py-2 text-xs flex items-center justify-between border-b border-[#383633] z-30">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="tracking-wide">您目前處於<strong>「創作者編輯模式」</strong>（可新增與編輯旅行／相片）</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSetAuthorMode(false)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#FAF9F6] rounded-xs text-[11px] transition"
                title="切換回訪客視角查看前台"
              >
                <Eye className="w-3 h-3" />
                <span>切換為訪客視角</span>
              </button>
              <button
                onClick={() => setIsAuthorAuthModalOpen(true)}
                className="text-[#ABA79C] hover:text-white underline text-[11px]"
              >
                權限設定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared URL Toast Banner */}
      {sharedToast && (
        <div className="bg-[#1F1E1D] text-[#FAF9F6] px-4 py-2.5 text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 border-b border-[#383633]">
          <Sparkles className="w-3.5 h-3.5 text-[#D5D2C8]" />
          <span>{sharedToast}</span>
          <button
            onClick={() => {
              setSharedToast(null);
              handleNavigateTab('home');
            }}
            className="ml-4 underline text-[#ABA79C] hover:text-white text-xs"
          >
            返回總覽首頁
          </button>
          <button
            onClick={() => setSharedToast(null)}
            className="ml-2 text-[#88857E] hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {activeTab === 'home' && (
          <HomeView
            trips={trips}
            onSelectTrip={handleSelectTrip}
            onNavigateTab={handleNavigateTab}
            onOpenShareModal={handleOpenShare}
            onOpenCreateModal={handleOpenCreate}
            onOpenPhotoLightbox={handleOpenLightbox}
            isAuthorMode={isAuthorMode}
            countryClicks={countryClicks}
            onRecordCountryClick={handleRecordCountryClick}
          />
        )}

        {activeTab === 'trips' && (
          <TripsListView
            trips={trips}
            onSelectTrip={handleSelectTrip}
            onEditTrip={handleOpenEdit}
            onDeleteTrip={handleDeleteTrip}
            onOpenShareModal={handleOpenShare}
            onOpenCreateModal={handleOpenCreate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isAuthorMode={isAuthorMode}
            countryClicks={countryClicks}
            onRecordCountryClick={handleRecordCountryClick}
          />
        )}

        {activeTab === 'trip-detail' && selectedTrip && (
          <TripDetailView
            trip={selectedTrip}
            onBack={() => handleNavigateTab('trips')}
            onNavigateHome={() => handleNavigateTab('home')}
            onOpenShareModal={handleOpenShare}
            onOpenPhotoLightbox={handleOpenLightbox}
            onToggleTripLike={handleToggleTripLike}
            initialSubTab={tripDetailInitialSubTab}
            countryClicks={countryClicks}
          />
        )}

        {activeTab === 'gallery' && (
          <PhotoGalleryView
            trips={trips}
            onTogglePhotoLike={handleTogglePhotoLike}
            onAddPhotoToTrip={handleAddPhotoToTrip}
            onUpdatePhoto={handleUpdatePhoto}
            onDeletePhoto={handleDeletePhoto}
            onOpenLightbox={handleOpenLightbox}
            onOpenShareModal={handleOpenShare}
            isAuthorMode={isAuthorMode}
          />
        )}

        {activeTab === 'map' && (
          <TravelMapView
            trips={trips}
            selectedTripId={selectedTrip?.id}
            onSelectTrip={handleSelectTrip}
            onOpenPhotoLightbox={handleOpenLightbox}
          />
        )}

      </main>

      {/* Global Photo Lightbox for all views */}
      {lightboxPhoto && (
        <PhotoLightboxModal
          photo={lightboxPhoto}
          photosList={lightboxPhotosList}
          onClose={handleCloseLightbox}
          onNavigatePhoto={(p) => setLightboxPhoto(p)}
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          trips={trips}
          selectedTrip={shareTargetTrip}
          onClose={() => setIsShareModalOpen(false)}
          onSelectTripToView={(t) => {
            setIsShareModalOpen(false);
            handleSelectTrip(t);
          }}
          onGoHome={() => {
            setIsShareModalOpen(false);
            handleNavigateTab('home');
          }}
          shareCount={shareCount}
          onCounterUpdated={(newVal) => setShareCount(newVal)}
        />
      )}

      {/* Trip Creator & Editor Modal */}
      {isEditorModalOpen && (
        <TripEditorModal
          tripToEdit={tripToEdit}
          onSave={handleSaveTrip}
          onClose={() => setIsEditorModalOpen(false)}
        />
      )}

      {/* Author Authentication & Access Modal */}
      <AuthorAuthModal
        isOpen={isAuthorAuthModalOpen}
        onClose={() => setIsAuthorAuthModalOpen(false)}
        isAuthorMode={isAuthorMode}
        onSetAuthorMode={handleSetAuthorMode}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="重置旅行典藏資料"
        message="確定要將所有旅行遊記與相片重置為初始精選範例（京都、瑞士、冰島、花東）嗎？自訂的紀錄將會被重設。"
        confirmLabel="確認重置"
        cancelLabel="保留現有紀錄"
        isDestructive={true}
        onConfirm={handleExecuteReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Site Footer - Editorial Fine-Art Aesthetic */}
      <footer className="bg-[#181716] text-[#A6A298] border-t border-[#292725] py-14 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="space-y-2">
            <div className="font-serif text-xl tracking-[0.15em] text-[#FAF9F6] uppercase">
              WANDERLOG
            </div>
            <p className="text-xs text-[#88857E] font-light max-w-sm">
              個人旅行攝影集與行旅紀錄 · 像一本精美的攝影書，將世界的光影與故事分享給摯友。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-[#ABA79C]">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FAF9F6] transition"
            >
              首頁
            </button>
            <button
              onClick={() => {
                setActiveTab('trips');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FAF9F6] transition"
            >
              旅行列表 ({trips.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FAF9F6] transition"
            >
              攝影集
            </button>
            <button
              onClick={() => {
                setActiveTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FAF9F6] transition"
            >
              足跡地圖
            </button>
            <button
              onClick={() => handleOpenShare()}
              className="text-[#FAF9F6] hover:underline"
            >
              分享專屬網址
            </button>
          </div>

          {/* Author Access Control */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuthorAuthModalOpen(true)}
              className="flex items-center gap-1.5 text-[#88857E] hover:text-[#FAF9F6] text-[11px] tracking-wider transition"
            >
              {isAuthorMode ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>作者管理中</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>創作者管理</span>
                </>
              )}
            </button>

            {isAuthorMode && (
              <button
                onClick={handleResetData}
                className="text-[#78756E] hover:text-[#D5D2C8] text-[11px] underline tracking-wider"
              >
                重置為範例資料
              </button>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
