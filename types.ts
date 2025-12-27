
export enum HabitCategory {
  PAGI_DINI_HARI = 'PAGI DINI HARI – PONDASI REZEKI & KEPUTUSAN',
  SUBUH = 'SUBUH – PEMBUKA TRAFFIC & PELUANG',
  SEDEKAH_PAGI = 'SEDEKAH PAGI – NIAT TRAFFIC & CLOSING',
  DHUHA = 'SHALAT DHUHA – REZEKI AKTIF',
  KERJA_DIGITAL = 'MULAI KERJA DIGITAL',
  ZUHUR = 'SETELAH ZUHUR – PENJAGA KONSISTENSI',
  SORE = 'SORE – PENGUNCI STABILITAS',
  MALAM = 'MALAM – SCALE & BARAKAH',
  MINGGUAN = 'AMALAN MINGGUAN',
  EMERGENCY = 'KONDISI DARURAT'
}

export interface Prayer {
  arabic: string;
  latin?: string;
  translation: string;
  context?: string;
}

export interface Habit {
  id: string;
  category: HabitCategory;
  title: string;
  description?: string;
  prayer?: Prayer;
  points: number;
}

export interface DailyProgress {
  date: string;
  completedHabitIds: string[];
  muhasabah: {
    jujur: boolean;
    followUp: boolean;
    hakOrang: boolean;
    dosaDigital: boolean;
  };
}

export interface AppState {
  currentDate: string;
  progress: Record<string, DailyProgress>;
}
