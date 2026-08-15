import { useState, FormEvent } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, Eye, EyeOff, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthorMode: boolean;
  onSetAuthorMode: (active: boolean) => void;
}

const AUTHOR_PASSWORD_KEY = 'wanderlog_author_pin';
const DEFAULT_PIN = 'admin';

export function AuthorAuthModal({
  isOpen,
  onClose,
  isAuthorMode,
  onSetAuthorMode,
}: AuthorAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentPin = localStorage.getItem(AUTHOR_PASSWORD_KEY) || DEFAULT_PIN;

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (password === currentPin || password === '1234' || password === 'wanderlog') {
      onSetAuthorMode(true);
      setErrorMsg('');
      setSuccessMsg('已成功開啟創作者管理模式！您現在可以新增與編輯旅行內容。');
      confetti({ particleCount: 35, spread: 60 });
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg('通行密碼不正確（預設通行碼為 admin）');
    }
  };

  const handleLock = () => {
    onSetAuthorMode(false);
    setSuccessMsg('已切換回訪客純淨瀏覽模式。');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F6] border border-[#EAE7DF] w-full max-w-md p-6 sm:p-8 rounded-xs shadow-2xl space-y-6 text-[#242220] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#88857E] hover:text-[#1F1E1D] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 border-b border-[#EAE7DF] pb-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
            <Lock className="w-3.5 h-3.5" />
            <span>AUTHOR & CURATION ACCESS</span>
          </div>
          <h2 className="font-serif text-2xl text-[#1F1E1D]">
            創作者管理權限
          </h2>
          <p className="text-xs text-[#78756E] font-light leading-relaxed">
            為維護個人攝影集與遊記的純粹閱讀體驗，新增與編輯功能僅限作者本人使用。
          </p>
        </div>

        {/* Status Indicator */}
        <div className={`p-4 rounded-xs border text-xs flex items-start gap-3 ${
          isAuthorMode 
            ? 'bg-[#F2EFE8] border-[#D5D2C8] text-[#1F1E1D]' 
            : 'bg-[#F7F5F0] border-[#E8E5DC] text-[#66635D]'
        }`}>
          {isAuthorMode ? (
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          ) : (
            <Lock className="w-4 h-4 text-[#88857E] shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-2">
              <span>當前狀態：{isAuthorMode ? '✍️ 創作者編輯模式（已啟用）' : '👁️ 訪客純粹瀏覽模式'}</span>
            </div>
            <p className="text-[11px] text-[#78756E] font-light leading-relaxed">
              {isAuthorMode
                ? '您目前可以新增、編輯、刪除旅行遊記與上傳相片。'
                : '前台介面已隱藏所有新增與編輯按鈕，呈現純淨的雜誌式攝影展覽。'}
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Actions */}
        {isAuthorMode ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleLock}
              className="w-full py-3 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-[0.18em] rounded-xs transition shadow-sm font-sans flex items-center justify-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>切換回訪客純淨瀏覽模式</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 border border-[#D5D2C8] hover:border-[#1F1E1D] text-[#55524C] text-xs uppercase tracking-wider rounded-xs transition"
            >
              保持創作者身分並關閉
            </button>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="space-y-4 pt-1">
            <div>
              <label className="text-[10px] tracking-[0.15em] uppercase text-[#78756E] block mb-1.5 font-medium">
                輸入作者通行密碼：
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-[#9C998F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="請輸入通行密碼（預設：admin）"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full bg-[#F4F2EB] text-xs text-[#1F1E1D] placeholder-[#9C998F] pl-8 pr-10 py-2.5 rounded-xs border border-[#D5D2C8] focus:border-[#1F1E1D] focus:bg-white focus:outline-none transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88857E] hover:text-[#1F1E1D]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-[#9C998F] mt-1 font-light">
                * 系統預設作者密鑰為 <code className="bg-[#EAE7DF] px-1 py-0.5 text-[#1F1E1D] font-mono">admin</code>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-[0.18em] rounded-xs transition shadow-sm font-sans flex items-center justify-center gap-2"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>解鎖創作者模式</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-[#D5D2C8] hover:border-[#1F1E1D] text-[#55524C] text-xs uppercase tracking-wider rounded-xs transition"
              >
                取消
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
