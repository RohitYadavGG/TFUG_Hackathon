'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  login: (email: string, pass: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Check for auth status on initial load
    try {
        const storedAuth = sessionStorage.getItem('isAuthenticated');
        setIsAuthenticated(storedAuth === 'true');
    } catch (error) {
        setIsAuthenticated(false);
    }
  }, []);

  const login = (email: string, pass: string) => {
    // This is a mock login. In a real app, you'd call an API.
    if (email === 'abc.xyz@mail.com' && pass === 'admin') {
      try {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Could not set session storage", error)
        setIsAuthenticated(true);
      }
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const logout = () => {
    try {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    } catch (error) {
        console.error("Could not clear session storage", error);
        setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
