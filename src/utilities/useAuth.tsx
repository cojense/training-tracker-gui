import React, { useState, useCallback, useMemo, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isTrainingManager: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(() => {
    setUser({
      id: '1',
      name: 'Mock User',
      email: 'mock@shyftsolutions.io',
      isAdmin: true,
      isTrainingManager: true,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
