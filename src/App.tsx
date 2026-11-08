import React, { useState, useEffect } from 'react';
import {
  BookOpen, Sparkles, Award, Heart, Calendar, HelpCircle,
  PenLine, Cpu, Search, ChevronDown, Check, Volume2, Share2,
  SlidersHorizontal, ShieldCheck, Flame, Compass
} from 'lucide-react';
import { SURAHS_LIST, SurahMeta } from './data/quranMetadata';
import { SurahData, Ayah, getSurahData } from './data/quranService';
import { QuranReader } from './components/QuranReader';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { TadabburModal } from './components/TadabburModal';
import { SocialShareModal } from './components/SocialShareModal';
import { MemorizationMode } from './components/MemorizationMode';
import { FaithAnalytics } from './components/FaithAnalytics';
import { CollectiveKhatma } from './components/CollectiveKhatma';
import { TajweedEncyclopedia } from './components/TajweedEncyclopedia';
import { MoodVersesExplorer } from './components/MoodVersesExplorer';
import { QuranJournal, JournalNote } from './components/QuranJournal';
import { FlutterArchitectureDoc } from './components/FlutterArchitectureDoc';
import { TajweedLegendModal } from './components/TajweedLegendModal';
import { KhatmaPlannerModal } from './components/KhatmaPlannerModal';
import { AmbientAudioBar } from './components/AmbientAudioBar';

type ActiveView =
  | 'mushaf'
  | 'memorization'
  | 'mood'
  | 'analytics'
  | 'khatma'
  | 'tajweed'
  | 'journal'
  | 'flutter-arch';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('mushaf');
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [activeAyahNumber, setActiveAyahNumber] = useState<number>(1);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(true);

  // Audio & Tajweed state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(1);
  const [isTajweedActive, setIsTajweedActive] = useState<boolean>(true);
  const [isSmartScrollActive, setIsSmartScrollActive] = useState<boolean>(true);

  // Modals state
  const [tadabburAyah, setTadabburAyah] = useState<Ayah | null>(null);
  const [shareAyah, setShareAyah] = useState<Ayah | null>(null);
  const [isTajweedLegendOpen, setIsTajweedLegendOpen] = useState<boolean>(false);
  const [isKhatmaPlannerOpen, setIsKhatmaPlannerOpen] = useState<boolean>(false);
  const [isSurahPickerOpen, setIsSurahPickerOpen] = useState<boolean>(false);
  const [surahSearchTerm, setSurahSearchTerm] = useState<string>('');

  // Journal notes stored locally
  const [journalNotes, setJournalNotes] = useState<JournalNote[]>(() => {
    const saved = localStorage.getItem('bayan_journal_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        ayahId: 1,
        surahName: 'الفاتحة',
        ayahNumber: 1,
        text: 'استحضار البسملة في بداية كل أمر يطرد التشتت ويبارك في كل دقيقة من يومي.',
        date: '2026-11-08'
      }
    ];
  });

  // Load Surah data when number changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingSurah(true);

    getSurahData(currentSurahNumber).then((data) => {
      if (!isCancelled) {
        setSurahData(data);
        setActiveAyahNumber(1);
        setIsLoadingSurah(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentSurahNumber]);

  // Handle saving journal note
  const handleSaveJournalNote = (note: { ayahId: number; text: string; date: string }) => {
    const updated = [
      {
        ayahId: note.ayahId,
        surahName: surahData?.meta.name,
        ayahNumber: tadabburAyah?.numberInSurah,
        text: note.text,
        date: note.date
      },
      ...journalNotes.filter(n => n.ayahId !== note.ayahId)
    ];
    setJournalNotes(updated);
    localStorage.setItem('bayan_journal_notes', JSON.stringify(updated));
  };

  const handleDeleteJournalNote = (ayahId: number) => {
    const updated = journalNotes.filter(n => n.ayahId !== ayahId);
    setJournalNotes(updated);
    localStorage.setItem('bayan_journal_notes', JSON.stringify(updated));
  };

  const handleNavigateToAyah = (surahNum: number, ayahNum: number) => {
    setCurrentSurahNumber(surahNum);
    setActiveAyahNumber(ayahNum);
    setActiveView('mushaf');
  };

  const handlePlayAyahAudio = (ayahNum: number) => {
    setActiveAyahNumber(ayahNum);
    setIsPlayingAudio(true);
  };

  const filteredSurahs = SURAHS_LIST.filter(s =>
    s.name.includes(surahSearchTerm) ||
    s.englishName.toLowerCase().includes(surahSearchTerm.toLowerCase()) ||
    String(s.number) === surahSearchTerm ||
    String(s.juzNumber) === surahSearchTerm
  );

  return (
    <div className="min-h-screen bg-[#0b1117] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#090f14]/95 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Waqf Title */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveView('mushaf')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950 font-bold text-xl font-kufi group-hover:scale-105 transition-transform">
                ب
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg text-white font-kufi flex items-center gap-2">
                  <span>بَيَان</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans font-medium">
                    وقف خيري
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  المصحف الرقمي الذكي بالرسم العثماني
                </div>
              </div>
            </div>

            {/* Quick Surah selector button */}
            {activeView === 'mushaf' && surahData && (
              <button
                onClick={() => setIsSurahPickerOpen(true)}
                className="mr-3 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>سورة {surahData.meta.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80">
            {[
              { id: 'mushaf', label: 'المصحف الشريف', icon: BookOpen },
              { id: 'memorization', label: 'حلقة الحفظ', icon: Award },
              { id: 'mood', label: 'القرآن حياتي', icon: Heart },
              { id: 'analytics', label: 'سجل الختمات', icon: Calendar },
              { id: 'khatma', label: 'الختمات الجماعية', icon: Sparkles },
              { id: 'tajweed', label: 'موسوعة التجويد', icon: HelpCircle },
              { id: 'journal', label: 'مفكرتي', icon: PenLine },
              { id: 'flutter-arch', label: 'هندسة Flutter', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as ActiveView)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Helpers */}
          <div className="flex items-center gap-2">
            <AmbientAudioBar />
            
            <button
              onClick={() => setIsKhatmaPlannerOpen(true)}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              title="مخطط الورد والختمة الذكية"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>مخطط الورد</span>
            </button>
          </div>

        </div>

        {/* Mobile Horizontal Sub-menu */}
        <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-t border-slate-800/60 overflow-x-auto scrollbar-none bg-slate-950/60">
          {[
            { id: 'mushaf', label: 'المصحف', icon: BookOpen },
            { id: 'memorization', label: 'الحفظ', icon: Award },
            { id: 'mood', label: 'بحسب الحال', icon: Heart },
            { id: 'analytics', label: 'الإحصاءات', icon: Calendar },
            { id: 'khatma', label: 'الختمات', icon: Sparkles },
            { id: 'tajweed', label: 'التجويد', icon: HelpCircle },
            { id: 'journal', label: 'مفكرتي', icon: PenLine },
            { id: 'flutter-arch', label: 'هندسة Flutter', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as ActiveView)}
                className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-28">
        {activeView === 'mushaf' && (
          <div>
            {isLoadingSurah || !surahData ? (
              <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-xs text-slate-400 font-medium">جارٍ تحميل آيات السورة الكريمة بالرسم العثماني المعتمد...</p>
              </div>
            ) : (
              <QuranReader
                surahData={surahData}
                activeAyahNumber={activeAyahNumber}
                onSelectAyah={(a) => setActiveAyahNumber(a.numberInSurah)}
                onAyahAudioSelect={handlePlayAyahAudio}
                onOpenShareModal={(a) => setShareAyah(a)}
                onOpenTadabburModal={(a) => setTadabburAyah(a)}
                isTajweedActive={isTajweedActive}
                onToggleTajweed={() => setIsTajweedActive(!isTajweedActive)}
                isSmartScrollActive={isSmartScrollActive}
                onToggleSmartScroll={() => setIsSmartScrollActive(!isSmartScrollActive)}
                onOpenTajweedLegend={() => setIsTajweedLegendOpen(true)}
                isPlayingAudio={isPlayingAudio}
                currentTime={audioCurrentTime}
                duration={audioDuration}
              />
            )}
          </div>
        )}

        {activeView === 'memorization' && surahData && (
          <MemorizationMode
            ayahs={surahData.ayahs}
            surahName={surahData.meta.name}
            onClose={() => setActiveView('mushaf')}
            onPlayAyah={handlePlayAyahAudio}
          />
        )}

        {activeView === 'mood' && (
          <MoodVersesExplorer
            onNavigateToAyah={handleNavigateToAyah}
            onOpenShareModal={(a) => setShareAyah(a)}
          />
        )}

        {activeView === 'analytics' && (
          <FaithAnalytics />
        )}

        {activeView === 'khatma' && (
          <CollectiveKhatma />
        )}

        {activeView === 'tajweed' && (
          <TajweedEncyclopedia />
        )}

        {activeView === 'journal' && (
          <QuranJournal
            notes={journalNotes}
            onDeleteNote={handleDeleteJournalNote}
            onNavigateToAyah={handleNavigateToAyah}
          />
        )}

        {activeView === 'flutter-arch' && (
          <FlutterArchitectureDoc />
        )}
      </main>

      {/* Floating Audio Player Bar (when on Mushaf view or playing) */}
      {surahData && (
        <AudioPlayerBar
          surahNumber={surahData.meta.number}
          surahName={surahData.meta.name}
          totalAyahs={surahData.meta.numberOfAyahs}
          currentAyahNumber={activeAyahNumber}
          onAyahChange={(num) => {
            setActiveAyahNumber(num);
            setAudioCurrentTime(0);
          }}
          isPlaying={isPlayingAudio}
          onPlayPauseToggle={(playing) => setIsPlayingAudio(playing)}
          isSmartScrollEnabled={isSmartScrollActive}
          onToggleSmartScroll={() => setIsSmartScrollActive(!isSmartScrollActive)}
          onPlaybackProgress={(cur, dur) => {
            setAudioCurrentTime(cur);
            setAudioDuration(dur);
          }}
        />
      )}

      {/* Surah Picker Modal */}
      {isSurahPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>اختر السورة الكريمة (114 سورة)</span>
              </h3>
              <button
                onClick={() => setIsSurahPickerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-slate-800 bg-slate-900">
              <div className="relative">
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={surahSearchTerm}
                  onChange={(e) => setSurahSearchTerm(e.target.value)}
                  placeholder="ابحث باسم السورة، رقمها، أو الجزء..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredSurahs.map((s) => {
                const isSelected = s.number === currentSurahNumber;
                return (
                  <button
                    key={s.number}
                    onClick={() => {
                      setCurrentSurahNumber(s.number);
                      setIsSurahPickerOpen(false);
                      setSurahSearchTerm('');
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-800/80 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {s.number}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-white">سورة {s.name}</div>
                        <div className="text-[10px] text-slate-400">{s.revelationTypeAr} • {s.numberOfAyahs} آيات</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">جـ{s.juzNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tadabbur & Tafsir Modal */}
      <TadabburModal
        isOpen={Boolean(tadabburAyah)}
        onClose={() => setTadabburAyah(null)}
        ayah={tadabburAyah}
        surahName={surahData?.meta.name || ''}
        onSaveJournalNote={handleSaveJournalNote}
        savedNote={journalNotes.find(n => n.ayahId === tadabburAyah?.overallNumber)?.text || ''}
        onPlayAyah={(num) => {
          setActiveAyahNumber(num);
          setIsPlayingAudio(true);
        }}
        onOpenShareModal={(a) => {
          setTadabburAyah(null);
          setShareAyah(a);
        }}
      />

      {/* Social Share Card Generator Modal */}
      <SocialShareModal
        isOpen={Boolean(shareAyah)}
        onClose={() => setShareAyah(null)}
        ayah={shareAyah}
        surahName={surahData?.meta.name || ''}
      />

      {/* Tajweed Legend Modal */}
      <TajweedLegendModal
        isOpen={isTajweedLegendOpen}
        onClose={() => setIsTajweedLegendOpen(false)}
      />

      {/* Khatma Planner Modal */}
      <KhatmaPlannerModal
        isOpen={isKhatmaPlannerOpen}
        onClose={() => setIsKhatmaPlannerOpen(false)}
        onApplyPlan={() => {
          // Success toast or confirmation
        }}
      />

    </div>
  );
}
