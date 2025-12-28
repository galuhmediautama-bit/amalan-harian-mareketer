import React, { useState, useEffect } from 'react';
import { signIn, signUp } from '../services/authService';
import { getAppSettings } from '../services/settingsService';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [appSettings, setAppSettings] = useState<{
    app_name: string;
    app_logo: string;
    app_favicon: string;
  } | null>(null);

  // Load app settings for branding
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getAppSettings();
        setAppSettings(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults
        setAppSettings({
          app_name: 'Amalan Marketer Berkah',
          app_logo: '',
          app_favicon: ''
        });
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        if (!name.trim()) {
          setError('Nama harus diisi');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password minimal 6 karakter');
          setLoading(false);
          return;
        }
        user = await signUp(email, password, name);
      } else {
        user = await signIn(email, password);
      }
      
      if (user) {
        // Reset form
        setEmail('');
        setPassword('');
        setName('');
        setError('');
        // Reset loading after a short delay to allow auth state to propagate
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        setError('Gagal autentikasi. Silakan coba lagi.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = 'Terjadi kesalahan';
      
      // Better error messages
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah';
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'Email sudah terdaftar. Silakan masuk.';
        } else if (err.message.includes('Password')) {
          errorMessage = 'Password terlalu lemah. Minimal 6 karakter.';
        } else if (err.message.includes('Email')) {
          errorMessage = 'Format email tidak valid';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const appName = appSettings?.app_name || 'Amalan Marketer Berkah';
  const appLogo = appSettings?.app_logo || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 px-4 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md border border-teal-200/50 relative z-10 backdrop-blur-sm">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          {appLogo ? (
            <div className="mb-6 flex justify-center">
              <img 
                src={appLogo} 
                alt={appName}
                className="w-20 h-20 object-contain rounded-2xl shadow-lg"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-900 to-teal-700 rounded-2xl mb-6 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          )}
          
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 bg-gradient-to-r from-teal-900 to-teal-700 bg-clip-text text-transparent">
            {appName}
          </h1>
          <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">
            {isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun Anda'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                autoComplete="name"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Masukkan nama lengkap"
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 pl-12 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="nama@email.com"
                disabled={loading}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Minimal 6 karakter"
                disabled={loading}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-slate-500 mt-1">Password minimal 6 karakter</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-900 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-900 to-teal-700 text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider hover:from-teal-800 hover:to-teal-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses...
              </>
            ) : isSignUp ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Daftar Sekarang
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Masuk
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setName('');
              setPassword('');
            }}
            className="w-full text-sm text-slate-600 font-bold hover:text-teal-900 transition-colors py-2"
            disabled={loading}
          >
            {isSignUp ? (
              <span>Sudah punya akun? <span className="text-teal-700 underline">Masuk di sini</span></span>
            ) : (
              <span>Belum punya akun? <span className="text-teal-700 underline">Daftar sekarang</span></span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

