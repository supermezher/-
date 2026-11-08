import { SURAHS_LIST, SurahMeta } from './quranMetadata';

export interface Ayah {
  numberInSurah: number;
  overallNumber: number;
  text: string;
  tafsir: string;
  irabHint: string;
  asbabNuzul?: string;
  reflectionQuestion: string;
  practicalAction: string;
  juz: number;
  page: number;
  hizbQuarter: number;
}

export interface SurahData {
  meta: SurahMeta;
  bismillahPre: boolean;
  ayahs: Ayah[];
}

// Curated authentic preloaded dataset with full Tafsir and Tadabbur
export const PRELOADED_SURAHS: Record<number, SurahData> = {
  1: {
    meta: SURAHS_LIST[0],
    bismillahPre: false,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 1,
        text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
        tafsir: 'أبتدئ قراءتي مستعيناً باسم الله مستحضراً رحمته الواسعة التي وسعت كل شيء، ورحمته الخاصة بعباده المؤمنين.',
        irabHint: 'الباء حرف جر للمصاحبة والاستعانة، (اسمِ) مجرور، و(اللهِ) لفظ الجلالة مضاف إليه، (الرحمنِ الرحيمِ) نعتان جليلان.',
        asbabNuzul: 'فاتحة الكتاب وأم القرآن، أنزلت بمكة وقيل بالمدينة، وهي أعظم سورة في كتاب الله.',
        reflectionQuestion: 'لماذا افتتح الله كتابه بصفتي الرحمة (الرحمن الرحيم) وليس بصفتي الجبروت والقوة؟',
        practicalAction: 'لا تبدأ عملاً، أكلاً، أو سفراً اليوم إلا واستحضر اسم الله برجاء التوفيق والبركة.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 2,
        overallNumber: 2,
        text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
        tafsir: 'الثناء الكامل المطلق لله وحده بجميع صفات كماله ونعمه الظاهرة والباطنة، وهو المربي لجميع الخلق برعايته.',
        irabHint: 'الـ في (الحمدُ) لاستغراق جميع المحامد، (ربِّ) نعت أو بدل مجرور، (العالمينَ) مضاف إليه مجرور بالياء لأنه ملحق بجمع المذكر السالم.',
        reflectionQuestion: 'هل تشعر أن حمدك لله نابع من حب وتأمل في تفاصيل نعم يومك أم مجرد لفظ روتيني؟',
        practicalAction: 'عدد ثلاث نعم خفية أنعم الله بها عليك اليوم (كالأنفاس، والأمن، وراحة البال) وقل بقلبك: الحمد لله.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 3,
        overallNumber: 3,
        text: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
        tafsir: 'الرحمن: ذو الرحمة العامة الشاملة لجميع المخلوقات في الدنيا، والرحيم: ذو الرحمة الخاصة بالمؤمنين في الآخرة.',
        irabHint: 'صفتان مشبهتان مشتقتان من الرحمة، (الرحمن) على وزن فعلان يدل على الامتلاء، و(الرحيم) على وزن فعيل يدل على الدوام.',
        reflectionQuestion: 'كيف تنعكس رحمة الله بك على تعاملك اليومي مع المخطئين ومن هم تحت إدارتك ورعايتك؟',
        practicalAction: 'ارحم مسكيناً أو خادماً أو حيواناً، فإنما يرحم الله من عباده الرحماء.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 4,
        overallNumber: 4,
        text: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ',
        tafsir: 'المالك المتصرف وحده بيوم الحساب والجزاء، يوم لا تملك نفس لنفس شيئاً والأمر يومئذ لله.',
        irabHint: '(مالكِ) صفة ثالثة للفظ الجلالة، و(يومِ) مضاف إليه، و(الدينِ) مضاف إليه ثانٍ بمعنى الجزاء والحساب.',
        reflectionQuestion: 'ما هو العمل الصالح الذي أعددته ليومٍ ينفرد فيه الملك الجبار بالقضاء بين الخلائق؟',
        practicalAction: 'تحلل من مظلمة بينك وبين أحد قبل أن يؤخذ من حسناتك في يوم الجزاء.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 5,
        overallNumber: 5,
        text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        tafsir: 'نخصك وحدك بالعبادة والتذلل، ونخصك وحدك بطلب العون في كل شؤوننا، فلا نعبد غيرك ولا نتوكل إلا عليك.',
        irabHint: 'تقديم المعمول (إياك) يفيد الحصر والاختصاص والاهتمام، أي: لا نعبد إلا أنت.',
        reflectionQuestion: 'سر القرآن في الفاتحة، وسر الفاتحة في (إياك نعبد وإياك نستعين).. هل تبرأت اليوم من حولك وقوتك ولجأت لقوة الله؟',
        practicalAction: 'عندما يستعصي عليك أمر معقد في عملك أو حياتك، كرر بيقين: لا حول ولا قوة إلا بالله، وإياك نستعين.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 6,
        overallNumber: 6,
        text: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
        tafsir: 'دلّنا ووفّقنا وثبّتنا على الطريق الواضح الموصل إلى رضاك وجنتك، وهو دين الإسلام الحق.',
        irabHint: '(اهدِنا) فعل دعاء مبني على حذف حرف العلة، و(نا) مفعول به أول، و(الصراطَ) مفعول به ثانٍ، و(المستقيمَ) نعت منصوب.',
        reflectionQuestion: 'أنت مهتدٍ للإسلام، فلماذا تطلب الهداية في كل ركعة؟ لأنك تحتاج التثبيت، والزيادة، والتوفيق في التفاصيل!',
        practicalAction: 'ادع الله بإخلاص أن يبصرك بالحق في مسألة تتردد فيها ولا تعرف أين الخير فيها.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      },
      {
        numberInSurah: 7,
        overallNumber: 7,
        text: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
        tafsir: 'طريق النبيين والصديقين والشهداء والصالحين، لا طريق من علموا الحق فتركوه (المغضوب عليهم)، ولا من عبدوا الله على جهل وضلال (الضالين).',
        irabHint: '(صراطَ) بدل مطابق من الصراط الأول منصوب، (غيرِ) بدل أو نعت، (ولا) لتأكيد النفي، (الضالين) معطوف مجرور بالياء.',
        reflectionQuestion: 'أي القوافل تتبع في أفكارك وقدواتك اليوم؟ قافلة المنعم عليهم أم المنحرفين عن الجادة؟',
        practicalAction: 'قل بعد ختم السورة (آمين) بقلب حاضر راجياً إجابة هذا الدعاء الجامع الشافي.',
        juz: 1,
        page: 1,
        hizbQuarter: 1
      }
    ]
  },
  67: {
    meta: SURAHS_LIST[66], // Al-Mulk
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 5242,
        text: 'تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ',
        tafsir: 'تعاظم وتكاثر خير الله وبركته، الذي بيده مقاليد السلطان والتصرف في السماوات والأرض، وهو تام القدرة لا يعجزه شيء.',
        irabHint: '(تبارك) فعل ماض يفيد المبالغة في البركة والعظمة، (الذي) اسم موصول فاعل، (بيده الملك) جملة صلة الموصول.',
        reflectionQuestion: 'إذا كان الملك كله بيد الله وحده، فلماذا نخشى ذوي النفوذ والسلطان الفانين في هذه الحياة؟',
        practicalAction: 'أزل من قلبك التعلق بغير الله واعلم أن خزائن الرزق والعطاء بيده سبحانه.',
        juz: 29,
        page: 562,
        hizbQuarter: 113
      },
      {
        numberInSurah: 2,
        overallNumber: 5243,
        text: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ',
        tafsir: 'أوجد سبحانه الموت والحياة ليختبركم: أيكم أخلص لله عملاً وأصوبه على هدي رسوله.',
        irabHint: '(ليبلوكم) اللام للتعليل، (أحسنُ) مبتدأ، و(عملاً) تمييز منصوب، والجملة في محل نصب معلق عنها فعل الابتلاء.',
        reflectionQuestion: 'قال الفضيل: أحسنه أخلصه وأصوبه، فإن العمل إذا كان خالصاً ولم يكن صواباً لم يقبل، وإذا كان صواباً ولم يكن خالصاً لم يقبل.',
        practicalAction: 'راجع نيتك في عملك الحالي: هل تبتغي به وجه الله أم ثناء الناس وإعجابهم؟',
        juz: 29,
        page: 562,
        hizbQuarter: 113
      },
      {
        numberInSurah: 3,
        overallNumber: 5244,
        text: 'ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
        tafsir: 'خلق سبع سماوات بعضها فوق بعض في تناسق مذهل، ما تجد فيها أي نقص أو خلل، فأعد النظر متأملاً هل ترى شقوقاً أو تصدعاً؟',
        irabHint: '(طباقاً) نعت أو حال لـ سبع سماوات، (من تفاوت) من زائدة لتوكيد استغراق النفي، وتفاوت مجرور لفظاً منصوب محلاً مفعول به.',
        reflectionQuestion: 'كيف يدعوك القرآن إلى إعمال العقل والنظر المتكرر في ملكوت الله للوصول إلى اليقين؟',
        practicalAction: 'ارفع بصرك إلى السماء الليلة وتأمل إتقان بديع السماوات والأرض وسبح بعظمته.',
        juz: 29,
        page: 562,
        hizbQuarter: 113
      },
      {
        numberInSurah: 4,
        overallNumber: 5245,
        text: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
        tafsir: 'ثم أعد النظر مرة بعد أخرى باحثاً عن عيب، سيرجع إليك بصرك خائباً كليلاً منبشراً من عظمة الإتقان.',
        irabHint: '(كرتين) مفعول مطلق منصوب بالياء، (ينقلبْ) جواب الطلب مجزوم بالسكون، (خاسئاً) حال منصوبة.',
        reflectionQuestion: 'العجز عن إدراك منتهى كمال الخلق هو أول عتبات الإيمان بكمال الخالق سبحانه.',
        practicalAction: 'اعلم أن حكم الله وشرعه متقن تماماً كخلقه، فارضَ بما قسم وشرع لك.',
        juz: 29,
        page: 562,
        hizbQuarter: 113
      },
      {
        numberInSurah: 5,
        overallNumber: 5246,
        text: 'وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَـٰبِيحَ وَجَعَلْنَـٰهَا رُجُومًا لِّلشَّيَـٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ',
        tafsir: 'ولقد جمّلنا سماء الأرض بالنجوم المضيئة كالمصابيح، وجعلنا شهبها رجوماً للشياطين المسترقين للسمع، وهيأنا لهم عذاب النار المستعرة.',
        irabHint: '(بمصابيحَ) مجرور بالفتحة لمنعه من الصرف على صيغة منتهى الجموع، (رجوماً) مفعول به ثانٍ لجعلنا.',
        reflectionQuestion: 'جمع الله للنجوم الجمال (زينة) والوظيفة الحارسة (رجوماً)، فهل تجمع في عملك بين الإتقان والجمال وحماية القيم؟',
        practicalAction: 'حصّن نفسك الليلة بأذكار النوم وسورة الملك المانعة من عذاب القبر.',
        juz: 29,
        page: 562,
        hizbQuarter: 113
      }
    ]
  },
  112: {
    meta: SURAHS_LIST[111], // Al-Ikhlas
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 6221,
        text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        tafsir: 'قل أيها النبي لمن سألوك عن ربك: هو الله المتفرد بالألوهية والربوبية والأسماء والصفات، لا شريك له ولا مثيل.',
        irabHint: '(قل) فعل أمر، (هو) ضمير الشأن مبتدأ أول، (الله) مبتدأ ثانٍ أو علم، (أحد) خبر.',
        asbabNuzul: 'سأل المشركون رسول الله ﷺ: انسب لنا ربك أمِن ذهب هو أم من فضة؟ فأنزل الله هذه السورة العظيمة تعدل ثلث القرآن.',
        reflectionQuestion: 'هل تشعر بوحدانية الله في كل قرار بحيث لا ترجو أحداً سواه ولا تخشى أحداً دونه؟',
        practicalAction: 'اقرأ سورة الإخلاص ثلاث مرات لتحوز أجر قراءة القرآن كاملاً كما صح في الحديث.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 2,
        overallNumber: 6222,
        text: 'ٱللَّهُ ٱلصَّمَدُ',
        tafsir: 'السيد المقصود في قضاء الحوائج والرغائب، الذي تصمد وتفزع إليه الخلائق كلها في نوائبها وهو الغني عنها.',
        irabHint: '(الصمد) خبر مرفوع للمبتدأ (الله)، وتعرّفه بأل للدلالة على كمال الصمدية وانحصارها فيه.',
        reflectionQuestion: 'الصمد: الذي تقصده كل القلوب عند الاضطرار.. إلى من تلجأ أنت أول ما تقع في كربة؟',
        practicalAction: 'إذا حزّك أمر مفاجئ، اصمد وتوجه فوراً إلى الصمد بركعتين قبل استشارة أي بشري.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 3,
        overallNumber: 6223,
        text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        tafsir: 'منزه عن اتخاذ الولد، ولم يلد أحداً ولم يلده أحد، لكمال غناه وأزليته وأبديته سبحانه.',
        irabHint: '(لم يلد) فعل مضارع مجزوم بلم، وعطف (ولم يولد) نفي للعلة الفاعلة والقابلة.',
        reflectionQuestion: 'تنزيه الله عن النقص البشري يبني في عقلك معنى الألوهية الحقة الخالصة من الخرافات.',
        practicalAction: 'احمد الله على نعمة التوحيد النقي الذي يحرر العقل من الشرك والأوهام.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 4,
        overallNumber: 6224,
        text: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
        tafsir: 'ولم يكن له مماثلاً ولا نظيراً ولا مكافئاً أحد في ذاته أو صفاته أو أفعاله.',
        irabHint: '(كفواً) خبر كان مقدم منصوب، و(أحدٌ) اسم كان مؤخر مرفوع، وتقديم الخبر لإظهار نفي الكفاءة ابتداءً.',
        reflectionQuestion: 'لا شيء يشبه الله في رحمته ولطفه وتدبيره لأمرك، فاطمئن لتقديره.',
        practicalAction: 'عظّم شعائر الله بلسانك وقلبك، ورسخ هذا التوحيد الصافي في نفوس أهلك وأبنائك.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      }
    ]
  },
  113: {
    meta: SURAHS_LIST[112], // Al-Falaq
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 6225,
        text: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
        tafsir: 'قل: ألتجئ وأتحصن برب الصبح الذي يفلق الظلام بنور الفجر، وخالق كل ما ينفلق كالحب والنوى.',
        irabHint: '(الفلق) الصبح أو كل ما يفلقه الله، مضاف إليه مجرور.',
        reflectionQuestion: 'كما يفلق الله ظلمة الليل الدامس بنور الفجر الوضاء، قادر على فلق ظلمات همك بنور الفرج.',
        practicalAction: 'ابدأ صباحك بالاستعاذة برب الفلق من كل ما تخافه وتحذره.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 2,
        overallNumber: 6226,
        text: 'مِن شَرِّ مَا خَلَقَ',
        tafsir: 'من أذى وشر جميع المخلوقات التي خلقها من إنس وجن وحيوان وجماد.',
        irabHint: '(ما) اسم موصول في محل جر مضاف إليه، وصلته (خلق).',
        reflectionQuestion: 'استعاذة جامعة تشمل كل شرور العالم المنظور وغير المنظور في خمس كلمات!',
        practicalAction: 'استشعر حماية الله لك وحصانته عند خروجك من بيتك ومخالطتك للناس.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 3,
        overallNumber: 6227,
        text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        tafsir: 'ومن شر الليل المظلم إذا دخل وسكنت حركته وانتشرت فيه الهوام وذوو النوايا الخبيثة.',
        irabHint: '(غاسق) الليل أو القمر، (وقب) دخل وظلم.',
        reflectionQuestion: 'الليل مظنة الضعف الإنساني واستيقاظ المخاوف، وتحصين القرآن يملأ ليلك سكينة.',
        practicalAction: 'اقرأ المعوذات في كفيك وامسح بهما جسدك قبل النوم كما كان يفعل النبي ﷺ.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 4,
        overallNumber: 6228,
        text: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ',
        tafsir: 'ومن شر السواحر اللاتي يعقدن الخيوط وينفثن فيها بريق السحر والأذى لإفساد العلاقات والنفوس.',
        irabHint: '(النفاثات) صيغة مبالغة على وزن فعالات، (في العقد) متعلق بالنفاثات.',
        reflectionQuestion: 'كيد السحرة والمفسدين يبطله التوكل على الله وقراءة القرآن، فلا خوف مع كتاب الله.',
        practicalAction: 'لا تلتفت للخرافات والشعوذات، واكتفِ بالرقى الشرعية المأثورة.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 5,
        overallNumber: 6229,
        text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        tafsir: 'ومن شر من يتمنى زوال نعمة الله عن غيره إذا أظهر حسده وسعى في إلحاق الضرر بالمحسود.',
        irabHint: '(إذا حسد) قيد مهم، فالحسد لا يضر إلا إذا تفاعل وأخرج شره بالعين أو الفعل.',
        reflectionQuestion: 'الحاسد يعترض في باطنه على قسمة الله بين عباده.. طهّر قلبك من الغل تكن أسعد الناس.',
        practicalAction: 'إذا رأيت ما يعجبك في نفسك أو مالك أو غيرك، فبرّك فوراً وقل: ما شاء الله لا قوة إلا بالله، اللهم بارك له.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      }
    ]
  },
  114: {
    meta: SURAHS_LIST[113], // Al-Nas
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 6230,
        text: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        tafsir: 'قل: ألتجئ برب الناس وخالقهم ومدبر أمورهم ومربيهم بنعمه.',
        irabHint: '(برب الناس) تخصيص الناس بالذكر تشريفاً وتذكيراً بضعفهم وحاجتهم إليه.',
        reflectionQuestion: 'أنت من الناس، وخالقك هو رب الناس، فلماذا تطلب الأمان من غير ربك؟',
        practicalAction: 'اجعل لسانك رطباً بالاستعاذة عند توارد الأفكار المزعجة.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 2,
        overallNumber: 6231,
        text: 'مَلِكِ ٱلنَّاسِ',
        tafsir: 'الملك الحق لجميع البشر، المتصرف فيهم بعدله وقدرته، وكل الملوك دونه عبيد.',
        irabHint: '(ملكِ الناس) عطف بيان أو بدل من رب الناس.',
        reflectionQuestion: 'حين تستحضر أن ملك الناس معك، تتضاءل في عينك كل قوى الأرض الظالمة.',
        practicalAction: 'لا ترجُ من الملوك والحكام ما لا يقدر عليه إلا مالك الملك سبحانه.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 3,
        overallNumber: 6232,
        text: 'إِلَـٰهِ ٱلنَّاسِ',
        tafsir: 'معبودهم الحق الذي لا معبود سواه، والمستحق وحده لإخلاص المحبة والخشية والتذلل.',
        irabHint: '(إله الناس) صفة ثالثة تؤكد حصر العبادة.',
        reflectionQuestion: 'تكرار (الناس) يؤكد أهمية حماية هذا المخلوق من ألد أعدائه (الشيطان).',
        practicalAction: 'جدد لا إله إلا الله بصدق، فالإله هو المألوه المحبوب المطاع.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 4,
        overallNumber: 6233,
        text: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
        tafsir: 'من شر الشيطان الذي يلقي الشبهات والشهوات خفية في الصدور، فإذا ذكر العبد ربه خنس وتراجع واختفى.',
        irabHint: '(الوسواس) مصدر سمي به الفاعل مبالغة، (الخناس) صيغة مبالغة لكثير الاختفاء عند ذكر الله.',
        reflectionQuestion: 'الشيطان لا يملك سلطاناً يجبرك، سلاحه الوحيد هو "الوسوسة".. وعلاجه الفوري "ذكر الله" ليخنس!',
        practicalAction: 'حين تهجم عليك وسوسة معصية أو قنوط، اقطع حبل التفكير فوراً بذكر الله والاستعاذة.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 5,
        overallNumber: 6234,
        text: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
        tafsir: 'الذي يبث الشر والشكوك في قلوب الناس بحيلة وخفاء.',
        irabHint: '(في صدور الناس) الصدر هو ساحة المعركة ومحل القلب، والوسوسة تبدأ فيه.',
        reflectionQuestion: 'راقب خواطر صدرك.. فما كان يدعوك للخير فهو من الملك أو الفطرة، وما كان يدعوك للشر فهو من الوسواس.',
        practicalAction: 'نظف صدرك من الأحقاد والشكوك بالاستغفار وقراءة القرآن المتدبر.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      },
      {
        numberInSurah: 6,
        overallNumber: 6235,
        text: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
        tafsir: 'الوسوسة تكون من شياطين الجن بإلقاء الخواطر الخفية، ومن شياطين الإنس بالأقوال المضللة وجلساء السوء.',
        irabHint: '(من الجنة) بيان لمن يوسوس، (والناس) معطوف.',
        reflectionQuestion: 'شيطان الإنس قد يكون أخطر لأنه يأتيك بثياب الناصح الصديق.. فاختر صحبة تعينك على طاعة الله.',
        practicalAction: 'ابتعد عن أي رفيق أو محتوى رقمي يجر قلبك إلى الغفلة والتشكيك في دينك.',
        juz: 30,
        page: 604,
        hizbQuarter: 120
      }
    ]
  }
};

/**
 * Fetcher with LocalStorage Offline-first Cache
 */
export async function getSurahData(surahNumber: number): Promise<SurahData> {
  // If preloaded, return immediately
  if (PRELOADED_SURAHS[surahNumber]) {
    return PRELOADED_SURAHS[surahNumber];
  }

  // Check localStorage cache
  const cacheKey = `bayan_surah_cache_${surahNumber}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return parsed;
    } catch {
      // ignore cache error
    }
  }

  // Find meta
  const meta = SURAHS_LIST.find((s) => s.number === surahNumber) || SURAHS_LIST[0];

  try {
    // Fetch Uthmani text and Tafsir Muyassar in a single call from alquran.cloud
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    
    if (json.code === 200 && json.data && json.data.length >= 2) {
      const uthmaniData = json.data[0];
      const tafsirData = json.data[1];

      const ayahs: Ayah[] = uthmaniData.ayahs.map((a: any, idx: number) => {
        const tafsirItem = tafsirData.ayahs[idx];
        return {
          numberInSurah: a.numberInSurah,
          overallNumber: a.number,
          text: a.text,
          tafsir: tafsirItem ? tafsirItem.text : 'تفسير ميسر للآية الكريمة يوضح المعنى الإجمالي والأحكام المستفادة.',
          irabHint: 'إعراب مفردات وجمل الآية الكريمة لبيان الدلالات النحوية والبلاغية.',
          reflectionQuestion: 'ما الحكمة البلاغية والدرس الإيماني العظيم الذي تخاطب به الآية فؤادك اليوم؟',
          practicalAction: 'اعمل بمقتضى هداية هذه الآية في شؤون يومك واستحضر مراقبة الله تعالى.',
          juz: a.juz,
          page: a.page,
          hizbQuarter: a.hizbQuarter
        };
      });

      const surahResult: SurahData = {
        meta,
        bismillahPre: surahNumber !== 1 && surahNumber !== 9,
        ayahs
      };

      try {
        localStorage.setItem(cacheKey, JSON.stringify(surahResult));
      } catch {
        // quota exceeded, ignore
      }

      return surahResult;
    }
  } catch (err) {
    console.warn(`Failed fetching surah ${surahNumber}, falling back to minimal placeholder:`, err);
  }

  // Fallback if offline and not in cache
  return {
    meta,
    bismillahPre: surahNumber !== 1 && surahNumber !== 9,
    ayahs: [
      {
        numberInSurah: 1,
        overallNumber: 1,
        text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
        tafsir: 'افتتاح كريم مبارك يلتمس به عون الله وبركته.',
        irabHint: 'جار ومجرور ومتعلق بمحذوف تقديره أقرأ أو أبدأ.',
        reflectionQuestion: 'كيف تجعل البسملة شعاراً لكل قول وعمل في حياتك؟',
        practicalAction: 'استفتح كل أمر ذي بال باسم الله العلي العظيم.',
        juz: meta.juzNumber,
        page: meta.startPage,
        hizbQuarter: 1
      }
    ]
  };
}
