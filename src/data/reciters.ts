export interface Reciter {
  id: string;
  name: string;
  style: string;
  serverKey: string;
  bitrate: string;
  country: string;
  bio: string;
}

export const RECITERS_LIST: Reciter[] = [
  {
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    style: 'مرتل عذب',
    serverKey: 'Alafasy_128kbps',
    bitrate: '128 kbps',
    country: 'الكويت',
    bio: 'إمام المسجد الكبير بدولة الكويت، قارئ متميز بصوته الندي وإتقانه الدقيق لأحكام التجويد ومخارج الحروف.'
  },
  {
    id: 'abdulbasit-murattal',
    name: 'عبد الباسط عبد الصمد (مرتل)',
    style: 'مرتل هادئ ومتقن',
    serverKey: 'Abdul_Basit_Murattal_192kbps',
    bitrate: '192 kbps',
    country: 'مصر',
    bio: 'صوت مكة وأحد أشهر قراء العالم الإسلامي، يتميز بنبرته الخاشعة ونَفَسِه المديد وتطبيقه الدقيق لميزان التجويد.'
  },
  {
    id: 'abdulbasit-mujawwad',
    name: 'عبد الباسط عبد الصمد (مجود)',
    style: 'تجويد محبر كلاسيكي',
    serverKey: 'Abdul_Basit_Mujawwad_128kbps',
    bitrate: '128 kbps',
    country: 'مصر',
    bio: 'التلاوة المجودة الرائعة ذات المقامات الرفيعة التي حركت قلوب الملايين حول العالم.'
  },
  {
    id: 'minshawi',
    name: 'محمد صديق المنشاوي',
    style: 'الصوت الباكي الخاشع',
    serverKey: 'Minshawy_Murattal_128kbps',
    bitrate: '128 kbps',
    country: 'مصر',
    bio: 'صاحب الصوت الخاشع الحزين المتأصل في وجدان الأمة، تلاوته تبعث على التدبر التام والدمعة الصادقة.'
  },
  {
    id: 'husary',
    name: 'محمود خليل الحصري',
    style: 'شيخ عموم المقارئ المصرية',
    serverKey: 'Husary_128kbps',
    bitrate: '128 kbps',
    country: 'مصر',
    bio: 'المرجع الأول لضبط التلاوة ومخارج الحروف وقواعد التجويد بلا تكلف، المصحف المعلم المعتمد للأجيال.'
  },
  {
    id: 'muaiqly',
    name: 'ماهر المعيقلي',
    style: 'إمام المسجد الحرام',
    serverKey: 'Maher_AlMuaiqly_64kbps',
    bitrate: '64 kbps',
    country: 'السعودية',
    bio: 'إمام وخطيب المسجد الحرام بمكة المكرمة، تلاوة مؤثرة حية تقرب أجواء الحرم الشريف إلى قلب القارئ.'
  },
  {
    id: 'ghamdi',
    name: 'سعد الغامدي',
    style: 'حدر وترتيل وقور',
    serverKey: 'Ghamadi_40kbps',
    bitrate: '40 kbps (خفيف وسريع)',
    country: 'السعودية',
    bio: 'قارئ بارز يتميز بسلاسة أدائه وسرعته الموزونة المناسبة للحفظ والمراجعة الدورية.'
  },
  {
    id: 'shatri',
    name: 'أبو بكر الشاطري',
    style: 'ترتيل حجازي هادئ',
    serverKey: 'Abu_Bakr_Ash-Shaatree_128kbps',
    bitrate: '128 kbps',
    country: 'السعودية',
    bio: 'نبرة حجازية هادئة تمتاز بالنقاء العاطفي والصفاء الذهني الذي يساعد على التركيز أثناء القراءة.'
  },
  {
    id: 'dosari',
    name: 'ياسر الدوسري',
    style: 'قوة المقامات والجهورية',
    serverKey: 'Yasser_Ad-Dussary_128kbps',
    bitrate: '128 kbps',
    country: 'السعودية',
    bio: 'إمام المسجد الحرام، تلاواته تمتاز بالجهورية والخشوع الشديد والقوة في استحضار معاني الوعيد والوعد.'
  },
  {
    id: 'shuraim',
    name: 'سعود الشريم',
    style: 'تلاوة تراويح مكة المأثورة',
    serverKey: 'Saood_ash-Shuraym_128kbps',
    bitrate: '128 kbps',
    country: 'السعودية',
    bio: 'الصوت الرخيم الذي ارتبط به المسلمون في صلوات التراويح والقيام بالحرم المكي لعقود.'
  }
];

export function getAyahAudioUrl(serverKey: string, surahNum: number, ayahNum: number): string {
  const sStr = String(surahNum).padStart(3, '0');
  const aStr = String(ayahNum).padStart(3, '0');
  return `https://everyayah.com/data/${serverKey}/${sStr}${aStr}.mp3`;
}
