import React, { useState } from 'react';
import { CloudRain, Wind, Moon, VolumeX, Volume2, Sparkles } from 'lucide-react';
import { ambientAudio } from '../utils/ambientAudio';

export const AmbientAudioBar: React.FC = () => {
  const [activeSound, setActiveSound] = useState<'rain' | 'breeze' | 'night' | 'none'>('none');
  const [volume, setVolume] = useState<number>(30);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSound = (mode: 'rain' | 'breeze' | 'night') => {
    if (activeSound === mode) {
      ambientAudio.stop();
      setActiveSound('none');
    } else {
      ambientAudio.play(mode);
      setActiveSound(mode);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    ambientAudio.setVolume(val / 100);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
          activeSound !== 'none'
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm animate-pulse'
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
        }`}
        title="أجواء التدبر والتركيز (أصوات طبيعية هادئة)"
      >
        {activeSound === 'rain' && <CloudRain className="w-3.5 h-3.5" />}
        {activeSound === 'breeze' && <Wind className="w-3.5 h-3.5" />}
        {activeSound === 'night' && <Moon className="w-3.5 h-3.5" />}
        {activeSound === 'none' && <Volume2 className="w-3.5 h-3.5" />}
        <span>{activeSound !== 'none' ? 'أجواء التدبر تعمل' : 'أجواء التدبر'}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              أصوات الطبيعة لتعزيز الخشوع
            </span>
            {activeSound !== 'none' && (
              <button
                onClick={() => {
                  ambientAudio.stop();
                  setActiveSound('none');
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
              >
                <VolumeX className="w-3 h-3" />
                إيقاف
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => toggleSound('rain')}
              className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all ${
                activeSound === 'rain'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>مطر خفيف</span>
            </button>

            <button
              onClick={() => toggleSound('breeze')}
              className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all ${
                activeSound === 'breeze'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>حفيف شجر</span>
            </button>

            <button
              onClick={() => toggleSound('night')}
              className={`p-2 rounded-xl text-xs flex flex-col items-center gap-1 border transition-all ${
                activeSound === 'night'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>سكينة الليل</span>
            </button>
          </div>

          {activeSound !== 'none' && (
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>مستوى الصوت</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
