import { supabase } from './supabase';
import { AppState, DailyProgress } from '../types';

const TABLE_NAME = 'user_progress';

/**
 * Full diagnostic check for Supabase
 */
export const runDiagnostics = async (): Promise<{
  auth: { ok: boolean; message: string; userId?: string };
  table: { ok: boolean; message: string };
  data: { ok: boolean; message: string; rowCount?: number };
  save: { ok: boolean; message: string };
}> => {
  const results = {
    auth: { ok: false, message: '' },
    table: { ok: false, message: '' },
    data: { ok: false, message: '' },
    save: { ok: false, message: '' }
  };

  // 1. Check Auth
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      results.auth = { ok: false, message: `Auth error: ${error.message}` };
      return results;
    }
    if (!user) {
      results.auth = { ok: false, message: 'Tidak ada user yang login' };
      return results;
    }
    results.auth = { ok: true, message: `User: ${user.email}`, userId: user.id };
    console.log('✅ [1/4] Auth OK:', user.email);
  } catch (e: any) {
    results.auth = { ok: false, message: e.message };
    return results;
  }

  // 2. Check if table exists
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .select('user_id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        results.table = { ok: false, message: '❌ Tabel user_progress TIDAK ADA! Jalankan SQL schema di Supabase.' };
      } else if (error.code === '42501' || error.message.includes('permission')) {
        results.table = { ok: false, message: '❌ Permission denied. Cek RLS policies di Supabase.' };
      } else {
        results.table = { ok: false, message: `Table error: ${error.message} (${error.code})` };
      }
      console.error('❌ [2/4] Table check failed:', error);
      return results;
    }
    results.table = { ok: true, message: 'Tabel user_progress ada' };
    console.log('✅ [2/4] Table exists');
  } catch (e: any) {
    results.table = { ok: false, message: e.message };
    return results;
  }

  // 3. Check if user has data
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', results.auth.userId!)
      .maybeSingle();

    if (error) {
      results.data = { ok: false, message: `Fetch error: ${error.message}` };
      console.error('❌ [3/4] Data fetch failed:', error);
    } else if (data) {
      const progressKeys = Object.keys(data.progress || {});
      results.data = { 
        ok: true, 
        message: `Data ditemukan: ${progressKeys.length} hari tersimpan`,
        rowCount: progressKeys.length
      };
      console.log('✅ [3/4] User data found:', progressKeys.length, 'days');
    } else {
      results.data = { ok: true, message: 'User baru - belum ada data tersimpan', rowCount: 0 };
      console.log('⚠️ [3/4] No data yet for this user (new user)');
    }
  } catch (e: any) {
    results.data = { ok: false, message: e.message };
  }

  // 4. Test save functionality
  try {
    const testData = {
      user_id: results.auth.userId!,
      current_date_value: new Date().toISOString().split('T')[0],
      progress: { test: true },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert(testData, { onConflict: 'user_id' });

    if (error) {
      results.save = { ok: false, message: `Save error: ${error.message} (${error.code})` };
      console.error('❌ [4/4] Save test failed:', error);
    } else {
      results.save = { ok: true, message: 'Bisa menyimpan data' };
      console.log('✅ [4/4] Save test passed');
    }
  } catch (e: any) {
    results.save = { ok: false, message: e.message };
  }

  return results;
};

/**
 * Test Supabase connection (simple version)
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  const diagnostics = await runDiagnostics();
  
  if (!diagnostics.auth.ok) {
    return { success: false, message: diagnostics.auth.message };
  }
  if (!diagnostics.table.ok) {
    return { success: false, message: diagnostics.table.message };
  }
  if (!diagnostics.save.ok) {
    return { success: false, message: diagnostics.save.message };
  }
  
  return { success: true, message: 'Semua OK! Data tersimpan di server.' };
};

/**
 * Get user data from Supabase
 */
export const getUserData = async (): Promise<AppState | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found');
      return null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('current_date_value, progress')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      // PGRST116 = not found (no rows returned) - this is OK for new users
      if (error.code === 'PGRST116') {
        console.log('No user data found, returning default state');
        return null;
      }
      console.error('Error getting user data:', error);
      return null;
    }

    if (!data) {
      console.log('No data returned');
      return null;
    }

    // Debug: Log raw data from Supabase
    console.log('📦 Raw data from Supabase:', JSON.stringify(data, null, 2));
    console.log('📅 Dates in progress:', Object.keys(data.progress || {}));

    const result = {
      currentDate: data.current_date_value || new Date().toISOString().split('T')[0],
      progress: (data.progress as Record<string, DailyProgress>) || {}
    };
    
    console.log('📊 Parsed result:', result);
    return result;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Save user data to Supabase
 */
export const saveUserData = async (state: AppState): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('⚠️ Cannot save: User not authenticated');
      return false;
    }

    console.log('💾 Saving to Supabase...', { 
      userId: user.id.substring(0, 8) + '...',
      dates: Object.keys(state.progress).length,
      habits: Object.values(state.progress).reduce((acc, p) => acc + (p.completedHabitIds?.length || 0), 0)
    });

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert({
        user_id: user.id,
        current_date_value: state.currentDate,
        progress: state.progress,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('❌ Error saving user data:', error);
      throw error;
    }

    console.log('✅ Saved to Supabase successfully!', data);
    return true;
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    throw error;
  }
};

/**
 * Update daily progress
 */
export const updateDailyProgress = async (date: string, progress: DailyProgress): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const currentData = await getUserData();
    const newProgress = {
      ...(currentData?.progress || {}),
      [date]: progress
    };

    await saveUserData({
      currentDate: date,
      progress: newProgress
    });
  } catch (error) {
    console.error('Error updating daily progress:', error);
    throw error;
  }
};

/**
 * Listen to real-time updates
 */
export const subscribeToUserData = (
  callback: (state: AppState | null) => void
): (() => void) => {
  let subscription: any = null;

  supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) {
      callback(null);
      return;
    }

    subscription = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLE_NAME,
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          const data = await getUserData();
          callback(data);
        }
      )
      .subscribe();

    // Initial load
    getUserData().then(callback);
  });

  return () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  };
};

/**
 * Migrate data from localStorage (one-time)
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const localData = localStorage.getItem('marketer_berkah_state');
    if (!localData) return;

    const parsed = JSON.parse(localData);
    await saveUserData(parsed);

    // Optional: Clear localStorage after migration
    // localStorage.removeItem('marketer_berkah_state');
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
};

