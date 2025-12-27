
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Heart, 
  BookOpen, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Info,
  Star,
  Moon,
  LogOut
} from 'lucide-react';
import { HABITS, MINGGUAN, EMERGENCY } from './constants';
import { Habit, HabitCategory, DailyProgress, AppState } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Login from './components/Login';
import { onAuthChange, signOutUser, getCurrentUser } from './services/authService';
import { getUserData, saveUserData, subscribeToUserData, migrateFromLocalStorage } from './services/supabaseService';

// Helper components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-2 sm:mb-3 mt-4 sm:mt-5">
    <div className="p-1 sm:p-1.5 bg-teal-100 text-teal-900 rounded-lg shrink-0">
      {icon}
    </div>
    <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight leading-tight">{title}</h2>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      currentDate: today,
      progress: {
        [today]: {
          date: today,
          completedHabitIds: [],
          muhasabah: {
            jujur: true,
            followUp: true,
            hakOrang: true,
            dosaDigital: false
          }
        }
      }
    };
  });

  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'emergency'>('daily');
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPrinsipIndex, setCurrentPrinsipIndex] = useState(0);

  // Check authentication and load data
  useEffect(() => {
    let unsubscribeStorage: (() => void) | null = null;

    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load data from Supabase
        try {
          await migrateFromLocalStorage();
          
          const userData = await getUserData();
          if (userData) {
            setState(userData);
          }

          // Subscribe to real-time data changes
          unsubscribeStorage = subscribeToUserData((updatedState) => {
            if (updatedState) {
              setState(updatedState);
            }
          });
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubscribeStorage) {
        unsubscribeStorage();
      }
    };
  }, []);

  // Save to Supabase when state changes (debounced)
  useEffect(() => {
    if (!user) return;

    setIsSaving(true);
    const timeoutId = setTimeout(async () => {
      try {
        await saveUserData(state);
      } catch (error) {
        console.error('Error saving data:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [state, user]);

  // All hooks must be called before early returns
  const today = state.currentDate;
  const todayProgress = state.progress[today] || {
    date: today,
    completedHabitIds: [],
    muhasabah: { jujur: true, followUp: true, hakOrang: true, dosaDigital: false }
  };

  const groupedHabits = useMemo(() => {
    const groups: Record<HabitCategory, Habit[]> = {} as any;
    HABITS.forEach(h => {
      if (!groups[h.category]) groups[h.category] = [];
      groups[h.category].push(h);
    });
    return groups;
  }, []);

  const totalPointsPossible = HABITS.reduce((sum, h) => sum + h.points, 0);
  const currentPoints = HABITS
    .filter(h => todayProgress.completedHabitIds.includes(h.id))
    .reduce((sum, h) => sum + h.points, 0);
  
  const completionPercentage = Math.round((currentPoints / totalPointsPossible) * 100);

  const statsData = useMemo(() => {
    const entries = Object.entries(state.progress) as [string, DailyProgress][];
    return entries
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, prog]) => {
        const points = HABITS
          .filter(h => prog.completedHabitIds.includes(h.id))
          .reduce((sum, h) => sum + h.points, 0);
        return {
          date: date.split('-').slice(1).join('/'),
          points: points
        };
      });
  }, [state.progress]);

  const prinsipDasar = useMemo(() => [
    "Rezeki datang lewat kepercayaan (jujur & amanah)",
    "Keputusan bisnis butuh hati yang bersih",
    "Rezeki besar lahir dari manfaat besar",
    "Amalan membuka pintu, ikhtiar yang memasukkan",
    "Algoritma berubah, Allah tidak",
    "Trust lebih kuat dari click",
    "Konten jujur menarik audience yang tepat",
    "Barakah menjaga performa jangka panjang"
  ], []);

  // Rotate prinsip dasar untuk ditampilkan di header
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrinsipIndex((prev) => (prev + 1) % prinsipDasar.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [prinsipDasar.length]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setState({
        currentDate: new Date().toISOString().split('T')[0],
        progress: {}
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleHabit = (id: string) => {
    setState(prev => {
      const current = prev.progress[today] || {
        date: today,
        completedHabitIds: [],
        muhasabah: { jujur: true, followUp: true, hakOrang: true, dosaDigital: false }
      };
      
      const newCompleted = current.completedHabitIds.includes(id)
        ? current.completedHabitIds.filter(hid => hid !== id)
        : [...current.completedHabitIds, id];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [today]: { ...current, completedHabitIds: newCompleted }
        }
      };
    });
  };

  const toggleMuhasabah = (key: keyof DailyProgress['muhasabah']) => {
    setState(prev => {
      const current = prev.progress[today];
      return {
        ...prev,
        progress: {
          ...prev.progress,
          [today]: {
            ...current,
            muhasabah: { ...current.muhasabah, [key]: !current.muhasabah[key] }
          }
        }
      };
    });
  };

  // Early returns after all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-900">
        <div className="text-white text-xl font-black">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen pb-20 sm:pb-24">
      {/* Header */}
      <header className="bg-teal-900 text-white pt-3 sm:pt-4 pb-4 sm:pb-5 px-4 sm:px-6 rounded-b-xl sm:rounded-b-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-teal-800 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-30 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div className="flex-1 pr-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tighter leading-tight">Marketer Berkah</h1>
              <p className="text-teal-300 text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-0.5 leading-tight">
                Traffic berkah • Conversion stabil • Cashflow sehat
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="bg-teal-800 p-1.5 sm:p-2 rounded-lg border border-teal-600 shadow-md shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="bg-teal-800/80 hover:bg-teal-800 p-1.5 sm:p-2 rounded-lg border border-teal-600 shadow-md shrink-0 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>
              {isSaving && (
                <div className="text-[9px] sm:text-[10px] text-teal-300 font-black animate-pulse">
                  Saving...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/20 mt-2.5 sm:mt-3 shadow-inner backdrop-blur-sm">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.1em]">Progress Hari Ini</span>
              <span className="text-xl sm:text-2xl font-black">{completionPercentage}%</span>
            </div>
            <div className="h-2.5 sm:h-3 w-full bg-teal-950/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-teal-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(45,212,191,0.5)]" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Prinsip Dasar Rotator - Compact */}
          <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2 bg-white/10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/20 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-black text-teal-900 text-xs sm:text-sm shadow-md shrink-0 border border-yellow-300">
              {currentPrinsipIndex + 1}
            </div>
            <p className="text-[10px] sm:text-[11px] text-white font-black leading-tight flex-1 transition-opacity duration-500 line-clamp-1">
              {prinsipDasar[currentPrinsipIndex]}
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-4 sm:px-5 -mt-4 sm:-mt-5 relative z-20">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-slate-200 p-1.5 sm:p-2 flex gap-1.5 sm:gap-2 relative overflow-hidden">
          {/* Animated background indicator with gradient */}
          <div 
            className={`absolute top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-teal-700 to-teal-600 transition-all duration-500 ease-out shadow-lg shadow-teal-500/30 ${
              activeTab === 'daily' ? 'left-1.5 sm:left-2 w-[calc(33.333%-0.75rem)]' :
              activeTab === 'stats' ? 'left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.75rem)]' :
              'left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.75rem)]'
            }`}
          />
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] relative z-10 ${
              activeTab === 'daily' 
                ? 'text-white transform scale-[1.02]' 
                : 'text-slate-700 hover:text-teal-700 active:scale-95'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'daily' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>HARIAN</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] relative z-10 ${
              activeTab === 'stats' 
                ? 'text-white transform scale-[1.02]' 
                : 'text-slate-700 hover:text-teal-700 active:scale-95'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'stats' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>GRAFIK</span>
          </button>
          <button 
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] relative z-10 ${
              activeTab === 'emergency' 
                ? 'text-white transform scale-[1.02] bg-gradient-to-r from-red-600 to-red-500 rounded-lg sm:rounded-xl' 
                : 'text-slate-700 hover:text-red-600 active:scale-95'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'emergency' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>BONCOS</span>
          </button>
        </div>
      </div>

      <main className="px-4 sm:px-5 mt-4 sm:mt-6">
        {activeTab === 'daily' && (
          <div className="space-y-4 sm:space-y-5">
            {/* A. PRINSIP DASAR */}
            <div className="mb-4 sm:mb-6">
              <SectionHeader title="A. Prinsip Dasar" icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />} />
              <Card className="bg-amber-50 border-2 border-amber-300 shadow-lg">
                <div className="p-3 sm:p-4">
                  <h3 className="font-black text-amber-950 text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" /> Pegang Setiap Hari
                  </h3>
                  <div className="grid gap-2 sm:gap-3">
                    {prinsipDasar.map((prinsip, index) => (
                      <div key={index} className="flex gap-2 sm:gap-3 items-start">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0 border-2 border-amber-300 shadow-sm">
                          {index + 1}
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-slate-950 font-black leading-snug">
                          {prinsip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Habit Categories */}
            {(Object.entries(groupedHabits) as [HabitCategory, Habit[]][]).map(([category, habits]) => (
              <div key={category} className="mb-4 sm:mb-6">
                <SectionHeader 
                  title={category} 
                  icon={
                    category === HabitCategory.PAGI_DINI_HARI ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> :
                    category === HabitCategory.KERJA_DIGITAL ? <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> :
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  } 
                />
                <div className="space-y-2 sm:space-y-3">
                  {habits.map(habit => {
                    const isCompleted = todayProgress.completedHabitIds.includes(habit.id);
                    return (
                    <Card key={habit.id} className={`group transition-all duration-500 ease-out ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-300/60 shadow-md' 
                        : 'bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-400'
                    }`}>
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button 
                            onClick={() => toggleHabit(habit.id)}
                            className={`shrink-0 transition-all duration-300 ease-out active:scale-90 min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center rounded-xl ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-teal-600 to-teal-700 shadow-lg shadow-teal-500/50 scale-105' 
                                : 'bg-gradient-to-br from-slate-100 to-slate-200 hover:from-teal-100 hover:to-teal-200 shadow-inner hover:scale-105'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white stroke-2 drop-shadow-lg animate-in zoom-in duration-300" />
                            ) : (
                              <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-slate-500 stroke-[3px] group-hover:text-teal-600 transition-colors" />
                            )}
                          </button>
                          <div 
                            className="flex-1 cursor-pointer min-w-0" 
                            onClick={() => setExpandedHabitId(expandedHabitId === habit.id ? null : habit.id)}
                          >
                            <h4 className={`font-black text-[15px] sm:text-[16px] leading-tight tracking-tight transition-all duration-300 ${
                              isCompleted 
                                ? 'line-through text-slate-500 decoration-2 decoration-teal-600' 
                                : 'text-slate-950 group-hover:text-teal-900'
                            }`}>
                              {habit.title}
                            </h4>
                            {habit.description && (
                              <p className={`text-[12px] sm:text-[13px] mt-1 sm:mt-1.5 font-semibold leading-relaxed transition-colors ${
                                isCompleted 
                                  ? 'text-slate-400' 
                                  : 'text-slate-700 group-hover:text-slate-900'
                              }`}>
                                {habit.description}
                              </p>
                            )}
                          </div>
                          {(habit.prayer || habit.description) && (
                            <button 
                              onClick={() => setExpandedHabitId(expandedHabitId === habit.id ? null : habit.id)}
                              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                expandedHabitId === habit.id
                                  ? 'bg-teal-100 text-teal-900 border-2 border-teal-300 shadow-inner'
                                  : 'bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 active:scale-95'
                              }`}
                            >
                              {expandedHabitId === habit.id ? (
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                              ) : (
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                              )}
                            </button>
                          )}
                        </div>

                        {expandedHabitId === habit.id && habit.prayer && (
                          <div className="mt-3 sm:mt-4 p-4 sm:p-5 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 rounded-xl sm:rounded-2xl text-white shadow-xl border-2 border-teal-700/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                            <div className="text-right text-xl sm:text-2xl font-serif mb-3 sm:mb-4 leading-relaxed tracking-wider drop-shadow-lg">
                              {habit.prayer.arabic}
                            </div>
                            {habit.prayer.latin && (
                              <p className="text-[11px] sm:text-[12px] italic text-teal-100 mb-3 sm:mb-4 font-semibold border-b border-white/30 pb-3 sm:pb-4 leading-relaxed tracking-wide">
                                {habit.prayer.latin}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                              "{habit.prayer.translation}"
                            </p>
                            {habit.prayer.context && (
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/30 text-[10px] sm:text-[11px] text-teal-200 uppercase tracking-wider font-black flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span>{habit.prayer.context}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Muhasabah Bisnis - Fixed Contrast */}
            <SectionHeader title="Muhasabah Bisnis" icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />} />
            <Card className="p-4 sm:p-5 mb-8 sm:mb-10 bg-white border-2 border-slate-300 shadow-xl">
              <h3 className="font-black text-base sm:text-lg mb-4 sm:mb-5 flex items-center gap-2 text-teal-950 uppercase tracking-tighter">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700 shrink-0" /> <span>Refleksi Penutup Hari</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { key: 'jujur', label: 'Apakah hari ini saya jujur?' },
                  { key: 'followUp', label: 'Ada klien belum ditindaklanjuti?' },
                  { key: 'hakOrang', label: 'Ada hak orang tertunda?' },
                  { key: 'dosaDigital', label: 'Ada dosa digital (manipulasi)?' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-200 cursor-pointer hover:bg-slate-100 active:bg-slate-100 transition-all active:scale-[0.97] group min-h-[50px]">
                    <span className="text-xs sm:text-sm font-black text-slate-950 tracking-tight group-hover:text-teal-900 pr-2">{label}</span>
                    <input 
                      type="checkbox" 
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border-2 border-slate-400 text-teal-800 focus:ring-teal-800 focus:ring-offset-2 shadow-inner transition-colors shrink-0 cursor-pointer"
                      checked={todayProgress.muhasabah[key as keyof DailyProgress['muhasabah']]}
                      onChange={() => toggleMuhasabah(key as keyof DailyProgress['muhasabah'])}
                    />
                  </label>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 sm:space-y-8">
            <Card className="p-4 sm:p-8 bg-white border-2 border-slate-200 shadow-2xl">
              <h3 className="font-black text-slate-950 mb-6 sm:mb-10 flex items-center gap-2 sm:gap-3 text-lg sm:text-xl uppercase tracking-tight">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-teal-900 shrink-0" /> <span>Performa Amalan</span>
              </h3>
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.7}/>
                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#0f172a', fontSize: 11, fontWeight: 900}} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '16px', 
                        border: '3px solid #0f766e', 
                        backgroundColor: '#ffffff',
                        padding: '12px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#0f766e', fontWeight: '900', fontSize: '12px' }}
                      labelStyle={{fontWeight: '900', color: '#0f172a', marginBottom: '6px', fontSize: '13px'}}
                    />
                    <Area type="monotone" dataKey="points" stroke="#0f766e" strokeWidth={5} fillOpacity={1} fill="url(#colorPoints)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-6 sm:p-8 text-center bg-white border-2 border-slate-200 shadow-lg">
                <p className="text-[11px] sm:text-[12px] text-slate-950 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3 opacity-70">Total Hari</p>
                <p className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tighter">{Object.keys(state.progress).length}</p>
              </Card>
              <Card className="p-6 sm:p-8 text-center bg-white border-2 border-slate-200 shadow-lg">
                <p className="text-[11px] sm:text-[12px] text-slate-950 font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-2 sm:mb-3 opacity-70">Rata-Rata</p>
                <p className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tighter">
                  {Math.round(statsData.reduce((acc, curr) => acc + curr.points, 0) / (statsData.length || 1))}
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12">
            <div className="bg-red-50 border-4 border-red-300 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div className="bg-red-800 p-4 sm:p-5 rounded-xl sm:rounded-[2rem] shadow-xl shrink-0">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-black text-red-950 uppercase tracking-tighter leading-tight">DARURAT</h2>
                  <p className="text-red-900 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] mt-1 sm:mt-2">Boncos / Suspend / Limit</p>
                </div>
              </div>
              <p className="text-red-950 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-10 font-black bg-white/60 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-red-200 shadow-inner italic">
                "Saat traffic anjlok atau ads bermasalah, ingatlah bahwa rezeki bukan datang dari algoritma, tapi dari Dzat Yang Maha Mengatur."
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                {EMERGENCY.map(item => (
                  <Card key={item.id} className="p-4 sm:p-6 bg-white border-2 border-red-300 shadow-xl">
                    <h4 className="font-black text-slate-950 text-base sm:text-lg mb-2 uppercase tracking-tight leading-tight">{item.title}</h4>
                    {item.description && <p className="text-[12px] sm:text-[13px] text-red-950 font-black mb-4 sm:mb-6 italic bg-red-50/50 p-3 sm:p-4 rounded-xl border border-red-100">{item.description}</p>}
                    {item.prayer && (
                      <div className="p-5 sm:p-8 prayer-card rounded-[1.5rem] sm:rounded-[2.5rem] text-white shadow-2xl border-4 border-teal-950/40">
                        <div className="text-right text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 leading-relaxed">
                          {item.prayer.arabic}
                        </div>
                        <p className="text-[11px] sm:text-[12px] text-teal-50 italic mb-4 sm:mb-5 font-black opacity-90 border-b border-white/20 pb-4 sm:pb-5 leading-relaxed">
                          {item.prayer.latin}
                        </p>
                        <p className="text-[13px] sm:text-[15px] leading-relaxed font-black">"{item.prayer.translation}"</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6 sm:p-10 bg-teal-950 text-white border-none shadow-2xl">
              <h3 className="font-black mb-6 sm:mb-10 flex items-center gap-3 sm:gap-4 text-teal-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[10px] sm:text-xs">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" /> <span>AMALAN MINGGUAN ( SCALE UP )</span>
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {MINGGUAN.map(item => (
                  <div key={item.id} className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/5 border border-white/10 shadow-inner group hover:bg-white/10 active:bg-white/10 transition-all">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.5rem] bg-teal-900 border-2 border-teal-700 flex items-center justify-center font-black text-teal-300 text-2xl sm:text-3xl shadow-2xl group-hover:scale-105 transition-transform shrink-0">
                      +{item.points}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[15px] sm:text-[17px] font-black text-white leading-tight">{item.title}</h4>
                      <p className="text-[11px] sm:text-[12px] text-teal-400 font-black uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-2 opacity-80">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-around items-center z-50 max-w-xs sm:max-w-sm w-[calc(100%-2rem)] shadow-2xl rounded-2xl sm:rounded-3xl">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-all active:scale-90 min-w-[60px] sm:min-w-[70px] justify-center ${activeTab === 'daily' ? 'text-teal-950 scale-105' : 'text-slate-500'}`}
        >
          <CheckCircle className={`w-6 h-6 sm:w-7 sm:h-7 ${activeTab === 'daily' ? 'fill-teal-100 text-teal-900 stroke-[3px]' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${activeTab === 'daily' ? 'text-teal-950' : 'text-slate-500'}`}>Harian</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-all active:scale-90 min-w-[60px] sm:min-w-[70px] justify-center ${activeTab === 'stats' ? 'text-teal-950 scale-105' : 'text-slate-500'}`}
        >
          <TrendingUp className={`w-6 h-6 sm:w-7 sm:h-7 ${activeTab === 'stats' ? 'text-teal-900 stroke-[3px]' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${activeTab === 'stats' ? 'text-teal-950' : 'text-slate-500'}`}>Grafik</span>
        </button>
        <button 
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-all active:scale-90 min-w-[60px] sm:min-w-[70px] justify-center ${activeTab === 'emergency' ? 'text-red-900 scale-105' : 'text-slate-500'}`}
        >
          <AlertTriangle className={`w-6 h-6 sm:w-7 sm:h-7 ${activeTab === 'emergency' ? 'fill-red-50 text-red-900 stroke-[3px]' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${activeTab === 'emergency' ? 'text-red-950' : 'text-slate-500'}`}>Boncos</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
