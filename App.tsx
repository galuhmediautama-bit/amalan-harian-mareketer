
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
import { getUserData, saveUserData, subscribeToUserData, migrateFromLocalStorage } from './services/storageService';

// Helper components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-6 sm:mt-8">
    <div className="p-1.5 sm:p-2 bg-teal-100 text-teal-900 rounded-lg shrink-0">
      {icon}
    </div>
    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{title}</h2>
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

  // Check authentication and load data
  useEffect(() => {
    let unsubscribeStorage: (() => void) | null = null;

    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load data from localStorage
        try {
          await migrateFromLocalStorage();
          
          const userData = await getUserData();
          if (userData) {
            setState(userData);
          }

          // Subscribe to data changes
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

  // Save to localStorage when state changes (debounced)
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

  const handleLogout = async () => {
    try {
      await signOutUser();
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
    // onAuthChange will automatically update user state, no callback needed
    return <Login onLoginSuccess={() => {}} />;
  }

  const prinsipDasar = [
    "Rezeki datang lewat kepercayaan (jujur & amanah)",
    "Keputusan bisnis butuh hati yang bersih",
    "Rezeki besar lahir dari manfaat besar",
    "Amalan membuka pintu, ikhtiar yang memasukkan",
    "Algoritma berubah, Allah tidak",
    "Trust lebih kuat dari click",
    "Konten jujur menarik audience yang tepat",
    "Barakah menjaga performa jangka panjang"
  ];

  // Rotate prinsip dasar untuk ditampilkan di header
  const [currentPrinsipIndex, setCurrentPrinsipIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrinsipIndex((prev) => (prev + 1) % prinsipDasar.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [prinsipDasar.length]);

  return (
    <div className="max-w-xl mx-auto min-h-screen pb-24 sm:pb-28">
      {/* Header */}
      <header className="bg-teal-900 text-white pt-6 sm:pt-10 pb-10 sm:pb-14 px-4 sm:px-6 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-teal-800 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24 opacity-30 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex-1 pr-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter leading-tight">Marketer Berkah</h1>
              <p className="text-teal-300 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-1.5 leading-relaxed">
                Traffic berkah • Conversion stabil • Cashflow sehat
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-teal-800 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-teal-600 shadow-xl shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="bg-teal-800/80 hover:bg-teal-800 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-teal-600 shadow-xl shrink-0 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              {isSaving && (
                <div className="text-xs text-teal-300 font-black animate-pulse">
                  Saving...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 mt-6 sm:mt-8 shadow-inner backdrop-blur-sm">
            <div className="flex justify-between items-end mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.25em]">Progress Hari Ini</span>
              <span className="text-3xl sm:text-4xl font-black">{completionPercentage}%</span>
            </div>
            <div className="h-4 sm:h-5 w-full bg-teal-950/60 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-teal-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Prinsip Dasar Rotator */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-4 bg-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-black text-teal-900 text-lg sm:text-xl shadow-lg shrink-0 border-2 border-yellow-300 animate-pulse">
              {currentPrinsipIndex + 1}
            </div>
            <p className="text-[12px] sm:text-[14px] text-white font-black leading-relaxed flex-1 transition-opacity duration-500">
              {prinsipDasar[currentPrinsipIndex]}
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-4 sm:px-5 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-1.5 sm:p-2 flex gap-1 sm:gap-0 relative">
          {/* Animated background indicator */}
          <div 
            className={`absolute top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 rounded-xl sm:rounded-2xl bg-teal-800 transition-all duration-300 ease-out shadow-lg ${
              activeTab === 'daily' ? 'left-1.5 sm:left-2 w-[calc(33.333%-0.5rem)]' :
              activeTab === 'stats' ? 'left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.5rem)]' :
              'left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.5rem)]'
            }`}
          />
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 min-h-[44px] relative z-10 ${
              activeTab === 'daily' 
                ? 'text-white transform scale-105' 
                : 'text-slate-900 hover:text-teal-800 active:scale-95'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'daily' ? 'scale-110' : ''}`} /> 
            <span>HARIAN</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 min-h-[44px] relative z-10 ${
              activeTab === 'stats' 
                ? 'text-white transform scale-105' 
                : 'text-slate-900 hover:text-teal-800 active:scale-95'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'stats' ? 'scale-110' : ''}`} /> 
            <span>GRAFIK</span>
          </button>
          <button 
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 min-h-[44px] relative z-10 ${
              activeTab === 'emergency' 
                ? 'text-white transform scale-105' 
                : 'text-slate-900 hover:text-red-600 active:scale-95'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${activeTab === 'emergency' ? 'scale-110' : ''}`} /> 
            <span>BONCOS</span>
          </button>
        </div>
      </div>

      <main className="px-4 sm:px-5 mt-6 sm:mt-10">
        {activeTab === 'daily' && (
          <div className="space-y-6">
            {/* A. PRINSIP DASAR */}
            <div className="mb-8 sm:mb-10">
              <SectionHeader title="A. Prinsip Dasar" icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />} />
              <Card className="bg-amber-50 border-2 border-amber-300 shadow-xl">
                <div className="p-4 sm:p-6">
                  <h3 className="font-black text-amber-950 text-xs sm:text-sm mb-4 sm:mb-5 uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" /> Pegang Setiap Hari
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {prinsipDasar.map((prinsip, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 items-start">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0 border-2 border-amber-300 shadow-sm">
                          {index + 1}
                        </div>
                        <p className="text-[13px] sm:text-[14px] text-slate-950 font-black leading-snug">
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
              <div key={category} className="mb-8 sm:mb-12">
                <SectionHeader 
                  title={category} 
                  icon={
                    category === HabitCategory.PAGI_DINI_HARI ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> :
                    category === HabitCategory.KERJA_DIGITAL ? <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> :
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  } 
                />
                <div className="space-y-3 sm:space-y-4">
                  {habits.map(habit => (
                    <Card key={habit.id} className={`transition-all duration-300 ${todayProgress.completedHabitIds.includes(habit.id) ? 'bg-slate-100 border-slate-300 opacity-80 shadow-none' : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-300'}`}>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-3 sm:gap-5">
                          <button 
                            onClick={() => toggleHabit(habit.id)}
                            className="shrink-0 transition-all duration-200 active:scale-75 min-w-[44px] min-h-[44px] flex items-center justify-center hover:scale-110"
                          >
                            {todayProgress.completedHabitIds.includes(habit.id) ? (
                              <CheckCircle className="w-10 h-10 sm:w-11 sm:h-11 text-teal-800 fill-teal-50 animate-in fade-in zoom-in duration-200" />
                            ) : (
                              <Circle className="w-10 h-10 sm:w-11 sm:h-11 text-slate-400 stroke-[2.5px] hover:text-teal-600 transition-colors" />
                            )}
                          </button>
                          <div className="flex-1 cursor-pointer min-w-0" onClick={() => setExpandedHabitId(expandedHabitId === habit.id ? null : habit.id)}>
                            <h4 className={`font-black text-slate-950 text-[15px] sm:text-[16px] leading-tight tracking-tight ${todayProgress.completedHabitIds.includes(habit.id) ? 'line-through text-slate-600' : ''}`}>
                              {habit.title}
                            </h4>
                            {habit.description && (
                              <p className={`text-[11px] sm:text-[12px] mt-1 sm:mt-1.5 font-black leading-relaxed ${todayProgress.completedHabitIds.includes(habit.id) ? 'text-slate-500' : 'text-slate-800'}`}>
                                {habit.description}
                              </p>
                            )}
                          </div>
                          {(habit.prayer || habit.description) && (
                            <button 
                              onClick={() => setExpandedHabitId(expandedHabitId === habit.id ? null : habit.id)}
                              className="p-2 sm:p-2.5 text-slate-950 bg-slate-100 rounded-xl sm:rounded-2xl hover:bg-slate-200 active:bg-slate-200 border-2 border-slate-200 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                              {expandedHabitId === habit.id ? <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                          )}
                        </div>

                        {expandedHabitId === habit.id && habit.prayer && (
                          <div className="mt-4 sm:mt-5 p-4 sm:p-6 prayer-card rounded-[1.5rem] sm:rounded-[2rem] text-white shadow-2xl border-4 border-teal-900/40">
                            <div className="text-right text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 leading-relaxed tracking-wider drop-shadow-lg">
                              {habit.prayer.arabic}
                            </div>
                            {habit.prayer.latin && (
                              <p className="text-[11px] sm:text-[12px] italic text-teal-50 mb-4 sm:mb-5 font-black border-b border-white/20 pb-3 sm:pb-4 leading-relaxed tracking-tight">
                                {habit.prayer.latin}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm font-black text-white leading-relaxed">
                              "{habit.prayer.translation}"
                            </p>
                            {habit.prayer.context && (
                              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20 text-[10px] sm:text-[11px] text-teal-300 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span>{habit.prayer.context}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {/* Muhasabah Bisnis - Fixed Contrast */}
            <SectionHeader title="Muhasabah Bisnis" icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />} />
            <Card className="p-5 sm:p-8 mb-12 sm:mb-16 bg-white border-2 border-slate-300 shadow-2xl">
              <h3 className="font-black text-lg sm:text-xl mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-teal-950 uppercase tracking-tighter">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 shrink-0" /> <span>Refleksi Penutup Hari</span>
              </h3>
              <div className="space-y-4 sm:space-y-5">
                {[
                  { key: 'jujur', label: 'Apakah hari ini saya jujur?' },
                  { key: 'followUp', label: 'Ada klien belum ditindaklanjuti?' },
                  { key: 'hakOrang', label: 'Ada hak orang tertunda?' },
                  { key: 'dosaDigital', label: 'Ada dosa digital (manipulasi)?' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border-2 border-slate-200 cursor-pointer hover:bg-slate-100 active:bg-slate-100 transition-all active:scale-[0.97] group min-h-[60px]">
                    <span className="text-xs sm:text-sm font-black text-slate-950 tracking-tight group-hover:text-teal-900 pr-2">{label}</span>
                    <input 
                      type="checkbox" 
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border-2 border-slate-400 text-teal-800 focus:ring-teal-800 focus:ring-offset-2 shadow-inner transition-colors shrink-0 cursor-pointer"
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

      {/* Persistent Bottom Nav - Fixed Styling with Safe Area */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-slate-100 px-4 sm:px-8 py-4 sm:py-6 pb-safe flex justify-around items-center z-50 max-w-xl mx-auto shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[2rem] sm:rounded-t-[3.5rem]">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center gap-1.5 sm:gap-2 transition-all active:scale-75 min-h-[60px] min-w-[60px] sm:min-w-0 justify-center ${activeTab === 'daily' ? 'text-teal-950 scale-110' : 'text-slate-400 opacity-60'}`}
        >
          <CheckCircle className={`w-7 h-7 sm:w-8 sm:h-8 ${activeTab === 'daily' ? 'fill-teal-100 text-teal-900 stroke-[3px]' : 'text-slate-900 stroke-[2.5px]'}`} />
          <span className={`text-[11px] sm:text-[12px] font-black uppercase tracking-[0.08em] sm:tracking-[0.1em] ${activeTab === 'daily' ? 'text-teal-950' : 'text-slate-900'}`}>Harian</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1.5 sm:gap-2 transition-all active:scale-75 min-h-[60px] min-w-[60px] sm:min-w-0 justify-center ${activeTab === 'stats' ? 'text-teal-950 scale-110' : 'text-slate-400 opacity-60'}`}
        >
          <TrendingUp className={`w-7 h-7 sm:w-8 sm:h-8 ${activeTab === 'stats' ? 'text-teal-900 stroke-[3px]' : 'text-slate-900 stroke-[2.5px]'}`} />
          <span className={`text-[11px] sm:text-[12px] font-black uppercase tracking-[0.08em] sm:tracking-[0.1em] ${activeTab === 'stats' ? 'text-teal-950' : 'text-slate-900'}`}>Grafik</span>
        </button>
        <button 
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center gap-1.5 sm:gap-2 transition-all active:scale-75 min-h-[60px] min-w-[60px] sm:min-w-0 justify-center ${activeTab === 'emergency' ? 'text-red-900 scale-110' : 'text-slate-400 opacity-60'}`}
        >
          <AlertTriangle className={`w-7 h-7 sm:w-8 sm:h-8 ${activeTab === 'emergency' ? 'fill-red-50 text-red-900 stroke-[3px]' : 'text-slate-900 stroke-[2.5px]'}`} />
          <span className={`text-[11px] sm:text-[12px] font-black uppercase tracking-[0.08em] sm:tracking-[0.1em] ${activeTab === 'emergency' ? 'text-red-950' : 'text-slate-900'}`}>Boncos</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
