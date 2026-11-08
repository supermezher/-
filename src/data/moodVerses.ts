export interface MoodVerseCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  themeColor: string;
  verses: {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    arabicText: string;
    tafsirHint: string;
    reflection: string;
  }[];
}

export const MOOD_CATEGORIES: MoodVerseCategory[] = [
  {
    id: 'anxiety-sorrow',
    title: 'عند الحزن وضيق الصدر',
    description: 'سكينة تطمئن القلب المكلوم وتنزع الهم',
    iconName: 'HeartHandshake',
    themeColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
    verses: [
      {
        surahNumber: 94,
        surahName: 'الشرح',
        ayahNumber: 5,
        arabicText: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ﴿٦﴾',
        tafsirHint: 'تأكيد إلهي جازم: لن يغلب عسر واحد يسرين، واليسر مصاحب للعسر في باطنه.',
        reflection: 'حين تضيق بك السبل، اعلم أن فرج الله لا يأتي بعد العسر بل يرافقه وينبثق من رحمه.'
      },
      {
        surahNumber: 15,
        surahName: 'الحجر',
        ayahNumber: 97,
        arabicText: 'وَلَقَدْ نَعْلَمُ أَنَّكَ يَضِيقُ صَدْرُكَ بِمَا يَقُولُونَ ﴿٩٧﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ ٱلسَّـٰجِدِينَ ﴿٩٨﴾',
        tafsirHint: 'علاج نبوي رباني لضيق الصدر: الفزع إلى التسبيح والسجود لله.',
        reflection: 'أقرب ما تكون لفك قيود الحزن عندما تضع جبينك على الأرض شاكياً لخالقك.'
      },
      {
        surahNumber: 13,
        surahName: 'الرعد',
        ayahNumber: 28,
        arabicText: 'ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ ﴿٢٨﴾',
        tafsirHint: 'القلوب جبلت على القلق حتى تأوي إلى كنف ذكر الله ومحبته.',
        reflection: 'مهما تلاطمت أمواج الفتن والمصائب، ففي ترديد اسم الله واحة أمان لا تنضب.'
      }
    ]
  },
  {
    id: 'fear-uncertainty',
    title: 'عند الخوف والقلق من المستقبل',
    description: 'حصن التوكل واليقين بأن الأمور بيد الله وحده',
    iconName: 'ShieldAlert',
    themeColor: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300',
    verses: [
      {
        surahNumber: 65,
        surahName: 'الطلاق',
        ayahNumber: 3,
        arabicText: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ ۚ إِنَّ ٱللَّهَ بَـٰلِغُ أَمْرِهِۦ ۚ',
        tafsirHint: 'من فوّض أمره لله كفاه كل ما أهمه من أمر دنياه وآخرته.',
        reflection: 'حسبك الله: أي كافيك.. فإذا كان خالق الأكوان كافيك فممن تخاف؟'
      },
      {
        surahNumber: 9,
        surahName: 'التوبة',
        ayahNumber: 51,
        arabicText: 'قُل لَّن يُصِيبَنَآ إِلَّا مَا كَتَبَ ٱللَّهُ لَنَا هُوَ مَوْلَىٰنَا ۚ وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ ﴿٥١﴾',
        tafsirHint: 'تأمل قوله (لنا) لا (علينا)، فكل قدر الله للمؤمن خير ونعمة ومربح.',
        reflection: 'يقينك بأن مقاديرك كُتبت بلطف من يحبك أكثر من والديك ينسف كل ذرة رعب.'
      }
    ]
  },
  {
    id: 'sickness-healing',
    title: 'عند المرض وطلب الشفاء والرحمة',
    description: 'شفاء للأرواح والأبدان وأمل بالمعافاة',
    iconName: 'Activity',
    themeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
    verses: [
      {
        surahNumber: 26,
        surahName: 'الشعراء',
        ayahNumber: 80,
        arabicText: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ ﴿٨٠﴾',
        tafsirHint: 'أدب إبراهيم الخليل عليه السلام: نسب المرض لنفسه والشفاء لله وحده تكرماً.',
        reflection: 'الأطباء أسباب ووسائط، والشافي الحقيقي الذي يبرئ السقم هو رب الأرباب.'
      },
      {
        surahNumber: 21,
        surahName: 'الأنبياء',
        ayahNumber: 83,
        arabicText: 'وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُۥٓ أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ ﴿٨٣﴾',
        tafsirHint: 'دعاء أيوب بعد سنوات الابتلاء: غاية الأدب والافتقار والثناء على الله.',
        reflection: 'لم يطلب صراحة الشفاء بل عرض حاله على أرحم الراحمين فاستجاب له فوراً.'
      }
    ]
  },
  {
    id: 'repentance-hope',
    title: 'عند التوبة والرغبة في العودة لله',
    description: 'باب الله المفتوح الذي لا يوصد في وجه نادم',
    iconName: 'Sparkles',
    themeColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300',
    verses: [
      {
        surahNumber: 39,
        surahName: 'الزمر',
        ayahNumber: 53,
        arabicText: '۞ قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ',
        tafsirHint: 'أرجى آية في كتاب الله! خاطبهم بـ (يا عبادي) رغم إسرافهم بالمعاصي.',
        reflection: 'لا تدع الشيطان يوهمك أن ذنبك أكبر من رحمة وسعت السماوات والأرض.'
      },
      {
        surahNumber: 3,
        surahName: 'آل عمران',
        ayahNumber: 135,
        arabicText: 'وَٱلَّذِينَ إِذَا فَعَلُوا۟ فَـٰحِشَةً أَوْ ظَلَمُوٓا۟ أَنفُسَهُمْ ذَكَرُوا۟ ٱللَّهَ فَٱسْتَغْفَرُوا۟ لِذُنُوبِهِمْ وَمَن يَغْفِرُ ٱلذُّنُوبَ إِلَّا ٱللَّهُ',
        tafsirHint: 'سياق الآية في وصف المتقين! فهم يخطئون لكن ميزتهم سرعة الأوبة والذكر.',
        reflection: 'العبرة ليست بعدم السقوط، بل بسرعة النهوض والاستغفار بصدق.'
      }
    ]
  },
  {
    id: 'gratitude-joy',
    title: 'عند الفرح والنعمة والشكر',
    description: 'تثبيت النعم واستزادتها بالاعتراف بالفضل لمن أسداه',
    iconName: 'Sun',
    themeColor: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-300',
    verses: [
      {
        surahNumber: 14,
        surahName: 'إبراهيم',
        ayahNumber: 7,
        arabicText: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِى لَشَدِيدٌ ﴿٧﴾',
        tafsirHint: 'قيد النعم هو الشكر، والزيادة الإلهية موعودة غير مقطوعة للشاكرين.',
        reflection: 'كل نعمة لا تقربك من الله فهي استدراج، والشكر يحول النعمة العابرة إلى أجر دائم.'
      },
      {
        surahNumber: 27,
        surahName: 'النمل',
        ayahNumber: 40,
        arabicText: 'قَالَ هَـٰذَا مِن فَضْلِ رَبِّى لِيَبْلُوَنِىٓ ءَأَشْكُرُ أَمْ أَكْفُرُ ۖ',
        tafsirHint: 'موقف سليمان عليه السلام حين أوتي ملكاً لا ينبغي لأحد من بعده.',
        reflection: 'لا تنسب الفضل لذكائك أو جهدك، بل تواضع وقل: هذا من فضل ربي.'
      }
    ]
  }
];
