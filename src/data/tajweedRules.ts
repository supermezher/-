export interface TajweedRule {
  id: string;
  name: string;
  nameEn: string;
  colorHex: string;
  cssClass: string;
  category: 'ghunnah' | 'ikhfa' | 'idgham' | 'qalqalah' | 'madd' | 'tafkheem';
  definition: string;
  letters: string[];
  mizan: string; // e.g. "حركتان", "4-5 حركات"
  exampleQuran: string;
  exampleExplanation: string;
  benefit: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  {
    id: 'ghunnah',
    name: 'الغُنّة المشددة',
    nameEn: 'Ghunnah',
    colorHex: '#10b981',
    cssClass: 'tajweed-ghunnah',
    category: 'ghunnah',
    definition: 'صوت رخيم يخرج من الخيشوم ملازم للنون والميم المشددتين بمقدار حركتين.',
    letters: ['نّ', 'مّ'],
    mizan: 'حركتان (كالقبض والبسط)',
    exampleQuran: 'إِنَّ ٱلَّذِينَ كَفَرُوا۟ / عَمَّ يَتَسَآءَلُونَ',
    exampleExplanation: 'النطق بصوت الغنة من الخيشوم دون زيادة أو نقصان مع الحفاظ على التشديد.',
    benefit: 'إعطاء الحرف كمال حقه الصوتي وعدم الإسراع فيه.'
  },
  {
    id: 'ikhfa',
    name: 'الإخفاء الحقيقي والشفوي',
    nameEn: 'Ikhfa (Concealment)',
    colorHex: '#f59e0b',
    cssClass: 'tajweed-ikhfa',
    category: 'ikhfa',
    definition: 'النطق بالحرف بصفة بين الإظهار والإدغام عارٍ عن التشديد مع بقاء الغنة.',
    letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
    mizan: 'حركتان',
    exampleQuran: 'مِن قَبْلِ / كُنتُمْ / يَنتَهُوا۟',
    exampleExplanation: 'ستر مخرج النون الساكنة عند ملاقاة حروف الإخفاء، وتفخيم الغنة إن كان الحرف مفخماً وترقيقها إن كان مرققاً.',
    benefit: 'سلاسة الانتقال الصوتي وتزيين القراءة بالرنين الخيشومي الهادئ.'
  },
  {
    id: 'idgham',
    name: 'الإدغام (بغنة وبغير غنة)',
    nameEn: 'Idgham (Merging)',
    colorHex: '#06b6d4',
    cssClass: 'tajweed-idgham',
    category: 'idgham',
    definition: 'إدخال حرف ساكن في حرف متحرك بحيث يصيران حرفاً واحداً مشدداً.',
    letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن (يرملون)'],
    mizan: 'حركتان (بغنة: ينمو) / بدون غنة (ل، ر)',
    exampleQuran: 'مَن يَقُولُ / مِن رَّبِّهِمْ / مِّن مَّالٍ',
    exampleExplanation: 'تذويب النون الساكنة بالكلية في الحرف التالي، وتظهر الغنة واضحة في حروف (ي-ن-م-و).',
    benefit: 'التخفيف والانسجام اللساني الفصيح.'
  },
  {
    id: 'qalqalah',
    name: 'القلقلة (صغرى وكبرى)',
    nameEn: 'Qalqalah (Echoing)',
    colorHex: '#38bdf8',
    cssClass: 'tajweed-qalqalah',
    category: 'qalqalah',
    definition: 'اضطراب الصوت عند النطق بالحرف الساكن حتى يُسمع له نبرة قوية تميزه.',
    letters: ['ق', 'ط', 'ب', 'ج', 'د (قطب جد)'],
    mizan: 'نبرة صوتية اضطرابية سريعة',
    exampleQuran: 'ٱلْفَلَقِ ﴿١﴾ / تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ / حَبْلٌ مِّن مَّسَدٍ',
    exampleExplanation: 'تكون كبرى عند الوقف على الحرف المشدد أو المخفف، وصغرى في وسط الكلمة أو الكلام.',
    benefit: 'بيان صفة الشدة والجهر في الحرف وعدم ضياعه.'
  },
  {
    id: 'madd-wajib',
    name: 'المد المتصل والمنفصل والعارض',
    nameEn: 'Madd Wajib & Jaiz (4-5 Counts)',
    colorHex: '#f43f5e',
    cssClass: 'tajweed-madd-wajib',
    category: 'madd',
    definition: 'إطالة الصوت بحرف المد إذا جاء بعده همز في كلمة واحدة (متصل) أو كلمتين (منفصل).',
    letters: ['ا', 'و', 'ي'],
    mizan: '4 إلى 5 حركات (المتصل واجب، والمنفصل جائز)',
    exampleQuran: 'جَآءَ / سُوٓءَ / بِمَآ أُنزِلَ / ٱلسَّمَآءِ',
    exampleExplanation: 'مد الصوت بزمن متساوٍ يملأ النفس خشوعاً ويزين الترتيل.',
    benefit: 'التأني والتمكين المعنوي لكلمات التعظيم والنداء والوحي.'
  },
  {
    id: 'madd-lazim',
    name: 'المد اللازم (الكلمي والحرفي)',
    nameEn: 'Madd Lazim (6 Counts)',
    colorHex: '#a855f7',
    cssClass: 'tajweed-madd-lazim',
    category: 'madd',
    definition: 'أن يأتي بعد حرف المد سكون أصلي لازم وصلاً ووقفاً في كلمة أو في حرف هجائي.',
    letters: ['ا', 'و', 'ي'],
    mizan: '6 حركات مشبعة وجوباً',
    exampleQuran: 'وَلَا ٱلضَّآلِّينَ / ٱلصَّآخَّةُ / الٓمٓ / قٓ',
    exampleExplanation: 'أطول المدود في القرآن، يُمد 6 حركات كاملة دون تسرع.',
    benefit: 'هيبة الكلمة وجلال معناها في مواقف الفصل والإنذار وفواتح السور.'
  },
  {
    id: 'tafkheem',
    name: 'التفخيم والاستعلاء',
    nameEn: 'Tafkheem (Emphatic letters)',
    colorHex: '#60a5fa',
    cssClass: 'tajweed-tafkheem',
    category: 'tafkheem',
    definition: 'سِمن يدخل على صوت الحرف حتى يمتلئ الفم بصداه، في حروف الاستعلاء وبعض أحوال الراء ولام لفظ الجلالة.',
    letters: ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ (خص ضغط قظ)'],
    mizan: 'حسب مرتبة الحرف (المفتوح بعده ألف، ثم المفتوح، ثم المضموم، إلخ)',
    exampleQuran: 'خَالِدِينَ / ٱلصِّرَاطَ / ٱلظَّالِمِينَ / قَالَ',
    exampleExplanation: 'رفع أقصى اللسان إلى الحنك الأعلى وتوجيه الهواء للأعلى.',
    benefit: 'فخامة الجرس اللغوي القرآني وتمييز الحروف القوية من الضعيفة.'
  }
];

export interface TajweedQuizQuestion {
  id: number;
  question: string;
  ayahSnippet: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  ruleCategory: string;
}

export const TAJWEED_QUIZ: TajweedQuizQuestion[] = [
  {
    id: 1,
    question: 'ما هو حكم النون الساكنة في قوله تعالى: ﴿مِن بَعْدِ﴾؟',
    ayahSnippet: 'مِن بَعْدِ مَآ جَآءَتْهُمُ ٱلْبَيِّنَاتُ',
    options: ['إظهار حلقي', 'إقلاب (قلب النون ميماً مع الغنة)', 'إدغام بغنة', 'إخفاء حقيقي'],
    correctIndex: 1,
    explanation: 'تقلب النون الساكنة أو التنوين ميماً مخفاة بغنة حركتين إذا جاء بعدها حرف الباء، وتوضع ميم قائمة صغيرة (مـ) بالمصحف.',
    ruleCategory: 'ikhfa'
  },
  {
    id: 2,
    question: 'كم عدد حركات المد اللازم في قوله تعالى: ﴿وَلَا ٱلضَّآلِّينَ﴾؟',
    ayahSnippet: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    options: ['حركتان', '4 حركات', '6 حركات وجوباً', 'يجوز فيه الوجهان'],
    correctIndex: 2,
    explanation: 'المد اللازم الكلمي المثقل يمد بمقدار 6 حركات مشبعة وجوباً عند جميع القراء لمجيء السكون الأصلي بعد حرف المد.',
    ruleCategory: 'madd'
  },
  {
    id: 3,
    question: 'أي من الحروف الآتية هو أحد حروف القلقلة (قطب جد)؟',
    ayahSnippet: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾',
    options: ['الدال (د)', 'السين (س)', 'الراء (ر)', 'الحاء (ح)'],
    correctIndex: 0,
    explanation: 'حروف القلقلة خمسة مجموعة في جملة (قَطْبُ جَدٍّ)، وعند الوقف عليها في ﴿أَحَدْ﴾ تقلقل قلقلة كبرى واضحة.',
    ruleCategory: 'qalqalah'
  },
  {
    id: 4,
    question: 'ما حكم الميم المشددة في قوله تعالى: ﴿عَمَّ يَتَسَآءَلُونَ﴾؟',
    ayahSnippet: 'عَمَّ يَتَسَآءَلُونَ ﴿١﴾ عَنِ النَّبَإِ الْعَظِيمِ',
    options: ['إخفاء شفوي', 'غنة مشددة بمقدار حركتين', 'إدغام مثلين', 'إظهار مطلق'],
    correctIndex: 1,
    explanation: 'النون والميم المشددتان حكمهما الغنة المشددة بمقدار حركتين وصلاً ووقفاً، وصوتها يخرج من الخيشوم.',
    ruleCategory: 'ghunnah'
  }
];
