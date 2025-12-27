import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ojmicttywrqeflqjmqfm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration is missing!');
  console.error('Please create a .env.local file with your Supabase URL and Anon Key.');
  console.error('See SETUP_SUPABASE.md for setup instructions.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

