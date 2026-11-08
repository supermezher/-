import React from 'react';

/**
 * Intelligent Tajweed Highlighting & Word-by-Word Synchronizer
 */

export interface TajweedToken {
  text: string;
  rule?: 'ghunnah' | 'ikhfa' | 'idgham' | 'qalqalah' | 'madd-wajib' | 'madd-lazim' | 'tafkheem';
  tooltip?: string;
}

export function parseWordTajweed(word: string): TajweedToken[] {
  // Check specific high-impact Tajweed patterns inside word
  // Madd Lazim: e.g. الضَّآلِّينَ (Madda + Shaddah)
  if (word.includes('آلِّ') || word.includes('آخَّ') || word.includes('آفَّ') || word.includes('آمَّ') || (word.includes('ٓ') && word.includes('ّ'))) {
    return [{
      text: word,
      rule: 'madd-lazim',
      tooltip: 'مد لازم كلمي (6 حركات مشبعة)'
    }];
  }
  
  // Madd Wajib / Jaiz: e.g. جَآءَ, سُوٓءَ, بِمَآ, السَّمَاءِ
  if (word.includes('َآء') || word.includes('ُوٓء') || word.includes('ِىٓء') || word.includes('َآ') || word.includes('ُوٓ') || word.includes('ِىٓ') || word.includes('ٓ')) {
    return [{
      text: word,
      rule: 'madd-wajib',
      tooltip: 'مد متصل / منفصل (4 - 5 حركات)'
    }];
  }
  
  // Ghunnah: e.g. إِنَّ, عَمَّ, مِّنَّا, مَّن
  if (word.includes('نَّ') || word.includes('مَّ') || word.includes('نّ') || word.includes('مّ')) {
    return [{
      text: word,
      rule: 'ghunnah',
      tooltip: 'غنة مشددة بمقدار حركتين'
    }];
  }
  
  // Qalqalah: words ending with قطب جد sukoon or containing Qalqalah
  if (
    /[قَُِْ]?([قطبجد]ْ|[قطبجد]$)/.test(word) ||
    word.includes('فَلَقِ') ||
    word.includes('وَقَبَ') ||
    word.includes('عَقَدِ') ||
    word.includes('حَسَدَ') ||
    word.includes('أَحَدٌ') ||
    word.includes('ٱلصَّمَدُ') ||
    word.includes('يَلِدْ') ||
    word.includes('يُولَدْ') ||
    word.includes('أَحَدٌۢ')
  ) {
    return [{
      text: word,
      rule: 'qalqalah',
      tooltip: 'قلقلة صغرى / كبرى في حرف قطب جد'
    }];
  }
  
  // Ikhfa pattern
  if (word.includes('مِن قَ') || word.includes('كُنتُمْ') || word.includes('أَنتُمْ') || word.includes('عَن صَ') || word.includes('مِن شَ') || word.includes('مِن ثَ')) {
    return [{
      text: word,
      rule: 'ikhfa',
      tooltip: 'إخفاء حقيقي بغنة حركتين'
    }];
  }
  
  // Idgham pattern
  if (word.includes('مَن يَّ') || word.includes('مِن رَّ') || word.includes('مِّن مَّ') || word.includes('مِّن وَ')) {
    return [{
      text: word,
      rule: 'idgham',
      tooltip: 'إدغام بغنة / بغير غنة'
    }];
  }

  return [{ text: word }];
}

export function renderTajweedText(
  rawText: string,
  isTajweedActive: boolean,
  onWordClick?: (word: string) => void,
  activeWordIndex?: number
): React.ReactNode {
  const words = rawText.trim().split(/\s+/);

  return (
    <span>
      {words.map((word, wIdx) => {
        const isCurrentActiveWord = activeWordIndex !== undefined && activeWordIndex === wIdx;
        const tokens = isTajweedActive ? parseWordTajweed(word) : [{ text: word }];

        return (
          <React.Fragment key={wIdx}>
            <span
              onClick={() => onWordClick?.(word)}
              className={`transition-all duration-150 cursor-pointer rounded px-0.5 inline-block ${
                isCurrentActiveWord
                  ? 'bg-emerald-500/35 text-emerald-100 ring-1 ring-emerald-400 shadow-sm scale-105 font-bold'
                  : 'hover:bg-emerald-500/10'
              }`}
            >
              {tokens.map((token, tIdx) => {
                if (!token.rule) {
                  return <span key={tIdx}>{token.text}</span>;
                }

                let ruleClass = '';
                if (token.rule === 'ghunnah') ruleClass = 'tajweed-ghunnah border-b border-emerald-500/40';
                if (token.rule === 'ikhfa') ruleClass = 'tajweed-ikhfa border-b border-amber-500/40';
                if (token.rule === 'idgham') ruleClass = 'tajweed-idgham border-b border-cyan-500/40';
                if (token.rule === 'qalqalah') ruleClass = 'tajweed-qalqalah border-b border-sky-500/40';
                if (token.rule === 'madd-wajib') ruleClass = 'tajweed-madd-wajib border-b border-rose-500/40';
                if (token.rule === 'madd-lazim') ruleClass = 'tajweed-madd-lazim border-b border-purple-500/40';
                if (token.rule === 'tafkheem') ruleClass = 'tajweed-tafkheem';

                return (
                  <span
                    key={tIdx}
                    className={ruleClass}
                    title={token.tooltip}
                  >
                    {token.text}
                  </span>
                );
              })}
            </span>
            {wIdx < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </span>
  );
}
