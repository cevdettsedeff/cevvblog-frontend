// src/components/auth/LogoutConfirmation.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const { logout, logoutLoading } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      
      // Başarı mesajını göster
      setShowSuccess(true);
      
      // 1.5 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        navigate('/login');
        onConfirm?.();
      }, 1500);
      
    } catch (error) {
      console.error('Logout hatası:', error);
      // Hata durumunda da çıkış yap
      onClose();
      navigate('/login');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
          
          {showSuccess ? (
            /* Başarı Mesajı */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg 
                  className="h-8 w-8 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-secondary-900">
                Çıkış Başarılı!
              </h3>
              <p className="text-sm text-secondary-600">
                Güvenli bir şekilde çıkış yaptınız.
              </p>
            </div>
          ) : (
            /* Onay Dialog'u */
            <>
              <div className="mb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <svg 
                    className="h-8 w-8 text-orange-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                
                <h3 className="text-center text-lg font-semibold text-secondary-900">
                  Çıkış Yapmak İstiyor Musunuz?
                </h3>
                <p className="mt-2 text-center text-sm text-secondary-600">
                  Oturumunuz sonlandırılacak ve giriş sayfasına yönlendirileceksiniz.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={logoutLoading}
                  className="flex-1 rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  İptal
                </button>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="flex-1 rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {logoutLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Çıkış Yapılıyor...
                    </>
                  ) : (
                    'Çıkış Yap'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;