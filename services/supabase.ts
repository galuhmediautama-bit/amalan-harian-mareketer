import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojmicttywrqeflqjmqfm.supabase.co';

// Anon key from Supabase Dashboard > Project Settings > API
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDU1OTksImV4cCI6MjA4MjQyMTU5OX0.kLAlHqaPub0fixy3cAs8hNj5NAtT9BU44Hs_FUW8Rw4';

// Check if key is valid format
const isValidKey = supabaseAnonKey.startsWith('eyJ');

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey || !isValidKey) {
  console.warn('⚠️ Supabase configuration issue!');
  console.warn('URL:', supabaseUrl);
  console.warn('Key valid:', isValidKey);
}

// Create Supabase client with error handling
let supabase: ReturnType<typeof createClient>;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    global: {
      headers: {
        'x-client-info': 'marketer-berkah'
      }
    }
  });
  
  // Log successful connection
  console.log('✅ Supabase client initialized');
} catch (error) {
  console.error('❌ Error creating Supabase client:', error);
  throw error;
}

export { supabase };

