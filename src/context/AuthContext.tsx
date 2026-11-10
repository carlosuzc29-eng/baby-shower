import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  loginWithPin: (pin: string) => boolean;
  logout: () => Promise<void>;
}

const ADMIN_PIN_KEY = 'baby_shower_admin_pin_auth';
export const DEFAULT_ADMIN_PIN = '2026';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdminAuthenticated: false,
  loading: false,
  login: async () => {},
  loginWithPin: () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_PIN_KEY) === 'true';
  });
  const [loading, setLoading] = useState(!isFirebaseConfigured ? false : true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithPin = (enteredPin: string) => {
    const savedCustomPin = localStorage.getItem('baby_shower_custom_pin') || DEFAULT_ADMIN_PIN;
    if (enteredPin.trim() === savedCustomPin.trim() || enteredPin.trim() === DEFAULT_ADMIN_PIN) {
      setIsPinAuthenticated(true);
      localStorage.setItem(ADMIN_PIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsPinAuthenticated(false);
    localStorage.removeItem(ADMIN_PIN_KEY);
    if (currentUser) {
      await signOut(auth);
    }
  };

  const isAdminAuthenticated = Boolean(currentUser || isPinAuthenticated);

  return (
    <AuthContext.Provider value={{ currentUser, isAdminAuthenticated, loading, login, loginWithPin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
