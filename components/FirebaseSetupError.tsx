import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const FirebaseSetupError: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-2xl border-4 border-red-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Firebase Belum Dikonfigurasi</h1>
          <p className="text-sm text-slate-600 font-black">
            Environment variables Firebase belum di-set
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="font-black text-red-900 mb-4 uppercase tracking-tight">
              Langkah Setup Firebase:
            </h2>
            <ol className="space-y-3 text-sm text-slate-800 font-black">
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">1</span>
                <span>Buka <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a></span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">2</span>
                <span>Buat project baru atau pilih project yang sudah ada</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">3</span>
                <span>Enable <strong>Authentication</strong> → <strong>Email/Password</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">4</span>
                <span>Buat <strong>Firestore Database</strong> (test mode untuk development)</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">5</span>
                <span>Buka <strong>Project Settings</strong> → <strong>Your apps</strong> → Klik ikon Web</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-red-600 text-white rounded-lg w-6 h-6 flex items-center justify-center shrink-0 font-black text-xs">6</span>
                <span>Copy config yang muncul dan paste ke file <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code></span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
            <h3 className="font-black text-slate-900 mb-3 uppercase tracking-tight text-sm">
              Format .env.local:
            </h3>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123`}
            </pre>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
            <p className="text-sm font-black text-amber-900">
              ⚠️ <strong>Penting:</strong> Setelah mengisi .env.local, <strong>restart dev server</strong> dengan menekan <code className="bg-amber-100 px-2 py-1 rounded">Ctrl+C</code> lalu jalankan <code className="bg-amber-100 px-2 py-1 rounded">npm run dev</code> lagi.
            </p>
          </div>

          <div className="text-center">
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 transition-colors"
            >
              Buka Firebase Console
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupError;

