import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Compass, Lightbulb, PenLine, Bookmark, Check, Share2, Volume2 } from 'lucide-react';
import { Ayah } from '../data/quranService';

interface TadabburModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surahName: string;
  onSaveJournalNote: (note: { ayahId: number; text: string; date: string }) => void;
  savedNote?: string;
  onPlayAyah?: (ayahNumber: number) => void;
  onOpenShareModal?: (ayah: Ayah) => void;
}

export const TadabburModal: React.FC<TadabburModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surahName,
  onSaveJournalNote,
  savedNote = '',
  onPlayAyah,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tafsir' | 'tadabbur' | 'irab' | 'journal'>('tadabbur');
  const [journalInput, setJournalInput] = useState(savedNote);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Sync journalInput if savedNote changes
  React.useEffect(() => {
    setJournalInput(savedNote);
  }, [savedNote, ayah]);

  if (!isOpen || !ayah) return null;

  const handleSaveNote = () => {
    onSaveJournalNote({
      ayahId: ayah.overallNumber,
      text: journalInput,
      date: new Date().toLocaleDateString('ar-SA')
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-emerald-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header with Ayah Badge */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>سورة {surahName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  الآية {ayah.numberInSurah}
                </span>
              </h3>
              <p className="text-xs text-slate-400">مساعد الفهم العميق والتدبر العملي والتفسير</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onPlayAyah && (
              <button
                onClick={() => onPlayAyah(ayah.numberInSurah)}
                title="استماع للآية"
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
            {onOpenShareModal && (
              <button
                onClick={() => onOpenShareModal(ayah)}
                title="مشاركة كبطاقة"
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlighted Ayah Banner */}
        <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 text-center">
          <p className="font-quran text-xl sm:text-2xl text-emerald-100 leading-loose">
            ﴿ {ayah.text} ﴾
          </p>
          <div className="mt-2 text-xs text-slate-500 flex justify-center gap-4">
            <span>الجزء {ayah.juz}</span>
            <span>•</span>
            <span>الصفحة {ayah.page}</span>
            <span>•</span>
            <span>الحزب {Math.ceil(ayah.hizbQuarter / 4)}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'tadabbur', label: 'مساعد التدبر والعمل', icon: Sparkles },
            { id: 'tafsir', label: 'التفسير الميسر', icon: BookOpen },
            { id: 'irab', label: 'الإعراب والغريب', icon: Compass },
            { id: 'journal', label: 'مفكرتي الخاصة', icon: PenLine },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'tadabbur' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Rhetorical Question */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-950/20 border border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>سؤال التدبر واللمحة البلاغية</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {ayah.reflectionQuestion}
                </p>
              </div>

              {/* Practical Action */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-950/20 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>الواجب العملي المعاش (كيف أطبق الآية اليوم؟)</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {ayah.practicalAction}
                </p>
              </div>

              {/* Asbab al-Nuzul if available */}
              {ayah.asbabNuzul && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block mb-1">سبب النزول ومقصد السورة:</span>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {ayah.asbabNuzul}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tafsir' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>التفسير الميسر (مجمع الملك فهد لطباعة المصحف الشريف)</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {ayah.tafsir}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'irab' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-2">
                  <Compass className="w-4 h-4" />
                  <span>اللمحة النحوية والإعراب</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {ayah.irabHint}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  خواطري وتأملاتي الخاصة حول هذه الآية (مشفرة ومحفوظة على جهازك):
                </label>
                <textarea
                  rows={5}
                  value={journalInput}
                  onChange={(e) => setJournalInput(e.target.value)}
                  placeholder="سجل هنا ما لامس قلبك من معانٍ، موقفاً حياتياً ذكرتك به الآية، أو عهداً تقطعه على نفسك..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 text-sm placeholder:text-slate-600 resize-none outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleSaveNote}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <PenLine className="w-4 h-4" />
                  <span>حفظ في مفكرتي</span>
                </button>

                {isSavedAlert && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Check className="w-4 h-4" />
                    تم الحفظ بنجاح في المفكرة
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs text-slate-500">
          <span>بيان • وقف لوجه الله تعالى</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
