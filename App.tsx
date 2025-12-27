
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
  LogOut,
  Users,
  UserPlus,
  MessageCircle,
  Trophy
} from 'lucide-react';
import { HABITS, MINGGUAN, EMERGENCY } from './constants';
import { Habit, HabitCategory, DailyProgress, AppState } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Login from './components/Login';
import { onAuthChange, signOutUser, getCurrentUser } from './services/authService';
import { getUserData, saveUserData, subscribeToUserData, migrateFromLocalStorage } from './services/supabaseService';
import { getMyPartnership, getPendingInvitations, invitePartnerById, acceptPartnership, rejectPartnership, getPartnerProgress, subscribeToPartnership, Partnership } from './services/partnershipService';
import { getMessages, sendMessage, subscribeToMessages, Message } from './services/messageService';

// Helper components
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow-md border border-slate-200 overflow-hidden backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string, icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-2 mt-4">
    <div className="p-1 bg-teal-100 text-teal-900 rounded-lg shrink-0">
      {icon}
    </div>
    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{title}</h2>
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

  const [activeTab, setActiveTab] = useState<'daily' | 'stats' | 'emergency' | 'together'>('daily');
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPrinsipIndex, setCurrentPrinsipIndex] = useState(0);
  
  // Partnership state
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<{ sent: Partnership[]; received: Partnership[] }>({ sent: [], received: [] });
  const [partnerProgress, setPartnerProgress] = useState<AppState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

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

  // Load partnership data
  useEffect(() => {
    if (!user) {
      setPartnership(null);
      setPendingInvitations({ sent: [], received: [] });
      setPartnerProgress(null);
      setMessages([]);
      return;
    }

    const loadPartnershipData = async () => {
      try {
        const [myPartnership, invitations] = await Promise.all([
          getMyPartnership(),
          getPendingInvitations()
        ]);
        setPartnership(myPartnership);
        setPendingInvitations(invitations);

        // Load partner progress if partnership exists
        if (myPartnership) {
          const partnerId = myPartnership.user1_id === user.id ? myPartnership.user2_id : myPartnership.user1_id;
          const progress = await getPartnerProgress(partnerId);
          setPartnerProgress(progress);
        } else {
          setPartnerProgress(null);
        }
      } catch (error) {
        console.error('Error loading partnership data:', error);
      }
    };

    loadPartnershipData();

    // Subscribe to partnership changes
    const unsubscribe = subscribeToPartnership((updatedPartnership) => {
      setPartnership(updatedPartnership);
      if (updatedPartnership && user) {
        const partnerId = updatedPartnership.user1_id === user.id ? updatedPartnership.user2_id : updatedPartnership.user1_id;
        getPartnerProgress(partnerId).then(setPartnerProgress);
      } else {
        setPartnerProgress(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Load messages when partnership exists
  useEffect(() => {
    if (!user || !partnership) {
      setMessages([]);
      return;
    }

    const partnerId = partnership.user1_id === user.id ? partnership.user2_id : partnership.user1_id;
    
    const loadMessages = async () => {
      try {
        const msgs = await getMessages(partnerId);
        setMessages(msgs);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    // Subscribe to message changes
    const unsubscribe = subscribeToMessages(partnerId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [user, partnership]);

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
    <div className="max-w-xl mx-auto min-h-screen pb-16">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white pt-4 pb-5 px-4 rounded-b-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-700 rounded-full -mr-12 -mt-12 opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-600 rounded-full -ml-8 -mb-8 opacity-30 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-2">
              <h1 className="text-lg font-black tracking-tighter leading-tight drop-shadow-lg">Marketer Berkah</h1>
              <p className="text-teal-200 text-[10px] font-black uppercase tracking-wider mt-0.5 leading-tight opacity-90">
                Traffic berkah • Conversion stabil • Cashflow sehat
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20 shadow-lg shrink-0 hover:bg-white/20 transition-colors" title="Kalender">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              {isSaving && (
                <div className="text-[10px] text-teal-200 font-black animate-pulse flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse"></div>
                  Saving...
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/30 mt-3 shadow-xl">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-black text-white uppercase tracking-wider opacity-90">Progress Hari Ini</span>
              <span className="text-2xl font-black drop-shadow-lg">{completionPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-teal-950/70 rounded-full overflow-hidden border border-white/20 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 via-teal-300 to-teal-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(45,212,191,0.6)] relative overflow-hidden" 
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Prinsip Dasar Rotator */}
          <div className="mt-4 flex items-center gap-2 bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/30 shadow-lg">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex items-center justify-center font-black text-teal-900 text-xs shadow-xl shrink-0 border-2 border-yellow-300/80 ring-2 ring-yellow-200/50">
              {currentPrinsipIndex + 1}
            </div>
            <p className="text-[11px] text-white font-black leading-snug flex-1 transition-opacity duration-500 drop-shadow-sm">
              {prinsipDasar[currentPrinsipIndex]}
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="px-4 -mt-4 relative z-20">
        <div className="bg-white rounded-xl shadow-xl border-2 border-slate-200 p-1.5 flex gap-1.5 relative overflow-hidden">
          {/* Animated background indicator with gradient */}
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-lg bg-gradient-to-r from-teal-700 to-teal-600 transition-all duration-500 ease-out shadow-lg shadow-teal-500/30 ${
              activeTab === 'daily' ? 'left-1.5 w-[calc(33.333%-0.75rem)]' :
              activeTab === 'stats' ? 'left-[calc(33.333%+0.25rem)] w-[calc(33.333%-0.75rem)]' :
              'left-[calc(66.666%+0.25rem)] w-[calc(33.333%-0.75rem)]'
            }`}
          />
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 min-h-[38px] relative z-10 ${
              activeTab === 'daily' 
                ? 'text-white transform scale-[1.02]' 
                : 'text-slate-700 hover:text-teal-700 active:scale-95'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 transition-all ${activeTab === 'daily' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>HARIAN</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 min-h-[38px] relative z-10 ${
              activeTab === 'stats' 
                ? 'text-white transform scale-[1.02]' 
                : 'text-slate-700 hover:text-teal-700 active:scale-95'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 transition-all ${activeTab === 'stats' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>GRAFIK</span>
          </button>
          <button 
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[11px] font-black transition-all duration-300 flex items-center justify-center gap-1.5 min-h-[38px] relative z-10 ${
              activeTab === 'emergency' 
                ? 'text-white transform scale-[1.02] bg-gradient-to-r from-red-600 to-red-500 rounded-lg' 
                : 'text-slate-700 hover:text-red-600 active:scale-95'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 transition-all ${activeTab === 'emergency' ? 'scale-110 drop-shadow-lg' : ''}`} /> 
            <span>BONCOS</span>
          </button>
        </div>
      </div>

      <main className="px-4 mt-4">
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {/* A. PRINSIP DASAR */}
            <div className="mb-4">
              <SectionHeader title="A. Prinsip Dasar" icon={<Star className="w-4 h-4" />} />
              <Card className="bg-gradient-to-br from-amber-50 via-amber-50/90 to-yellow-50 border-2 border-amber-300/80 shadow-xl ring-1 ring-amber-200/50">
                <div className="p-3">
                  <h3 className="font-black text-amber-950 text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1 bg-amber-200 rounded-lg">
                      <Heart className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    </div>
                    <span>Pegang Setiap Hari</span>
                  </h3>
                  <div className="grid gap-2">
                    {prinsipDasar.map((prinsip, index) => (
                      <div key={index} className="flex gap-2 items-start p-1.5 rounded-lg hover:bg-amber-100/50 transition-colors">
                        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-300 to-amber-400 text-amber-900 flex items-center justify-center font-black text-[10px] shrink-0 border-2 border-amber-400 shadow-sm ring-1 ring-amber-200">
                          {index + 1}
                        </div>
                        <p className="text-[12px] text-slate-950 font-black leading-snug">
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
              <div key={category} className="mb-4">
                <SectionHeader 
                  title={category} 
                  icon={
                    category === HabitCategory.PAGI_DINI_HARI ? <Moon className="w-4 h-4" /> :
                    category === HabitCategory.KERJA_DIGITAL ? <ShieldCheck className="w-4 h-4" /> :
                    <CheckCircle className="w-4 h-4" />
                  } 
                />
                <div className="space-y-2.5">
                  {habits.map(habit => {
                    const isCompleted = todayProgress.completedHabitIds.includes(habit.id);
                    return (
                    <Card key={habit.id} className={`group transition-all duration-500 ease-out ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-teal-50 via-teal-50/80 to-teal-100/50 border-2 border-teal-300/70 shadow-md ring-1 ring-teal-200/50' 
                        : 'bg-white border-2 border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-400 hover:-translate-y-0.5 active:translate-y-0'
                    }`}>
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleHabit(habit.id)}
                            className={`shrink-0 transition-all duration-300 ease-out active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl ${
                              isCompleted 
                                ? 'bg-gradient-to-br from-teal-600 via-teal-600 to-teal-700 shadow-xl shadow-teal-500/60 scale-105 ring-2 ring-teal-400/50' 
                                : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 hover:from-teal-100 hover:via-teal-50 hover:to-teal-200 shadow-inner hover:scale-105 hover:ring-2 hover:ring-teal-200/50'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-white fill-white stroke-2 drop-shadow-xl animate-in zoom-in duration-300" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500 stroke-[3px] group-hover:text-teal-600 transition-colors" />
                            )}
                          </button>
                          <div 
                            className="flex-1 cursor-pointer min-w-0" 
                            onClick={() => setExpandedHabitId(expandedHabitId === habit.id ? null : habit.id)}
                          >
                            <h4 className={`font-black text-[15px] leading-tight tracking-tight transition-all duration-300 ${
                              isCompleted 
                                ? 'line-through text-slate-500 decoration-2 decoration-teal-600' 
                                : 'text-slate-950 group-hover:text-teal-900'
                            }`}>
                              {habit.title}
                            </h4>
                            {habit.description && (
                              <p className={`text-[12px] mt-1 font-semibold leading-relaxed transition-colors ${
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
                              className={`p-2 rounded-lg transition-all duration-300 shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center ${
                                expandedHabitId === habit.id
                                  ? 'bg-teal-100 text-teal-900 border-2 border-teal-300 shadow-inner'
                                  : 'bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 active:scale-95'
                              }`}
                            >
                              {expandedHabitId === habit.id ? (
                                <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                              ) : (
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                              )}
                            </button>
                          )}
                        </div>

                        {expandedHabitId === habit.id && habit.prayer && (
                          <div className="mt-3 p-3.5 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 rounded-xl text-white shadow-2xl border-2 border-teal-700/60 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ring-2 ring-teal-700/30">
                            <div className="text-right text-lg font-serif mb-3 leading-relaxed tracking-wider drop-shadow-xl">
                              {habit.prayer.arabic}
                            </div>
                            {habit.prayer.latin && (
                              <p className="text-[11px] italic text-teal-100 mb-3 font-semibold border-b border-white/40 pb-3 leading-relaxed tracking-wide">
                                {habit.prayer.latin}
                              </p>
                            )}
                            <p className="text-xs font-bold text-white leading-relaxed drop-shadow-sm">
                              "{habit.prayer.translation}"
                            </p>
                            {habit.prayer.context && (
                              <div className="mt-3 pt-3 border-t border-white/40 text-[10px] text-teal-200 uppercase tracking-wider font-black flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 shrink-0" /> <span>{habit.prayer.context}</span>
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
            <SectionHeader title="Muhasabah Bisnis" icon={<Heart className="w-4 h-4" />} />
            <Card className="p-4 mb-8 bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-300/80 shadow-xl ring-1 ring-slate-200/50">
              <h3 className="font-black text-base mb-4 flex items-center gap-2 text-teal-950 uppercase tracking-tighter">
                <div className="p-1 bg-teal-100 rounded-lg">
                  <Info className="w-4 h-4 text-teal-700 shrink-0" />
                </div>
                <span>Refleksi Penutup Hari</span>
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'jujur', label: 'Apakah hari ini saya jujur?' },
                  { key: 'followUp', label: 'Ada klien belum ditindaklanjuti?' },
                  { key: 'hakOrang', label: 'Ada hak orang tertunda?' },
                  { key: 'dosaDigital', label: 'Ada dosa digital (manipulasi)?' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border-2 border-slate-200/80 cursor-pointer hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100/50 hover:border-teal-300 active:bg-slate-100 transition-all active:scale-[0.97] group min-h-[48px] shadow-sm hover:shadow-md">
                    <span className="text-xs font-black text-slate-950 tracking-tight group-hover:text-teal-900 pr-2 transition-colors">{label}</span>
                    <input 
                      type="checkbox" 
                      className="w-7 h-7 rounded-lg border-2 border-slate-400 text-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-inner transition-all shrink-0 cursor-pointer checked:bg-teal-600 checked:border-teal-600 hover:scale-110"
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

        {activeTab === 'together' && (
          <div className="space-y-4 pb-8">
            {/* Header Section */}
            <Card className="p-4 bg-gradient-to-br from-purple-50 via-purple-50/90 to-pink-50 border-2 border-purple-300/80 shadow-xl ring-1 ring-purple-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-600 rounded-xl shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-black text-purple-950 uppercase tracking-tight">Evaluasi Bersama</h2>
                  <p className="text-[11px] text-purple-700 font-black">Accountability Partner</p>
                </div>
              </div>
              <p className="text-xs text-purple-900 font-semibold leading-relaxed">
                Evaluasi bersama rekan kerja atau pasangan untuk saling memotivasi dan menjaga konsistensi amalan harian.
              </p>
            </Card>

            {/* Partner Status */}
            <Card className="p-4 bg-white border-2 border-slate-200 shadow-lg">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-slate-950 uppercase tracking-tight">
                <UserPlus className="w-4 h-4 text-teal-700" />
                <span>Partner Saya</span>
              </h3>
              <div className="space-y-3">
                {!partnership && pendingInvitations.received.length === 0 && pendingInvitations.sent.length === 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 text-center">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-black text-slate-600 mb-3">Belum ada partner</p>
                    <button 
                      onClick={() => setShowInviteModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-black rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      + Invite Partner
                    </button>
                  </div>
                )}

                {/* Pending Invitations Received */}
                {pendingInvitations.received.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-600 mb-2">Undangan Masuk:</p>
                    {pendingInvitations.received.map((inv) => (
                      <div key={inv.id} className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300">
                        <p className="text-xs font-black text-amber-950 mb-2">Undangan dari partner</p>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await acceptPartnership(inv.id);
                                const [updatedPartnership, updatedInvitations] = await Promise.all([
                                  getMyPartnership(),
                                  getPendingInvitations()
                                ]);
                                setPartnership(updatedPartnership);
                                setPendingInvitations(updatedInvitations);
                              } catch (error: any) {
                                alert(error.message || 'Error accepting partnership');
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs font-black rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                          >
                            Terima
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await rejectPartnership(inv.id);
                                const updatedInvitations = await getPendingInvitations();
                                setPendingInvitations(updatedInvitations);
                              } catch (error: any) {
                                alert(error.message || 'Error rejecting partnership');
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 active:scale-95 transition-all"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending Invitations Sent */}
                {pendingInvitations.sent.length > 0 && (
                  <div className="p-3 rounded-xl bg-blue-50 border-2 border-blue-300">
                    <p className="text-xs font-black text-blue-950">Menunggu konfirmasi partner...</p>
                  </div>
                )}

                {/* Active Partnership */}
                {partnership && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-teal-50 to-teal-100/50 border-2 border-teal-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-black text-sm">
                          {partnership.partner?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-950">Partner Aktif</p>
                          <p className="text-[10px] text-slate-600">
                            Sejak {new Date(partnership.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    {partnerProgress && (
                      <div className="flex items-center gap-4 text-xs mt-2">
                        <div>
                          <p className="text-slate-500 font-black">Progress Hari Ini</p>
                          <p className="text-teal-900 font-black text-sm">
                            {(() => {
                              const today = new Date().toISOString().split('T')[0];
                              const todayProg = partnerProgress.progress[today];
                              if (!todayProg || !todayProg.completedHabitIds) return '0%';
                              const partnerPoints = HABITS
                                .filter(h => todayProg.completedHabitIds.includes(h.id))
                                .reduce((sum, h) => sum + h.points, 0);
                              return Math.round((partnerPoints / totalPointsPossible) * 100) + '%';
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-black">Total Hari</p>
                          <p className="text-teal-900 font-black text-sm">{Object.keys(partnerProgress.progress || {}).length}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Invite Modal */}
            {showInviteModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="p-4 bg-white max-w-md w-full">
                  <h3 className="font-black text-base mb-3 text-slate-950">Invite Partner</h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Masukkan User ID partner untuk mengundang. (Untuk testing - nanti bisa diganti dengan email)
                  </p>
                  <input
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="User ID partner (UUID)"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 text-sm font-black mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await invitePartnerById(inviteEmail);
                          setShowInviteModal(false);
                          setInviteEmail('');
                          const updatedInvitations = await getPendingInvitations();
                          setPendingInvitations(updatedInvitations);
                        } catch (error: any) {
                          alert(error.message || 'Error inviting partner');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-black rounded-lg hover:bg-purple-700 active:scale-95 transition-all"
                    >
                      Kirim Undangan
                    </button>
                    <button
                      onClick={() => {
                        setShowInviteModal(false);
                        setInviteEmail('');
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-black rounded-lg hover:bg-slate-300 active:scale-95 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </Card>
              </div>
            )}

            {/* Comparison View */}
            <Card className="p-4 bg-white border-2 border-slate-200 shadow-lg">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-slate-950 uppercase tracking-tight">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Perbandingan Progress</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <p className="text-xs text-slate-500 font-black mb-2">Hari Ini</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">Saya</span>
                      <div className="flex-1 mx-3 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-950 w-12 text-right">{completionPercentage}%</span>
                    </div>
                    <div className={`flex items-center justify-between ${!partnerProgress ? 'opacity-50' : ''}`}>
                      <span className="text-xs font-black text-slate-700">Partner</span>
                      <div className="flex-1 mx-3 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" 
                          style={{ 
                            width: partnerProgress ? (() => {
                              const today = new Date().toISOString().split('T')[0];
                              const todayProg = partnerProgress.progress[today];
                              if (!todayProg || !todayProg.completedHabitIds) return '0%';
                              const partnerPoints = HABITS
                                .filter(h => todayProg.completedHabitIds.includes(h.id))
                                .reduce((sum, h) => sum + h.points, 0);
                              return Math.round((partnerPoints / totalPointsPossible) * 100) + '%';
                            })() : '0%'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-950 w-12 text-right">
                        {partnerProgress ? (() => {
                          const today = new Date().toISOString().split('T')[0];
                          const todayProg = partnerProgress.progress[today];
                          if (!todayProg || !todayProg.completedHabitIds) return '0%';
                          const partnerPoints = HABITS
                            .filter(h => todayProg.completedHabitIds.includes(h.id))
                            .reduce((sum, h) => sum + h.points, 0);
                          return Math.round((partnerPoints / totalPointsPossible) * 100) + '%';
                        })() : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <p className="text-xs text-slate-500 font-black mb-2">Minggu Ini (Rata-rata)</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">Saya</span>
                      <div className="flex-1 mx-3 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full" style={{ width: `${Math.round(statsData.reduce((acc, curr) => acc + curr.points, 0) / (statsData.length || 1) / totalPointsPossible * 100)}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-950 w-12 text-right">
                        {Math.round(statsData.reduce((acc, curr) => acc + curr.points, 0) / (statsData.length || 1) / totalPointsPossible * 100)}%
                      </span>
                    </div>
                    <div className={`flex items-center justify-between ${!partnerProgress ? 'opacity-50' : ''}`}>
                      <span className="text-xs font-black text-slate-700">Partner</span>
                      <div className="flex-1 mx-3 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" 
                          style={{ 
                            width: partnerProgress ? (() => {
                              const partnerStats = Object.values(partnerProgress.progress || {});
                              if (partnerStats.length === 0) return '0%';
                              const avgPoints = partnerStats.reduce((sum: number, prog: any) => {
                                if (!prog.completedHabitIds) return sum;
                                const points = HABITS
                                  .filter(h => prog.completedHabitIds.includes(h.id))
                                  .reduce((s, h) => s + h.points, 0);
                                return sum + points;
                              }, 0) / partnerStats.length;
                              return Math.round((avgPoints / totalPointsPossible) * 100) + '%';
                            })() : '0%'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-950 w-12 text-right">
                        {partnerProgress ? (() => {
                          const partnerStats = Object.values(partnerProgress.progress || {});
                          if (partnerStats.length === 0) return '0%';
                          const avgPoints = partnerStats.reduce((sum: number, prog: any) => {
                            if (!prog.completedHabitIds) return sum;
                            const points = HABITS
                              .filter(h => prog.completedHabitIds.includes(h.id))
                              .reduce((s, h) => s + h.points, 0);
                            return sum + points;
                          }, 0) / partnerStats.length;
                          return Math.round((avgPoints / totalPointsPossible) * 100) + '%';
                        })() : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Messages/Feedback Section */}
            <Card className="p-4 bg-white border-2 border-slate-200 shadow-lg">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-slate-950 uppercase tracking-tight">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span>Pesan & Motivasi</span>
              </h3>
              <div className="space-y-3">
                {!partnership ? (
                  <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 text-center">
                    <MessageCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-black text-slate-600 mb-3">Belum ada partner untuk saling memberikan motivasi</p>
                    <p className="text-[10px] text-slate-500">Invite partner untuk mulai saling memberikan feedback</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                      {messages.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-4">Belum ada pesan</p>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.sender_id === user?.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-2.5 rounded-lg ${
                                  isMe
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-100 text-slate-900'
                                }`}
                              >
                                <p className="text-xs leading-relaxed">{msg.message}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-teal-100' : 'text-slate-500'}`}>
                                  {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newMessage.trim() && partnership) {
                            const partnerId = partnership.user1_id === user?.id ? partnership.user2_id : partnership.user1_id;
                            sendMessage(partnerId, newMessage).then(() => {
                              setNewMessage('');
                              getMessages(partnerId).then(setMessages);
                            }).catch(alert);
                          }
                        }}
                        placeholder="Tulis pesan motivasi..."
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-300 text-xs font-black"
                      />
                      <button
                        onClick={async () => {
                          if (!newMessage.trim() || !partnership) return;
                          const partnerId = partnership.user1_id === user?.id ? partnership.user2_id : partnership.user1_id;
                          try {
                            await sendMessage(partnerId, newMessage);
                            setNewMessage('');
                            const updatedMessages = await getMessages(partnerId);
                            setMessages(updatedMessages);
                          } catch (error: any) {
                            alert(error.message || 'Error sending message');
                          }
                        }}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-teal-600 text-white text-xs font-black rounded-lg hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Kirim
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* How It Works */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-blue-950 uppercase tracking-tight">
                <Info className="w-4 h-4 text-blue-700" />
                <span>Cara Kerja</span>
              </h3>
              <div className="space-y-2.5">
                {[
                  { step: '1', title: 'Invite Partner', desc: 'Kirim undangan ke rekan kerja atau pasangan via email' },
                  { step: '2', title: 'Terima Undangan', desc: 'Partner menerima dan menerima undangan' },
                  { step: '3', title: 'Saling Melihat Progress', desc: 'Lihat progress harian dan mingguan partner' },
                  { step: '4', title: 'Saling Memotivasi', desc: 'Kirim pesan motivasi dan feedback untuk saling mendukung' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-950 mb-0.5">{item.title}</p>
                      <p className="text-[11px] text-blue-800 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Settings Section */}
            <Card className="p-4 bg-white border-2 border-slate-200 shadow-lg">
              <h3 className="font-black text-sm mb-3 flex items-center gap-2 text-slate-950 uppercase tracking-tight">
                <Info className="w-4 h-4 text-slate-600" />
                <span>Pengaturan</span>
              </h3>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-300 text-red-900 font-black text-sm uppercase tracking-tight hover:from-red-100 hover:to-red-200 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar / Logout</span>
              </button>
            </Card>
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

      {/* Bottom Nav - Full Width Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200/80 px-2 py-3 flex justify-around items-center z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 justify-center relative ${activeTab === 'daily' ? 'text-teal-950 scale-105' : 'text-slate-500'}`}
        >
          {activeTab === 'daily' && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-full"></div>
          )}
          <CheckCircle className={`w-5 h-5 transition-all ${activeTab === 'daily' ? 'fill-teal-100 text-teal-900 stroke-[3px] drop-shadow-md' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeTab === 'daily' ? 'text-teal-950' : 'text-slate-500'}`}>Harian</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 justify-center relative ${activeTab === 'stats' ? 'text-teal-950 scale-105' : 'text-slate-500'}`}
        >
          {activeTab === 'stats' && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-full"></div>
          )}
          <TrendingUp className={`w-5 h-5 transition-all ${activeTab === 'stats' ? 'text-teal-900 stroke-[3px] drop-shadow-md' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeTab === 'stats' ? 'text-teal-950' : 'text-slate-500'}`}>Grafik</span>
        </button>
        <button 
          onClick={() => setActiveTab('together')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 justify-center relative ${activeTab === 'together' ? 'text-purple-950 scale-105' : 'text-slate-500'}`}
        >
          {activeTab === 'together' && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-full"></div>
          )}
          <Users className={`w-5 h-5 transition-all ${activeTab === 'together' ? 'text-purple-900 stroke-[3px] drop-shadow-md' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeTab === 'together' ? 'text-purple-950' : 'text-slate-500'}`}>Bersama</span>
        </button>
        <button 
          onClick={() => setActiveTab('emergency')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 flex-1 justify-center relative ${activeTab === 'emergency' ? 'text-red-900 scale-105' : 'text-slate-500'}`}
        >
          {activeTab === 'emergency' && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600 rounded-full"></div>
          )}
          <AlertTriangle className={`w-5 h-5 transition-all ${activeTab === 'emergency' ? 'fill-red-50 text-red-900 stroke-[3px] drop-shadow-md' : 'text-slate-400 stroke-[2.5px]'}`} />
          <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${activeTab === 'emergency' ? 'text-red-950' : 'text-slate-500'}`}>Boncos</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
