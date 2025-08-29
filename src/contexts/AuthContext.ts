// src/contexts/AuthContext.tsx - TypeScript hataları düzeltildi
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient, { api } from '@/services/api';
import { RegisterRequest, User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await api.auth.getProfile();
          
          if (response.data) {
            const userData = response.data?.data || response.data;
            setUser(userData);
            setToken(storedToken);
            console.log('Token doğrulandı:', userData);
          } else {
            throw new Error('Invalid user response');
          }
        } catch (error) {
          console.warn('Token geçersiz, temizleniyor...', error);
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.auth.login(email, password);
      
      const authData = response.data?.data || response.data;
      
      if (!authData || !authData.token || !authData.user) {
        throw new Error('Invalid login response');
      }
      
      const { user: userData, token: userToken } = authData;
      
      localStorage.setItem('token', userToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      setUser(userData);
      setToken(userToken);
      
    } catch (error: any) {
      let errorMessage = 'Giriş yapılamadı';
      
      if (error.response?.status === 401) {
        errorMessage = 'E-posta veya şifre hatalı';
      } else if (error.response?.status === 403) {
        errorMessage = 'Hesabınız deaktive edilmiş';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      const response = await api.auth.register(userData);
      
      const authData = response.data?.data || response.data;
      
      if (!authData || !authData.token || !authData.user) {
        throw new Error('Invalid register response');
      }
      
      const { user: newUser, token: userToken } = authData;
      
      localStorage.setItem('token', userToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      setUser(newUser);
      setToken(userToken);
      
    } catch (error: any) {
      let errorMessage = 'Kayıt olunamadı';
      
      if (error.response?.status === 409) {
        const conflictData = error.response?.data;
        if (conflictData?.details?.email) {
          errorMessage = 'E-posta zaten kullanılıyor';
        } else if (conflictData?.details?.username) {
          errorMessage = 'Kullanıcı adı zaten kullanılıyor';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};