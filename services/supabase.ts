import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ojmicttywrqeflqjmqfm.supabase.co';
const supabaseAnonKey = 'sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

