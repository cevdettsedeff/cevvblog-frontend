// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // Hangi roller erişebilir
  redirectTo?: string; // Yönlendirilecek sayfa
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading durumunda spinner göster
  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} // Giriş yaptıktan sonra buraya dönmek için
        replace 
      />
    );
  }

  // Eğer belirli roller gerekiyorsa kontrol et
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-error-50 border border-error-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-error-100 rounded-full">
              <svg 
                className="w-6 h-6 text-error-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-error-800 mb-2">
              Erişim Reddedildi
            </h3>
            <p className="text-error-600 mb-4">
              Bu sayfaya erişmek için yeterli yetkiniz bulunmuyor.
            </p>
            <p className="text-sm text-error-500">
              Gerekli rol: {requiredRoles.join(' veya ')}
            </p>
            <div className="mt-6">
              <button 
                onClick={() => window.history.back()}
                className="btn-secondary mr-3"
              >
                Geri Dön
              </button>
              <a href="/" className="btn-primary">
                Ana Sayfa
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Her şey yolundaysa component'i render et
  return <>{children}</>;
};

export default ProtectedRoute;