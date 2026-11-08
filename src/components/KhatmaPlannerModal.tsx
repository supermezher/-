import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, Check, BookOpen, Flame, Compass } from 'lucide-react';

interface KhatmaPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (plan: { targetDays: number; pagesPerDay: number; pagesPerPrayer: number }) => void;
}

export const KhatmaPlannerModal: React.FC<KhatmaPlannerModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(30); // default 1 month
  const [availableTime, setAvailableTime] = useState<number>(20); // 20 mins/day

  if (!isOpen) return null;

  // 604 total pages in standard Medina Mushaf
  const pagesPerDay = Math.ceil(604 / selectedDays);
  const pagesPerPrayer = Math.ceil(pagesPerDay / 5);

  const handleSave = () => {
    onApplyPlan({
      targetDays: selectedDays,
      pagesPerDay,
      pagesPerPrayer,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-800/40 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base sm:text-lg text-white">مخطط الورد والختمة الذكية</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          نظام مرن يوزع قراءتك بهدوء دون مشقة، ويتكيف مع جدول انشغالك اليومي لتنال أجر الختم المبارك:
        </p>

        {/* Question 1: Target Khatma Duration */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            1. متى تود إتمام الختمة المباركة؟
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { days: 10, label: '10 أيام (مكثف)' },
              { days: 30, label: 'شهر واحد (المعتاد)' },
              { days: 60, label: 'شهرين (متوسط)' },
              { days: 90, label: '3 أشهر (ميسر)' },
            ].map((d) => (
              <button
                key={d.days}
                onClick={() => setSelectedDays(d.days)}
                className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all text-center ${
                  selectedDays === d.days
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Plan Preview */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold">خطة وردك اليومي المقترحة:</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold">
              {pagesPerDay} صفحات يومياً
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">التقسيم بعد كل فريضة</span>
              <strong className="text-base text-white">{pagesPerPrayer} صفحات</strong>
              <span className="text-[10px] text-slate-500 block">(بعد كل صلاة من الصلوات الـ 5)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">الوقت التقريبي</span>
              <strong className="text-base text-white">~{Math.round(pagesPerDay * 1.5)} دقيقة</strong>
              <span className="text-[10px] text-slate-500 block">قراءة متأنية مع تدبر</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed text-center pt-1">
            قال النبي ﷺ: «قاربوا وسددوا، واعلموا أنه لن ينجو أحد منكم بعمله، وأن أحب الأعمال إلى الله أدومها وإن قل».
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>اعتماد هذه الخطة للورد اليومي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
