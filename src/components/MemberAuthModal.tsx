import { useState, FormEvent } from 'react';
import { MemberUser } from '../types';
import { registerMember, loginMember, logoutMember } from '../utils/memberAuth';
import { 
  User, 
  UserPlus, 
  LogIn, 
  LogOut, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Crown,
  Heart,
  MessageSquare,
  Loader2,
  AlertCircle,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: MemberUser | null;
  onMemberChange: (member: MemberUser | null) => void;
  initialMode?: 'login' | 'register';
  onNavigateToOrders?: () => void;
}

export function MemberAuthModal({
  isOpen,
  onClose,
  currentMember,
  onMemberChange,
  initialMode = 'login',
  onNavigateToOrders,
}: MemberAuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialMode);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await loginMember(loginEmail, loginPassword);
      if (res.success && res.member) {
        onMemberChange(res.member);
        setSuccessMsg(`歡迎回來，${res.member.name}！已成功以 Supabase 帳號登入。`);
        confetti({ particleCount: 35, spread: 65 });
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1100);
      } else {
        setErrorMsg(res.error || '登入失敗，請檢查信箱與密碼');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || '登入過程發生異常');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('兩次輸入的密碼不相符，請確認後重試');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('密碼長度至少需 6 個字元以上');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerMember(regName, regEmail, regPassword);
      if (res.success && res.member) {
        onMemberChange(res.member);
        if (res.requiresEmailConfirm) {
          setSuccessMsg(`註冊已送出！若您在 Supabase 開啟了 Email 確認，請先至信箱收取確認信；若未開啟則可直接使用。`);
        } else {
          setSuccessMsg(`恭喜註冊成功！已加入 WANDERLOG 會員，${res.member.name}！`);
        }
        confetti({ particleCount: 45, spread: 75 });
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1500);
      } else {
        setErrorMsg(res.error || '註冊失敗');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || '註冊過程發生異常');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logoutMember();
    onMemberChange(null);
    setIsLoading(false);
    setSuccessMsg('已安全登出會員帳號。');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#FAF9F6] dark:bg-[#1E1E1C] border border-[#EAE7DF] dark:border-[#393733] w-full max-w-md p-6 sm:p-8 rounded-xs shadow-2xl space-y-6 text-[#242220] dark:text-[#E8E5DE] relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#88857E] hover:text-[#1F1E1D] dark:hover:text-white transition p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logged in state (Member Profile View) */}
        {currentMember ? (
          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-[#EAE7DF] dark:border-[#393733] pb-4">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#9A8060] font-mono">
                <Crown className="w-3.5 h-3.5" />
                <span>MEMBER PROFILE · 會員專區</span>
              </div>
              <h2 className="font-serif text-2xl text-[#1F1E1D] dark:text-[#FAF9F6]">
                會員個人中心
              </h2>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-[#262624] border border-[#EAE7DF] dark:border-[#393733] p-5 rounded-sm shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#EFECE4] dark:bg-[#333330] border border-[#D5D2C8] dark:border-[#444] flex items-center justify-center text-xl font-serif text-[#9A8060] shrink-0 overflow-hidden">
                {currentMember.avatar ? (
                  <img src={currentMember.avatar} alt={currentMember.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 stroke-[1.5]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg text-[#1F1E1D] dark:text-[#FAF9F6] truncate">
                    {currentMember.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-[#9A8060]/15 text-[#9A8060] text-[10px] uppercase tracking-wider font-mono rounded-xs font-semibold">
                    Supabase 會員
                  </span>
                </div>
                <p className="text-xs text-[#77736C] dark:text-[#A8A49B] truncate font-mono mt-0.5">
                  {currentMember.email}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#88857E] font-mono mt-1">
                  <Database className="w-3 h-3 text-[#9A8060]" />
                  <span className="truncate">UID: {currentMember.id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            {/* Unlocked Benefits & Actions */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#88857E] font-medium">會員專屬特權與功能</div>
              <div className="space-y-1.5 text-xs text-[#55524B] dark:text-[#C5C0B5]">
                <div className="flex items-center gap-2 p-2.5 bg-[#F5F3EC] dark:bg-[#2A2A27] rounded-xs border border-[#EAE7DF] dark:border-[#383633]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>已啟用線上專屬下單與歷史「我的訂單」查詢</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-[#F5F3EC] dark:bg-[#2A2A27] rounded-xs border border-[#EAE7DF] dark:border-[#383633]">
                  <MessageSquare className="w-4 h-4 text-[#9A8060] shrink-0" />
                  <span>已解鎖 FAQ 問答與意見回饋表單發送權限</span>
                </div>
              </div>
            </div>

            {/* Navigation Button to Orders */}
            {onNavigateToOrders && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToOrders();
                }}
                className="w-full py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium flex items-center justify-center gap-2 shadow-xs"
              >
                <span>前往線上下單與「我的訂單」</span>
              </button>
            )}

            {/* Feedback Alert */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-[#EAE7DF] dark:border-[#393733]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] hover:text-[#1F1E1D] dark:hover:text-white transition"
              >
                關閉視窗
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs uppercase tracking-wider rounded-sm transition font-medium disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                <span>登出帳號</span>
              </button>
            </div>
          </div>
        ) : (
          /* Not logged in: Tabbed Login / Register */
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-1.5 border-b border-[#EAE7DF] dark:border-[#393733] pb-4">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#9A8060] font-mono">
                <User className="w-3.5 h-3.5" />
                <span>SUPABASE AUTH · 會員中心</span>
              </div>
              <h2 className="font-serif text-2xl text-[#1F1E1D] dark:text-[#FAF9F6]">
                {tab === 'login' ? '會員登入' : '註冊新會員'}
              </h2>
              <p className="text-xs text-[#78756E] dark:text-[#A8A49B] font-light leading-relaxed">
                {tab === 'login'
                  ? '登入您的 Supabase 帳號以進行下單、檢視「我的訂單」及使用專屬功能。'
                  : '使用 Email 註冊帳號，即可解鎖線上訂單管理與專屬個人化功能。'}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 bg-[#EFECE4] dark:bg-[#2A2A27] p-1 rounded-sm border border-[#E0DDD5] dark:border-[#393733]">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-1.5 text-xs tracking-wider uppercase font-medium rounded-xs transition flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-white dark:bg-[#1E1E1C] text-[#1F1E1D] dark:text-white shadow-xs'
                    : 'text-[#77736C] dark:text-[#A8A49B] hover:text-[#1F1E1D]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>帳號登入</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-1.5 text-xs tracking-wider uppercase font-medium rounded-xs transition flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'bg-white dark:bg-[#1E1E1C] text-[#1F1E1D] dark:text-white shadow-xs'
                    : 'text-[#77736C] dark:text-[#A8A49B] hover:text-[#1F1E1D]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Email 註冊</span>
              </button>
            </div>

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs rounded-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="leading-relaxed">{errorMsg}</div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                    電子郵件 (Email)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                    密碼 (Password)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="請輸入密碼"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-10 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88857E] hover:text-[#1F1E1D] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isLoading ? '登入驗證中...' : '立即登入'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1 font-medium">
                    您的暱稱 / 姓名 <span className="text-[#9A8060]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="例：旅人 Alex"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1 font-medium">
                    電子郵件 (Email) <span className="text-[#9A8060]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1 font-medium">
                      設定密碼 <span className="text-[#9A8060]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="至少6碼"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-8 pr-3 py-2 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1 font-medium">
                      確認密碼 <span className="text-[#9A8060]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="再次輸入"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-white dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-8 pr-3 py-2 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isLoading ? '註冊處理中...' : '完成 Email 註冊並登入'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
