import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize with a mock user for now to demonstrate UI
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Mock User',
    email: 'mock@shyftsolutions.io',
    isAdmin: true,
    isTrainingManager: true,
  });

  const login = () => {
    setUser({
      id: '1',
      name: 'Mock User',
      email: 'mock@shyftsolutions.io',
      isAdmin: true,
      isTrainingManager: true,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
