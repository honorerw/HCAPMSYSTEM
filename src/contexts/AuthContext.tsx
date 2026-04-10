import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'hcapms_users';
const CURRENT_USER_KEY = 'hcapms_current_user';

interface StoredUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  photo?: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser({ ...userData, password: undefined });
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string, role: UserRole): boolean => {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      return false;
    }

    const newUser: StoredUser = {
      id: Date.now(),
      name,
      email,
      password,
      role
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'doctor':
      return '/doctor-dashboard';
    case 'patient':
      return '/patient-dashboard';
    default:
      return '/dashboard';
  }
};