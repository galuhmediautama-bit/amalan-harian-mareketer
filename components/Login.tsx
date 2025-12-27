import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';
import { ShieldCheck } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isSignUp) {
        console.log('Attempting sign up...');
        user = await signUp(email, password, name);
        console.log('Sign up result:', user);
      } else {
        console.log('Attempting sign in...');
        user = await signIn(email, password);
        console.log('Sign in result:', user);
      }
      
      if (user) {
        console.log('Auth successful, user will be updated via onAuthChange');
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
        console.warn('No user returned from auth');
        setError('Gagal autentikasi. Silakan coba lagi.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMessage = err.message || err.toString() || 'Terjadi kesalahan';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md border-4 border-teal-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-900 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Marketer Berkah</h1>
          <p className="text-sm text-slate-600 font-black uppercase tracking-wider">
            Internal Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none font-black text-slate-900"
                placeholder="Nama Lengkap"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none font-black text-slate-900"
              placeholder="email@internal.com"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:outline-none font-black text-slate-900"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-900 px-4 py-3 rounded-xl text-sm font-black">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-900 text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider hover:bg-teal-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading ? 'Loading...' : isSignUp ? 'Daftar' : 'Masuk'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setName('');
            }}
            className="w-full text-sm text-slate-600 font-black hover:text-teal-900 transition-colors"
          >
            {isSignUp ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

