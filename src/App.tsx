import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Layout Components
import Navbar from '@/components/layout/Navbar';

// Pages
import HomePage from '@/pages/HomePage';
import PostDetailPage from '@/pages/posts/PostDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Author Pages
import AuthorDashboard from '@/pages/author/AuthorDashboard';
import CreatePostPage from '@/pages/author/CreatePostPage';

// Common Components
import ProtectedRoute from '@/components/common/ProtectedRoute';

// CSS import
import './index.css';

// 404 sayfası
const NotFoundPage: React.FC = () => {
  return (
    <div className="container-custom py-16 text-center">
      <h1 className="text-6xl font-bold text-secondary-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-secondary-800 mb-4">
        Sayfa Bulunamadı
      </h2>
      <p className="text-secondary-600 mb-8">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <a 
        href="/" 
        className="btn-primary"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-secondary-50">
          {/* Navigation Bar */}
          <Navbar />
          
          {/* Ana İçerik */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Post Routes */}
              <Route path="/post/:slug" element={<PostDetailPage />} />
              <Route path="/posts/:slug" element={<PostDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes - Basic User */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Author Routes - Require AUTHOR or ADMIN role */}
              <Route 
                path="/author-dashboard" 
                element={
                  <ProtectedRoute requiredRoles={['AUTHOR', 'ADMIN']}>
                    <AuthorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/create-post" 
                element={
                  <ProtectedRoute requiredRoles={['AUTHOR', 'ADMIN']}>
                    <CreatePostPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/edit-post/:id" 
                element={
                  <ProtectedRoute requiredRoles={['AUTHOR', 'ADMIN']}>
                    <CreatePostPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRoles={['ADMIN']}>
                    <div className="container-custom py-8">
                      <h1>Admin Paneli (Yakında)</h1>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-secondary-900 text-white py-12">
            <div className="container-custom">
              <div className="grid md:grid-cols-4 gap-8">
                
                {/* Logo & About */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="text-xl font-bold">CevvBlog</span>
                  </div>
                  <p className="text-secondary-300 mb-4 max-w-md">
                    Teknoloji, programlama ve kişisel gelişim konularında kaliteli içerikler üreten topluluk blog platformu.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
                  <ul className="space-y-2 text-secondary-300">
                    <li><a href="/about" className="hover:text-white transition-colors">Hakkımızda</a></li>
                    <li><a href="/contact" className="hover:text-white transition-colors">İletişim</a></li>
                    <li><a href="/privacy" className="hover:text-white transition-colors">Gizlilik</a></li>
                    <li><a href="/terms" className="hover:text-white transition-colors">Koşullar</a></li>
                  </ul>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4">Kategoriler</h3>
                  <ul className="space-y-2 text-secondary-300">
                    <li><a href="/category/frontend" className="hover:text-white transition-colors">Frontend</a></li>
                    <li><a href="/category/backend" className="hover:text-white transition-colors">Backend</a></li>
                    <li><a href="/category/mobile" className="hover:text-white transition-colors">Mobile</a></li>
                    <li><a href="/category/ai" className="hover:text-white transition-colors">AI & ML</a></li>
                  </ul>
                </div>
                
              </div>
              
              <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
                <p>&copy; 2024 CevvBlog. Tüm hakları saklıdır.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;