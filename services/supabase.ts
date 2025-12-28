import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojmicttywrqeflqjmqfm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = '❌ Supabase configuration is missing!';
  console.error(errorMsg);
  console.error('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  console.error('Using fallback values:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey.substring(0, 20) + '...' });
  
  // In production, show user-friendly error
  if (import.meta.env.PROD) {
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
  }
}

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
} catch (error) {
  console.error('Error creating Supabase client:', error);
  throw error;
}

export { supabase };

