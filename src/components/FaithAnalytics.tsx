import React, { useState } from 'react';
import { Flame, BookOpen, CheckCircle, Clock, Calendar, Trophy, ChevronRight, TrendingUp } from 'lucide-react';

interface FaithAnalyticsProps {
  onClose?: () => void;
}

export const FaithAnalytics: React.FC<FaithAnalyticsProps> = ({ onClose }) => {
  // Generate realistic 52 weeks x 7 days heatmap data
  const generateYearData = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Realistic simulation: more activity on Fridays and Ramadan
      const dayOfWeek = d.getDay();
      let intensity = 0;
      const rand = Math.random();
      if (rand > 0.3) {
        intensity = dayOfWeek === 5 ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 4);
      }
      days.push({
        date: d.toISOString().split('T')[0],
        intensity, // 0 to 4
        ayahCount: intensity === 0 ? 0 : (intensity === 1 ? 7 : (intensity === 2 ? 25 : (intensity === 3 ? 50 : 120)))
      });
    }
    return days;
  };

  const [heatmapData] = useState(generateYearData());
  const [hoveredDay, setHoveredDay] = useState<{ date: string; ayahCount: number } | null>(null);

  const getCellColor = (intensity: number) => {
    switch (intensity) {
      case 1:
        return 'bg-emerald-950/80 border-emerald-800/40';
      case 2:
        return 'bg-emerald-700 border-emerald-600';
      case 3:
        return 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/30';
      case 4:
        return 'bg-emerald-300 border-white shadow-sm shadow-emerald-400/50';
      default:
        return 'bg-slate-800/50 border-slate-800/80';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Motivation */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>لوحة الإنجاز الإيماني وسجل الختمات</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
              ﴿ وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ ﴾
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              قال رسول الله ﷺ: «أَحَبُّ الأعمالِ إلى اللهِ أَدْوَمُها وإنْ قَلَّ». قراءتك اليومية المنتظمة هي صلتك الدائمة بربك.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">21 يوم</div>
              <div className="text-xs text-slate-400">سلسلة الورد المستمر (Streak)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">مجموع الآيات</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,842</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+140 آية هذا الأسبوع</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">ختمات مكتملة</span>
            <CheckCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">2 ختمة</div>
          <div className="text-[11px] text-slate-400 mt-1">
            الختمة الحالية: 58% (صفحة 350)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">دقائق الاستماع</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">640 دقيقة</div>
          <div className="text-[11px] text-slate-400 mt-1">
            بمعدل 22 دقيقة يومياً
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">خواطر التدبر</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">34 خاطرة</div>
          <div className="text-[11px] text-purple-300 mt-1">
            مسجلة في مفكرتك الخاصة
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>شبكة النشاط والتلاوة السنوية (365 يوماً)</span>
            </h3>
            <p className="text-xs text-slate-400">
              كل مربع يمثل يوماً، وتزداد درجة اللون الأخضر بازدياد عدد الآيات المقروءة
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>أقل</span>
            <div className="w-3 h-3 rounded-sm bg-slate-800/80 border border-slate-700"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-950/80 border border-emerald-800"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-300"></div>
            <span>أكثر</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-flow-col grid-rows-7 gap-1 min-w-[700px]">
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3 h-3 rounded-xs border transition-transform hover:scale-125 cursor-pointer ${getCellColor(
                  day.intensity
                )}`}
              />
            ))}
          </div>
        </div>

        {/* Hover readout */}
        <div className="mt-3 text-xs text-slate-400 h-5 flex items-center">
          {hoveredDay ? (
            <span className="text-emerald-300 font-medium">
              📅 {hoveredDay.date}: قرأت {hoveredDay.ayahCount} آية كريمة
            </span>
          ) : (
            <span>مرر المؤشر فوق المربعات لعرض تفاصيل اليوم</span>
          )}
        </div>
      </div>

      {/* Current Khatma Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="font-bold text-white">الختمة المباركة الثالثة</span>
          <span className="text-emerald-400 font-bold">350 / 604 صفحة (58%)</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-md shadow-emerald-500/20"
            style={{ width: '58%' }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>المتبقي: 254 صفحة</span>
          <span>المعدل الموصى به: 8 صفحات يومياً لإنهاء الختمة في شهر</span>
        </div>
      </div>
    </div>
  );
};
