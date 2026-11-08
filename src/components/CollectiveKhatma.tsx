import React, { useState, useEffect } from 'react';
import {
  Users, Heart, Share2, CheckCircle2, BookOpen, Plus, Sparkles,
  Check, Copy, Edit2, UserMinus, ShieldCheck, Clock, MessageCircle,
  AlertCircle, RotateCcw, UserCheck, Calendar, X, AlertTriangle, ExternalLink
} from 'lucide-react';

export interface PartClaim {
  juzNumber: number;
  juzName: string;
  claimedBy: string | null;
  claimedAt?: string;
  isCompleted: boolean;
  surahsCovered?: string;
}

const DEFAULT_JUZ_SURAS: Record<number, string> = {
  1: 'من الفاتحة 1 إلى البقرة 141',
  2: 'من البقرة 142 إلى البقرة 252',
  3: 'من البقرة 253 إلى آل عمران 92',
  4: 'من آل عمران 93 إلى النساء 23',
  5: 'من النساء 24 إلى النساء 147',
  6: 'من النساء 148 إلى المائدة 81',
  7: 'من المائدة 82 إلى الأنعام 110',
  8: 'من الأنعام 111 إلى الأعراف 87',
  9: 'من الأعراف 88 إلى الأنفال 40',
  10: 'من الأنفال 41 إلى التوبة 92',
  11: 'من التوبة 93 إلى هود 5',
  12: 'من هود 6 إلى يوسف 52',
  13: 'من يوسف 53 إلى إبراهيم 52',
  14: 'من الحجر 1 إلى النحل 128',
  15: 'من الإسراء 1 إلى الكهف 74',
  16: 'من الكهف 75 إلى طه 135',
  17: 'من الأنبياء 1 إلى الحج 78',
  18: 'من المؤمنون 1 إلى الفرقان 20',
  19: 'من الفرقان 21 إلى النمل 55',
  20: 'من النمل 56 إلى العنكبوت 45',
  21: 'من العنكبوت 46 إلى الأحزاب 30',
  22: 'من الأحزاب 31 إلى يس 27',
  23: 'من يس 28 إلى الزمر 31',
  24: 'من الزمر 32 إلى فصلت 46',
  25: 'من فصلت 47 إلى الجاثية 37',
  26: 'من الأحقاف 1 إلى الذاريات 30',
  27: 'من الذاريات 31 إلى الحديد 29',
  28: 'من المجادلة 1 إلى التحريم 12',
  29: 'من الملك 1 إلى المرسلات 50',
  30: 'من النبأ 1 إلى الناس 6 (جزء عم)',
};

interface CollectiveKhatmaProps {
  onNavigateToJuz?: (juzNumber: number) => void;
}

export const CollectiveKhatma: React.FC<CollectiveKhatmaProps> = ({ onNavigateToJuz }) => {
  const STORAGE_KEY = 'bayan_collective_khatma_v2';

  const [dedicationTitle, setDedicationTitle] = useState('ختمة البر والصدقة الجارية لجميع موتى المسلمين');
  const [creatorName, setCreatorName] = useState('فاعل خير');
  const [deadlineDays, setDeadlineDays] = useState<number>(3);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'claimed' | 'completed'>('all');
  
  // Inline edit state
  const [editingJuz, setEditingJuz] = useState<number | null>(null);
  const [editingNameInput, setEditingNameInput] = useState<string>('');

  // In-App Modals state (replaces fragile window.prompt / window.confirm)
  const [claimModalJuz, setClaimModalJuz] = useState<number | null>(null);
  const [claimNameInput, setClaimNameInput] = useState<string>('');

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: 'withdraw' | 'admin-release' | 'reset-all';
    targetJuz?: number;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionType: 'withdraw'
  });

  const [isDedicationModalOpen, setIsDedicationModalOpen] = useState(false);
  const [tempTitleInput, setTempTitleInput] = useState(dedicationTitle);
  const [tempCreatorInput, setTempCreatorInput] = useState(creatorName);

  const [whatsAppModalConfig, setWhatsAppModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    whatsAppUrl: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    whatsAppUrl: ''
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate initial fallback parts
  const generateInitialParts = (): PartClaim[] => {
    return Array.from({ length: 30 }, (_, i) => {
      const num = i + 1;
      let claimed: string | null = null;
      let done = false;
      let date = '';

      if (num === 1 || num === 2 || num === 30) {
        claimed = 'أم أحمد';
        done = true;
        date = 'اليوم';
      } else if (num === 3 || num === 4) {
        claimed = 'أبو عبد الله';
        done = true;
        date = 'اليوم';
      } else if (num === 5 || num === 6) {
        claimed = 'سارة';
        done = false;
        date = 'منذ يوم';
      } else if (num === 15) {
        claimed = 'يوسف';
        done = false;
        date = 'منذ يومين';
      }

      return {
        juzNumber: num,
        juzName: `الجزء ${num}`,
        claimedBy: claimed,
        claimedAt: date,
        isCompleted: done,
        surahsCovered: DEFAULT_JUZ_SURAS[num],
      };
    });
  };

  const [parts, setParts] = useState<PartClaim[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.parts && Array.isArray(parsed.parts)) {
          return parsed.parts;
        }
      } catch {
        // fallback
      }
    }
    return generateInitialParts();
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dedicationTitle) setDedicationTitle(parsed.dedicationTitle);
        if (parsed.creatorName) setCreatorName(parsed.creatorName);
        if (parsed.deadlineDays) setDeadlineDays(parsed.deadlineDays);
      } catch {
        // ignore
      }
    }
  }, []);

  const saveToStorage = (updatedParts: PartClaim[], title = dedicationTitle, creator = creatorName, days = deadlineDays) => {
    setParts(updatedParts);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        parts: updatedParts,
        dedicationTitle: title,
        creatorName: creator,
        deadlineDays: days,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  const completedCount = parts.filter(p => p.isCompleted).length;
  const claimedCount = parts.filter(p => p.claimedBy !== null).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  // Safe clipboard helper
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  // Open Claim in-app modal
  const handleOpenClaimModal = (juzNum: number) => {
    setClaimModalJuz(juzNum);
    setClaimNameInput('');
  };

  // Confirm Claim in-app
  const handleConfirmClaim = () => {
    if (!claimModalJuz) return;
    const trimmed = claimNameInput.trim() || 'قارئ محب للخير';

    const updated = parts.map(p =>
      p.juzNumber === claimModalJuz
        ? {
            ...p,
            claimedBy: trimmed,
            claimedAt: 'اليوم',
            isCompleted: false,
          }
        : p
    );
    saveToStorage(updated);
    setClaimModalJuz(null);
    showToast(`تم حجز الجزء ${claimModalJuz} بنجاح باسم: ${trimmed}`);
  };

  // Toggle completion
  const handleToggleComplete = (juzNumber: number) => {
    const updated = parts.map(p => {
      if (p.juzNumber === juzNumber) {
        const nextState = !p.isCompleted;
        if (nextState) {
          showToast(`هنيئاً لك! تم إتمام قراءة الجزء ${juzNumber} بحمد الله`);
        }
        return { ...p, isCompleted: nextState };
      }
      return p;
    });
    saveToStorage(updated);
  };

  // Inline edit name
  const handleStartEditName = (juzNumber: number, currentName: string) => {
    setEditingJuz(juzNumber);
    setEditingNameInput(currentName);
  };

  const handleSaveEditName = (juzNumber: number) => {
    const trimmed = editingNameInput.trim();
    if (!trimmed) return;

    const updated = parts.map(p =>
      p.juzNumber === juzNumber
        ? { ...p, claimedBy: trimmed }
        : p
    );
    saveToStorage(updated);
    setEditingJuz(null);
    showToast(`تم تحديث اسم القارئ للجزء ${juzNumber} إلى: ${trimmed}`);
  };

  // Open in-app Confirm Modal (Withdraw / Admin release / Reset)
  const handleOpenConfirmModal = (actionType: 'withdraw' | 'admin-release' | 'reset-all', targetJuz?: number) => {
    if (actionType === 'withdraw') {
      setConfirmModalConfig({
        isOpen: true,
        title: 'الاعتذار والانسحاب من القراءة',
        message: `هل ترغب في الاعتذار عن قراءة الجزء ${targetJuz}؟ سيتم إخلاء الجزء فوراً ليتمكن مشارك آخر من حجز وتلاوة هذا الورد ونيل الأجر.`,
        actionType,
        targetJuz
      });
    } else if (actionType === 'admin-release') {
      setConfirmModalConfig({
        isOpen: true,
        title: 'إخلاء الجزء (إجراء المشرف)',
        message: `هل تريد بصفتك مشرف الختمة تحرير الجزء ${targetJuz} وإعادة طرحه شاغراً للمشاركين؟`,
        actionType,
        targetJuz
      });
    } else {
      setConfirmModalConfig({
        isOpen: true,
        title: 'إعادة ضبط وبدء ختمة جديدة',
        message: 'سيتم تفريغ كافة حجوزات الأجزاء الـ 30 وإعادة الختمة إلى نقطة البداية. هل أنت متأكد؟',
        actionType
      });
    }
  };

  // Execute confirmed action
  const handleExecuteConfirm = () => {
    const { actionType, targetJuz } = confirmModalConfig;

    if (actionType === 'withdraw' || actionType === 'admin-release') {
      if (targetJuz) {
        const updated = parts.map(p =>
          p.juzNumber === targetJuz
            ? {
                ...p,
                claimedBy: null,
                claimedAt: undefined,
                isCompleted: false,
              }
            : p
        );
        saveToStorage(updated);
        showToast(actionType === 'withdraw' ? `تم الاعتذار عن الجزء ${targetJuz} وإتاحته للجميع` : `تم تحرير الجزء ${targetJuz} من قبل المشرف`);
      }
    } else if (actionType === 'reset-all') {
      const resetParts = parts.map(p => ({
        ...p,
        claimedBy: null,
        claimedAt: undefined,
        isCompleted: false,
      }));
      saveToStorage(resetParts);
      showToast('تمت إعادة ضبط الختمة بنجاح وبدء دورة جديدة');
    }

    setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Open WhatsApp Reminder in-app modal
  const handleOpenWhatsAppReminderModal = (part: PartClaim) => {
    const msg = `السلام عليكم ورحمة الله وبركاته 🌸\nنذكركم بلطف بوردكم المبارك في الختمة الجماعية (${part.juzName}: ${part.surahsCovered}) بنية: "${dedicationTitle}".\n\nتقبل الله طاعاتكم وبارك في وقتكم!\nيمكنكم تأكيد إتمام القراءة عبر الرابط:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    setWhatsAppModalConfig({
      isOpen: true,
      title: `تذكير عبر واتساب - ${part.juzName}`,
      message: msg,
      whatsAppUrl: url,
    });
  };

  // Open WhatsApp Broadcast in-app modal
  const handleOpenWhatsAppBroadcastModal = () => {
    const remainingCount = 30 - claimedCount;
    const msg = `قال تعالى: ﴿وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ﴾ 📖\n\nندعوكم للمشاركة في الختمة الجماعية المباركة:\n✨ "${dedicationTitle}" ✨\n\n📊 نسبة الإنجاز الحالية: ${progressPercent}% (${completedCount} أجزاء مكتملة).\n📌 متبقي ${remainingCount} جزء شاغر للحجز.\n\nسارع بحجز جزئك والظفر بالأجر عبر الرابط المباشر:\n${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    setWhatsAppModalConfig({
      isOpen: true,
      title: 'دعوة ومتابعة الختمة الجماعية عبر واتساب',
      message: msg,
      whatsAppUrl: url,
    });
  };

  // Copy standard link
  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      showToast('تم نسخ رابط الختمة إلى الحافظة');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Save Dedication changes
  const handleSaveDedication = () => {
    const trimmedTitle = tempTitleInput.trim() || dedicationTitle;
    const trimmedCreator = tempCreatorInput.trim() || creatorName;
    setDedicationTitle(trimmedTitle);
    setCreatorName(trimmedCreator);
    saveToStorage(parts, trimmedTitle, trimmedCreator, deadlineDays);
    setIsDedicationModalOpen(false);
    showToast('تم تحديث نية الختمة واسم المنشئ بنجاح');
  };

  const filteredParts = parts.filter(p => {
    if (filter === 'available') return p.claimedBy === null;
    if (filter === 'claimed') return p.claimedBy !== null && !p.isCompleted;
    if (filter === 'completed') return p.isCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 py-2.5 px-5 bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dedication Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>الختمات الجماعية والأوقاف الرقمية</span>
              </span>

              {/* Deadline Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
                <Clock className="w-3 h-3" />
                <span>المهلة المقترحة: {deadlineDays} أيام</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-400 fill-rose-400/30 shrink-0" />
              <span>{dedicationTitle}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              أنشئت بواسطة: <strong className="text-emerald-400">{creatorName}</strong> • وقف لوجه الله تعالى يرجى ثوابه لكل من شارك فيه وقرأ آية.
            </p>
          </div>

          {/* Action buttons (Share & WhatsApp) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenWhatsAppBroadcastModal}
              className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
              title="مشاركة تحديث الختمة مع الأهل والأصدقاء عبر واتساب"
            >
              <MessageCircle className="w-4 h-4" />
              <span>دعوة ومتابعة واتساب</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>

        {/* Progress summary bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <span>إنجاز الختمة:</span>
              <strong className="text-emerald-400">{completedCount} أجزاء مكتملة</strong>
              <span>من أصل 30 ({claimedCount} محجوزة)</span>
            </span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-md shadow-emerald-500/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Admin Mode Bar & Controls */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Admin Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              showToast(!isAdminMode ? 'تم تفعيل وضع المشرف: يمكنك الآن إدارة الأجزاء وإعادة ضبطها' : 'تم الخروج من وضع المشرف');
            }}
            className={`py-1.5 px-3 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAdminMode
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isAdminMode ? 'وضع المشرف: مفعّل' : 'دخول وضع المشرف'}</span>
          </button>

          {isAdminMode && (
            <span className="text-slate-400 hidden sm:inline">
              (تستطيع تعديل أي اسم، تحرير أي جزء اعتذر قارئه، أو ضبط المهلة)
            </span>
          )}
        </div>

        {/* Admin specific options */}
        <div className="flex items-center gap-2">
          {isAdminMode && (
            <>
              {/* Set Deadline selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">المهلة:</span>
                <select
                  value={deadlineDays}
                  onChange={(e) => {
                    const days = Number(e.target.value);
                    setDeadlineDays(days);
                    saveToStorage(parts, dedicationTitle, creatorName, days);
                    showToast(`تم تعيين مهلة الختمة إلى ${days} أيام`);
                  }}
                  className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
                >
                  <option value={1} className="bg-slate-900">24 ساعة (يوم الجمعة)</option>
                  <option value={3} className="bg-slate-900">3 أيام</option>
                  <option value={7} className="bg-slate-900">أسبوع كامل</option>
                  <option value={30} className="bg-slate-900">شهر كامل</option>
                </select>
              </div>

              {/* Reset Khatma */}
              <button
                onClick={() => handleOpenConfirmModal('reset-all')}
                className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                title="تفريغ كافة الأجزاء وبدء ختمة جديدة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط الختمة</span>
              </button>
            </>
          )}

          {/* Edit dedication title */}
          <button
            onClick={() => {
              setTempTitleInput(dedicationTitle);
              setTempCreatorInput(creatorName);
              setIsDedicationModalOpen(true);
            }}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>تخصيص النية</span>
          </button>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            جميع الأجزاء (30)
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'available'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الأجزاء المتاحة للحجز ({30 - claimedCount})
          </button>
          <button
            onClick={() => setFilter('claimed')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'claimed'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            قيد القراءة والتلاوة ({claimedCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الأجزاء المكتملة ({completedCount})
          </button>
        </div>
      </div>

      {/* 30 Ajza' Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {filteredParts.map((part) => {
          const isEditingThis = editingJuz === part.juzNumber;

          return (
            <div
              key={part.juzNumber}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                part.isCompleted
                  ? 'bg-emerald-950/30 border-emerald-600/40'
                  : part.claimedBy
                  ? 'bg-slate-900 border-amber-600/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Part Title and Status badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white text-sm">{part.juzName}</span>
                  {part.isCompleted ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      مكتمل
                    </span>
                  ) : part.claimedBy ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      محجوز
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      متاح
                    </span>
                  )}
                </div>

                {/* Surahs covered description */}
                <p className="text-[10px] text-slate-400 leading-tight mb-2.5">
                  {part.surahsCovered}
                </p>

                {/* Reader Name or Claim Prompt */}
                <div className="text-xs text-slate-300 min-h-[3.2rem]">
                  {part.claimedBy ? (
                    <div>
                      {isEditingThis ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="text"
                            value={editingNameInput}
                            onChange={(e) => setEditingNameInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditName(part.juzNumber);
                              if (e.key === 'Escape') setEditingJuz(null);
                            }}
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                            placeholder="الاسم الجديد..."
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEditName(part.juzNumber)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                            title="حفظ (Enter)"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingJuz(null)}
                            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                            title="إلغاء (Esc)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">القارئ:</span>
                            {/* Action to edit name */}
                            <button
                              onClick={() => handleStartEditName(part.juzNumber, part.claimedBy || '')}
                              className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-0.5 cursor-pointer"
                              title="تعديل اسم القارئ"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>
                          </div>

                          <div className="font-bold text-white text-xs truncate">
                            {part.claimedBy}
                          </div>

                          {/* Self withdrawal / apologize button & WhatsApp Reminder */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => handleOpenConfirmModal('withdraw', part.juzNumber)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                              title="في حال طرأ ظرف وترغب بالاعتذار عن القراءة"
                            >
                              <UserMinus className="w-3 h-3" />
                              <span>اعتذار وانسحاب</span>
                            </button>

                            {/* WhatsApp Reminder (when late and not completed) */}
                            {!part.isCompleted && (
                              <button
                                onClick={() => handleOpenWhatsAppReminderModal(part)}
                                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                                title="إرسال رسالة تذكير لطيفة عبر واتساب"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>تذكير</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 block pt-1">
                      سارع بحجز هذا الجزء والتلاوة بنية الختمة
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-2.5 border-t border-slate-800/80 flex flex-col gap-1.5">
                {part.claimedBy ? (
                  <>
                    <button
                      onClick={() => handleToggleComplete(part.juzNumber)}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        part.isCompleted
                          ? 'bg-emerald-800/40 text-emerald-300 hover:bg-emerald-800/60'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{part.isCompleted ? 'إلغاء الإتمام' : 'تأكيد إتمام القراءة'}</span>
                    </button>

                    {/* Admin Force Release button */}
                    {isAdminMode && (
                      <button
                        onClick={() => handleOpenConfirmModal('admin-release', part.juzNumber)}
                        className="w-full py-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors cursor-pointer"
                      >
                        [إجراء المشرف: إخلاء الجزء وإعادة طرحه]
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleOpenClaimModal(part.juzNumber)}
                    className="w-full py-2 px-2 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 hover:text-white text-emerald-300 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    احجز هذا الجزء الآن
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- IN-APP MODALS (100% Iframe-Safe, No prompt/confirm/alert) --- */}

      {/* 1. Claim Part In-App Modal */}
      {claimModalJuz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-base text-white">حجز الجزء {claimModalJuz} للقراءة</h3>
              </div>
              <button
                onClick={() => setClaimModalJuz(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يشمل هذا الجزء المبارك: <strong className="text-emerald-300">{DEFAULT_JUZ_SURAS[claimModalJuz]}</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                أدخل اسمك الكريم (أو كنيتك):
              </label>
              <input
                type="text"
                value={claimNameInput}
                onChange={(e) => setClaimNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmClaim()}
                placeholder="مثال: عبد الله بن أحمد / أم عبد الرحمن"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white outline-none"
                autoFocus
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setClaimModalJuz(null)}
                className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmClaim}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد الحجز ونيل الأجر</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Confirmation Modal (Replaces window.confirm) */}
      {confirmModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{confirmModalConfig.title}</h3>
                <p className="text-xs text-slate-400">تأكيد الإجراء</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              {confirmModalConfig.message}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                تراجع
              </button>
              <button
                onClick={handleExecuteConfirm}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-900/30"
              >
                نعم، تأكيد الإجراء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Customize Dedication Modal (Replaces window.prompt) */}
      {isDedicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Heart className="w-5 h-5 text-rose-400" />
                <h3 className="text-base text-white">تخصيص نية الختمة واسم المنشئ</h3>
              </div>
              <button
                onClick={() => setIsDedicationModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  نية الختمة المباركة (مثال: صدقة جارية، شفاء مريض، ورد عائلي):
                </label>
                <input
                  type="text"
                  value={tempTitleInput}
                  onChange={(e) => setTempTitleInput(e.target.value)}
                  placeholder="أدخل عنوان أو نية الختمة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  اسم منشئ الختمة أو المشرف:
                </label>
                <input
                  type="text"
                  value={tempCreatorInput}
                  onChange={(e) => setTempCreatorInput(e.target.value)}
                  placeholder="فاعل خير..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDedicationModalOpen(false)}
                className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveDedication}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WhatsApp Message & Share Modal (Replaces window.open with safe <a> & copy) */}
      {whatsAppModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-base text-white">{whatsAppModalConfig.title}</h3>
              </div>
              <button
                onClick={() => setWhatsAppModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              نص الرسالة المجهز للإرسال مباشرة إلى جهات الاتصال أو مجموعات واتساب العائلية:
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {whatsAppModalConfig.message}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                onClick={async () => {
                  const copied = await copyToClipboard(whatsAppModalConfig.message);
                  if (copied) {
                    showToast('تم نسخ نص الرسالة إلى الحافظة بنجاح!');
                  }
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>نسخ نص الرسالة</span>
              </button>

              <a
                href={whatsAppModalConfig.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWhatsAppModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all text-center"
              >
                <ExternalLink className="w-4 h-4" />
                <span>فتح في واتساب الآن</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
