import React, { useState } from 'react';
import { Ayah } from '../data/quranService';
import { Eye, EyeOff, RotateCcw, CheckCircle2, Award, ChevronLeft, ChevronRight, Shuffle, Volume2, Sparkles } from 'lucide-react';

interface MemorizationModeProps {
  ayahs: Ayah[];
  surahName: string;
  onClose: () => void;
  onPlayAyah: (ayahNum: number) => void;
}

type HidePattern = 'first-word-only' | 'alternate-words' | 'all-blank';

export const MemorizationMode: React.FC<MemorizationModeProps> = ({
  ayahs,
  surahName,
  onClose,
  onPlayAyah,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hidePattern, setHidePattern] = useState<HidePattern>('first-word-only');
  const [revealedWordIndices, setRevealedWordIndices] = useState<Set<number>>(new Set());
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [spacedRepetitionStatus, setSpacedRepetitionStatus] = useState<Record<number, 'needs-review' | 'good' | 'mastered'>>({});

  const currentAyah = ayahs[currentIdx] || ayahs[0];
  const words = currentAyah ? currentAyah.text.split(' ') : [];

  // Reset revealed words when changing ayah or pattern
  const handleNextAyah = () => {
    if (currentIdx < ayahs.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setRevealedWordIndices(new Set());
      setCurrentRepeat(1);
    }
  };

  const handlePrevAyah = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setRevealedWordIndices(new Set());
      setCurrentRepeat(1);
    }
  };

  const toggleRevealWord = (index: number) => {
    const updated = new Set(revealedWordIndices);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setRevealedWordIndices(updated);
  };

  const revealAll = () => {
    const all = new Set(words.map((_, i) => i));
    setRevealedWordIndices(all);
  };

  const hideAll = () => {
    setRevealedWordIndices(new Set());
  };

  const setAyahMastery = (status: 'needs-review' | 'good' | 'mastered') => {
    setSpacedRepetitionStatus(prev => ({
      ...prev,
      [currentAyah.numberInSurah]: status
    }));
    // move to next ayah
    if (currentIdx < ayahs.length - 1) {
      handleNextAyah();
    }
  };

  // Determine if a word should be hidden according to pattern
  const isWordHidden = (index: number) => {
    if (revealedWordIndices.has(index)) return false; // user clicked to reveal
    if (hidePattern === 'all-blank') return true;
    if (hidePattern === 'first-word-only') {
      return index > 0; // show first word only as hint
    }
    if (hidePattern === 'alternate-words') {
      return index % 2 === 1; // hide odd index words
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-800/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>حلقة التسميع وتثبيت الحفظ</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  سورة {surahName}
                </span>
              </h2>
              <p className="text-xs text-slate-400">اختبر استحضارك للآيات بالتدريج والتكرار المتباعد</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            خروج من وضع الحفظ
          </button>
        </div>

        {/* Toolbar & Pattern Selector */}
        <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Pattern Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 ml-1">نمط الإخفاء:</span>
            {[
              { id: 'first-word-only', label: 'مطلع الآية فقط' },
              { id: 'alternate-words', label: 'كلمة بعد كلمة' },
              { id: 'all-blank', label: 'حجب كامل الآية' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setHidePattern(p.id as HidePattern);
                  setRevealedWordIndices(new Set());
                }}
                className={`py-1.5 px-2.5 rounded-lg font-medium transition-all ${
                  hidePattern === p.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick Reveal / Hide All */}
          <div className="flex items-center gap-2">
            <button
              onClick={revealAll}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>كشف الكل</span>
            </button>
            <button
              onClick={hideAll}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span>حجب مجدداً</span>
            </button>
          </div>
        </div>

        {/* Main Testing Canvas */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col items-center justify-center min-h-[260px] text-center select-none bg-radial from-slate-900 to-slate-950">
          <div className="text-xs text-emerald-400/80 mb-3 font-semibold">
            الآية {currentAyah.numberInSurah} من {ayahs.length}
          </div>

          {/* Interactive Words Flow */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 font-quran text-2xl sm:text-3xl text-slate-100 max-w-2xl leading-relaxed">
            {words.map((word, idx) => {
              const hidden = isWordHidden(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleRevealWord(idx)}
                  className={`transition-all duration-200 rounded px-2 py-0.5 relative group ${
                    hidden
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-transparent hover:border-emerald-400 shadow-inner min-w-[3.5rem] cursor-pointer'
                      : 'hover:bg-emerald-500/10 cursor-pointer'
                  }`}
                  title={hidden ? 'انقر لكشف الكلمة' : 'انقر لإخفاء الكلمة'}
                >
                  <span className={hidden ? 'opacity-0 select-none' : 'opacity-100'}>
                    {word}
                  </span>
                  {hidden && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-sans text-emerald-400/50 group-hover:text-emerald-300">
                      ؟
                    </span>
                  )}
                </button>
              );
            })}
            <span className="text-emerald-400 font-sans text-lg font-bold">
              ﴿{currentAyah.numberInSurah}﴾
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            💡 نصيحة: انقر على أي كلمة مخفية لكشفها عند التعثر للتأكد من حفظك
          </p>
        </div>

        {/* Repetition & Spaced Repetition Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Audio helper & Repeat count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlayAyah(currentAyah.numberInSurah)}
              className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="استمع لتلاوة الآية"
            >
              <Volume2 className="w-4 h-4" />
              <span>استماع</span>
            </button>

            {/* Repeat Counter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>التكرار:</span>
              <button
                onClick={() => setCurrentRepeat(prev => Math.min(prev + 1, repeatCount))}
                className="font-bold text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded"
              >
                {currentRepeat} / {repeatCount}
              </button>
            </div>
          </div>

          {/* Spaced Repetition Self-Assessment */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 ml-1">تقييم الحفظ:</span>
            <button
              onClick={() => setAyahMastery('needs-review')}
              className="py-1.5 px-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-medium transition-colors"
            >
              يحتاج تثبيت (غداً)
            </button>
            <button
              onClick={() => setAyahMastery('good')}
              className="py-1.5 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-medium transition-colors"
            >
              جيد (بعد 3 أيام)
            </button>
            <button
              onClick={() => setAyahMastery('mastered')}
              className="py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-medium transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>متقن (أسبوعي)</span>
            </button>
          </div>

          {/* Ayah Steppers */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevAyah}
              disabled={currentIdx === 0}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextAyah}
              disabled={currentIdx === ayahs.length - 1}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
