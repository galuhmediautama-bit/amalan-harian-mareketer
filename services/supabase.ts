import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojmicttywrqeflqjmqfm.supabase.co';

// IMPORTANT: This should be the "anon" key from Supabase Dashboard > Project Settings > API
// NOT the "Publishable API Key" - that's different!
// The anon key usually starts with "eyJ..."
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzOTU2MDAsImV4cCI6MjA1MDk3MTYwMH0.placeholder';

// Check if using placeholder key
const isPlaceholderKey = supabaseAnonKey.includes('placeholder');

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey || isPlaceholderKey) {
  console.warn('⚠️ Supabase anon key may not be configured correctly!');
  console.warn('Go to: Supabase Dashboard > Project Settings > API > Project API keys > anon (public)');
  console.warn('The anon key starts with "eyJ..."');
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

