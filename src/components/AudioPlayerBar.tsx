import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, FastForward, Clock, Download, Check, Sparkles, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { Reciter, RECITERS_LIST, getAyahAudioUrl } from '../data/reciters';

interface AudioPlayerBarProps {
  surahNumber: number;
  surahName: string;
  totalAyahs: number;
  currentAyahNumber: number;
  onAyahChange: (ayahNum: number) => void;
  isPlaying: boolean;
  onPlayPauseToggle: (playing: boolean) => void;
  isSmartScrollEnabled: boolean;
  onToggleSmartScroll: () => void;
  onPlaybackProgress?: (currentTime: number, duration: number) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  surahNumber,
  surahName,
  totalAyahs,
  currentAyahNumber,
  onAyahChange,
  isPlaying,
  onPlayPauseToggle,
  isSmartScrollEnabled,
  onToggleSmartScroll,
  onPlaybackProgress,
}) => {
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<'none' | '3-times' | 'loop'>('none');
  const [repeatCounter, setRepeatCounter] = useState<number>(1);
  const [khatmaTimerMinutes, setKhatmaTimerMinutes] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio source URL
  const audioUrl = getAyahAudioUrl(selectedReciter.serverKey, surahNumber, currentAyahNumber);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(err => {
        console.warn('Audio play prevented:', err);
        onPlayPauseToggle(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl, playbackSpeed]);

  // Khatma sleep timer countdown
  useEffect(() => {
    if (khatmaTimerMinutes <= 0) {
      setTimeRemaining(0);
      return;
    }
    setTimeRemaining(khatmaTimerMinutes * 60);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onPlayPauseToggle(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [khatmaTimerMinutes]);

  const handleAudioEnded = () => {
    if (repeatMode === 'loop') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    if (repeatMode === '3-times') {
      if (repeatCounter < 3) {
        setRepeatCounter(prev => prev + 1);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        return;
      } else {
        setRepeatCounter(1); // reset for next
      }
    }

    // Move to next ayah in surah
    if (currentAyahNumber < totalAyahs) {
      onAyahChange(currentAyahNumber + 1);
    } else {
      onPlayPauseToggle(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setAudioProgress((cur / dur) * 100);
      setDuration(dur);
      onPlaybackProgress?.(cur, dur);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audioRef.current.currentTime = percent * (audioRef.current.duration || 0);
  };

  const handleSimulateDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
    }, 1500);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md shadow-2xl transition-all">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Progress line */}
      <div
        onClick={handleSeek}
        className="w-full h-1 bg-slate-800 hover:h-2 cursor-pointer transition-all relative"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
          style={{ width: `${audioProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col gap-2">
        {/* Main Player Row */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Ayah info & Reciter */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-xs sm:text-sm truncate flex items-center gap-1.5">
                <span>سورة {surahName}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  الآية {currentAyahNumber} من {totalAyahs}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                بصوت: <strong className="text-slate-300">{selectedReciter.name}</strong> ({selectedReciter.style})
              </div>
            </div>
          </div>

          {/* Center: Controls (Prev, Play/Pause, Next) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onAyahChange(Math.max(1, currentAyahNumber - 1))}
              disabled={currentAyahNumber <= 1}
              title="الآية السابقة"
              className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPlayPauseToggle(!isPlaying)}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => onAyahChange(Math.min(totalAyahs, currentAyahNumber + 1))}
              disabled={currentAyahNumber >= totalAyahs}
              title="الآية التالية"
              className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Smart Scroll, Reciter Selector & Expand Toggle */}
          <div className="flex items-center gap-2">
            {/* Smart Scroll Toggle button */}
            <button
              onClick={onToggleSmartScroll}
              className={`hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                isSmartScrollEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="تمرير تلقائي يتوقف عند رأس كل آية ﴿﴾ للتدبر"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>التمرير الذكي</span>
            </button>

            {/* Reciter quick selector */}
            <select
              value={selectedReciter.id}
              onChange={(e) => {
                const found = RECITERS_LIST.find(r => r.id === e.target.value);
                if (found) setSelectedReciter(found);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 py-1.5 px-2 outline-none max-w-[140px] sm:max-w-[170px]"
            >
              {RECITERS_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Expand additional options */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="خيارات الختمة والتكرار والسرعة"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Expanded Options Drawer */}
        {isExpanded && (
          <div className="pt-2.5 pb-1 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            {/* Repeat Mode */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">تكرار الآية:</span>
              <button
                onClick={() => {
                  if (repeatMode === 'none') setRepeatMode('3-times');
                  else if (repeatMode === '3-times') setRepeatMode('loop');
                  else setRepeatMode('none');
                }}
                className={`py-1 px-2.5 rounded-lg font-medium border flex items-center gap-1 ${
                  repeatMode !== 'none'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>
                  {repeatMode === 'none' ? 'بدون تكرار' : (repeatMode === '3-times' ? `3 مرات (${repeatCounter}/3)` : 'تكرار مستمر')}
                </span>
              </button>
            </div>

            {/* Playback Speed */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">السرعة:</span>
              <div className="flex gap-1">
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`py-0.5 px-2 rounded-md font-semibold ${
                      playbackSpeed === speed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Khatma Sleep Timer */}
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">مؤقت الورد:</span>
              <select
                value={khatmaTimerMinutes}
                onChange={(e) => setKhatmaTimerMinutes(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded-md text-slate-200 py-0.5 px-1.5 outline-none"
              >
                <option value={0}>بدون إيقاف</option>
                <option value={15}>15 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={45}>45 دقيقة</option>
                <option value={60}>ساعة كاملة</option>
              </select>
              {timeRemaining > 0 && (
                <span className="text-emerald-400 font-mono text-[10px]">
                  ({Math.floor(timeRemaining / 60)}د)
                </span>
              )}
            </div>

            {/* Offline-First Download Simulator */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleSimulateDownload}
                disabled={isDownloaded || isDownloading}
                className={`py-1 px-2.5 rounded-lg font-medium border flex items-center gap-1.5 transition-colors ${
                  isDownloaded
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isDownloaded ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>محفوظة للعمل Offline</span>
                  </>
                ) : (
                  <>
                    <Download className={`w-3 h-3 ${isDownloading ? 'animate-bounce text-emerald-400' : ''}`} />
                    <span>{isDownloading ? 'جارِ التحميل...' : 'حفظ بدون إنترنت'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
