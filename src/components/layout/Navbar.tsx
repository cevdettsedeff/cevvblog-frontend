import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  PlusCircle,
  BarChart3,
  Search,
  FolderOpen,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesMenuOpen, setIsCategoriesMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Scroll efekti için
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kategorileri yükle
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.categories.getActive();
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Aktif link kontrolü
  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Link stil sınıfları
  const linkClasses = (path: string) => {
    const baseClasses =
      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105";
    return `${baseClasses} ${
      isActiveLink(path)
        ? "bg-primary-100 text-primary-700"
        : "text-secondary-700 hover:text-primary-600 hover:bg-primary-50"
    }`;
  };

  // Search submit
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  // Enter key handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Logout işlemleri
  const handleLogoutClick = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthor = user?.role?.toLowerCase() === 'author' || user?.role?.toLowerCase() === 'admin';

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-secondary-100"
          : "bg-white shadow-sm border-b border-secondary-100"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/favicon.ico"
                alt="CevvBlog Logo"
                className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={linkClasses("/")}>
              Ana Sayfa
            </Link>
            <Link to="/blog" className={linkClasses("/blog")}>
              Blog
            </Link>
            
            {/* Kategoriler Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoriesMenuOpen(true)}
              onMouseLeave={() => setIsCategoriesMenuOpen(false)}
            >
              <button className={`${linkClasses("/categories")} flex items-center space-x-1`}>
                <span>Kategoriler</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoriesMenuOpen ? "rotate-180" : ""
                  }`} 
                />
              </button>

              {/* Categories Dropdown Menu */}
              {isCategoriesMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-secondary-100 py-3 z-50">
                  <div className="px-4 py-2 border-b border-secondary-100">
                    <h3 className="text-sm font-semibold text-secondary-800">Kategoriler</h3>
                  </div>
                  
                  {categoriesLoading ? (
                    <div className="px-4 py-6 text-center">
                      <div className="inline-block w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-secondary-500 mt-2">Yükleniyor...</p>
                    </div>
                  ) : categories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 px-2 py-2 max-h-80 overflow-y-auto">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="flex items-center space-x-3 px-3 py-2.5 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors group"
                          onClick={() => setIsCategoriesMenuOpen(false)}
                        >
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate group-hover:text-primary-700">
                              {category.name}
                            </p>
                            {category.description && (
                              <p className="text-xs text-secondary-500 truncate mt-0.5">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <FolderOpen className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-sm text-secondary-500">Henüz kategori yok</p>
                    </div>
                  )}
                  
                  <div className="border-t border-secondary-100 px-4 py-2 mt-2">
                    <Link
                      to="/categories"
                      className="block text-sm text-primary-600 hover:text-primary-700 font-medium"
                      onClick={() => setIsCategoriesMenuOpen(false)}
                    >
                      Tüm kategorileri görüntüle →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className={linkClasses("/about")}>
              Hakkında
            </Link>
            <Link to="/contact" className={linkClasses("/contact")}>
              İletişim
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
            <div className="w-full relative group">
              <div
                className={`relative flex items-center transition-all duration-300 ${
                  isSearchFocused ? "transform scale-105" : ""
                }`}
              >
                <Search
                  className={`absolute left-3 w-4 h-4 transition-colors duration-200 ${
                    isSearchFocused ? "text-primary-500" : "text-secondary-400"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ara..."
                  className={`w-full pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white focus:shadow-lg ${
                    isSearchFocused ? "shadow-lg" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Author Controls */}
                {isAuthor && (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/create-post"
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Yeni Yazı</span>
                    </Link>
                    <Link
                      to="/author-dashboard"
                      className="p-2.5 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 hover:scale-110"
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
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-medium">
                        {user.firstName?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-secondary-700">
                      {user.firstName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-secondary-400 transition-transform duration-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-secondary-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {user.email}
                        </p>
                        {user.role && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                              {user.role}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Ayarlar</span>
                      </Link>

                      {/* Admin Panel Link */}
                      {user.role?.toLowerCase() === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <div className="border-t border-secondary-100 my-1" />

                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-secondary-700 hover:text-secondary-900 font-medium rounded-lg hover:bg-secondary-50 transition-all duration-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={handleSearchSubmit}
              className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
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
          <div className="md:hidden border-t border-secondary-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-3 border-b border-secondary-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              
              {/* Mobile Categories Section */}
              <div className="py-2">
                <p className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wide">
                  Kategoriler
                </p>
                <div className="mt-2 space-y-1">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="flex items-center space-x-3 px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                  {categories.length > 6 && (
                    <Link
                      to="/categories"
                      className="block px-3 py-2 text-sm text-primary-600 hover:text-primary-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Tüm kategoriler →
                    </Link>
                  )}
                </div>
              </div>

              <Link
                to="/about"
                className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkında
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="border-t border-secondary-100 px-4 py-4">
                {isAuthor && (
                  <div className="mb-4 space-y-2">
                    <Link
                      to="/create-post"
                      className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-lg font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Yeni Yazı</span>
                    </Link>
                  </div>
                )}

                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Ayarlar</span>
                  </Link>

                  {/* Admin Panel Link for Mobile */}
                  {user.role?.toLowerCase() === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-secondary-100 px-4 py-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-center text-secondary-700 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-colors"
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
            setIsCategoriesMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;