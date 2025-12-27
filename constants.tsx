import { Habit, HabitCategory } from './types';

export const HABITS: Habit[] = [
  {
    id: 'pagi-0',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Shalat Tahajud (2-8 Rakaat)',
    description: 'Pondasi ketenangan, kejernihan hati & ketajaman insting bisnis',
    points: 20,
  },
  {
    id: 'pagi-1',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Istighfar 100x',
    description: 'Pembersih penghalang rezeki',
    points: 10,
  },
  {
    id: 'pagi-2',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Niat Usaha Berkah',
    points: 5,
    prayer: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَرِزْقٍ لَا يَنْفَدُ، وَعَمَلٍ لَا يُرْفَعُ',
      latin: 'Allāhumma inni a‘ūdzu bika min ‘ilmin lā yanfa‘, wa rizqin lā yanfad, wa ‘amalin lā yurfa‘.',
      translation: 'Ya Allah, aku berlindung kepada-Mu dari ilmu yang tidak bermanfaat, rezeki yang akan habis, dan amal yang tidak diangkat (diterima).',
      context: 'Niatkan: "Ya Allah, jadikan semua aktivitasku hari ini halal, jujur, dan bermanfaat."'
    }
  },
  {
    id: 'subuh-1',
    category: HabitCategory.SUBUH,
    title: 'Shalat Subuh Tepat Waktu',
    points: 15,
  },
  {
    id: 'subuh-2',
    category: HabitCategory.SUBUH,
    title: 'Dzikir Pagi',
    points: 10,
  },
  {
    id: 'subuh-3',
    category: HabitCategory.SUBUH,
    title: 'Doa Pembuka Rezeki Digital',
    points: 5,
    prayer: {
      arabic: 'يَا فَتَّاحُ، اِفْتَحْ لَنَا أَبْوَابَ الرِّزْقِ، وَبَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَاجْعَلْهُ رِزْقاً حَلَالاً طَيِّباً',
      latin: 'Yā Fattāḥ, iftaḥ lanā abwābar rizq, wabārik lanā fīmā razaqtanā, waj‘alhu rizqan ḥalālan ṭayyiban.',
      translation: 'Wahai Dzat Yang Maha Pembuka, bukakanlah bagi kami pintu-pintu rezeki, berkahilah apa yang Engkau anugerahkan, dan jadikanlah ia rezeki yang halal lagi baik.'
    }
  },
  {
    id: 'sedekah-1',
    category: HabitCategory.SEDEKAH_PAGI,
    title: 'Sedekah Sebelum Kerja',
    description: 'Sedekah sebelum buka ads / posting / follow-up',
    points: 15,
    prayer: {
      arabic: '', 
      translation: 'Ya Allah, ganti sedekah ini dengan traffic, conversion, dan rezeki yang Engkau ridai.',
      context: 'Niatkan sebelum mulai aktivitas marketing harian.'
    }
  },
  {
    id: 'dhuha-1',
    category: HabitCategory.DHUHA,
    title: 'Shalat Dhuha (2-4 Rakaat)',
    points: 10,
    prayer: {
      arabic: 'اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ، وَإِنْ كَانَ بَعِيداً فَقَرِّبْهُ',
      latin: 'Allāhumma in kāna rizqī fis-samā’i fa anzilhu, wa in kāna fil-ardhi fa akhrijhu, wa in kāna ba‘īdan fa qarribhu.',
      translation: 'Ya Allah, jika rezekiku ada di langit maka turunkanlah, jika ada di dalam bumi maka keluarkanlah, dan jika jauh maka dekatkanlah.'
    }
  },
  {
    id: 'kerja-1',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Bismillah & Shalawat 3x',
    description: 'Sebelum setting ads / bikin konten',
    points: 5,
  },
  {
    id: 'kerja-2',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Prinsip Solusi Bukan Manipulasi',
    description: 'Hindari clickbait menipu, testimoni palsu, overclaim',
    points: 10,
  },
  {
    id: 'kerja-3',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Hasbiyallāhu (Closing/Follow-up)',
    description: 'Niat membantu, bukan memaksa',
    points: 5,
  },
  {
    id: 'zuhur-1',
    category: HabitCategory.ZUHUR,
    title: 'Shalat Zuhur Tepat Waktu',
    points: 10,
  },
  {
    id: 'zuhur-2',
    category: HabitCategory.ZUHUR,
    title: 'Istighfar 33x & Shalawat 10x',
    points: 5,
  },
  {
    id: 'sore-1',
    category: HabitCategory.SORE,
    title: 'Shalat Asar Tepat Waktu',
    points: 10,
  },
  {
    id: 'sore-2',
    category: HabitCategory.SORE,
    title: 'Dzikir Petang',
    points: 10,
  },
  {
    id: 'sore-3',
    category: HabitCategory.SORE,
    title: 'Ikhlas Atas Hasil Ads/Sales',
    description: 'Lepaskan emosi dari boncos / CTR turun',
    points: 5,
  },
  {
    id: 'malam-1',
    category: HabitCategory.MALAM,
    title: 'Baca Al-Qur\'an',
    description: 'Al-Waqi\'ah, Al-Mulk, atau min. 2 halaman',
    points: 15,
  },
  {
    id: 'malam-2',
    category: HabitCategory.MALAM,
    title: 'Istighfar Penutup 100x',
    description: 'Penghapus dosa dan pembuka keberkahan esok hari',
    points: 5,
  },
  {
    id: 'malam-3',
    category: HabitCategory.MALAM,
    title: 'Doa Penutup Hari',
    points: 5,
    prayer: {
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      latin: 'Allāhumma ikfinī biḥalālika ‘an ḥarāmik, wa aghninī bifaḍlika ‘amman siwāk.',
      translation: 'Ya Allah, cukupkanlah aku dengan rezeki-Mu yang halal hingga aku terhindar dari yang haram, dan kayakanlah aku dengan anugerah-Mu hingga aku tidak bergantung kepada selain-Mu.',
      context: 'Baca sebagai pengunci hari agar rezeki yang didapat terjaga keberkahannya.'
    }
  }
];

export const MINGGUAN: Habit[] = [
  {
    id: 'jumat-1',
    category: HabitCategory.MINGGUAN,
    title: 'Sedekah Jumat Lebih Besar',
    points: 20,
  },
  {
    id: 'jumat-2',
    category: HabitCategory.MINGGUAN,
    title: 'Shalawat 100x (Jumat)',
    points: 10,
  },
  {
    id: 'minggu-1',
    category: HabitCategory.MINGGUAN,
    title: 'Silaturahmi Bisnis',
    points: 10,
  },
  {
    id: 'minggu-2',
    category: HabitCategory.MINGGUAN,
    title: 'Berbagi Ilmu Gratis',
    points: 15,
  }
];

export const EMERGENCY: Habit[] = [
  {
    id: 'emergency-1',
    category: HabitCategory.EMERGENCY,
    title: 'Shalat Sunnah 2 Rakaat',
    description: 'Saat ads boncos atau akun suspend',
    points: 0,
  },
  {
    id: 'emergency-2',
    category: HabitCategory.EMERGENCY,
    title: 'Doa Nabi Yunus 100x',
    points: 0,
    prayer: {
      arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      latin: 'Lā ilāha illā anta, subḥānaka innī kuntu minaẓ-ẓālimīn.',
      translation: 'Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zhalim.'
    }
  }
];
