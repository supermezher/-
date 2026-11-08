import React from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';
import { TAJWEED_RULES } from '../data/tajweedRules';

interface TajweedLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TajweedLegendModal: React.FC<TajweedLegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-800/40 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base sm:text-lg text-white">دليل ألوان التجويد القياسي</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          نظام التلوين المعتمد في مصحف "بيان" يطابق المصاحف الشريفة الملونة لتعليم الترتيل وتطبيق الأحكام دون عناء:
        </p>

        <div className="space-y-2.5">
          {TAJWEED_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3"
            >
              <span
                className="w-4 h-4 rounded-full mt-1 shrink-0 shadow-sm"
                style={{ backgroundColor: rule.colorHex }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs sm:text-sm">{rule.name}</span>
                  <span className="text-[11px] text-emerald-400 font-mono">{rule.mizan}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{rule.definition}</p>
                <div className="mt-1 text-xs text-slate-300 font-quran">
                  مثال: <span className="text-emerald-200">{rule.exampleQuran}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
          >
            فهمت، العودة للمصحف
          </button>
        </div>
      </div>
    </div>
  );
};
