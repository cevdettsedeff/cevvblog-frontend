import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Layout Components
import Navbar from '@/components/layout/Navbar';

// Pages
import HomePage from '@/pages/HomePage';
import PostDetailPage from '@/pages/posts/PostDetailPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Common Components
import ProtectedRoute from '@/components/common/ProtectedRoute';

// CSS import
import './index.css';

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
              
              {/* Post Routes */}
              <Route path="/post/:slug" element={<PostDetailPage />} />
              <Route path="/posts/:slug" element={<PostDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <div className="container-custom py-8">
                      <h1>Profil Sayfası (Yakında)</h1>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Author Routes */}
              <Route 
                path="/create-post" 
                element={
                  <ProtectedRoute requiredRoles={['AUTHOR', 'ADMIN']}>
                    <div className="container-custom py-8">
                      <h1>Yazı Oluştur (Yakında)</h1>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-secondary-900 text-white py-4">
            <div className="container-custom text-center">
              <p>&copy; 2024 CevvBlog. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

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

export default App;