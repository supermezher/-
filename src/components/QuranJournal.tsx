import React, { useState } from 'react';
import { PenLine, Search, Trash2, Download, ShieldCheck, Calendar, Sparkles, BookOpen } from 'lucide-react';

export interface JournalNote {
  ayahId: number;
  surahName?: string;
  ayahNumber?: number;
  text: string;
  date: string;
}

interface QuranJournalProps {
  notes: JournalNote[];
  onDeleteNote: (ayahId: number) => void;
  onNavigateToAyah?: (surahNumber: number, ayahNumber: number) => void;
}

export const QuranJournal: React.FC<QuranJournalProps> = ({
  notes,
  onDeleteNote,
  onNavigateToAyah,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(n =>
    n.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.surahName && n.surahName.includes(searchTerm))
  );

  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Bayan_Quran_Journal_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2">
            <PenLine className="w-3.5 h-3.5" />
            <span>مفكرة التدبر الشخصية والخواطر</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            خواطرك ومواقفك مع كتاب الله
          </h2>
          <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>مساحة خاصة مشفرة محلياً على جهازك - خصوصية تامة دون حفظ في أي خادم خارجي</span>
          </div>
        </div>

        {notes.length > 0 && (
          <button
            onClick={handleExportJournal}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية (Backup)</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث في خواطرك أو باسم السورة..."
          className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
        />
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <PenLine className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-300">لا توجد خواطر مسجلة بعد</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            أثناء قراءتك في المصحف، انقر على أي آية واختر "مفكرتي الخاصة" لتسجيل ما يلهمك الله به من تدبر.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.ayahId}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                      {note.surahName ? `سورة ${note.surahName}` : `الآية ${note.ayahId}`}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {note.date}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.ayahId)}
                    title="حذف الخاطرة"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {note.text}
                </p>
              </div>

              {note.surahName && onNavigateToAyah && (
                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => onNavigateToAyah(1, 1)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>مراجعة الآية في المصحف</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
