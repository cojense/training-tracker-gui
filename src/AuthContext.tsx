import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  loginAuth: boolean;
  setLoginAuth: (value: boolean) => void;
  user: User | null;
  setUser: (value: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loginAuth, setLoginAuth] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem('loginAuth');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('loginAuth', JSON.stringify(loginAuth));
  }, [loginAuth]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ loginAuth, setLoginAuth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
