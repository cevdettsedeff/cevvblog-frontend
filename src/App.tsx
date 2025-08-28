// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Layout Components
import Navbar from '@/components/layout/Navbar';

// Pages
import HomePage from '@/pages/HomePage';
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Test Route - Geliştirme aşamasında */}
              <Route path="/test" element={<TestPage />} />
              
              {/* Protected Routes - Daha sonra ekleyeceğiz */}
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
              
              {/* Author Routes - Daha sonra ekleyeceğiz */}
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
          
          {/* Footer - Daha sonra ekleyeceğiz */}
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

// Test sayfası - Geliştirme aşamasında bağlantıları test etmek için
const TestPage: React.FC = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Test Sayfası</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-2">API Test</h3>
            <p className="text-secondary-600">
              Backend bağlantısını test etmek için bu sayfayı kullanabilirsiniz.
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-2">Bileşen Test</h3>
            <div className="space-y-2">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-outline">Outline Button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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