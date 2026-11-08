import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { Ayah } from '../data/quranService';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  surahName: string;
}

type AspectRatio = 'story' | 'post';
type CardTheme = 'emerald' | 'midnight' | 'parchment' | 'amethyst' | 'obsidian';

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  ayah,
  surahName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('post');
  const [theme, setTheme] = useState<CardTheme>('emerald');
  const [includeTafsir, setIncludeTafsir] = useState(true);
  const [fontSize, setFontSize] = useState<number>(38);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && ayah) {
      renderCanvas();
    }
  }, [isOpen, ayah, aspectRatio, theme, includeTafsir, fontSize, surahName]);

  if (!isOpen || !ayah) return null;

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = 1080;
    const height = aspectRatio === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (theme === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#06281e');
      grad.addColorStop(0.5, '#041d15');
      grad.addColorStop(1, '#02120d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'midnight') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#090d16');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'parchment') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fbf6ea');
      grad.addColorStop(1, '#ece2cb');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'amethyst') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#2e1065');
      grad.addColorStop(0.6, '#1e0842');
      grad.addColorStop(1, '#0f0322');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Obsidian
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(1, '#030712');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Decorative Islamic Frame
    const isLight = theme === 'parchment';
    const accentColor = isLight ? '#92400e' : (theme === 'emerald' ? '#34d399' : '#38bdf8');
    const goldColor = isLight ? '#b45309' : '#fbbf24';
    const textColor = isLight ? '#1c1917' : '#f8fafc';
    const subTextColor = isLight ? '#44403c' : '#94a3b8';

    // Outer subtle border
    ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.3)' : 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Inner thin border with corner notches
    ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.5)' : 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(76, 76, width - 152, height - 152);

    // Top Header: Bismillah / Bayan branding
    ctx.textAlign = 'center';
    ctx.fillStyle = goldColor;
    ctx.font = 'bold 32px "Amiri", serif';
    ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', width / 2, 140);

    // Surah & Ayah Badge
    ctx.fillStyle = isLight ? 'rgba(180, 83, 9, 0.1)' : 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(width / 2 - 160, 175, 320, 52, 26);
    ctx.fill();

    ctx.fillStyle = accentColor;
    ctx.font = '600 24px "Cairo", sans-serif';
    ctx.fillText(`سورة ${surahName} • الآية ${ayah.numberInSurah}`, width / 2, 210);

    // Draw Ayah Text wrapped nicely
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px "Amiri Quran", "Amiri", serif`;
    ctx.direction = 'rtl';

    const fullAyahText = `﴿ ${ayah.text} ﴾`;
    const maxWidth = width - 240;
    const lineHeight = fontSize * 2.1;
    const words = fullAyahText.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Calculate vertical centering
    const totalTextHeight = lines.length * lineHeight;
    let startY = (height / 2) - (totalTextHeight / 2) - (includeTafsir ? 70 : 0);
    if (startY < 290) startY = 290;

    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), width / 2, startY + (i * lineHeight));
    });

    // Draw Tafsir / Reflection Snippet if enabled
    if (includeTafsir) {
      const tafsirY = startY + totalTextHeight + 60;
      if (tafsirY < height - 200) {
        // Decorative divider
        ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 120, tafsirY - 30);
        ctx.lineTo(width / 2 + 120, tafsirY - 30);
        ctx.stroke();

        ctx.fillStyle = subTextColor;
        ctx.font = '500 24px "Cairo", sans-serif';

        // Wrap tafsir snippet
        const tafsirWords = ayah.tafsir.split(' ');
        let tLine = '';
        const tLines: string[] = [];
        for (let i = 0; i < tafsirWords.length && tLines.length < 3; i++) {
          const testT = tLine + tafsirWords[i] + ' ';
          if (ctx.measureText(testT).width > maxWidth - 60) {
            tLines.push(tLine);
            tLine = tafsirWords[i] + ' ';
          } else {
            tLine = testT;
          }
        }
        if (tLine && tLines.length < 3) tLines.push(tLine);

        tLines.forEach((tl, idx) => {
          ctx.fillText(tl.trim(), width / 2, tafsirY + (idx * 36));
        });
      }
    }

    // Bottom Footer: Waqf & App Seal
    ctx.textAlign = 'center';
    ctx.fillStyle = isLight ? '#78716c' : '#64748b';
    ctx.font = '500 20px "Cairo", sans-serif';
    ctx.fillText('تطبيق بيان | مصحف وقف إسلامي رقمي مجاني', width / 2, height - 100);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);
    const link = document.createElement('a');
    link.download = `Bayan_Ayah_${surahName}_${ayah.numberInSurah}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    } catch {
      // Fallback: download
      handleDownload();
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (navigator.share) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Ayah_${surahName}.png`, { type: 'image/png' });
        try {
          await navigator.share({
            title: `آية من سورة ${surahName}`,
            text: `﴿ ${ayah.text} ﴾ [سورة ${surahName}: ${ayah.numberInSurah}]`,
            files: [file]
          });
        } catch {
          // ignore share cancel
        }
      });
    } else {
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Controls Sidebar */}
        <div className="w-full md:w-80 p-5 border-b md:border-b-0 md:border-l border-slate-800 bg-slate-950/80 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5" />
              <span>مصمم بطاقات الآيات</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">مقاس البطاقة</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAspectRatio('post')}
                className={`py-2 px-3 text-xs rounded-lg font-medium border transition-all ${
                  aspectRatio === 'post'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                مربع (1:1 Post)
              </button>
              <button
                onClick={() => setAspectRatio('story')}
                className={`py-2 px-3 text-xs rounded-lg font-medium border transition-all ${
                  aspectRatio === 'story'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                طولي (9:16 Story)
              </button>
            </div>
          </div>

          {/* Theme selection */}
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">طابع الهوية والخلفية</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'emerald', label: 'الزمردي', bg: 'bg-[#06281e]' },
                { id: 'midnight', label: 'كحلي ليلي', bg: 'bg-[#0f172a]' },
                { id: 'parchment', label: 'المخطوطة', bg: 'bg-[#fbf6ea] text-slate-900' },
                { id: 'amethyst', label: 'أرجواني', bg: 'bg-[#2e1065]' },
                { id: 'obsidian', label: 'فحمي داكن', bg: 'bg-[#111827]' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as CardTheme)}
                  className={`py-2 px-2 text-xs rounded-lg font-medium border text-center transition-all ${t.bg} ${
                    theme === t.id
                      ? 'ring-2 ring-emerald-400 border-white/40'
                      : 'border-slate-800 opacity-75 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>حجم الخط القرآني</span>
              <span>{fontSize}px</span>
            </div>
            <input
              type="range"
              min={26}
              max={56}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tafsir toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">إدراج ومضة من التفسير</span>
            <input
              type="checkbox"
              checked={includeTafsir}
              onChange={(e) => setIncludeTafsir(e.target.checked)}
              className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="mt-auto pt-3 flex flex-col gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all text-sm"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الصورة عالية الدقة</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'تم النسخ' : 'نسخ للحافظة'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة فورية</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="flex-1 bg-black/40 p-6 flex items-center justify-center overflow-auto">
          <div className="relative max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              className="max-h-[70vh] w-auto object-contain rounded-lg shadow-inner"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
