import React, {
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import { api } from './api';
import { Box, CircularProgress } from '@mui/material';
import { User } from '~/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const loadingStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.warn('Session verification failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void verifySession();
  }, [verifySession]);

  const logout = useCallback(() => {
    // For real logout, we'll redirect to backend /logout with next parameter
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
    const FRONTEND_URL = window.location.origin;
    window.location.href = `${BACKEND_URL}/oauth2/logout?next=${encodeURIComponent(`${FRONTEND_URL}/login`)}`;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      logout,
    }),
    [user, isLoading, logout]
  );

  if (isLoading) {
    return (
      <Box sx={loadingStyles}>
        <CircularProgress />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
