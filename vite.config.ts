import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          // Fix for React 19 production build issues
          jsxRuntime: 'automatic',
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // React vendor - keep React and ReactDOM together
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react-vendor';
              }
              // Supabase vendor
              if (id.includes('node_modules/@supabase')) {
                return 'supabase-vendor';
              }
              // Recharts vendor (large library)
              if (id.includes('node_modules/recharts')) {
                return 'recharts-vendor';
              }
              // Lucide icons
              if (id.includes('node_modules/lucide-react')) {
                return 'icons-vendor';
              }
              // Other node_modules
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
            // Fix for React 19 production build
            format: 'es',
            generatedCode: {
              constBindings: true
            }
          }
        },
        chunkSizeWarningLimit: 300,
        reportCompressedSize: false, // Faster builds
        // Ensure consistent build output
        commonjsOptions: {
          include: [/node_modules/]
        },
        // Target modern browsers for better compatibility
        target: 'esnext',
        // Fix for React 19
        modulePreload: {
          polyfill: false
        }
      }
    };
});
