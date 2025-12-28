import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Award, 
  Activity,
  RefreshCw,
  Shield,
  BarChart3
} from 'lucide-react';
import { getAllUsersStats, getAdminStats, UserStats, AdminStats } from '../services/adminService';

interface AdminPanelProps {
  adminEmail: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminEmail }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [adminStats, usersStats] = await Promise.all([
        getAdminStats(),
        getAllUsersStats()
      ]);
      setStats(adminStats);
      setUsers(usersStats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mb-2"></div>
          <p className="text-slate-600 font-semibold text-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Admin Header */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-4 shadow-xl text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">Admin Panel</h2>
              <p className="text-purple-200 text-[10px] font-semibold">{adminEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <p className="text-purple-100 text-xs font-medium leading-relaxed">
          🔒 Panel ini hanya terlihat oleh Anda. User lain tidak bisa melihat menu ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Users</span>
          </div>
          <p className="text-3xl font-black">{stats?.totalUsers || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Aktif Hari Ini</span>
          </div>
          <p className="text-3xl font-black">{stats?.activeUsersToday || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Aktif Minggu Ini</span>
          </div>
          <p className="text-3xl font-black">{stats?.activeUsersWeek || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Avg. Rate</span>
          </div>
          <p className="text-3xl font-black">{stats?.averageCompletionRate || 0}%</p>
        </div>
      </div>

      {/* Total Habits */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-4 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Amalan Selesai</p>
              <p className="text-2xl font-black">{stats?.totalHabitsCompleted?.toLocaleString() || 0}</p>
            </div>
          </div>
          <TrendingUp className="w-10 h-10 opacity-30" />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            Daftar User ({users.length})
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">Belum ada user terdaftar</p>
            </div>
          ) : (
            users.map((userData, index) => (
              <div key={userData.id} className="p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">User #{userData.id.substring(0, 8)}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {userData.last_active_date 
                          ? `Terakhir aktif: ${new Date(userData.last_active_date).toLocaleDateString('id-ID')}`
                          : 'Belum ada aktivitas'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-teal-700">
                      <Award className="w-3.5 h-3.5" />
                      <span className="font-black text-sm">{userData.total_habits_completed}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-semibold uppercase">
                      {userData.current_streak > 0 ? `🔥 ${userData.current_streak} hari streak` : 'No streak'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-slate-100 rounded-xl p-3 text-center">
        <p className="text-[10px] text-slate-600 font-semibold">
          🛡️ Data terakhir diperbarui: {new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;

