// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, RegisterRequest } from '@/types';
import { api } from '@/services/api';

// Context oluştur
const AuthContext = createContext<AuthContextType | null>(null);

// Props interface
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component - tüm uygulamayı saracak
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde kullanıcı bilgilerini al
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const response = await api.auth.getProfile();
          setUser(response.data.data);
          setToken(storedToken);
          
          // Development'ta user bilgisini logla
          if (import.meta.env.DEV) {
            console.log('👤 User loaded:', response.data.data);
          }
        } catch (error) {
          // Token geçersizse temizle
          console.warn('Token geçersiz, temizleniyor...');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login fonksiyonu
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Demo login - Backend hazır olana kadar
      if (email === 'demo@cevvblog.com' && password === 'demo123') {
        const demoUser: User = {
          id: 'demo-user-1',
          email: 'demo@cevvblog.com',
          firstName: 'Demo',
          lastName: 'Kullanıcı',
          role: 'AUTHOR',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        };
        
        const demoToken = 'demo-jwt-token-12345';
        
        setUser(demoUser);
        setToken(demoToken);
        localStorage.setItem('token', demoToken);
        
        if (import.meta.env.DEV) {
          console.log('✅ Demo Login successful:', demoUser);
        }
        return;
      }
      
      // Gerçek API çağrısı (backend hazır olduğunda)
      const response = await api.auth.login(email, password);
      const { user: userData, token: userToken } = response.data.data;
      
      // State'i güncelle
      setUser(userData);
      setToken(userToken);
      
      // LocalStorage'a kaydet
      localStorage.setItem('token', userToken);
      
      // Development'ta başarılı login'i logla
      if (import.meta.env.DEV) {
        console.log('✅ Login successful:', userData);
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Giriş yapılamadı'
      );
    }
  };

  // Register fonksiyonu
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      const response = await api.auth.register(userData);
      const { user: newUser, token: userToken } = response.data.data;
      
      // State'i güncelle
      setUser(newUser);
      setToken(userToken);
      
      // LocalStorage'a kaydet
      localStorage.setItem('token', userToken);
      
      // Development'ta başarılı register'ı logla
      if (import.meta.env.DEV) {
        console.log('✅ Register successful:', newUser);
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Kayıt olunamadı'
      );
    }
  };

  // Logout fonksiyonu
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    
    // Development'ta logout'u logla
    if (import.meta.env.DEV) {
      console.log('👋 User logged out');
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  // Alternative: React.createElement syntax
  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};

// Custom hook - Context'i kullanmak için
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth hook AuthProvider içinde kullanılmalıdır');
  }
  
  return context;
};