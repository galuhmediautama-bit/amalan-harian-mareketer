import { Habit, HabitCategory } from './types';

export const HABITS: Habit[] = [
  // === PAGI / DINI HARI ===
  {
    id: 'pagi-0',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Shalat Tahajud (2-8 Rakaat)',
    description: 'Pondasi ketenangan, kejernihan hati & ketajaman insting bisnis',
    points: 20,
    prayer: {
      arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالأَرْضِ، وَلَكَ الْحَمْدُ أَنْتَ قَيَّامُ السَّمَاوَاتِ وَالأَرْضِ',
      latin: 'Allāhumma lakal-ḥamdu anta nūrus-samāwāti wal-arḍi, wa lakal-ḥamdu anta qayyāmus-samāwāti wal-arḍ.',
      translation: 'Ya Allah, bagi-Mu segala puji. Engkau cahaya langit dan bumi. Bagi-Mu segala puji, Engkau yang menegakkan langit dan bumi.',
      context: 'Doa pembuka Tahajud - Nabi SAW membaca ini saat memulai shalat malam'
    }
  },
  {
    id: 'pagi-1',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Istighfar 100x',
    description: 'Pembersih penghalang rezeki & penghapus dosa-dosa kecil',
    points: 10,
    prayer: {
      arabic: 'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
      latin: "Astaghfirullāhal-'aẓīm alladhī lā ilāha illā huwal-ḥayyul-qayyūm wa atūbu ilayh.",
      translation: 'Aku memohon ampun kepada Allah Yang Maha Agung, yang tidak ada Tuhan selain Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya.',
      context: 'Sayyidul Istighfar - Istighfar terbaik yang diajarkan Rasulullah'
    }
  },
  {
    id: 'pagi-2',
    category: HabitCategory.PAGI_DINI_HARI,
    title: 'Niat Usaha Berkah',
    description: 'Memulai hari dengan niat lillahi ta\'ala dalam bekerja',
    points: 5,
    prayer: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
      latin: "Allāhumma innī as'aluka 'ilman nāfi'an, wa rizqan ṭayyiban, wa 'amalan mutaqabbalan.",
      translation: 'Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
      context: 'Baca setelah shalat Subuh - Doa pembuka keberkahan hari'
    }
  },

  // === SUBUH ===
  {
    id: 'subuh-1',
    category: HabitCategory.SUBUH,
    title: 'Shalat Subuh Tepat Waktu',
    description: 'Kunci keberkahan hari - jangan pernah tunda!',
    points: 15,
    prayer: {
      arabic: 'اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا',
      latin: 'Allāhumma bārik li ummatī fī bukūrihā.',
      translation: 'Ya Allah, berkahilah umatku di waktu pagi mereka.',
      context: 'Hadits: "Waktu pagi adalah waktu diberkahi untuk umatku"'
    }
  },
  {
    id: 'subuh-2',
    category: HabitCategory.SUBUH,
    title: 'Dzikir Pagi',
    description: 'Perlindungan & pembuka pintu rezeki sepanjang hari',
    points: 10,
    prayer: {
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      latin: 'Bismillāhil-ladhī lā yaḍurru ma\'asmihi shay\'un fil-arḍi wa lā fis-samā\'i wa huwas-samī\'ul-\'alīm.',
      translation: 'Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun yang membahayakan di bumi maupun di langit, dan Dia Maha Mendengar lagi Maha Mengetahui.',
      context: 'Baca 3x pagi & petang - Perlindungan dari segala bahaya'
    }
  },
  {
    id: 'subuh-3',
    category: HabitCategory.SUBUH,
    title: 'Doa Pembuka Rezeki Digital',
    description: 'Doa khusus untuk marketer & pebisnis online',
    points: 5,
    prayer: {
      arabic: 'يَا فَتَّاحُ، اِفْتَحْ لَنَا أَبْوَابَ الرِّزْقِ، وَبَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَاجْعَلْهُ رِزْقاً حَلَالاً طَيِّباً',
      latin: 'Yā Fattāḥ, iftaḥ lanā abwābar rizq, wabārik lanā fīmā razaqtanā, waj\'alhu rizqan ḥalālan ṭayyiban.',
      translation: 'Wahai Dzat Yang Maha Pembuka, bukakanlah bagi kami pintu-pintu rezeki, berkahilah apa yang Engkau anugerahkan, dan jadikanlah ia rezeki yang halal lagi baik.',
      context: 'Baca sebelum buka laptop/HP untuk kerja'
    }
  },

  // === SEDEKAH PAGI ===
  {
    id: 'sedekah-1',
    category: HabitCategory.SEDEKAH_PAGI,
    title: 'Sedekah Sebelum Kerja',
    description: 'Sedekah sebelum buka ads / posting / follow-up - minimal Rp5.000',
    points: 15,
    prayer: {
      arabic: 'اللَّهُمَّ أَخْلِفْ عَلَى مُنْفِقٍ خَلَفًا، وَأَعْطِ مُمْسِكًا تَلَفًا',
      latin: 'Allāhumma akhlif \'alā munfiqin khalafan, wa a\'ṭi mumsikan talafan.',
      translation: 'Ya Allah, berikanlah ganti kepada orang yang berinfak, dan berikanlah kehancuran kepada orang yang menahan hartanya.',
      context: 'Niatkan: "Ya Allah, ganti sedekah ini dengan traffic, conversion, dan rezeki yang Engkau ridai."'
    }
  },

  // === DHUHA ===
  {
    id: 'dhuha-1',
    category: HabitCategory.DHUHA,
    title: 'Shalat Dhuha (2-4 Rakaat)',
    description: 'Waktu terbaik: 15 menit setelah matahari terbit - jam 11 siang',
    points: 10,
    prayer: {
      arabic: 'اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ، وَإِنْ كَانَ بَعِيداً فَقَرِّبْهُ، وَإِنْ كَانَ قَرِيباً فَيَسِّرْهُ، وَإِنْ كَانَ قَلِيلاً فَكَثِّرْهُ، وَإِنْ كَانَ كَثِيراً فَبَارِكْ لِي فِيهِ',
      latin: 'Allāhumma in kāna rizqī fis-samā\'i fa anzilhu, wa in kāna fil-arḍi fa akhrijhu, wa in kāna ba\'īdan fa qarribhu, wa in kāna qarīban fa yassirhu, wa in kāna qalīlan fa kaththirhu, wa in kāna kathīran fa bārik lī fīh.',
      translation: 'Ya Allah, jika rezekiku ada di langit maka turunkanlah, jika ada di dalam bumi maka keluarkanlah, jika jauh maka dekatkanlah, jika dekat maka mudahkanlah, jika sedikit maka perbanyaklah, dan jika banyak maka berkahilah.',
      context: 'Doa setelah shalat Dhuha - Doa pembuka 360 pintu rezeki'
    }
  },

  // === KERJA DIGITAL ===
  {
    id: 'kerja-1',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Bismillah & Shalawat 3x',
    description: 'Sebelum setting ads / bikin konten / kirim email',
    points: 5,
    prayer: {
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      latin: 'Bismillāhi tawakkaltu \'alallāh, lā ḥawla wa lā quwwata illā billāh.',
      translation: 'Dengan menyebut nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.',
      context: 'Baca sebelum memulai pekerjaan apapun'
    }
  },
  {
    id: 'kerja-2',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Prinsip Solusi Bukan Manipulasi',
    description: 'Hindari clickbait menipu, testimoni palsu, overclaim produk',
    points: 10,
    prayer: {
      arabic: 'اللَّهُمَّ اجْعَلْنِي صَادِقاً فِي قَوْلِي وَفِعْلِي',
      latin: 'Allāhummaj\'alnī ṣādiqan fī qawlī wa fi\'lī.',
      translation: 'Ya Allah, jadikanlah aku orang yang jujur dalam ucapan dan perbuatanku.',
      context: 'Checklist: Apakah iklan/kontenku sudah jujur? Apakah aku bangga jika Allah melihatnya?'
    }
  },
  {
    id: 'kerja-3',
    category: HabitCategory.KERJA_DIGITAL,
    title: 'Hasbiyallāhu (Closing/Follow-up)',
    description: 'Niat membantu customer, bukan memaksa untuk beli',
    points: 5,
    prayer: {
      arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
      latin: 'Ḥasbiyallāhu lā ilāha illā huwa \'alayhi tawakkaltu wa huwa rabbul-\'arshil-\'aẓīm.',
      translation: 'Cukuplah Allah bagiku. Tidak ada Tuhan selain Dia. Kepada-Nya aku bertawakal dan Dia adalah Tuhan Arsy yang agung.',
      context: 'Baca 7x setelah follow-up - Lepaskan hasil kepada Allah'
    }
  },

  // === ZUHUR ===
  {
    id: 'zuhur-1',
    category: HabitCategory.ZUHUR,
    title: 'Shalat Zuhur Tepat Waktu',
    description: 'Jangan tunda karena meeting atau deadline!',
    points: 10,
    prayer: {
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      latin: 'Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā \'adhāban-nār.',
      translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
      context: 'Doa yang paling sering dibaca Rasulullah SAW'
    }
  },
  {
    id: 'zuhur-2',
    category: HabitCategory.ZUHUR,
    title: 'Istighfar 33x & Shalawat 10x',
    description: 'Reset pikiran di tengah hari kerja yang padat',
    points: 5,
    prayer: {
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      latin: 'Allāhumma ṣalli \'alā Muḥammadin wa \'alā āli Muḥammad.',
      translation: 'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarga beliau.',
      context: 'Shalawat pembuka kemudahan dalam urusan'
    }
  },

  // === SORE / ASAR ===
  {
    id: 'sore-1',
    category: HabitCategory.SORE,
    title: 'Shalat Asar Tepat Waktu',
    description: 'Jangan sampai terlewat - ini shalat yang sangat dijaga!',
    points: 10,
    prayer: {
      arabic: 'مَنْ تَرَكَ صَلَاةَ الْعَصْرِ فَقَدْ حَبِطَ عَمَلُهُ',
      latin: 'Man taraka ṣalātal-\'aṣri faqad ḥabiṭa \'amaluh.',
      translation: 'Barangsiapa meninggalkan shalat Asar, maka sungguh amalnya terhapus.',
      context: 'Hadits Bukhari - Peringatan keras tentang shalat Asar'
    }
  },
  {
    id: 'sore-2',
    category: HabitCategory.SORE,
    title: 'Dzikir Petang',
    description: 'Perlindungan malam & kunci keberkahan hingga esok',
    points: 10,
    prayer: {
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      latin: 'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahu lā sharīka lah.',
      translation: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah. Segala puji bagi Allah. Tidak ada Tuhan selain Allah saja, tidak ada sekutu bagi-Nya.',
      context: 'Dzikir petang - Baca sebelum Maghrib'
    }
  },
  {
    id: 'sore-3',
    category: HabitCategory.SORE,
    title: 'Ikhlas Atas Hasil Ads/Sales',
    description: 'Lepaskan emosi dari boncos / CTR turun / deal gagal',
    points: 5,
    prayer: {
      arabic: 'قَدَّرَ اللَّهُ وَمَا شَاءَ فَعَلَ',
      latin: 'Qaddarallāhu wa mā shā\'a fa\'al.',
      translation: 'Allah telah mentakdirkan dan apa yang Dia kehendaki pasti terjadi.',
      context: 'Hadits Muslim - Sikap menghadapi kegagalan dengan tawakal'
    }
  },

  // === MALAM ===
  {
    id: 'malam-1',
    category: HabitCategory.MALAM,
    title: 'Baca Al-Qur\'an',
    description: 'Al-Waqi\'ah (rezeki), Al-Mulk (perlindungan), atau min. 2 halaman',
    points: 15,
    prayer: {
      arabic: 'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',
      latin: 'Allāhummaj\'alil-Qur\'āna rabī\'a qalbī, wa nūra ṣadrī, wa jalā\'a ḥuznī, wa dhahāba hammī.',
      translation: 'Ya Allah, jadikanlah Al-Qur\'an sebagai penyejuk hatiku, cahaya dadaku, penghilang kesedihanku, dan pelepas kegelisahanku.',
      context: 'Baca sebelum membaca Al-Qur\'an'
    }
  },
  {
    id: 'malam-2',
    category: HabitCategory.MALAM,
    title: 'Istighfar Penutup 100x',
    description: 'Penghapus dosa harian & pembuka keberkahan esok',
    points: 5,
    prayer: {
      arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
      latin: 'Astaghfirullāha wa atūbu ilayh.',
      translation: 'Aku memohon ampun kepada Allah dan bertaubat kepada-Nya.',
      context: 'Nabi SAW beristighfar 100x setiap hari - HR. Muslim'
    }
  },
  {
    id: 'malam-3',
    category: HabitCategory.MALAM,
    title: 'Doa Penutup Hari',
    description: 'Menyerahkan semua urusan & hasil hari ini kepada Allah',
    points: 5,
    prayer: {
      arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
      latin: 'Allāhumma ikfinī biḥalālika \'an ḥarāmik, wa aghninī bifaḍlika \'amman siwāk.',
      translation: 'Ya Allah, cukupkanlah aku dengan rezeki-Mu yang halal hingga aku terhindar dari yang haram, dan kayakanlah aku dengan anugerah-Mu hingga aku tidak bergantung kepada selain-Mu.',
      context: 'Doa agar terhindar dari rezeki haram dan hutang'
    }
  }
];

export const MINGGUAN: Habit[] = [
  {
    id: 'jumat-1',
    category: HabitCategory.MINGGUAN,
    title: 'Sedekah Jumat Lebih Besar',
    description: 'Minimal 2x lipat dari sedekah harian biasa',
    points: 20,
    prayer: {
      arabic: 'اللَّهُمَّ اجْعَلْهَا صَدَقَةً جَارِيَةً',
      latin: 'Allāhummaj\'alhā ṣadaqatan jāriyah.',
      translation: 'Ya Allah, jadikanlah ini sedekah yang terus mengalir pahalanya.',
      context: 'Hari Jumat adalah hari terbaik untuk bersedekah'
    }
  },
  {
    id: 'jumat-2',
    category: HabitCategory.MINGGUAN,
    title: 'Shalawat 100x (Jumat)',
    description: 'Perbanyak shalawat di hari sayyidul ayyam',
    points: 10,
    prayer: {
      arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
      latin: 'Allāhumma ṣalli wa sallim \'alā nabiyyinā Muḥammad.',
      translation: 'Ya Allah, limpahkanlah rahmat dan keselamatan kepada Nabi kita Muhammad.',
      context: 'Hadits: "Perbanyaklah shalawat kepadaku pada hari Jumat"'
    }
  },
  {
    id: 'minggu-1',
    category: HabitCategory.MINGGUAN,
    title: 'Silaturahmi Bisnis',
    description: 'Hubungi minimal 1 partner/client untuk menyambung silaturahmi',
    points: 10,
    prayer: {
      arabic: 'مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَأَنْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ',
      latin: 'Man sarrahu an yubsaṭa lahu fī rizqihi, wa an yunsa\'a lahu fī atharihi, falyaṣil raḥimah.',
      translation: 'Barangsiapa ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung silaturahmi.',
      context: 'Hadits Bukhari - Silaturahmi pembuka rezeki'
    }
  },
  {
    id: 'minggu-2',
    category: HabitCategory.MINGGUAN,
    title: 'Berbagi Ilmu Gratis',
    description: 'Share tips/insight marketing di media sosial tanpa minta imbalan',
    points: 15,
    prayer: {
      arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا',
      latin: 'Allāhummanfa\'nī bimā \'allamtanī, wa \'allimnī mā yanfa\'unī, wa zidnī \'ilmā.',
      translation: 'Ya Allah, berilah aku manfaat dari apa yang Engkau ajarkan kepadaku, ajarkanlah aku apa yang bermanfaat bagiku, dan tambahkanlah ilmuku.',
      context: 'Ilmu yang bermanfaat adalah sedekah jariyah'
    }
  }
];

export const EMERGENCY: Habit[] = [
  {
    id: 'emergency-1',
    category: HabitCategory.EMERGENCY,
    title: 'Shalat Sunnah 2 Rakaat',
    description: 'Saat ads boncos, akun suspend, atau deal gagal - serahkan ke Allah',
    points: 0,
    prayer: {
      arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
      latin: 'Wasta\'īnū biṣ-ṣabri waṣ-ṣalāh.',
      translation: 'Dan mohonlah pertolongan dengan sabar dan shalat.',
      context: 'QS. Al-Baqarah: 45 - Solusi saat menghadapi masalah berat'
    }
  },
  {
    id: 'emergency-2',
    category: HabitCategory.EMERGENCY,
    title: 'Doa Nabi Yunus 100x',
    description: 'Doa keluar dari kesulitan - terbukti ampuh!',
    points: 0,
    prayer: {
      arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      latin: 'Lā ilāha illā anta, subḥānaka innī kuntu minaẓ-ẓālimīn.',
      translation: 'Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku termasuk orang-orang yang zhalim.',
      context: 'Doa Nabi Yunus AS di perut ikan - pembuka jalan keluar'
    }
  },
  {
    id: 'emergency-3',
    category: HabitCategory.EMERGENCY,
    title: 'Sedekah Darurat',
    description: 'Bersedekah saat kesulitan - percepat pembuka solusi',
    points: 0,
    prayer: {
      arabic: 'إِنَّ الصَّدَقَةَ لَتُطْفِئُ غَضَبَ الرَّبِّ وَتَدْفَعُ مِيتَةَ السُّوءِ',
      latin: 'Innaṣ-ṣadaqata latuṭfi\'u ghaḍabar-Rabbi wa tadfa\'u mītatas-sū\'.',
      translation: 'Sesungguhnya sedekah itu memadamkan murka Rabb dan menolak kematian yang buruk.',
      context: 'Hadits Tirmidzi - Sedekah saat kesulitan mendatangkan pertolongan'
    }
  },
  {
    id: 'emergency-4',
    category: HabitCategory.EMERGENCY,
    title: 'Hasbunallah 7x',
    description: 'Penyerahan total saat semua sudah diusahakan',
    points: 0,
    prayer: {
      arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      latin: 'Ḥasbunallāhu wa ni\'mal-wakīl.',
      translation: 'Cukuplah Allah bagi kami dan Dia adalah sebaik-baik pelindung.',
      context: 'Doa Nabi Ibrahim AS saat dilempar ke api - penyerahan total'
    }
  }
];
