import { AppState, DailyProgress } from '../types';

const STORAGE_KEY = 'marketer_berkah_state';

/**
 * Get user data from localStorage
 */
export const getUserData = async (): Promise<AppState | null> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return {
      currentDate: parsed.currentDate || new Date().toISOString().split('T')[0],
      progress: parsed.progress || {}
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 */
export const saveUserData = async (state: AppState): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Update daily progress
 */
export const updateDailyProgress = async (date: string, progress: DailyProgress): Promise<void> => {
  try {
    const currentData = await getUserData();
    const newState: AppState = {
      currentDate: date,
      progress: {
        ...(currentData?.progress || {}),
        [date]: progress
      }
    };
    await saveUserData(newState);
  } catch (error) {
    console.error('Error updating daily progress:', error);
    throw error;
  }
};

/**
 * Listen to data changes (simulated with polling for localStorage)
 */
export const subscribeToUserData = (
  callback: (state: AppState | null) => void
): (() => void) => {
  let lastData: string | null = null;
  
  const checkChanges = () => {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData !== lastData) {
      lastData = currentData;
      if (currentData) {
        try {
          const parsed = JSON.parse(currentData);
          callback({
            currentDate: parsed.currentDate || new Date().toISOString().split('T')[0],
            progress: parsed.progress || {}
          });
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
  };
  
  // Check every second
  const intervalId = setInterval(checkChanges, 1000);
  
  // Initial check
  checkChanges();
  
  return () => clearInterval(intervalId);
};

/**
 * Migrate data (no-op for localStorage)
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
  // No migration needed for localStorage
  return Promise.resolve();
};

