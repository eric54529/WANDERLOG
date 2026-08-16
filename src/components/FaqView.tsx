import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Compass, MessageSquare, ArrowRight, Lock, UserPlus, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { MemberUser } from '../types';

interface FaqItem {
  id: string;
  category: 'general' | 'features' | 'sharing' | 'account';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '1',
    category: 'general',
    question: 'WANDERLOG 是一個怎樣的平台？',
    answer: 'WANDERLOG 是一本專屬於您的個人旅遊雜誌與遊記記錄器。我們融合了精緻的紙本雜誌美學與現代網頁互動，提供沈浸式的圖文日誌、攝影藝廊、足跡地圖與雲端同步分享功能，讓每一段旅程都成為永恆的典藏。'
  },
  {
    id: '2',
    category: 'features',
    question: '如何新增我自己的旅行紀錄與相片？',
    answer: '點擊頂端導覽列右側的「新增旅行」按鈕即可開啟編輯器（需處於創作者模式）。您可以自由填寫標題、目的地、國家、天數、封面圖片、每日詳細行程、花費預算與多張相片。系統會即時將您的旅行儲存至本地與雲端。'
  },
  {
    id: '3',
    category: 'features',
    question: '深淺色模式如何自動跟隨裝置預設？',
    answer: '系統預設會自動偵測您的作業系統或裝置預設（prefers-color-scheme）來顯示深色或淺色佈景主題。您也可以點擊導覽列上的太陽/月亮圖示隨時切換為手動模式；雙擊該圖示或清除設定，即可立刻恢復為跟隨裝置預設。'
  }
];

interface ContactFormspreeSectionProps {
  currentMember: MemberUser | null;
  onOpenMemberModal: () => void;
}

function ContactFormspreeSection({ currentMember, onOpenMemberModal }: ContactFormspreeSectionProps) {
  const [state, handleSubmit] = useForm('xaewddwz');

  // If user is not a logged in member, hide the form and show member invitation gate
  if (!currentMember) {
    return (
      <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-6 sm:p-8 rounded-sm shadow-xs mb-12 relative overflow-hidden">
        <div className="max-w-xl mx-auto text-center space-y-4 py-3">
          <div className="w-12 h-12 rounded-full bg-[#9A8060]/10 dark:bg-[#9A8060]/20 text-[#9A8060] flex items-center justify-center mx-auto border border-[#9A8060]/20">
            <Lock className="w-5 h-5 stroke-[1.75]" />
          </div>
          
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-widest text-[#9A8060] font-mono font-medium block">
              Members Exclusive · 會員專屬提問功能
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F1E1D] dark:text-[#E8E5DE]">
              線上問答與意見回饋表單
            </h3>
            <p className="text-xs sm:text-sm text-[#77736C] dark:text-[#A8A49B] leading-relaxed max-w-md mx-auto">
              為維護交流品質，線上諮詢與意見回饋表單目前<strong>僅開放給 WANDERLOG 註冊會員使用</strong>。一般瀏覽視角已為您隱藏表單。
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenMemberModal}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>免費註冊 / 登入會員解鎖表單</span>
            </button>
          </div>

          <p className="text-[11px] text-[#A39F95] dark:text-[#7A776F] pt-1">
            ✨ 加入會員即可與作者交流提問、收藏旅行足跡
          </p>
        </div>
      </div>
    );
  }

  // Member is logged in: Show form
  if (state.succeeded) {
    return (
      <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-8 text-center rounded-sm shadow-xs mb-12">
        <div className="w-12 h-12 rounded-full bg-[#9A8060]/15 text-[#9A8060] flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl text-[#1F1E1D] dark:text-[#E8E5DE] mb-2">感謝您的回饋與留言！</h3>
        <p className="text-xs sm:text-sm text-[#77736C] dark:text-[#A8A49B]">
          親愛的會員 <strong>{currentMember.name}</strong>，我們已經收到您的表單訊息，將會盡快透過信箱與您聯繫。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-6 sm:p-8 rounded-sm shadow-xs mb-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE7DF] dark:border-[#393733]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9A8060] font-mono mb-1 block">Contact & Feedback Form</span>
          <h3 className="font-serif text-xl text-[#1F1E1D] dark:text-[#E8E5DE]">線上意見回饋與聯絡表單</h3>
          <p className="text-xs text-[#77736C] dark:text-[#A8A49B] mt-1">
            如果您對 WANDERLOG 有任何建議、問題或合作洽詢，歡迎填寫以下表單與我們聯繫。
          </p>
        </div>
        
        {/* Verified Member Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F3EC] dark:bg-[#2A2A27] rounded-sm border border-[#E0DDD5] dark:border-[#393733] shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <div className="text-[11px] font-sans">
            <span className="text-[#88857E]">已驗證會員：</span>
            <span className="font-medium text-[#1F1E1D] dark:text-[#E8E5DE]">{currentMember.name}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
              您的姓名 / 暱稱 <span className="text-[#9A8060]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={currentMember.name}
              placeholder="請輸入您的姓名"
              className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] px-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
            />
            <ValidationError field="name" errors={state.errors} className="text-red-500 text-[11px] mt-1" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
              電子郵件 (Email) <span className="text-[#9A8060]">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={currentMember.email}
              placeholder="name@example.com"
              className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] px-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
            />
            <ValidationError field="email" errors={state.errors} className="text-red-500 text-[11px] mt-1" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
            回饋主題 / 分類
          </label>
          <select
            name="subject"
            className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] px-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
          >
            <option value="一般意見與諮詢">一般意見與諮詢</option>
            <option value="功能建議與回報">功能建議與回報 (Bug Report / Feature Request)</option>
            <option value="旅遊內容合作">旅遊內容合作與洽談</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#66635C] dark:text-[#A8A49B] mb-1.5 font-medium">
            詳細訊息與內容 <span className="text-[#9A8060]">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="請在此輸入您的寶貴意見或想詢問的問題..."
            className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] px-3.5 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition resize-none"
          ></textarea>
          <ValidationError field="message" errors={state.errors} className="text-red-500 text-[11px] mt-1" />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-[#88857E]">
            * 表單透過 Formspree 安全傳送，我們將盡快回覆您。
          </p>
          <button
            type="submit"
            disabled={state.submitting}
            className="px-6 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] dark:bg-[#E8E5DE] dark:hover:bg-[#D4D1C9] dark:text-[#171716] text-[#FAF9F6] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium disabled:opacity-50"
          >
            {state.submitting ? '傳送中...' : '送出表單'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface FaqViewProps {
  onNavigateHome: () => void;
  onOpenCreateModal: () => void;
  currentMember: MemberUser | null;
  onOpenMemberModal: () => void;
}

export function FaqView({ onNavigateHome, onOpenCreateModal, currentMember, onOpenMemberModal }: FaqViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'features' | 'sharing' | 'account'>('all');
  const [openId, setOpenId] = useState<string | null>('1');

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 transition-colors font-sans">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFECE4] dark:bg-[#2A2A27] text-[#5A5750] dark:text-[#C5C0B5] text-xs tracking-widest uppercase mb-4 font-sans border border-[#E2DFD6] dark:border-transparent">
          <MessageSquare className="w-3.5 h-3.5 text-[#9A8060]" />
          <span>常見問答與說明 · FAQ</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1E1D] dark:text-[#E8E5DE] tracking-tight mb-3">
          解答您的所有疑惑
        </h1>
        <p className="text-sm text-[#77736C] dark:text-[#A8A49B] leading-relaxed">
          關於 WANDERLOG 的使用操作、深淺色切換、資料同步與分享機制，您可以在此找到詳細解答。
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-4 sm:p-6 rounded-sm shadow-xs mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#88857E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋常見問題關鍵字（例如：分享、深色模式、新增旅程...）"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F6] dark:bg-[#171716] text-xs sm:text-sm text-[#1F1E1D] dark:text-[#E8E5DE] placeholder-[#88857E] pl-10 pr-4 py-2.5 rounded-sm border border-[#E5E2D9] dark:border-[#393733] focus:outline-none focus:border-[#77736C] transition"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EAE7DF] dark:border-[#393733]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs rounded-sm transition ${
              activeCategory === 'all'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#E8E5DE] dark:text-[#171716] font-medium shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] hover:bg-[#EAE7DF] border border-[#E5E2D9] dark:border-transparent'
            }`}
          >
            全部問題 ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('general')}
            className={`px-3 py-1.5 text-xs rounded-sm transition ${
              activeCategory === 'general'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#E8E5DE] dark:text-[#171716] font-medium shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] hover:bg-[#EAE7DF] border border-[#E5E2D9] dark:border-transparent'
            }`}
          >
            平台簡介
          </button>
          <button
            onClick={() => setActiveCategory('features')}
            className={`px-3 py-1.5 text-xs rounded-sm transition ${
              activeCategory === 'features'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#E8E5DE] dark:text-[#171716] font-medium shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] hover:bg-[#EAE7DF] border border-[#E5E2D9] dark:border-transparent'
            }`}
          >
            功能與操作
          </button>
          <button
            onClick={() => setActiveCategory('sharing')}
            className={`px-3 py-1.5 text-xs rounded-sm transition ${
              activeCategory === 'sharing'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#E8E5DE] dark:text-[#171716] font-medium shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] hover:bg-[#EAE7DF] border border-[#E5E2D9] dark:border-transparent'
            }`}
          >
            分享與統計
          </button>
          <button
            onClick={() => setActiveCategory('account')}
            className={`px-3 py-1.5 text-xs rounded-sm transition ${
              activeCategory === 'account'
                ? 'bg-[#1F1E1D] text-[#FAF9F6] dark:bg-[#E8E5DE] dark:text-[#171716] font-medium shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#2A2A27] text-[#66635C] dark:text-[#A8A49B] hover:bg-[#EAE7DF] border border-[#E5E2D9] dark:border-transparent'
            }`}
          >
            資料與權限
          </button>
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3 mb-12">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] p-12 text-center rounded-sm">
            <HelpCircle className="w-10 h-10 text-[#88857E] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="font-serif text-lg text-[#1F1E1D] dark:text-[#E8E5DE] mb-1">找不到相關問題</h3>
            <p className="text-xs text-[#77736C] dark:text-[#A8A49B]">請嘗試更換關鍵字或點擊「全部問題」查看完整清單。</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-transparent border-b border-[#EAE7DF] dark:border-[#393733] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left py-4 px-2 flex items-center justify-between gap-4 hover:bg-[#F2EFE8]/70 dark:hover:bg-[#2A2A27]/50 transition rounded-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-[#2A2A27] border border-[#E0DDD5] dark:border-transparent text-[#77736C] dark:text-[#A8A49B] text-xs font-mono flex items-center justify-center shrink-0 shadow-2xs">
                      Q
                    </span>
                    <span className="font-serif text-sm sm:text-base text-[#1F1E1D] dark:text-[#E8E5DE] font-medium">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-[#88857E] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-2 pb-5 pt-1 bg-transparent">
                    <div className="flex items-start gap-3 mt-2 pl-2">
                      <span className="w-6 h-6 rounded-full bg-[#9A8060] text-white text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                        A
                      </span>
                      <p className="text-xs sm:text-sm text-[#44413B] dark:text-[#C5C0B5] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Formspree Contact / Feedback Form Section */}
      <ContactFormspreeSection currentMember={currentMember} onOpenMemberModal={onOpenMemberModal} />

      {/* Quick CTA Box */}
      <div className="bg-[#F5F3EC] dark:bg-[#20201E] border border-[#EAE7DF] dark:border-[#393733] text-[#1F1E1D] dark:text-[#FAF9F6] p-8 rounded-sm text-center relative overflow-hidden shadow-xs">
        <div className="absolute -right-10 -bottom-10 opacity-5 dark:opacity-10 pointer-events-none text-[#1F1E1D] dark:text-white">
          <Compass className="w-64 h-64 stroke-[0.5]" />
        </div>
        <h3 className="font-serif text-xl sm:text-2xl mb-2 text-[#1F1E1D] dark:text-[#E8E5DE]">還有其他想了解的問題嗎？</h3>
        <p className="text-xs text-[#77736C] dark:text-[#ABA79C] max-w-md mx-auto mb-6">
          立即開始建立您的第一本個人旅行雜誌，記錄專屬您的美好足跡。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] dark:bg-[#FAF9F6] dark:hover:bg-[#EFECE4] dark:text-[#1F1E1D] text-xs uppercase tracking-widest rounded-sm transition font-sans font-medium shadow-xs"
          >
            立即新增旅行
          </button>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-white hover:bg-[#EAE7DF] text-[#1F1E1D] border border-[#D5D2C8] dark:bg-transparent dark:hover:bg-white/10 dark:text-[#FAF9F6] dark:border-[#66635C] text-xs uppercase tracking-widest rounded-sm transition font-sans flex items-center gap-1.5 shadow-2xs"
          >
            <span>返回總覽首頁</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
