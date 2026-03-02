import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  display_name?: string;
};

type AppContextType = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => void;
  setUser: (user: User | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('bakery_user');
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('bakery_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bakery_user');
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AppContext.Provider value={{ user, isAdmin, isLoading, signOut, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
