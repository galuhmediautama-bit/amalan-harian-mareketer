import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Award, 
  Activity,
  RefreshCw,
  Shield,
  BarChart3,
  Settings,
  Save,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { getAllUsersStats, getAdminStats, UserStats, AdminStats } from '../services/adminService';
import { getAppSettings, updateAppSettings, fileToBase64, AppSettings } from '../services/settingsService';
import { showToast } from './Toast';
import Modal, { showModal } from './Modal';

interface AdminPanelProps {
  adminEmail: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminEmail }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<'stats' | 'settings'>('stats');
  
  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    app_name: 'Amalan Marketer Berkah',
    app_logo: '',
    app_favicon: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  const loadData = async () => {
    try {
      const [adminStats, usersStats, appSettings] = await Promise.all([
        getAdminStats(),
        getAllUsersStats(),
        getAppSettings()
      ]);
      setStats(adminStats);
      setUsers(usersStats);
      setSettings(appSettings);
      setLogoPreview(appSettings.app_logo || '');
      setFaviconPreview(appSettings.app_favicon || '');
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

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const success = await updateAppSettings(settings);
      if (success) {
        showToast('Pengaturan berhasil disimpan!', 'success');
        // Update previews
        setLogoPreview(settings.app_logo || '');
        setFaviconPreview(settings.app_favicon || '');
        // Reload page to apply changes after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showToast('Gagal menyimpan pengaturan', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error: ' + (error as Error).message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setSettings({ ...settings, app_logo: base64 });
        setLogoPreview(base64);
      } catch (error) {
        console.error('Error converting logo:', error);
        showToast('Gagal mengupload logo', 'error');
      }
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setSettings({ ...settings, app_favicon: base64 });
        setFaviconPreview(base64);
      } catch (error) {
        console.error('Error converting favicon:', error);
        showToast('Gagal mengupload favicon', 'error');
      }
    }
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
        
        <p className="text-purple-100 text-xs font-medium leading-relaxed mb-3">
          🔒 Panel ini hanya terlihat oleh Anda. User lain tidak bisa melihat menu ini.
        </p>

        {/* Section Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveSection('stats')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all ${
              activeSection === 'stats'
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            📊 Statistik
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all ${
              activeSection === 'settings'
                ? 'bg-white text-purple-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            ⚙️ Pengaturan
          </button>
        </div>
      </div>

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-600" />
                Pengaturan Aplikasi
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* App Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />
                  Nama Web
                </label>
                <input
                  type="text"
                  value={settings.app_name}
                  onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-semibold text-sm"
                  placeholder="Nama aplikasi..."
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                  <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                  Logo
                </label>
                {logoPreview && (
                  <div className="mb-2 p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <span className="text-xs font-bold text-slate-600">
                      {logoPreview ? 'Ganti Logo' : '+ Upload Logo'}
                    </span>
                  </div>
                </label>
                {logoPreview && (
                  <button
                    onClick={() => {
                      setSettings({ ...settings, app_logo: '' });
                      setLogoPreview('');
                    }}
                    className="mt-2 text-xs text-red-600 font-bold hover:text-red-700"
                  >
                    Hapus Logo
                  </button>
                )}
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                  <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                  Favicon
                </label>
                {faviconPreview && (
                  <div className="mb-2 p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <img 
                      src={faviconPreview} 
                      alt="Favicon Preview" 
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                  />
                  <div className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                    <span className="text-xs font-bold text-slate-600">
                      {faviconPreview ? 'Ganti Favicon' : '+ Upload Favicon'}
                    </span>
                  </div>
                </label>
                {faviconPreview && (
                  <button
                    onClick={() => {
                      setSettings({ ...settings, app_favicon: '' });
                      setFaviconPreview('');
                    }}
                    className="mt-2 text-xs text-red-600 font-bold hover:text-red-700"
                  >
                    Hapus Favicon
                  </button>
                )}
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-black rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {activeSection === 'stats' && (
        <>
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
        </>
      )}
    </div>
  );
};

export default AdminPanel;

