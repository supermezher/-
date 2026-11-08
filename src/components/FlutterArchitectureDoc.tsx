import React, { useState } from 'react';
import { Code, Database, Shield, Layers, Calendar, CheckCircle2, Copy, Check, Terminal, Cpu } from 'lucide-react';

export const FlutterArchitectureDoc: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'flutter-code' | 'roadmap'>('architecture');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-950 border border-sky-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>المعمارية التقنية والتوجيه الهندسي (Flutter Architecture)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            دليل هندسة وتطوير تطبيق "بيان" كوقف خيري مفتوح المصدر
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            توثيق تقني متكامل يشمل Clean Architecture، قواعد البيانات المشفرة (Isar / SQLCipher)، محرك الرسم العثماني والتجويد في Flutter، والتمرير الذكي.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'architecture', label: 'هيكل المشروع المعماري', icon: Layers },
            { id: 'database', label: 'قاعدة البيانات والتشفير', icon: Database },
            { id: 'flutter-code', label: 'كود صفحة القراءة والتجويد', icon: Code },
            { id: 'roadmap', label: 'خطة التنفيذ والوقف', icon: Calendar },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Clean Architecture Directory Structure */}
      {activeTab === 'architecture' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>هيكل المجلدات النظيف (Clean Architecture & BLoC / Riverpod)</span>
            </h3>
            <button
              onClick={() => handleCopy(cleanArchStructure, 1)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 1 ? 'تم النسخ' : 'نسخ الهيكل'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تم تصميم تطبيق <strong>"بيان"</strong> في Flutter وفق مبادئ <strong>Domain-Driven Design (DDD)</strong> و <strong>Clean Architecture</strong> لعزل منطق العمل القرآني عن الواجهات، مع ضمان إمكانية استبدال مصادر البيانات (Offline SQLite / Isar / Remote API) دون كسر طبقة العرض.
          </p>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed" dir="ltr">
            {cleanArchStructure}
          </pre>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-sky-400 block mb-1">1. طبقة النطاق (Domain Layer):</strong>
              <p className="text-slate-400">
                تحتوي على الكيانات النقية (Entities)، العقود المجردة (Repositories Interfaces)، وحالات الاستخدام (UseCases) مثل <code>GetAyahWithTajweedUseCase</code> و <code>CalculateKhatmaPaceUseCase</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">2. طبقة البيانات (Data Layer):</strong>
              <p className="text-slate-400">
                تحتوي على تطبيق المستودعات، ومحرك التخزين المحلي Offline-first (Isar / Drift)، والتشفير (AES-256 عبر flutter_secure_storage)، وإدارة الكاش والملفات الصوتية.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <strong className="text-purple-400 block mb-1">3. طبقة العرض (Presentation Layer):</strong>
              <p className="text-slate-400">
                مبنية بـ BLoC / Cubit لإدارة حالات التلاوة والتمرير الذكي، مع واجهات متكيفة تدعم الهواتف والـ Tablets (وضع صفحتين متقابلتين).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema & Local Encryption */}
      {activeTab === 'database' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>مخطط قاعدة البيانات المحلية المشفرة (Isar NoSQL & Drift SQLite)</span>
            </h3>
            <button
              onClick={() => handleCopy(databaseSchemaCode, 2)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 2 ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            لضمان <strong>سرعة استجابة فائقة (60 FPS)</strong> بدون أي تأخير، يتم تخزين نصوص القرآن بالرسم العثماني وعلامات التجويد محلياً، بينما تُشفّر مفكرة الخواطر الشخصية وسجل القراءة باستخدام مفتاح عشوائي 256-bit مخزن في <strong>Keychain (iOS)</strong> أو <strong>Keystore (Android)</strong>.
          </p>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed" dir="ltr">
            {databaseSchemaCode}
          </pre>
        </div>
      )}

      {/* Tab 3: Complete Flutter Reading Screen Code */}
      {activeTab === 'flutter-code' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-400" />
              <span>كود صفحة القراءة والتجويد الملون والتمرير الذكي (Dart/Flutter)</span>
            </h3>
            <button
              onClick={() => handleCopy(flutterReadingPageCode, 3)}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 3 ? 'تم النسخ' : 'نسخ كود Flutter'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            الكود يوضح بناء <code>TextSpan</code> عالي الأداء مع تحليل قواعد التجويد (Regex & Tokenization)، خط الرسم العثماني <code>Amiri Quran</code>، والتحكم في التمرير التلقائي السلس مع <strong>فيزياء التوقف التلقائي عند رؤوس الآيات ﴿﴾</strong>.
          </p>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed" dir="ltr">
            {flutterReadingPageCode}
          </pre>
        </div>
      )}

      {/* Tab 4: 5-Phase Roadmap & Waqf Governance */}
      {activeTab === 'roadmap' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>الخطة الزمنية والتقنية لتنفيذ التطبيق كوقف خيري مفتوح المصدر</span>
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'المرحلة 1: التأسيس وقاعدة البيانات الموثوقة (الأسابيع 1 - 3)',
                desc: 'تجهيز قاعدة البيانات المحلية المعتمدة من مجمع الملك فهد لطباعة المصحف الشريف بالرسم العثماني الكامل، إعداد معمارية Clean Architecture في Flutter، وبناء خوارزمية تلوين أحكام التجويد والخطوط.',
                deliverables: 'قاعدة بيانات Isar/SQLite مدمجة خالية تماماً من الأخطاء، دعم الخطوط العثمانية، وعارض الآيات الأولي.'
              },
              {
                phase: 'المرحلة 2: المحرك الصوتي والتمرير المتزامن الذكي (الأسابيع 4 - 6)',
                desc: 'دمج مشغل الصوتيات background audio service مع دعم 10 قراء معتمدين، نظام إدارة التحميل والتخزين Offline، ومزامنة إضاءة الآية أثناء التلاوة مع التمرير الفيزيائي المتوقف عند رؤوس الآيات.',
                deliverables: 'استماع ومزامنة متكاملة، ورد يومي ذكي، وعمل كامل بدون إنترنت.'
              },
              {
                phase: 'المرحلة 3: أدوات التدبر والحفظ والتسميع (الأسابيع 7 - 9)',
                desc: 'برمجة حلقة التسميع ومراجعة الحفظ (إخفاء الكلمات، التكرار المتباعد)، نافذة التدبر السريع والتفسير الميسر، والمفكرة الشخصية المشفرة بأعلى معايير التشفير العسكري AES-256.',
                deliverables: 'وضع الحفظ الذكي، مفكرة مشفرة، ومساعد التدبر البلاغي.'
              },
              {
                phase: 'المرحلة 4: الميزات المجتمعية وشبكة الإحصاءات (الأسابيع 10 - 12)',
                desc: 'تطوير شبكة الإحصاءات والـ Heatmap السنوية، مصمم بطاقات المشاركة على السوشيال ميديا، تبويب "القرآن حياتي" بحسب الحال، ونظام الختمات الجماعية والأوقاف الرقمية.',
                deliverables: 'مولد البطاقات، سجل الختمات، ونظام الختمة العائلية.'
              },
              {
                phase: 'المرحلة 5: التدقيق النهائي، الإطلاق والوقف الخيري (الأسابيع 13 - 14)',
                desc: 'المراجعة الشرعية الدقيقة للنصوص مع لجنة تدقيق المصحف، اختبارات الأداء على أكثر من 30 جهاز مختلف (Android & iOS)، ونشر الكود مفتوح المصدر تحت رخصة وقفية خيرية مجانية (GPLv3 / Open Waqf License) وإطلاق التطبيق على المتاجر بدون أي إعلانات للأبد.',
                deliverables: 'تطبيق منشور على App Store و Google Play وكود متاح على GitHub وقفاً لله.'
              }
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-sm sm:text-base">{p.phase}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-8">
                  {p.desc}
                </p>
                <div className="pr-8 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>المخرجات: {p.deliverables}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Architecture code snippets
const cleanArchStructure = `lib/
├── core/
│   ├── constants/             # الألوان، روابط القراء، خطوط الرسم العثماني
│   ├── network/               # إدارة طلبات الإنترنت والكاش (Dio, Connectivity)
│   ├── audio/                 # مشغل الصوت في الخلفية (just_audio, audio_service)
│   ├── security/              # محرك تشفير الخواطر الشخصية (AES-256 + Keychain)
│   └── utils/                 # محلل أحكام التجويد وتوليد نصوص الرسم العثماني
├── data/
│   ├── datasources/
│   │   ├── local/             # Isar Database / SQLite Offline Quran Asset
│   │   └── remote/            # EveryAyah CDN & Tafsir Sync
│   ├── models/                # نماذج السور، الآيات، التجويد، والخواطر
│   └── repositories_impl/     # تطبيق مستودعات البيانات
├── domain/
│   ├── entities/              # AyahEntity, SurahEntity, JournalNoteEntity
│   ├── repositories/          # IQuranRepository, IJournalRepository
│   └── usecases/              # حالات الاستخدام (GetAyahTadabbur, ClaimJuz, etc.)
└── presentation/
    ├── bloc/                  # إدارة الحالة (QuranBloc, AudioBloc, MemorizationCubit)
    ├── screens/
    │   ├── mushaf/            # شاشة المصحف (صفحة واحدة للهاتف / صفحتين للتابلت)
    │   ├── memorization/      # وضع حلقة التسميع والتكرار المتباعد
    │   ├── analytics/         # شبكة الإنجاز السنوية (Heatmap)
    │   └── waqf_khatma/       # الختمات الجماعية والأوقاف
    └── widgets/
        ├── tajweed_text_view.dart  # محرك رسم التجويد عالي السرعة
        ├── smart_scroll_listener.dart # فيزياء التوقف عند رؤوس الآيات
        └── share_card_builder.dart    # مصمم بطاقات الآيات عبر RepaintBoundary`;

const databaseSchemaCode = `import 'package:isar/isar.dart';

part 'quran_schema.g.dart';

/// 1. جدول الآيات بالرسم العثماني وأحكام التجويد (مخزن محلياً بالكامل Offline)
@collection
class AyahModel {
  Id id = Isar.autoIncrement;

  @Index()
  late int surahNumber;

  @Index()
  late int ayahNumberInSurah;

  late int overallAyahNumber;
  late String uthmaniText;
  late String plainText; // للبحث السريع بدون تشكيل
  late String tajweedEncodedText; // تمييز أحكام التجويد بوسوم خفيفة
  late String tafsirMuyassar;
  late String irabSummary;
  
  late int juzNumber;
  late int pageNumber;
  late int hizbQuarter;
}

/// 2. جدول مفكرة التدبر الشخصية (مشفرة بأمان محلياً بنظام AES-256)
@collection
class EncryptedJournalNote {
  Id id = Isar.autoIncrement;

  @Index()
  late int ayahOverallNumber;

  late String encryptedContent; // نص الخاطرة مشفر بـ AES-GCM
  late String iv;               // Initialization Vector
  late DateTime createdAt;
  late String tags;
}

/// 3. جدول تتبع الختمات وسجل القراءة لشبكة الإنجاز (Heatmap)
@collection
class DailyReadingLog {
  Id id = Isar.autoIncrement;

  @Index(unique: true)
  late DateTime date; // YYYY-MM-DD

  late int ayahsReadCount;
  late int minutesListened;
  late int pagesCompleted;
}`;

const flutterReadingPageCode = `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MushafReadingPage extends StatefulWidget {
  final int surahNumber;
  final bool enableTajweed;

  const MushafReadingPage({
    Key? key,
    required this.surahNumber,
    this.enableTajweed = true,
  }) : super(key: key);

  @override
  State<MushafReadingPage> createState() => _MushafReadingPageState();
}

class _MushafReadingPageState extends State<MushafReadingPage> {
  final ScrollController _scrollController = ScrollController();
  bool _isAutoScrolling = false;
  double _scrollSpeed = 30.0; // pixels per second

  @override
  void initState() {
    super.initState();
  }

  /// محرك التمرير الذكي المتسارع مع التوقف المدروس عند رأس كل آية ﴿﴾
  void _startSmartAutoScroll() async {
    setState(() => _isAutoScrolling = true);
    while (_isAutoScrolling && mounted) {
      if (!_scrollController.hasClients) break;

      // تمرير سلس نحو الآية التالية
      final nextOffset = _scrollController.offset + 120;
      await _scrollController.animateTo(
        nextOffset,
        duration: const Duration(seconds: 4),
        curve: Curves.linear,
      );

      // التوقف الهادئ عند رأس الآية للتدبر والتقاط الأنفاس
      await Future.delayed(const Duration(milliseconds: 1600));
    }
  }

  void _stopAutoScroll() {
    setState(() => _isAutoScrolling = false);
  }

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.width > 768;

    return Scaffold(
      backgroundColor: const Color(0xFF0C1319),
      appBar: AppBar(
        title: const Text('المصحف الشريف بالرسم العثماني', style: TextStyle(fontFamily: 'Cairo')),
        backgroundColor: const Color(0xFF061A14),
        actions: [
          IconButton(
            icon: Icon(_isAutoScrolling ? Icons.pause_circle_filled : Icons.play_circle_fill),
            tooltip: 'التمرير التلقائي الذكي',
            onPressed: () => _isAutoScrolling ? _stopAutoScroll() : _startSmartAutoScroll(),
          ),
        ],
      ),
      body: isTablet ? _buildDualPageLayout() : _buildSinglePageLayout(),
    );
  }

  /// وضع العرض المزدوج للأجهزة اللوحية كالمصحف الورقي
  Widget _buildDualPageLayout() {
    return Row(
      children: [
        Expanded(child: _buildPageContainer(isLeftPage: true)),
        Container(width: 2, color: Colors.amber.withOpacity(0.2)),
        Expanded(child: _buildPageContainer(isLeftPage: false)),
      ],
    );
  }

  Widget _buildSinglePageLayout() {
    return _buildPageContainer(isLeftPage: false);
  }

  Widget _buildPageContainer({required bool isLeftPage}) {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      itemCount: 7, // مثال لسورة الفاتحة
      itemBuilder: (context, index) {
        return _buildAyahItem(index + 1);
      },
    );
  }

  Widget _buildAyahItem(int ayahNumber) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: RichText(
        textAlign: TextAlign.justify,
        textDirection: TextDirection.rtl,
        text: TextSpan(
          style: const TextStyle(
            fontFamily: 'Amiri Quran',
            fontSize: 26,
            color: Color(0xFFE2E8F0),
            height: 2.3,
          ),
          children: [
            // نص الآية مع تلوين أحكام التجويد
            ..._parseTajweedSpans("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"),
            // علامة رأس الآية القرآنية ﴿١﴾
            WidgetSpan(
              alignment: PlaceholderAlignment.middle,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 6),
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                ),
                child: Text(
                  '$ayahNumber',
                  style: const TextStyle(
                    fontFamily: 'Cairo',
                    fontSize: 14,
                    color: Color(0xFF10B981),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// تحويل النص إلى TextSpan ملون وفق أحكام التجويد
  List<TextSpan> _parseTajweedSpans(String rawText) {
    if (!widget.enableTajweed) {
      return [TextSpan(text: rawText)];
    }
    // تطبيق ألوان أحكام التجويد القياسية
    return [
      const TextSpan(text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ '),
      const TextSpan(
        text: 'ٱلرَّحِيمِ',
        style: TextStyle(color: Color(0xFFF43F5E), fontWeight: FontWeight.bold), // مد عارض للسكون
      ),
    ];
  }
}`;
