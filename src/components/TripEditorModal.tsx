import { useState, FormEvent } from 'react';
import { Trip, DayPlan, PlaceMarker, PhotoItem, TravelVibe } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Save, 
  Compass,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TripEditorModalProps {
  tripToEdit?: Trip | null;
  onSave: (trip: Trip) => void;
  onClose: () => void;
}

export function TripEditorModal({
  tripToEdit,
  onSave,
  onClose,
}: TripEditorModalProps) {
  const isEditing = Boolean(tripToEdit);

  // Form states
  const [title, setTitle] = useState(tripToEdit?.title || '');
  const [subtitle, setSubtitle] = useState(tripToEdit?.subtitle || '');
  const [destination, setDestination] = useState(tripToEdit?.destination || '');
  const [country, setCountry] = useState(tripToEdit?.country || '日本 (Japan)');
  const [flag, setFlag] = useState(tripToEdit?.flag || '🇯🇵');
  const [startDate, setStartDate] = useState(tripToEdit?.startDate || new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(tripToEdit?.endDate || new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10));
  const [daysCount, setDaysCount] = useState<number>(tripToEdit?.daysCount || 5);
  const [coverImage, setCoverImage] = useState(
    tripToEdit?.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80'
  );
  const [summary, setSummary] = useState(tripToEdit?.summary || '');
  const [companionsText, setCompanionsText] = useState(tripToEdit?.companions?.join('、') || '好友');
  const [vibe, setVibe] = useState<TravelVibe>(tripToEdit?.vibe || 'leisure');
  const [rating, setRating] = useState<number>(tripToEdit?.rating || 5);
  const [budgetTotal, setBudgetTotal] = useState<number>(tripToEdit?.budget?.totalAmount || 35000);
  const [memoriesText, setMemoriesText] = useState(tripToEdit?.memoriesText || '');

  // Days list
  const [days, setDays] = useState<DayPlan[]>(
    tripToEdit?.days || [
      {
        dayNumber: 1,
        date: startDate,
        title: '抵達與市區初訪',
        mood: '☀️ 雀躍期待',
        weather: '晴 22°C',
        journalText: '班機順利降落，推著行李走入這座美麗的城市...',
        stops: [
          {
            id: 'stop-1',
            time: '14:00',
            placeName: '地標景點初探',
            description: '陽光正好，在古色古香的街道漫步與品嚐在地美食。',
            category: 'sight'
          }
        ]
      }
    ]
  );

  // Places Markers list
  const [places, setPlaces] = useState<PlaceMarker[]>(
    tripToEdit?.places || [
      {
        id: 'place-1',
        name: '精選地標',
        category: 'sight',
        lat: 35.0116,
        lng: 135.7681,
        dayNumber: 1,
        note: '最棒的拍照位置與歷史氛圍',
        rating: 5
      }
    ]
  );

  // Photos list
  const [photos, setPhotos] = useState<PhotoItem[]>(tripToEdit?.photos || []);
  const [highlights, setHighlights] = useState<string[]>(
    tripToEdit?.highlights || ['清晨散策拍下無人絕景', '品嚐在地米其林推薦特色美食', '與好友在落日下漫步暢談']
  );
  const [tips, setTips] = useState<string[]>(
    tripToEdit?.tips || ['建議提前在官方網站預訂熱門門票', '準備好輕便好走的步鞋與隨身水壺']
  );

  // Quick Presets
  const presetLocations: Record<string, { lat: number; lng: number; flag: string; country: string }> = {
    '日本京都': { lat: 34.9948, lng: 135.7850, flag: '🇯🇵', country: '日本 (Japan)' },
    '日本東京': { lat: 35.6762, lng: 139.6503, flag: '🇯🇵', country: '日本 (Japan)' },
    '瑞士因特拉肯': { lat: 46.6863, lng: 7.8632, flag: '🇨🇭', country: '瑞士 (Switzerland)' },
    '冰島雷克雅維克': { lat: 64.1466, lng: -21.9426, flag: '🇮🇸', country: '冰島 (Iceland)' },
    '台灣花東': { lat: 24.0322, lng: 121.6294, flag: '🇹🇼', country: '台灣 (Taiwan)' },
  };

  const handleApplyPreset = (key: string) => {
    const p = presetLocations[key];
    if (p) {
      setDestination(key);
      setCountry(p.country);
      setFlag(p.flag);
      if (places.length > 0) {
        const updated = [...places];
        updated[0] = { ...updated[0], name: `${key} 地標`, lat: p.lat, lng: p.lng };
        setPlaces(updated);
      }
    }
  };

  const handleGenerateAISummary = () => {
    if (!destination) return;
    const sampleSummary = `這是一趟前往${destination}的${daysCount}天旅行。我們在陽光與微風中探訪了歷史人文街巷與自然景緻，拍下了許多令人留戀的照片。`;
    setSummary(sampleSummary);
    if (!memoriesText) {
      setMemoriesText(`「旅行的意義，是在陌生的地方重新發現生活的美好。」`);
    }
  };

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: DayPlan = {
      dayNumber: nextDayNum,
      date: new Date(Date.now() + 86400000 * (nextDayNum - 1)).toISOString().slice(0, 10),
      title: `第 ${nextDayNum} 天行程漫步`,
      mood: '🌿 愜意悠閒',
      weather: '晴 20°C',
      journalText: '今天的天氣宜人，我們探訪了當地的特色景致...',
      stops: [
        {
          id: `stop-${Date.now()}`,
          time: '10:00',
          placeName: '上午精選行程',
          description: '欣賞迷人的景緻與品嚐在地特色。',
          category: 'sight'
        }
      ]
    };
    setDays([...days, newDay]);
    setDaysCount(nextDayNum);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) return;

    const companions = companionsText
      .split(/[,，、\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const savedTrip: Trip = {
      id: tripToEdit?.id || `trip-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      destination: destination.trim(),
      country: country.trim(),
      countryCode: country.includes('日本') ? 'JP' : country.includes('瑞士') ? 'CH' : country.includes('冰島') ? 'IS' : 'TW',
      flag: flag.trim() || '✈️',
      startDate,
      endDate,
      daysCount: Number(daysCount) || days.length,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
      summary: summary.trim() || '一趟難忘的旅行故事。',
      companions,
      budget: {
        currency: 'TWD',
        totalAmount: Number(budgetTotal) || 0,
        perPerson: Number(budgetTotal) || 0,
      },
      vibe,
      rating: Number(rating) || 5,
      days,
      places,
      photos: photos.length > 0 ? photos : [
        {
          id: `photo-default-${Date.now()}`,
          url: coverImage,
          caption: `${title} 封面定格`,
          location: destination,
          dayNumber: 1,
          tags: ['精選', '旅行'],
          isCover: true,
          liked: true
        }
      ],
      highlights: highlights.filter(Boolean),
      tips: tips.filter(Boolean),
      memoriesText: memoriesText.trim() || undefined,
      isFavorite: tripToEdit?.isFavorite || false,
      likesCount: tripToEdit?.likesCount || 0,
      viewsCount: tripToEdit?.viewsCount || 1,
      createdAt: tripToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedTrip);
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121110]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] border border-[#D5D2C8] max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#EAE7DF] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#88857E] font-sans">
              MONOGRAPH EDITOR
            </span>
            <h2 className="font-serif text-xl text-[#1F1E1D] mt-0.5">
              {isEditing ? '編輯旅行紀錄' : '記錄一趟全新旅行'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#88857E] hover:text-[#1F1E1D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-[#242220] max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Presets */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1.5 font-sans">
              快速填入經典目的地：
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(presetLocations).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleApplyPreset(k)}
                  className="px-2.5 py-1 bg-[#F4F2EB] hover:bg-[#EAE7DF] text-[#383633] text-xs transition"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  旅行主標題 *：
                </label>
                <input
                  type="text"
                  placeholder="例：初春京都與嵐山：櫻花古寺慢活散策"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2.5 text-xs text-[#1F1E1D] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  副標題 / 摘要短句：
                </label>
                <input
                  type="text"
                  placeholder="例：漫步哲學之道、走進嵐山竹林的春日回憶"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2.5 text-xs text-[#1F1E1D] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  目的地城市 *：
                </label>
                <input
                  type="text"
                  placeholder="例：京都 & 嵐山"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  國家/地區：
                </label>
                <input
                  type="text"
                  placeholder="例：日本 (Japan)"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  旅行風格：
                </label>
                <select
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value as any)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs focus:outline-none"
                >
                  <option value="leisure">靜謐放鬆</option>
                  <option value="culture">人文歷史</option>
                  <option value="nature">壯麗自然</option>
                  <option value="foodie">風土美饌</option>
                  <option value="roadtrip">自駕漫遊</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  出發日期：
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  結束日期：
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  旅行天數：
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs font-mono"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78756E]">
                  封面攝影照片 (Banner Image)：
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1F1E1D] hover:bg-[#33302D] text-[#FAF9F6] text-[10px] uppercase tracking-wider rounded-xs transition-colors shadow-xs">
                  <ImageIcon className="w-3 h-3" />
                  <span>從電腦上傳照片</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        const result = uploadEvent.target?.result as string;
                        if (result) {
                          setCoverImage(result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="或輸入圖片網址 (Image URL)"
                className="w-full bg-white border border-[#D5D2C8] p-2 text-xs font-mono"
              />
              {coverImage && (
                <div className="mt-2 h-32 overflow-hidden bg-[#E8E6DF] border border-[#D5D2C8] relative group">
                  <img src={coverImage} alt="封面預覽" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    封面預覽
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-[#78756E]">
                  旅行故事概述：
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  className="text-[10px] text-[#78756E] hover:text-[#1F1E1D] underline"
                >
                  產生概述文字
                </button>
              </div>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-white border border-[#D5D2C8] p-2.5 text-xs text-[#1F1E1D] leading-relaxed"
                placeholder="寫下這趟旅行的整體氛圍與故事..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  同行旅伴：
                </label>
                <input
                  type="text"
                  placeholder="例：小涵、阿偉"
                  value={companionsText}
                  onChange={(e) => setCompanionsText(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#78756E] block mb-1">
                  旅途金句 / 感言 (Pull Quote)：
                </label>
                <input
                  type="text"
                  placeholder="例：世界很大，每一步都是新的風景。"
                  value={memoriesText}
                  onChange={(e) => setMemoriesText(e.target.value)}
                  className="w-full bg-white border border-[#D5D2C8] p-2 text-xs font-serif"
                />
              </div>
            </div>
          </div>

          {/* Days Section */}
          <div className="space-y-4 pt-4 border-t border-[#EAE7DF]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#88857E]">
                DAILY ITINERARY ({days.length} DAYS)
              </span>
              <button
                type="button"
                onClick={handleAddDay}
                className="px-2.5 py-1 bg-[#F4F2EB] hover:bg-[#EAE7DF] text-[#1F1E1D] text-[11px] uppercase tracking-wider transition"
              >
                + 新增一天
              </button>
            </div>

            <div className="space-y-3">
              {days.map((day, idx) => (
                <div key={day.dayNumber || idx} className="p-3 bg-[#F4F2EB] border border-[#EAE7DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-[#1F1E1D]">
                      DAY {day.dayNumber}
                    </span>
                    {days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDays(days.filter((_, i) => i !== idx))}
                        className="text-[#88857E] hover:text-red-700 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="當日標題"
                      value={day.title}
                      onChange={(e) => {
                        const updated = [...days];
                        updated[idx].title = e.target.value;
                        setDays(updated);
                      }}
                      className="bg-white border border-[#D5D2C8] p-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="當日氣候與心情 (例：晴朗 18°C)"
                      value={day.weather || ''}
                      onChange={(e) => {
                        const updated = [...days];
                        updated[idx].weather = e.target.value;
                        setDays(updated);
                      }}
                      className="bg-white border border-[#D5D2C8] p-1.5 text-xs"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="當日遊記隨筆..."
                    value={day.journalText}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[idx].journalText = e.target.value;
                      setDays(updated);
                    }}
                    className="w-full bg-white border border-[#D5D2C8] p-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#D5D2C8] hover:border-[#1F1E1D] text-xs uppercase tracking-wider"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#1F1E1D] hover:bg-[#383633] text-[#FAF9F6] text-xs uppercase tracking-widest transition flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? '儲存修改' : '建立旅行紀錄'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
