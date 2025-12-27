// Supabase Auth Service

import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, name?: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          display_name: name || ''
        },
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    
    // If user needs email confirmation, they might be null
    if (!data.user) {
      throw new Error('Sign up successful but user confirmation may be required. Please check your email.');
    }
    
    // Update user metadata if name provided
    if (name && data.user) {
      try {
        await supabase.auth.updateUser({
          data: { 
            name,
            display_name: name
          }
        });
      } catch (updateError) {
        console.warn('Could not update user metadata:', updateError);
        // Don't throw, this is not critical
      }
    }
    
    return data.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  // Initial check
  supabase.auth.getUser().then(({ data: { user } }) => {
    callback(user);
  });

  return () => {
    subscription.unsubscribe();
  };
};
