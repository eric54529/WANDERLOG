import { useState, useEffect } from 'react';
import { Trip } from '../types';
import { generateShareUrl, generatePortableShareUrl, exportTripsAsJSON } from '../utils/storage';
import { incrementShareCounter, getShareCounter } from '../utils/counterApi';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download, 
  ExternalLink, 
  X,
  Compass,
  MessageCircle,
  Mail,
  Activity,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  trips: Trip[];
  selectedTrip?: Trip | null;
  onClose: () => void;
  onSelectTripToView?: (trip: Trip) => void;
  onGoHome?: () => void;
  shareCount?: number;
  onCounterUpdated?: (newCount: number) => void;
}

export function ShareModal({
  trips,
  selectedTrip,
  onClose,
  onSelectTripToView,
  onGoHome,
  shareCount: initialShareCount,
  onCounterUpdated,
}: ShareModalProps) {
  const [currentTripId, setCurrentTripId] = useState<string>(
    selectedTrip?.id || trips[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);
  const [liveCount, setLiveCount] = useState<number>(initialShareCount ?? 0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getShareCounter().then((count) => {
      if (isMounted && typeof count === 'number') {
        setLiveCount(count);
        onCounterUpdated?.(count);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentTrip = trips.find((t) => t.id === currentTripId) || trips[0];

  const shareUrl = currentTrip
    ? generateShareUrl(currentTrip)
    : window.location.href;

  const triggerCounterIncrement = async () => {
    setIsSyncing(true);
    try {
      const newCount = await incrementShareCounter();
      setLiveCount(newCount);
      onCounterUpdated?.(newCount);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyLink = async () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#2C2A29', '#88857E', '#FAF9F6']
    });
    triggerCounterIncrement();
    setTimeout(() => setCopied(false), 2500);
  };

  // QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl)}&margin=10`;

  const handleLineShare = () => {
    triggerCounterIncrement();
    const text = encodeURIComponent(`來看看我這趟旅行的攝影集與遊記【${currentTrip?.title}】：${shareUrl}`);
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    triggerCounterIncrement();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleEmailShare = () => {
    triggerCounterIncrement();
    const subject = encodeURIComponent(`分享我的旅行攝影集：${currentTrip?.title}`);
    const body = encodeURIComponent(`嗨！我整理了這次前往【${currentTrip?.destination}】的旅行照片與遊記，點擊專屬網址即可直接閱讀：\n\n${shareUrl}\n\n希望你也喜歡這段旅程！`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#121110]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-[#FAF9F6] border border-[#D5D2C8] max-w-lg w-full shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#EAE7DF] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
              SHARE TRAVEL MONOGRAPH
            </span>
            <h2 className="font-serif text-xl text-[#1F1E1D] mt-0.5">
              分享旅行專屬網址
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#88857E] hover:text-[#1F1E1D] transition"
            title="關閉 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-[#242220] text-xs">
          
          {/* CounterAPI Live Stat Bar */}
          <div className="flex items-center justify-between p-2.5 bg-[#F0EDE5] border border-[#E0DDD5] rounded-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11px] text-[#4A4742]">
                CounterAPI 累計分享次數：
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#1F1E1D] bg-white px-2 py-0.5 border border-[#D5D2C8] rounded-xs">
                {liveCount} 次
              </span>
              {isSyncing && (
                <span className="text-[10px] text-[#88857E] font-sans">同步中...</span>
              )}
            </div>
          </div>

          {/* Trip Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1.5 font-sans">
              選擇要分享的旅行篇章：
            </label>
            <select
              value={currentTripId}
              onChange={(e) => setCurrentTripId(e.target.value)}
              className="w-full bg-white border border-[#D5D2C8] p-2.5 text-xs text-[#1F1E1D] focus:outline-none"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.destination} — {t.title} ({t.daysCount} 天)
                </option>
              ))}
            </select>
          </div>

          {/* Current Trip Preview Strip */}
          {currentTrip && (
            <div className="p-3 bg-[#F4F2EB] border border-[#EAE7DF] flex items-center gap-4">
              <img
                src={currentTrip.coverImage}
                alt={currentTrip.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-16 h-16 object-cover grayscale-[15%]"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="text-[10px] tracking-wider uppercase text-[#88857E]">
                  {currentTrip.country} · {currentTrip.destination}
                </div>
                <h4 className="font-serif text-xs text-[#1F1E1D] truncate font-medium">
                  {currentTrip.title}
                </h4>
                <div className="text-[10px] text-[#78756E]">
                  {currentTrip.photos.length} 張照片 · {currentTrip.places.length} 處足跡
                </div>
              </div>
            </div>
          )}

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#78756E] block">
              專屬分享連結：
            </label>
            <div className="flex items-center gap-2 bg-white border border-[#D5D2C8] p-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-[#1F1E1D] px-2 focus:outline-none font-mono truncate"
              />
              <button
                id="btn-copy-share-url"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs tracking-wider uppercase transition font-medium shrink-0 flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code & Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#F4F2EB] p-4 border border-[#EAE7DF]">
            <div className="flex flex-col items-center justify-center p-3 bg-white border border-[#E0DDD5] text-center">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-28 h-28 object-contain"
              />
              <span className="text-[10px] text-[#88857E] mt-2 font-mono">
                手機掃碼直接觀賞
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] tracking-wider uppercase text-[#78756E] mb-2 font-sans">
                快速傳送給好友：
              </div>
              
              <button
                onClick={handleLineShare}
                className="w-full py-2 px-3 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>傳送至 LINE 好友 / 群組</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="w-full py-2 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <span>分享至 Facebook</span>
              </button>

              <button
                onClick={handleEmailShare}
                className="w-full py-2 px-3 bg-white border border-[#D5D2C8] hover:border-[#1F1E1D] text-[#33302D] text-xs font-medium flex items-center justify-center gap-2 transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#78756E]" />
                <span>以 Email 傳送</span>
              </button>
            </div>
          </div>

          {/* Export JSON Backup */}
          <div className="pt-2 border-t border-[#EAE7DF] flex items-center justify-between text-[11px] text-[#88857E]">
            <span>備份與保存：</span>
            <button
              onClick={() => exportTripsAsJSON(trips)}
              className="flex items-center gap-1 text-[#1F1E1D] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出全站旅行資料 (JSON)</span>
            </button>
          </div>

          {/* Modal Action Footer */}
          <div className="pt-3 border-t border-[#EAE7DF] flex items-center justify-between gap-3">
            {onGoHome && (
              <button
                onClick={() => {
                  onClose();
                  onGoHome();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#F0EDE5] hover:bg-[#E4E0D6] text-[#2C2A28] rounded-xs text-xs font-medium transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>返回首頁</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-auto px-5 py-2 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] rounded-xs text-xs tracking-wider uppercase transition font-medium"
            >
              完成並關閉
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
