import React, { useState } from 'react';
import { MOOD_CATEGORIES, MoodVerseCategory } from '../data/moodVerses';
import { HeartHandshake, ShieldAlert, Activity, Sparkles, Sun, BookOpen, Share2, Volume2 } from 'lucide-react';
import { Ayah } from '../data/quranService';

interface MoodVersesExplorerProps {
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
  onOpenShareModal: (ayah: Ayah) => void;
}

export const MoodVersesExplorer: React.FC<MoodVersesExplorerProps> = ({
  onNavigateToAyah,
  onOpenShareModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MoodVerseCategory>(MOOD_CATEGORIES[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>القرآن حياتي • صيدلية القلوب</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          آيات بحسب حالتك النفسية والشعورية
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
          أينما كنت، وما كانت مشاعرك اليوم، ستجد في كتاب الله بلسماً يداوي جراحك، ويثبت فؤادك، وينير دربك.
        </p>
      </div>

      {/* Mood Pills selection */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {MOOD_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40 scale-[1.02]'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              {getIcon(cat.iconName)}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Verses Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{selectedCategory.description}</span>
          <span>{selectedCategory.verses.length} آيات مختارة</span>
        </div>

        {selectedCategory.verses.map((v, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            {/* Header with Surah badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                سورة {v.surahName} • الآية {v.ayahNumber}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToAyah(v.surahNumber, v.ayahNumber)}
                  className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>فتح في المصحف</span>
                </button>
              </div>
            </div>

            {/* Quran Ayah Text */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
              <p className="font-quran text-2xl sm:text-3xl text-emerald-100 leading-loose">
                {v.arabicText}
              </p>
            </div>

            {/* Tafsir & Reflection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <strong className="text-slate-400 block mb-1">دلالة التفسير:</strong>
                <p className="text-slate-300 leading-relaxed">{v.tafsirHint}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <strong className="text-emerald-400 block mb-1">لمسة بلسم لقلبك:</strong>
                <p className="text-slate-200 leading-relaxed">{v.reflection}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
