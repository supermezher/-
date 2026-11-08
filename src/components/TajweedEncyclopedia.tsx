import React, { useState } from 'react';
import { TAJWEED_RULES, TAJWEED_QUIZ, TajweedRule } from '../data/tajweedRules';
import { BookOpen, HelpCircle, Check, X, Award, ChevronDown, ChevronUp, Sparkles, Volume2 } from 'lucide-react';

export const TajweedEncyclopedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'quiz'>('rules');
  const [selectedRule, setSelectedRule] = useState<TajweedRule>(TAJWEED_RULES[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (showQuizResults) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    TAJWEED_QUIZ.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>موسوعة التجويد الملون التفاعلية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            رتّل القرآن ترتيلاً كما أنزل
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            تعرّف على أحكام التجويد الملون، مقادير المدود، ومخارج الحروف مع أمثلة قرآنية واختبر معلوماتك فورياً.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            أحكام وقواعد التجويد
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>اختبار التجويد التفاعلي</span>
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rules List sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 px-1 mb-2">الأحكام والألوان المعتمدة:</h3>
            {TAJWEED_RULES.map((rule) => {
              const isSelected = selectedRule.id === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: rule.colorHex }}
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{rule.name}</div>
                      <div className="text-[11px] text-slate-400">{rule.nameEn}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                    {rule.mizan}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Rule Details */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-lg shadow-md"
                  style={{ backgroundColor: selectedRule.colorHex }}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedRule.name}</h3>
                  <span className="text-xs text-slate-400">{selectedRule.nameEn}</span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-800 text-emerald-300 font-semibold text-xs border border-slate-700">
                المقدار الزمني: {selectedRule.mizan}
              </div>
            </div>

            {/* Definition */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1">التعريف اللغوي والاصطلاحي:</span>
              <p className="text-slate-200 text-sm leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedRule.definition}
              </p>
            </div>

            {/* Letters */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1.5">حروف الحكم:</span>
              <div className="flex flex-wrap gap-2">
                {selectedRule.letters.map((l, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-sm border border-slate-700 shadow-sm"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Quranic Example */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-1.5">أمثلة قرآنية نموذجية:</span>
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center">
                <p className="font-quran text-2xl text-emerald-200 mb-2 leading-loose">
                  {selectedRule.exampleQuran}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedRule.exampleExplanation}
                </p>
              </div>
            </div>

            {/* Practical Benefit */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400 block mb-1">الأثر الصوتي والجمالي في التلاوة:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRule.benefit}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-lg text-white">اختبر إتقانك لأحكام التجويد</h3>
              <p className="text-xs text-slate-400">أجب عن الأسئلة واكتشف مستواك في قواعد الترتيل</p>
            </div>
            {showQuizResults && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm flex items-center gap-2 border border-emerald-500/40">
                <Award className="w-4 h-4" />
                <span>النتيجة: {calculateScore()} من {TAJWEED_QUIZ.length}</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {TAJWEED_QUIZ.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div key={q.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      السؤال {idx + 1}
                    </span>
                    <span className="font-quran text-lg text-emerald-300 text-center flex-1">
                      {q.ayahSnippet}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedOpt === oIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (showQuizResults) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isChosen && oIdx !== q.correctIndex) {
                          btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`p-3 rounded-lg border text-right text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showQuizResults && oIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {showQuizResults && isChosen && oIdx !== q.correctIndex && (
                            <X className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 mt-2">
                      <strong className="text-emerald-400 block mb-0.5">الشرح والتوجيه:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            {!showQuizResults ? (
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(quizAnswers).length === 0}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all"
              >
                عرض النتيجة والتصحيح
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setShowQuizResults(false);
                }}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
