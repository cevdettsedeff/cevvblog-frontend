// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ChevronDown, User, Settings, LogOut, PlusCircle, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Aktif link kontrolü
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Link stil sınıfları
  const linkClasses = (path: string) => {
    const baseClasses = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200';
    return `${baseClasses} ${
      isActiveLink(path)
        ? 'bg-primary-100 text-primary-700' 
        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
    }`;
  };

  // Logout işlemi
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Kullanıcının yazar yetkisi var mı?
  const isAuthor = user?.role === 'AUTHOR' || user?.role === 'ADMIN';

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
              <div className="flex items-center space-x-3">
                
                {/* Author Controls */}
                {isAuthor && (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/create-post"
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Yeni Yazı</span>
                    </Link>
                    
                    <Link
                      to="/author-dashboard"
                      className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Yazar Paneli"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Link>
                  </div>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-secondary-700">
                      {user.firstName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-secondary-200">
                        <p className="text-sm font-medium text-secondary-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                        {user.role && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                              {user.role}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>

                      {isAuthor && (
                        <Link
                          to="/author-dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Yazar Paneli</span>
                        </Link>
                      )}
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Ayarlar</span>
                      </Link>
                      
                      <div className="border-t border-secondary-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Çıkış Yap</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <div className="space-y-2">
              <Link 
                to="/" 
                className={linkClasses('/')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              
              <Link 
                to="/posts" 
                className={linkClasses('/posts')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              <Link 
                to="/categories" 
                className={linkClasses('/categories')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kategoriler
              </Link>
              
              <Link 
                to="/about" 
                className={linkClasses('/about')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkında
              </Link>
              
              <Link 
                to="/contact" 
                className={linkClasses('/contact')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>
            </div>

            {/* Mobile User Menu */}
            {user ? (
              <div className="border-t border-secondary-200 mt-4 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.firstName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-secondary-500">{user.email}</p>
                  </div>
                </div>

                {/* Author Controls Mobile */}
                {isAuthor && (
                  <div className="space-y-2 mb-4">
                    <Link
                      to="/create-post"
                      className="flex items-center space-x-2 w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Yeni Yazı</span>
                    </Link>
                    
                    <Link
                      to="/author-dashboard"
                      className="flex items-center space-x-2 w-full px-4 py-3 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Yazar Paneli</span>
                    </Link>
                  </div>
                )}

                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-3 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-3 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Ayarlar</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-secondary-200 mt-4 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-center text-secondary-700 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-3 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Backdrop for closing dropdowns */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;