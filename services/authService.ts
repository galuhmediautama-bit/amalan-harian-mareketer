// Simple auth service using localStorage (no Firebase)

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

const STORAGE_KEY = 'marketer_berkah_user';
const USERS_KEY = 'marketer_berkah_users';

/**
 * Get stored users
 */
const getUsers = (): Record<string, { email: string; password: string; name?: string }> => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/**
 * Save users
 */
const saveUsers = (users: Record<string, { email: string; password: string; name?: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  const users = getUsers();
  const userKey = email.toLowerCase();
  
  if (!users[userKey] || users[userKey].password !== password) {
    throw new Error('Email atau password salah');
  }
  
  const user: User = {
    uid: userKey,
    email: users[userKey].email,
    displayName: users[userKey].name
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, name?: string): Promise<User> => {
  const users = getUsers();
  const userKey = email.toLowerCase();
  
  if (users[userKey]) {
    throw new Error('Email sudah terdaftar');
  }
  
  if (password.length < 6) {
    throw new Error('Password minimal 6 karakter');
  }
  
  users[userKey] = { email, password, name };
  saveUsers(users);
  
  const user: User = {
    uid: userKey,
    email,
    displayName: name
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  // Check immediately
  callback(getCurrentUser());
  
  // Listen to storage changes (for multi-tab support)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getCurrentUser());
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Also check periodically (for same-tab changes)
  const intervalId = setInterval(() => {
    callback(getCurrentUser());
  }, 1000);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(intervalId);
  };
};
