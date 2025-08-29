// src/components/layout/Navbar.tsx - Favicon eklendi
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  // Aktif link kontrolü
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const linkClasses = (path: string) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActiveLink(path) 
      ? 'bg-primary-100 text-primary-700' 
      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
    }
  `;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Favicon ile */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/favicon.ico" 
                alt="CevvBlog Logo" 
                className="w-8 h-8"
                onError={(e) => {
                  // Favicon yüklenemezse fallback göster
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback logo - favicon yüklenmezse görünecek */}
              <div 
                className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">
                CevvBlog
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkClasses('/')}>
              Ana Sayfa
            </Link>
            
            <Link to="/posts" className={linkClasses('/posts')}>
              Blog
            </Link>
            
            <Link to="/categories" className={linkClasses('/categories')}>
              Kategoriler
            </Link>
            
            <Link to="/about" className={linkClasses('/about')}>
              Hakkında
            </Link>
            
            <Link to="/contact" className={linkClasses('/contact')}>
              İletişim
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                {/* User dropdown button */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-secondary-700">
                    {user.firstName}
                  </span>
                  <svg 
                    className="w-4 h-4 text-secondary-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profil
                    </Link>
                    
                    {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
                      <Link
                        to="/create-post"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Yazı Yaz
                      </Link>
                    )}
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-secondary-900 px-3 py-2 text-sm font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveLink('/') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              
              <Link
                to="/posts"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveLink('/posts') 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              {user ? (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-base font-medium text-secondary-900">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  
                  {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
                    <Link
                      to="/create-post"
                      className="block px-3 py-2 rounded-md text-base text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Yazı Yaz
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base text-error-600 hover:bg-error-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="border-t pt-4 mt-4 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;