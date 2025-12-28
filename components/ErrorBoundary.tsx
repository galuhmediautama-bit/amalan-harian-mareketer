import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-red-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-2">Terjadi Kesalahan</h1>
              <p className="text-sm text-slate-600 mb-4">
                Aplikasi mengalami error. Silakan refresh halaman atau hubungi support.
              </p>
              {this.state.error && (
                <details className="text-left bg-slate-50 p-4 rounded-lg mb-4 text-xs">
                  <summary className="cursor-pointer font-black text-slate-700 mb-2">
                    Detail Error (untuk debugging)
                  </summary>
                  <pre className="text-red-600 overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-black text-lg uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-xl"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

