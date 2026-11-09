import React, { useState, useEffect, useRef } from 'react';
import { SurahData, Ayah } from '../data/quranService';
import { renderTajweedText } from '../utils/tajweedParser';
import {
  BookOpen, Sparkles, Eye, Share2, Columns, Smartphone,
  ZoomIn, ZoomOut, Palette, Maximize2, Minimize2,
  Bookmark, ChevronLeft, ChevronRight, HelpCircle,
  ChevronsDown, Play, Pause, X, ArrowDown, Radio, Hand
} from 'lucide-react';

interface QuranReaderProps {
  surahData: SurahData;
  activeAyahNumber: number;
  onSelectAyah: (ayah: Ayah) => void;
  onAyahAudioSelect?: (ayahNumber: number) => void;
  onOpenShareModal: (ayah: Ayah) => void;
  onOpenTadabburModal: (ayah: Ayah) => void;
  isTajweedActive: boolean;
  onToggleTajweed: () => void;
  isSmartScrollActive: boolean;
  onToggleSmartScroll?: () => void;
  onOpenTajweedLegend: () => void;
  isPlayingAudio?: boolean;
  currentTime?: number;
  duration?: number;
}

type ReaderTheme = 'dark' | 'sepia' | 'emerald' | 'high-contrast';

export const QuranReader: React.FC<QuranReaderProps> = ({
  surahData,
  activeAyahNumber,
  onSelectAyah,
  onAyahAudioSelect,
  onOpenShareModal,
  onOpenTadabburModal,
  isTajweedActive,
  onToggleTajweed,
  isSmartScrollActive,
  onToggleSmartScroll,
  onOpenTajweedLegend,
  isPlayingAudio,
  currentTime,
  duration,
}) => {
  const [fontSize, setFontSize] = useState<number>(28);
  const [isDualPage, setIsDualPage] = useState<boolean>(false);
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [bookmarkedAyah, setBookmarkedAyah] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLElement | null>>({});

  // Unified Auto-Scroll Engine state (Dual-Mode: Reciter-Adaptive Sync OR Manual Self-Reading)
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState<boolean>(false);
  const [scrollMode, setScrollMode] = useState<'reciter-sync' | 'manual-speed'>('reciter-sync');
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(2); // 1 to 5
  const [pauseAtAyahEnds, setPauseAtAyahEnds] = useState<boolean>(false); // Continuous smooth scrolling without stopping at ayah ends
  const [isPausedAtAyah, setIsPausedAtAyah] = useState<boolean>(false);
  const [pausedAyahNumber, setPausedAyahNumber] = useState<number | null>(null);
  const pausedAyahsHistory = useRef<Set<number>>(new Set());

  // Subpixel floating accumulator for smooth scrolling at all speeds (1x to 5x)
  const preciseScrollTop = useRef<number>(0);
  const isTouchActive = useRef<boolean>(false);

  // Touch & Gesture Guard (stops scroller from fighting user's thumb or mouse wheel)
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize precise scroll accumulator whenever container, surah, or mode changes
  useEffect(() => {
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }
  }, [surahData.meta.number, isAutoScrolling, autoScrollSpeed]);

  // Touch & Gesture Handlers: full manual control up & down without fighting
  const handleTouchStart = () => {
    isTouchActive.current = true;
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }
  };

  const handleTouchMove = () => {
    isTouchActive.current = true;
    setIsUserInteracting(true);
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }
  };

  const handleTouchEnd = () => {
    isTouchActive.current = false;
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }
    // Give user 2.2 seconds grace period to read where they manually scrolled
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      if (containerRef.current) {
        preciseScrollTop.current = containerRef.current.scrollTop;
      }
    }, 2200);
  };

  const handleWheel = () => {
    setIsUserInteracting(true);
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      if (containerRef.current) {
        preciseScrollTop.current = containerRef.current.scrollTop;
      }
    }, 2200);
  };

  const handleContainerScroll = () => {
    // When user scrolls manually with touch or scrollbar, sync precise accumulator
    if (isTouchActive.current || isUserInteracting) {
      if (containerRef.current) {
        preciseScrollTop.current = containerRef.current.scrollTop;
      }
    }
  };

  // Clear paused history when surah changes or auto-scroll starts
  useEffect(() => {
    pausedAyahsHistory.current.clear();
  }, [surahData.meta.number, isAutoScrolling]);

  // Synchronize reciter mode when audio starts
  useEffect(() => {
    if (isPlayingAudio) {
      if (isSmartScrollActive) {
        setIsAutoScrolling(true);
      }
      setScrollMode('reciter-sync');
      setIsAutoScrollPaused(false);
    }
  }, [isPlayingAudio, isSmartScrollActive]);

  // 60 FPS Unified Auto-Scroll Engine (Voice Sync Gliding + Free Self-Reading)
  useEffect(() => {
    const isEngineActive = isAutoScrolling || (isPlayingAudio && isSmartScrollActive);
    if (!isEngineActive || isAutoScrollPaused || isPausedAtAyah) return;

    let animId: number;
    let lastTime = performance.now();
    // Calibrated speed table for Arabic reading: px per second
    // 1x: 24px/s, 2x: 40px/s, 3x: 64px/s, 4x: 95px/s, 5x: 140px/s
    const speedTable = [24, 40, 64, 95, 140];
    const pxPerSec = speedTable[autoScrollSpeed - 1] || 40;

    // Ensure accumulator starts from current scroll position
    if (containerRef.current) {
      preciseScrollTop.current = containerRef.current.scrollTop;
    }

    const scrollLoop = (now: number) => {
      const container = containerRef.current;
      if (!container) return;

      const elapsed = (now - lastTime) / 1000;
      lastTime = now;

      // Yield completely while user is touching or manually adjusting
      if (isTouchActive.current || isUserInteracting) {
        preciseScrollTop.current = container.scrollTop;
        animId = requestAnimationFrame(scrollLoop);
        return;
      }

      // MODE 1: VOICE RECITATION TRACKER (المزامنة الذكية مع صوت وتلاوة الشيخ)
      if (isPlayingAudio && scrollMode === 'reciter-sync') {
        const el = ayahRefs.current[activeAyahNumber];
        if (el) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();

          // Ayah's position relative to container's scroll surface
          const elRelativeTop = elRect.top - containerRect.top + container.scrollTop;

          // Intra-ayah progression through words/lines
          const progress = (duration && duration > 0)
            ? Math.max(0, Math.min(1, (currentTime || 0) / duration))
            : 0;

          // Progressively shift focal line down long multi-line verses
          const intraOffset = progress * Math.max(0, elRect.height - 35);

          // Optimal focal zone: keep active recitation at ~38% from top of container
          const targetScrollTop = Math.max(
            0,
            Math.min(
              container.scrollHeight - container.clientHeight,
              elRelativeTop + intraOffset - (containerRect.height * 0.38)
            )
          );

          // Damping interpolation: 0.08 produces silky 60fps tracking without jumps
          const diff = targetScrollTop - container.scrollTop;
          if (Math.abs(diff) > 0.8) {
            container.scrollTop += diff * 0.08;
            preciseScrollTop.current = container.scrollTop;
          }
        }
      }
      // MODE 2: SELF-READING FREE SPEED (قراءة ذاتية حرة بسرعات 1 إلى 5 مع تراكم دقيق للبيكسلات)
      else {
        if (elapsed > 0 && elapsed < 0.2) {
          // Accumulate floating subpixel distance so speeds 1, 2, 3 never get truncated by browser DOM
          preciseScrollTop.current += pxPerSec * elapsed;

          // Check if reached bottom of surah
          const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
          if (preciseScrollTop.current >= maxScroll - 4) {
            container.scrollTop = maxScroll;
            setIsAutoScrolling(false);
            return;
          }

          // Apply to DOM scroll position
          container.scrollTop = preciseScrollTop.current;

          // Reflective pause at verse end symbols ﴿۝﴾ (if user toggles it on)
          if (pauseAtAyahEnds) {
            const containerRect = container.getBoundingClientRect();
            const focalLine = containerRect.top + containerRect.height * 0.40;

            for (const ayah of surahData.ayahs) {
              const num = ayah.numberInSurah;
              if (pausedAyahsHistory.current.has(num)) continue;

              const el = ayahRefs.current[num];
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.bottom >= focalLine - 16 && rect.bottom <= focalLine + 16) {
                  pausedAyahsHistory.current.add(num);
                  setIsPausedAtAyah(true);
                  setPausedAyahNumber(num);

                  setTimeout(() => {
                    setIsPausedAtAyah(false);
                    setPausedAyahNumber(null);
                    if (containerRef.current) {
                      preciseScrollTop.current = containerRef.current.scrollTop;
                    }
                  }, 1300);
                  return;
                }
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, [
    isAutoScrolling,
    isSmartScrollActive,
    isPlayingAudio,
    scrollMode,
    isAutoScrollPaused,
    isPausedAtAyah,
    isUserInteracting,
    activeAyahNumber,
    currentTime,
    duration,
    autoScrollSpeed,
    pauseAtAyahEnds,
    surahData.ayahs
  ]);

  // Load saved bookmark
  useEffect(() => {
    const saved = localStorage.getItem(`bayan_bookmark_${surahData.meta.number}`);
    if (saved) {
      setBookmarkedAyah(Number(saved));
    }
  }, [surahData.meta.number]);

  const handleToggleBookmark = (ayahNum: number) => {
    if (bookmarkedAyah === ayahNum) {
      setBookmarkedAyah(null);
      localStorage.removeItem(`bayan_bookmark_${surahData.meta.number}`);
    } else {
      setBookmarkedAyah(ayahNum);
      localStorage.setItem(`bayan_bookmark_${surahData.meta.number}`, String(ayahNum));
    }
  };

  // Determine container styling based on theme
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf7ee] text-[#1c1917] border-amber-900/20';
      case 'emerald':
        return 'bg-[#041a14] text-[#e6f7f2] border-emerald-900/30';
      case 'high-contrast':
        return 'bg-black text-white border-zinc-800';
      default:
        return 'bg-[#0c1319] text-[#e2e8f0] border-slate-800';
    }
  };

  const getBorderColor = () => {
    switch (theme) {
      case 'sepia':
        return '#d97706';
      case 'emerald':
        return '#059669';
      default:
        return '#10b981';
    }
  };

  // Divide ayahs into two pages if Dual Page mode is active
  const midPoint = Math.ceil(surahData.ayahs.length / 2);
  const rightPageAyahs = isDualPage ? surahData.ayahs.slice(0, midPoint) : surahData.ayahs;
  const leftPageAyahs = isDualPage ? surahData.ayahs.slice(midPoint) : [];

  return (
    <div className={`relative flex flex-col transition-all duration-300 ${isZenMode ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-[#070b0e]' : 'w-full'}`}>
      
      {/* Reader Toolbar (Hidden in pure Zen Mode until hovered) */}
      <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md transition-opacity ${
        isZenMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'
      }`}>
        
        {/* Left: Tajweed Toggle & Color Guide */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTajweed}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isTajweedActive
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTajweedActive ? 'التجويد الملون: مفعل' : 'الرسم العادي'}</span>
          </button>

          {isTajweedActive && (
            <button
              onClick={onOpenTajweedLegend}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
              title="دليل ألوان أحكام التجويد"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Dual Page Toggle (on tablets / desktop) */}
          <button
            onClick={() => setIsDualPage(!isDualPage)}
            className={`hidden md:flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDualPage
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="عرض المصحف المزدوج (صفحتين متقابلتين)"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isDualPage ? 'صفحتين' : 'صفحة واحدة'}</span>
          </button>

          {/* Self-Reading / Voice Sync Auto-Scroll Button */}
          <button
            onClick={() => {
              const currentlyActive = isAutoScrolling || (isPlayingAudio && isSmartScrollActive);
              if (currentlyActive) {
                setIsAutoScrolling(false);
                setIsAutoScrollPaused(false);
                if (isPlayingAudio && onToggleSmartScroll) {
                  onToggleSmartScroll();
                }
              } else {
                setIsAutoScrolling(true);
                setIsAutoScrollPaused(false);
                if (isPlayingAudio) {
                  setScrollMode('reciter-sync');
                  if (!isSmartScrollActive && onToggleSmartScroll) {
                    onToggleSmartScroll();
                  }
                }
              }
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              (isAutoScrolling || (isPlayingAudio && isSmartScrollActive))
                ? (isPlayingAudio && scrollMode === 'reciter-sync')
                  ? 'bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-900/50 ring-2 ring-emerald-300'
                  : 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-900/40 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="القراءة الذاتية التلقائية مع انسياب الأسطر للأسفل ومزامنة صوت القارئ"
          >
            {isPlayingAudio && scrollMode === 'reciter-sync' ? (
              <>
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-200" />
                <span className="hidden sm:inline">مزامنة القارئ 🎙️</span>
                <span className="sm:hidden">صوت الشيخ 🎙️</span>
              </>
            ) : (
              <>
                <ChevronsDown className={`w-3.5 h-3.5 ${(isAutoScrolling || (isPlayingAudio && isSmartScrollActive)) ? 'animate-bounce text-slate-950' : 'text-emerald-400'}`} />
                <span className="hidden sm:inline">{(isAutoScrolling || (isPlayingAudio && isSmartScrollActive)) ? 'قراءة ذاتية تعمل ⚡' : 'قراءة ذاتية'}</span>
                <span className="sm:hidden">{(isAutoScrolling || (isPlayingAudio && isSmartScrollActive)) ? 'قراءة آلية ⚡' : 'قراءة آلية'}</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Font Size adjust */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFontSize(prev => Math.max(20, prev - 2))}
            className="p-1 text-slate-400 hover:text-white"
            title="تصغير الخط"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-300 font-medium px-1 min-w-[2.5rem] text-center">{fontSize}px</span>
          <button
            onClick={() => setFontSize(prev => Math.min(48, prev + 2))}
            className="p-1 text-slate-400 hover:text-white"
            title="تكبير الخط"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Theme picker & Zen Mode */}
        <div className="flex items-center gap-2">
          {/* Themes */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTheme('dark')}
              className={`w-6 h-6 rounded-lg bg-[#0c1319] border ${theme === 'dark' ? 'ring-2 ring-emerald-400 border-white' : 'border-slate-700'}`}
              title="ليلي داكن"
            />
            <button
              onClick={() => setTheme('sepia')}
              className={`w-6 h-6 rounded-lg bg-[#fbf7ee] border ${theme === 'sepia' ? 'ring-2 ring-amber-600 border-slate-900' : 'border-slate-400'}`}
              title="ورق المصحف العاجي"
            />
            <button
              onClick={() => setTheme('emerald')}
              className={`w-6 h-6 rounded-lg bg-[#041a14] border ${theme === 'emerald' ? 'ring-2 ring-emerald-400 border-white' : 'border-emerald-800'}`}
              title="الزمرد الملكي"
            />
          </div>

          {/* Zen Mode toggle */}
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              isZenMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="وضع الانغماس البصري (إخفاء القوائم)"
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Floating Auto-Scroll Speed & Reciter Sync Controller */}
      {(isAutoScrolling || (isPlayingAudio && isSmartScrollActive)) && (
        <div className="mb-3 p-2.5 sm:p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center gap-2">
            {/* Play / Pause toggle */}
            <button
              onClick={() => setIsAutoScrollPaused(!isAutoScrollPaused)}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-transform active:scale-95 shrink-0 cursor-pointer"
              title={isAutoScrollPaused ? 'استئناف القراءة الذاتية' : 'إيقاف مؤقت للقراءة الذاتية'}
            >
              {isAutoScrollPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isAutoScrollPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
            </button>

            {/* If audio is playing: Mode Selector between Reciter Voice Sync and Free Manual Speed */}
            {isPlayingAudio && (
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setScrollMode('reciter-sync')}
                  className={`py-1 px-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    scrollMode === 'reciter-sync'
                      ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="مزامنة نزول الأسطر بدقة مع سرعة قراءة الشيخ لكلمة وراء كلمة"
                >
                  <Radio className="w-3 h-3" />
                  <span>مزامنة الشيخ 🎙️</span>
                </button>
                <button
                  onClick={() => setScrollMode('manual-speed')}
                  className={`py-1 px-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    scrollMode === 'manual-speed'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="تحديد سرعة يدوية ثابتة للقراءة الذاتية"
                >
                  <span>سرعة حرة (1x-5x)</span>
                </button>
              </div>
            )}

            {/* Manual Speed Selector pills (shown when not in voice sync mode, or not playing audio) */}
            {(!isPlayingAudio || scrollMode === 'manual-speed') && (
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[11px] font-semibold ml-1">سرعة القراءة:</span>
                {[
                  { level: 1, label: '1x (متأنٍ جداً)', name: '1x' },
                  { level: 2, label: '2x (هادئ ومعتدل)', name: '2x' },
                  { level: 3, label: '3x (متوسط)', name: '3x' },
                  { level: 4, label: '4x (سريع)', name: '4x' },
                  { level: 5, label: '5x (حدر ومراجعة)', name: '5x' },
                ].map((s) => (
                  <button
                    key={s.level}
                    onClick={() => setAutoScrollSpeed(s.level)}
                    className={`py-1 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      autoScrollSpeed === s.level
                        ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-300'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={s.label}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {/* Continuous flow vs Pause at verse ends indicator for manual mode */}
            {(!isPlayingAudio || scrollMode === 'manual-speed') && (
              <button
                onClick={() => setPauseAtAyahEnds(!pauseAtAyahEnds)}
                className={`py-1 px-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                  !pauseAtAyahEnds
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-amber-500/20 border-amber-500 text-amber-300'
                }`}
                title="التبديل بين الانسياب المستمر بدون توقف أو الوقوف عند رأس كل آية ﴿﴾"
              >
                <span>{!pauseAtAyahEnds ? 'انسياب مستمر (بدون توقف) ✓' : 'توقف عند ﴿﴾'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicator when user is interacting with touch/wheel */}
            {isUserInteracting ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-sky-300 px-2.5 py-1 rounded-lg bg-sky-950/70 border border-sky-500/40 font-medium flex items-center gap-1">
                  <Hand className="w-3 h-3 text-sky-400 animate-pulse" />
                  <span>تحكم يدوي باللمس 👆</span>
                </span>
                <button
                  onClick={() => {
                    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
                    isTouchActive.current = false;
                    setIsUserInteracting(false);
                    if (containerRef.current) {
                      preciseScrollTop.current = containerRef.current.scrollTop;
                    }
                  }}
                  className="py-1 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition-all shadow-sm cursor-pointer"
                  title="استئناف القراءة الذاتية فوراً من الموضع الحالي"
                >
                  استئناف الآن ⚡
                </button>
              </div>
            ) : isPlayingAudio && scrollMode === 'reciter-sync' ? (
              <span className="text-[11px] text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>تتبع تلاوة الآية ﴿{activeAyahNumber}﴾</span>
              </span>
            ) : isPausedAtAyah ? (
              <span className="text-[11px] text-amber-300 px-2 py-0.5 rounded-lg bg-amber-500/20 animate-pulse font-medium">
                وقفة تدبر عند الآية ﴿{pausedAyahNumber}﴾...
              </span>
            ) : null}

            {/* Close / Stop Auto-Scroll */}
            <button
              onClick={() => {
                setIsAutoScrolling(false);
                setIsAutoScrollPaused(false);
                if (isPlayingAudio && onToggleSmartScroll) {
                  onToggleSmartScroll();
                }
              }}
              className="py-1 px-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer text-[11px]"
              title="إيقاف القراءة الذاتية"
            >
              إيقاف القراءة الآلية ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Reading Frame (Mus'haf Page Layout) */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleContainerScroll}
        className={`relative rounded-3xl p-6 sm:p-10 border-2 shadow-2xl transition-all duration-300 overflow-y-auto max-h-[75vh] overscroll-contain ${getThemeClasses()}`}
      >
        {/* Decorative Corner Ornaments */}
        <div
          className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 opacity-40 pointer-events-none rounded-tr-lg"
          style={{ borderColor: getBorderColor() }}
        />
        <div
          className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 opacity-40 pointer-events-none rounded-tl-lg"
          style={{ borderColor: getBorderColor() }}
        />
        <div
          className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 opacity-40 pointer-events-none rounded-br-lg"
          style={{ borderColor: getBorderColor() }}
        />
        <div
          className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 opacity-40 pointer-events-none rounded-bl-lg"
          style={{ borderColor: getBorderColor() }}
        />

        {/* Surah Decorative Frame Header */}
        <div className="relative text-center mb-8 pb-4">
          <div className="inline-block relative px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-emerald-500/10 border border-emerald-500/30 shadow-inner">
            <h1 className="font-kufi text-2xl sm:text-3xl font-bold tracking-wide">
              سُورَةُ {surahData.meta.name}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-slate-400 font-sans">
              <span>{surahData.meta.revelationTypeAr}</span>
              <span>•</span>
              <span>{surahData.meta.numberOfAyahs} آيات</span>
              <span>•</span>
              <span>الجزء {surahData.meta.juzNumber}</span>
              <span>•</span>
              <span>الصفحة {surahData.meta.startPage}</span>
            </div>
          </div>

          {/* Bismillah Banner (unless Tawba) */}
          {surahData.bismillahPre && (
            <div className="mt-6 text-center">
              <p className="font-quran text-2xl sm:text-3xl text-emerald-400/90 leading-loose">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}
        </div>

        {/* Verses Container (Single or Dual Page) */}
        <div className={isDualPage ? 'grid grid-cols-1 md:grid-cols-2 gap-8 divide-x-2 divide-amber-500/20' : 'space-y-4'}>
          
          {/* Right Page (or full list) */}
          <div className="space-y-3 leading-loose text-justify font-quran select-text">
            {rightPageAyahs.map((ayah) => {
              const isActive = activeAyahNumber === ayah.numberInSurah;
              const isBookmarked = bookmarkedAyah === ayah.numberInSurah;

              const words = ayah.text.trim().split(/\s+/);
              let activeWordIndex: number | undefined = undefined;
              if (isActive && isPlayingAudio && duration && duration > 0) {
                const progress = Math.max(0, Math.min(0.99, (currentTime || 0) / duration));
                activeWordIndex = Math.floor(progress * words.length);
              }

              return (
                <span
                  key={ayah.numberInSurah}
                  ref={(el) => {
                    ayahRefs.current[ayah.numberInSurah] = el;
                  }}
                  className={`relative inline transition-colors duration-200 rounded px-1 ${
                    isActive
                      ? 'bg-emerald-500/10'
                      : 'hover:bg-emerald-500/5'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {/* Ayah Text with Tajweed and synchronized Word-by-Word highlighting */}
                  {renderTajweedText(ayah.text, isTajweedActive, () => onOpenTadabburModal(ayah), activeWordIndex)}

                  {/* Ayah End Ornament & Number ﴿١﴾ */}
                  <span
                    onClick={() => onOpenTadabburModal(ayah)}
                    className="ayah-end-symbol mx-1.5 inline-flex items-center justify-center cursor-pointer group"
                    title={`الآية ${ayah.numberInSurah} - انقر للتدبر والتفسير`}
                  >
                    <span className={`font-bold transition-all text-xl ${
                      isActive && isPlayingAudio
                        ? 'text-emerald-400 scale-110 drop-shadow-sm'
                        : 'text-emerald-500 group-hover:scale-125'
                    }`}>
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </span>

                  {/* Bookmark badge if set */}
                  {isBookmarked && (
                    <Bookmark className="inline w-4 h-4 text-amber-400 fill-amber-400 align-middle ml-1" />
                  )}
                </span>
              );
            })}
          </div>

          {/* Left Page (Dual Page Mode) */}
          {isDualPage && (
            <div className="space-y-3 leading-loose text-justify font-quran select-text pr-6">
              {leftPageAyahs.map((ayah) => {
                const isActive = activeAyahNumber === ayah.numberInSurah;
                const isBookmarked = bookmarkedAyah === ayah.numberInSurah;

                const words = ayah.text.trim().split(/\s+/);
                let activeWordIndex: number | undefined = undefined;
                if (isActive && isPlayingAudio && duration && duration > 0) {
                  const progress = Math.max(0, Math.min(0.99, (currentTime || 0) / duration));
                  activeWordIndex = Math.floor(progress * words.length);
                }

                return (
                  <span
                    key={ayah.numberInSurah}
                    ref={(el) => {
                      ayahRefs.current[ayah.numberInSurah] = el;
                    }}
                    className={`relative inline transition-colors duration-200 rounded px-1 ${
                      isActive
                        ? 'bg-emerald-500/10'
                        : 'hover:bg-emerald-500/5'
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {renderTajweedText(ayah.text, isTajweedActive, () => onOpenTadabburModal(ayah), activeWordIndex)}

                    <span
                      onClick={() => onOpenTadabburModal(ayah)}
                      className="ayah-end-symbol mx-1.5 inline-flex items-center justify-center cursor-pointer group"
                      title={`الآية ${ayah.numberInSurah} - انقر للتدبر والتفسير`}
                    >
                      <span className={`font-bold transition-all text-xl ${
                        isActive && isPlayingAudio
                          ? 'text-emerald-400 scale-110 drop-shadow-sm'
                          : 'text-emerald-500 group-hover:scale-125'
                      }`}>
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </span>

                    {isBookmarked && (
                      <Bookmark className="inline w-4 h-4 text-amber-400 fill-amber-400 align-middle ml-1" />
                    )}
                  </span>
                );
              })}
            </div>
          )}

        </div>

        {/* Page Footer metadata */}
        <div className="mt-12 pt-6 border-t border-current opacity-30 flex items-center justify-between text-xs font-sans">
          <span>الجزء {surahData.meta.juzNumber}</span>
          <span>مصحف بيان • وقف لوجه الله تعالى</span>
          <span>الصفحة {surahData.meta.startPage}</span>
        </div>

      </div>

    </div>
  );
};
