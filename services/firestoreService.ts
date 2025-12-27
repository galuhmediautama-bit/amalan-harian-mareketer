import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import { AppState, DailyProgress } from '../types';

const COLLECTION_NAME = 'marketer_berkah';

/**
 * Get current user ID or fallback to 'user_data' for internal use
 */
const getDocumentId = (): string => {
  return auth.currentUser?.uid || 'user_data';
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (): Promise<AppState | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, getDocumentId());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Convert Firestore Timestamps to strings
      return {
        currentDate: data.currentDate || new Date().toISOString().split('T')[0],
        progress: convertProgressDates(data.progress || {})
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Save user data to Firestore
 */
export const saveUserData = async (state: AppState): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, getDocumentId());
    await setDoc(docRef, {
      ...state,
      updatedAt: Timestamp.now()
    }, { merge: true });
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
    const docRef = doc(db, COLLECTION_NAME, getDocumentId());
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentData = docSnap.data();
      await updateDoc(docRef, {
        [`progress.${date}`]: progress,
        currentDate: date,
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        currentDate: date,
        progress: {
          [date]: progress
        },
        updatedAt: Timestamp.now()
      });
    }
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
  const docRef = doc(db, COLLECTION_NAME, getDocumentId());
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        currentDate: data.currentDate || new Date().toISOString().split('T')[0],
        progress: convertProgressDates(data.progress || {})
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in real-time subscription:', error);
    callback(null);
  });
};

/**
 * Convert Firestore Timestamps to date strings
 */
const convertProgressDates = (progress: Record<string, any>): Record<string, DailyProgress> => {
  const converted: Record<string, DailyProgress> = {};
  
  Object.entries(progress).forEach(([date, data]) => {
    converted[date] = {
      date: data.date || date,
      completedHabitIds: data.completedHabitIds || [],
      muhasabah: {
        jujur: data.muhasabah?.jujur ?? true,
        followUp: data.muhasabah?.followUp ?? true,
        hakOrang: data.muhasabah?.hakOrang ?? true,
        dosaDigital: data.muhasabah?.dosaDigital ?? false
      }
    };
  });
  
  return converted;
};

/**
 * Migrate data from localStorage to Firestore (one-time migration)
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

