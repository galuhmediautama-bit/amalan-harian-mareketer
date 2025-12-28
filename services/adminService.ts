import { supabase } from './supabase';

// Admin email - only this user can access admin panel
export const ADMIN_EMAIL = 'galuhmediautama@gmail.com';

export const isAdmin = (userEmail: string | undefined): boolean => {
  return userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export interface UserStats {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_sign_in_at?: string;
  total_habits_completed: number;
  total_days_active: number;
  current_streak: number;
  last_active_date?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  totalHabitsCompleted: number;
  averageCompletionRate: number;
}

/**
 * Get all users with their progress stats (admin only)
 */
export const getAllUsersStats = async (): Promise<UserStats[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdmin(user.email)) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Get all user progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('user_id, progress, updated_at, created_at');

    if (progressError) {
      console.error('Error fetching progress data:', progressError);
      return [];
    }

    // Process the data
    const usersStats: UserStats[] = (progressData || []).map((row: any) => {
      const progress = row.progress || {};
      const dates = Object.keys(progress);
      
      // Calculate total habits completed
      let totalHabits = 0;
      dates.forEach(date => {
        const dayProgress = progress[date];
        if (dayProgress?.completedHabitIds) {
          totalHabits += dayProgress.completedHabitIds.length;
        }
      });

      // Calculate streak
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (progress[dateStr]?.completedHabitIds?.length > 0) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      return {
        id: row.user_id,
        email: row.user_id.substring(0, 8) + '...', // Will be replaced with actual email if available
        created_at: row.created_at,
        total_habits_completed: totalHabits,
        total_days_active: dates.filter(d => progress[d]?.completedHabitIds?.length > 0).length,
        current_streak: streak,
        last_active_date: dates.sort().reverse()[0] || undefined
      };
    });

    return usersStats;
  } catch (error) {
    console.error('Error getting users stats:', error);
    return [];
  }
};

/**
 * Get admin dashboard stats
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdmin(user.email)) {
      throw new Error('Unauthorized: Admin access required');
    }

    const { data: progressData, error } = await supabase
      .from('user_progress')
      .select('user_id, progress, updated_at');

    if (error) {
      console.error('Error fetching admin stats:', error);
      return {
        totalUsers: 0,
        activeUsersToday: 0,
        activeUsersWeek: 0,
        totalHabitsCompleted: 0,
        averageCompletionRate: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    let totalHabits = 0;
    let activeToday = 0;
    let activeWeek = 0;
    let totalCompletionRates: number[] = [];

    (progressData || []).forEach((row: any) => {
      const progress = row.progress || {};
      const dates = Object.keys(progress);

      // Check if active today
      if (progress[today]?.completedHabitIds?.length > 0) {
        activeToday++;
      }

      // Check if active this week
      const hasActivityThisWeek = dates.some(date => {
        return date >= weekAgoStr && progress[date]?.completedHabitIds?.length > 0;
      });
      if (hasActivityThisWeek) {
        activeWeek++;
      }

      // Count total habits
      dates.forEach(date => {
        const dayProgress = progress[date];
        if (dayProgress?.completedHabitIds) {
          totalHabits += dayProgress.completedHabitIds.length;
        }
      });

      // Calculate average completion rate (last 7 days)
      let completedDays = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (progress[dateStr]?.completedHabitIds?.length > 0) {
          completedDays++;
        }
      }
      totalCompletionRates.push((completedDays / 7) * 100);
    });

    const avgCompletionRate = totalCompletionRates.length > 0 
      ? totalCompletionRates.reduce((a, b) => a + b, 0) / totalCompletionRates.length 
      : 0;

    return {
      totalUsers: progressData?.length || 0,
      activeUsersToday: activeToday,
      activeUsersWeek: activeWeek,
      totalHabitsCompleted: totalHabits,
      averageCompletionRate: Math.round(avgCompletionRate)
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return {
      totalUsers: 0,
      activeUsersToday: 0,
      activeUsersWeek: 0,
      totalHabitsCompleted: 0,
      averageCompletionRate: 0
    };
  }
};

