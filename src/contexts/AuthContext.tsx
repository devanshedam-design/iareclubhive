import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/storage';
import { seedUsers, seedClubs, seedMemberships, seedEvents, seedAnnouncements } from '@/lib/seed-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'student' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function initializeSeedData() {
  if (!getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, seedUsers);
  }
  if (!getItem(STORAGE_KEYS.CLUBS)) {
    setItem(STORAGE_KEYS.CLUBS, seedClubs);
  }
  if (!getItem(STORAGE_KEYS.MEMBERSHIPS)) {
    setItem(STORAGE_KEYS.MEMBERSHIPS, seedMemberships);
  }
  if (!getItem(STORAGE_KEYS.EVENTS)) {
    setItem(STORAGE_KEYS.EVENTS, seedEvents);
  }
  if (!getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, seedAnnouncements);
  }
  if (!getItem(STORAGE_KEYS.REGISTRATIONS)) {
    setItem(STORAGE_KEYS.REGISTRATIONS, []);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeSeedData();
    const storedUser = getItem<User>(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS) || [];
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      setItem(STORAGE_KEYS.CURRENT_USER, foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const switchRole = (role: 'student' | 'admin') => {
    const users = getItem<User[]>(STORAGE_KEYS.USERS) || [];
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setUser(targetUser);
      setItem(STORAGE_KEYS.CURRENT_USER, targetUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
