import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient, { api } from '@/services/api';
import { RegisterRequest, User } from '@/types';
import CryptoJS from 'crypto-js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  logoutLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Şifre hashleme fonksiyonu - korunuyor
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          const response = await api.auth.getProfile();
          
          if (response.data?.success && response.data?.data) {
            const userData = response.data.data;
            setUser(userData);
            setToken(storedToken);
            console.log('✅ Token doğrulandı:', userData);
          } else {
            throw new Error('Invalid user response');
          }
        } catch (error) {
          console.warn('⚠️ Token geçersiz, temizleniyor...', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete apiClient.defaults.headers.common['Authorization'];
          setToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const hashedPassword = hashPassword(password);
      const response = await api.auth.login(email, hashedPassword);

      const authData = response.data?.data || response.data;
      
      if (!authData || !authData.accessToken || !authData.user) {
        throw new Error('Invalid login response');
      }
      
      const { user: userData, accessToken, refreshToken: newRefreshToken } = authData;

      // Token'ları kaydet
      localStorage.setItem('token', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(userData);
      setToken(accessToken);

      console.log('✅ Login başarılı');

    } catch (error: any) {
      console.error('❌ Login hatası:', error);
      
      let errorMessage = 'Giriş yapılamadı';
      
      if (error.response?.status === 401) {
        errorMessage = 'E-posta veya şifre hatalı';
      } else if (error.response?.status === 403) {
        errorMessage = 'Hesabınız deaktive edilmiş';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      // Şifreyi hashle - korunuyor
      const hashedPassword = hashPassword(userData.password);
      console.log('🔒 Register: Şifre hashlendi, backend\'e gönderiliyor');
      
      const requestData = {
        ...userData,
        password: hashedPassword
      };
      
      const response = await api.auth.register(requestData);
      
      const authData = response.data?.data || response.data;
      
      if (!authData || !authData.accessToken || !authData.user) {
        throw new Error('Invalid register response');
      }
      
      const { user: newUser, accessToken, refreshToken: newRefreshToken } = authData;
      
      // Token'ları kaydet
      localStorage.setItem('token', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      setUser(newUser);
      setToken(accessToken);
      
      console.log('✅ Register başarılı');
      
    } catch (error: any) {
      let errorMessage = 'Kayıt olunamadı';
      
      if (error.response?.status === 409) {
        const conflictData = error.response?.data;
        if (conflictData?.message?.includes('Email')) {
          errorMessage = 'E-posta zaten kullanılıyor';
        } else if (conflictData?.message?.includes('Username')) {
          errorMessage = 'Kullanıcı adı zaten kullanılıyor';
        } else {
          errorMessage = conflictData?.message || 'Bu bilgiler zaten kullanılıyor';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('❌ Register hatası:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Access token yenileme fonksiyonu
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;

    try {
      const response = await api.auth.refreshToken(refreshToken);
      const newTokens = response.data?.data || response.data;
      
      if (!newTokens || !newTokens.accessToken) {
        throw new Error('Invalid refresh response');
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = newTokens;

      localStorage.setItem('token', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      setToken(newAccessToken);

      return newAccessToken;
    } catch (error) {
      console.warn('⚠️ Refresh token geçersiz:', error);
      await logout();
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLogoutLoading(true);

      // Backend'e logout isteği gönder
      try {
        const currentToken = localStorage.getItem('token');
        const currentRefreshToken = localStorage.getItem('refreshToken');
        
        if (currentToken) {
          await api.auth.logout(currentToken, currentRefreshToken);
        }
      } catch (error) {
        console.warn('⚠️ Backend logout hatası (göz ardı edildi):', error);
      }

      // UI feedback için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 500));

      // Local state'i temizle
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];
      
      setUser(null);
      setToken(null);
      setRefreshToken(null);

      console.log('✅ Logout başarılı');

    } catch (error) {
      console.error('❌ Logout hatası:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    logoutLoading,
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