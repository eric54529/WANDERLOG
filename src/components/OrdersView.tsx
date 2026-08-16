import { useState, useEffect, FormEvent } from 'react';
import { MemberUser, OrderItem } from '../types';
import { createOrder, fetchUserOrders } from '../utils/ordersApi';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  User, 
  Phone, 
  FileText, 
  Lock, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Database, 
  ShieldCheck,
  Plus,
  LogIn,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrdersViewProps {
  currentMember: MemberUser | null;
  onOpenAuthModal: () => void;
  onNavigateHome: () => void;
}

const PRESET_ITEMS = [
  { id: 'wanderlog-book', name: 'WANDERLOG 旅人精裝回憶特刊（典藏版）', price: 'NT$ 1,280', desc: '全彩硬殼精裝，收錄各國私房旅行路線與景點深度手札' },
  { id: 'postcard-set', name: '2026 世界旅人明信片典藏套組（12入）', price: 'NT$ 450', desc: '頂級厚磅棉絮紙印製，收錄精選底片色調旅行攝影作品' },
  { id: 'travel-notebook', name: '旅程探索手記手帳（附防水書套）', price: 'NT$ 620', desc: '內含行程規劃頁、支出記帳表與插畫集章空白頁' },
  { id: 'poster-pack', name: '極簡城市旅行復古海報（A3兩張入）', price: 'NT$ 580', desc: '包含東京與冰島雙主題，啞光防潑水高解析微噴工藝' },
];

export function OrdersView({ currentMember, onOpenAuthModal, onNavigateHome }: OrdersViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'list' | 'sql'>('create');
  
  // Form State
  const [name, setName] = useState(currentMember?.name || '');
  const [phone, setPhone] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ITEMS[0].name);
  const [isCustomItem, setIsCustomItem] = useState(false);
  const [customItem, setCustomItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Submit Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<OrderItem | null>(null);

  // Orders List State
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [listError, setListError] = useState('');

  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);

  // Synchronize default name when member changes
  useEffect(() => {
    if (currentMember?.name && !name) {
      setName(currentMember.name);
    }
  }, [currentMember]);

  // Fetch orders when switching to list tab or when member logs in
  const loadOrders = async () => {
    if (!currentMember) return;
    setIsLoadingOrders(true);
    setListError('');
    try {
      const res = await fetchUserOrders();
      if (res.success) {
        setOrders(res.orders);
      } else {
        setListError(res.error || '無法讀取訂單清單');
      }
    } catch (err: any) {
      setListError(err?.message || '讀取異常');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'list' && currentMember) {
      loadOrders();
    }
  }, [activeSubTab, currentMember]);

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setCreatedOrder(null);

    if (!currentMember) {
      onOpenAuthModal();
      return;
    }

    const finalItemName = isCustomItem ? customItem.trim() : selectedPreset;
    if (!finalItemName) {
      setSubmitError('請選擇或輸入品項名稱');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrder({
        name,
        phone,
        item: finalItemName,
        quantity,
        notes,
      });

      if (res.success && res.order) {
        setCreatedOrder(res.order);
        confetti({ particleCount: 50, spread: 70 });
        // Reset non-essential fields
        setNotes('');
      } else {
        setSubmitError(res.error || '下單失敗，請稍後再試');
      }
    } catch (err: any) {
      setSubmitError(err?.message || '下單過程發生錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sqlCode = `-- ==========================================
-- 建立 orders 資料表與 Supabase RLS 安全政策
-- 請將以下 SQL 貼到 Supabase SQL Editor 點擊 Run 執行
-- ==========================================

-- 1. 建立 orders 資料表 (若已存在則略過)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 確保 notes 欄位存在 (相容舊版 note 命名)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'notes'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
  END IF;
END $$;

-- 2. 啟用 Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. 政策：登入者只能讀取自己的訂單 (先 DROP 再 CREATE 避免重複錯誤)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. 政策：登入者只能新增自己的訂單
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. 授與 authenticated 角色基本權限
GRANT ALL ON TABLE public.orders TO authenticated;

-- 6. 建立索引優化查詢
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // If user is not logged in, show lock screen
  if (!currentMember) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 font-sans">
        <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-8 sm:p-12 rounded-sm shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#9A8060]/10 dark:bg-[#9A8060]/20 text-[#9A8060] flex items-center justify-center mx-auto border border-[#9A8060]/20">
            <Lock className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9A8060] font-mono font-medium">
              Authentication Required · 會員權限驗證
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] dark:text-[#FAF9F6]">
              請先登入會員以使用訂單功能
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C] dark:text-[#A8A49B] leading-relaxed">
              目前線上下單與「我的訂單」查詢功能僅開放給 Supabase 登入會員使用。未登入訪客僅可瀏覽首頁旅程故事與照片。
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto px-6 py-3 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>立即使用 Email 登入 / 註冊</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-5 py-3 bg-transparent hover:bg-[#F5F3EC] dark:hover:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] border border-[#D5D2C8] dark:border-[#393733] text-xs uppercase tracking-widest rounded-sm transition font-sans"
            >
              返回探索首頁
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      {/* Top Header */}
      <div className="mb-8 space-y-2 border-b border-[#EAE7DF] dark:border-[#393733] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A8060] font-mono font-medium">
              <Package className="w-4 h-4" />
              <span>MEMBER PORTAL · 會員訂單與專屬服務</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] dark:text-[#FAF9F6] tracking-tight mt-1">
              會員專區 & 訂單服務
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F3EC] dark:bg-[#20201E] rounded-sm border border-[#E0DDD5] dark:border-[#393733] text-xs self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[#88857E]">目前登入：</span>
              <span className="font-medium text-[#1F1E1D] dark:text-[#E8E5DE] ml-1">{currentMember.email}</span>
            </div>
          </div>
        </div>

        {/* SubTab Switcher */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => {
              setActiveSubTab('create');
              setCreatedOrder(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs transition ${
              activeSubTab === 'create'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#171716] shadow-xs'
                : 'bg-white dark:bg-[#20201E] text-[#66635C] dark:text-[#A8A49B] border border-[#EAE7DF] dark:border-[#393733] hover:bg-[#F5F3EC]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>填寫新訂單</span>
          </button>

          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs transition ${
              activeSubTab === 'list'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#171716] shadow-xs'
                : 'bg-white dark:bg-[#20201E] text-[#66635C] dark:text-[#A8A49B] border border-[#EAE7DF] dark:border-[#393733] hover:bg-[#F5F3EC]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>我的訂單記錄</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sql')}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs transition ${
              activeSubTab === 'sql'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:text-[#171716] shadow-xs'
                : 'bg-white dark:bg-[#20201E] text-[#66635C] dark:text-[#A8A49B] border border-[#EAE7DF] dark:border-[#393733] hover:bg-[#F5F3EC]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#9A8060]" />
            <span>SQL 與 RLS 語法</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Create Order Form */}
      {activeSubTab === 'create' && (
        <div className="space-y-6">
          {/* Success Banner */}
          {createdOrder && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-sm space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>訂單送出成功！已寫入 Supabase 資料庫</span>
              </div>
              <div className="p-4 bg-white/80 dark:bg-[#1E1E1C]/80 rounded-xs border border-emerald-200/60 dark:border-emerald-800/60 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-emerald-100 dark:border-emerald-900 pb-2 font-mono">
                  <span className="text-[#77736C] dark:text-[#A8A49B]">訂單編號 (Order ID)：</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 select-all">{createdOrder.id}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#44423E] dark:text-[#D5D2C8] pt-1">
                  <div><strong>品項：</strong>{createdOrder.item}</div>
                  <div><strong>數量：</strong>{createdOrder.quantity} 件</div>
                  <div><strong>訂購人：</strong>{createdOrder.name}</div>
                  <div><strong>聯絡電話：</strong>{createdOrder.phone}</div>
                </div>
                {createdOrder.notes && (
                  <div className="text-[#66635C] dark:text-[#A8A49B] pt-1">
                    <strong>備註：</strong>{createdOrder.notes}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  建立時間：{new Date(createdOrder.created_at).toLocaleString('zh-TW')}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('list')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs rounded-xs font-medium transition flex items-center gap-1"
                >
                  <span>查看我的所有訂單</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs rounded-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">訂單送出失敗</div>
                <div className="leading-relaxed">{submitError}</div>
                {submitError.includes('orders') && (
                  <button
                    onClick={() => setActiveSubTab('sql')}
                    className="underline text-red-800 dark:text-red-200 font-medium hover:opacity-80 block mt-1"
                  >
                    點此前往查看並複製 SQL 建立指令
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
            <div className="border-b border-[#EAE7DF] dark:border-[#393733] pb-4">
              <h2 className="font-serif text-xl text-[#1F1E1D] dark:text-[#FAF9F6]">
                新增訂購項目
              </h2>
              <p className="text-xs text-[#78756E] dark:text-[#A8A49B] mt-0.5">
                填寫以下訂購資料，系統將透過 Supabase RLS 安全驗證寫入您的專屬訂單。
              </p>
            </div>

            {/* Item Selection */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] font-medium">
                選擇訂購品項 <span className="text-[#9A8060]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_ITEMS.map((preset) => {
                  const isSelected = !isCustomItem && selectedPreset === preset.name;
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => {
                        setIsCustomItem(false);
                        setSelectedPreset(preset.name);
                      }}
                      className={`p-3.5 text-left rounded-sm border transition flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-[#1F1E1D] dark:border-[#FAF9F6] bg-[#F5F3EC] dark:bg-[#2A2A27]'
                          : 'border-[#EAE7DF] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#171716] hover:border-[#CCC8BD]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-serif text-[#1F1E1D] dark:text-[#FAF9F6] font-medium leading-snug">
                            {preset.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78756E] dark:text-[#A8A49B] line-clamp-2">
                          {preset.desc}
                        </p>
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-[#9A8060] pt-1">
                        {preset.price}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom item toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomItem(!isCustomItem)}
                  className="text-xs text-[#9A8060] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{isCustomItem ? '← 返回精選品項清單' : '+ 自訂其他品項名稱'}</span>
                </button>

                {isCustomItem && (
                  <div className="mt-2">
                    <input
                      type="text"
                      required={isCustomItem}
                      placeholder="請輸入欲訂購之品項名稱..."
                      value={customItem}
                      onChange={(e) => setCustomItem(e.target.value)}
                      className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] px-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                訂購數量 <span className="text-[#9A8060]">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center border border-[#D5D2C8] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#171716] text-sm rounded-sm hover:bg-[#EFECE4] transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center bg-[#FAF9F6] dark:bg-[#171716] text-sm font-semibold text-[#1F1E1D] dark:text-[#E8E5DE] py-2 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center border border-[#D5D2C8] dark:border-[#393733] bg-[#FAF9F6] dark:bg-[#171716] text-sm rounded-sm hover:bg-[#EFECE4] transition"
                >
                  +
                </button>
                <span className="text-xs text-[#88857E]">件</span>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                  訂購人姓名 <span className="text-[#9A8060]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="請輸入您的真實姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                  聯絡電話 <span className="text-[#9A8060]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#88857E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="例：0912-345-678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
                備註說明 (選填)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-[#88857E] absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="如有特殊收件需求、客製簽名或送禮留言，請於此處填寫..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] pl-9 pr-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>訂單傳送中，請稍候...</span>
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    <span>確認送出訂單</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: My Orders List */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-serif text-xl text-[#1F1E1D] dark:text-[#FAF9F6]">
                我的專屬訂單清單
              </h2>
              <p className="text-xs text-[#78756E] dark:text-[#A8A49B]">
                受 Supabase RLS 安全保護，僅顯示此帳號 ({currentMember.email}) 所建立的訂單。
              </p>
            </div>

            <button
              onClick={loadOrders}
              disabled={isLoadingOrders}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] text-xs text-[#66635C] dark:text-[#A8A49B] rounded-xs hover:bg-[#F5F3EC] transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              <span>重新整理</span>
            </button>
          </div>

          {/* List Error */}
          {listError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs rounded-sm space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>讀取訂單發生錯誤</span>
              </div>
              <p className="leading-relaxed">{listError}</p>
              {listError.includes('orders') && (
                <button
                  onClick={() => setActiveSubTab('sql')}
                  className="underline text-red-800 dark:text-red-200 font-medium hover:opacity-80 block"
                >
                  前往查看並複製 SQL 建立腳本
                </button>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoadingOrders ? (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] rounded-sm">
              <Loader2 className="w-7 h-7 animate-spin text-[#9A8060] mx-auto" />
              <p className="text-xs text-[#78756E] dark:text-[#A8A49B]">正在從 Supabase 讀取您的個人訂單...</p>
            </div>
          ) : orders.length === 0 && !listError ? (
            /* Empty State */
            <div className="py-16 text-center space-y-4 bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] rounded-sm p-8">
              <div className="w-12 h-12 rounded-full bg-[#9A8060]/10 text-[#9A8060] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-serif text-lg text-[#1F1E1D] dark:text-[#FAF9F6]">尚無任何訂單記錄</h3>
                <p className="text-xs text-[#78756E] dark:text-[#A8A49B]">
                  您目前尚未建立過任何商品訂單。隨時可以挑選喜愛的旅人物品下單！
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab('create')}
                className="px-5 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium inline-flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>立即填寫第一筆訂單</span>
              </button>
            </div>
          ) : (
            /* Orders Table / Cards */
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-5 rounded-sm shadow-xs hover:border-[#CCC8BD] transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE7DF] dark:border-[#393733] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-mono font-medium rounded-2xs border border-emerald-200 dark:border-emerald-800">
                        訂單成立
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#1F1E1D] dark:text-[#FAF9F6] select-all">
                        #{ord.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#88857E] font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(ord.created_at).toLocaleString('zh-TW')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[#88857E] block text-[11px]">訂購品項</span>
                      <span className="font-serif text-sm text-[#1F1E1D] dark:text-[#FAF9F6] font-medium block mt-0.5">
                        {ord.item}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#88857E] block text-[11px]">數量</span>
                      <span className="font-semibold text-[#1F1E1D] dark:text-[#FAF9F6] block mt-0.5 font-mono">
                        {ord.quantity} 件
                      </span>
                    </div>

                    <div>
                      <span className="text-[#88857E] block text-[11px]">訂購人</span>
                      <span className="text-[#1F1E1D] dark:text-[#FAF9F6] block mt-0.5 font-medium">
                        {ord.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#88857E] block text-[11px]">聯絡電話</span>
                      <span className="text-[#1F1E1D] dark:text-[#FAF9F6] block mt-0.5 font-mono">
                        {ord.phone}
                      </span>
                    </div>
                  </div>

                  {ord.notes && (
                    <div className="pt-2 border-t border-[#F0ECE1] dark:border-[#2A2A27] text-xs text-[#66635C] dark:text-[#A8A49B] bg-[#FAF9F6] dark:bg-[#171716] p-2.5 rounded-xs">
                      <span className="font-medium text-[#44423E] dark:text-[#C5C0B5]">備註：</span>
                      {ord.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: SQL Script View */}
      {activeSubTab === 'sql' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE7DF] dark:border-[#393733] pb-4">
              <div>
                <h2 className="font-serif text-xl text-[#1F1E1D] dark:text-[#FAF9F6] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#9A8060]" />
                  <span>Supabase SQL 建立腳本與 RLS 政策</span>
                </h2>
                <p className="text-xs text-[#78756E] dark:text-[#A8A49B] mt-0.5">
                  請將以下 SQL 複製並貼到您的 Supabase Dashboard &gt; SQL Editor 點擊 Run 執行。
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-wider rounded-sm font-medium transition shadow-xs self-start sm:self-auto"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>已複製 SQL 腳本！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一鍵複製完整 SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-[#171716] text-[#E8E5DE] rounded-sm font-mono text-xs overflow-x-auto leading-relaxed border border-[#333]">
                {sqlCode}
              </pre>
            </div>

            <div className="space-y-2 text-xs text-[#66635C] dark:text-[#A8A49B] pt-2">
              <div className="font-semibold text-[#1F1E1D] dark:text-[#FAF9F6]">💡 RLS 安全政策說明：</div>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><code className="text-[#9A8060]">user_id UUID REFERENCES auth.users(id)</code>：自動綁定登入之會員帳號。</li>
                <li><code className="text-[#9A8060]">ALTER TABLE orders ENABLE ROW LEVEL SECURITY</code>：啟動資料庫級防護。</li>
                <li><code className="text-[#9A8060]">Users can view own orders</code>：透過 <code className="text-[#9A8060]">auth.uid() = user_id</code>，確保每位使用者在讀取時只能看到自己建立的訂單。</li>
                <li><code className="text-[#9A8060]">Users can insert own orders</code>：新增時驗證只能以自己的 <code className="text-[#9A8060]">auth.uid()</code> 寫入。</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
