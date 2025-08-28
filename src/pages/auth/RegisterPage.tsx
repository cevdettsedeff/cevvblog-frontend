// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Form input değişikliklerini handle et
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // İlgili error'ı temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // İsim validasyonu
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Ad en az 2 karakter olmalıdır';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Şifre validasyonu
    if (!formData.password) {
      newErrors.password = 'Şifre alanı zorunludur';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir';
    }

    // Şifre tekrar validasyonu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrar alanı zorunludur';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      
      // Başarılı kayıt - ana sayfaya yönlendir
      navigate('/', { replace: true });
      
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-secondary-900">CevvBlog</span>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-secondary-900">
          Yeni hesap oluşturun
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Zaten hesabınız var mı?{' '}
          <Link 
            to="/login" 
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <div className="card-body">
            {/* Submit Error Message */}
            {errors.submit && (
              <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-5 w-5 text-error-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-error-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    Ad
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="form-error">{errors.firstName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Soyad
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="form-error">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="form-error">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
                <p className="text-xs text-secondary-500 mt-1">
                  En az 6 karakter, büyük harf, küçük harf ve rakam içermelidir
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Şifre Tekrar
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-secondary-600">
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                      Kullanım şartlarını
                    </Link>
                    {' '}ve{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                      gizlilik politikasını
                    </Link>
                    {' '}okudum ve kabul ediyorum.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex justify-center items-center"
                >
                  {loading ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    'Hesap Oluştur'
                  )}
                </button>
              </div>
            </form>

            {/* Social Register */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">Veya</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 rounded-lg bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path 
                      fill="currentColor" 
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path 
                      fill="currentColor" 
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path 
                      fill="currentColor" 
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path 
                      fill="currentColor" 
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 rounded-lg bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="ml-2">GitHub</span>
                </button>
              </div>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="text-sm font-medium text-primary-800 mb-2">Demo Bilgilendirme</h4>
              <p className="text-xs text-primary-600">
                Backend henüz hazır olmadığı için kayıt işlemi şimdilik çalışmayacak. 
                Test etmek için Login sayfasındaki demo hesabı kullanabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;