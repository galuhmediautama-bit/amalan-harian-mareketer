import { supabase } from './supabase';
import { AppState, DailyProgress } from '../types';

const TABLE_NAME = 'user_progress';

/**
 * Test Supabase connection
 */
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: 'Tidak ada user yang login' };
    }

    // Try to read from table
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('user_id')
      .limit(1);

    if (error) {
      console.error('Connection test error:', error);
      return { 
        success: false, 
        message: `Database error: ${error.message}. Pastikan tabel user_progress sudah dibuat di Supabase.` 
      };
    }

    return { success: true, message: 'Koneksi berhasil!' };
  } catch (error: any) {
    return { success: false, message: `Error: ${error.message}` };
  }
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

    return {
      currentDate: data.current_date_value || new Date().toISOString().split('T')[0],
      progress: (data.progress as Record<string, DailyProgress>) || {}
    };
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

