'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    Cookies.remove('token');
  };

  const checkTokenValidity = () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    // Perform a check to the server if the token is still valid
    fetch('/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          Cookies.remove('token', { path: '/' });
        }
      })
      .catch((error) => {
        console.error('Error validating token:', error);
        setIsLoggedIn(false);
        Cookies.remove('token', { path: '/' });
      });
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}