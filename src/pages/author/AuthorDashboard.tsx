// src/pages/author/AuthorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  createdAt: string;
  updatedAt: string;
  views: number;
  category: string;
}

const AuthorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });

  // Demo veri yükleme
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Demo veriler - normalde API'den gelecek
        const demoStats = {
          totalPosts: 12,
          publishedPosts: 8,
          draftPosts: 4,
          totalViews: 15420
        };

        const demoPosts: Post[] = [
          {
            id: '1',
            title: 'React 18 ile Gelen Yenilikler',
            slug: 'react-18-yenilikler',
            status: 'published',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
            views: 2450,
            category: 'Frontend'
          },
          {
            id: '2',
            title: 'TypeScript Best Practices',
            slug: 'typescript-best-practices',
            status: 'published',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10',
            views: 1980,
            category: 'Programlama'
          },
          {
            id: '3',
            title: 'Modern CSS Teknikleri',
            slug: 'modern-css-teknikleri',
            status: 'draft',
            createdAt: '2024-01-08',
            updatedAt: '2024-01-12',
            views: 0,
            category: 'Frontend'
          }
        ];

        setStats(demoStats);
        setPosts(demoPosts);
        
      } catch (error) {
        console.error('Posts yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Yayınlandı';
      case 'draft':
        return 'Taslak';
      case 'scheduled':
        return 'Zamanlandı';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Yazar Paneli
            </h1>
            <p className="text-secondary-600">
              Hoş geldiniz, {user?.firstName}! Yazılarınızı buradan yönetebilirsiniz.
            </p>
          </div>
          
          <Link
            to="/create-post"
            className="mt-4 md:mt-0 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Yeni Yazı</span>
          </Link>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Toplam Yazı</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Yayınlanan</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Taslak</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.draftPosts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Toplam Görüntüleme</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Yazılar Tablosu */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">
                Yazılarım
              </h2>
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <span>Toplam {posts.length} yazı</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Görüntüleme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary-900">{post.title}</p>
                        <p className="text-sm text-secondary-500">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="p-2 text-secondary-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        {post.status === 'published' && (
                          <Link
                            to={`/post/${post.slug}`}
                            className="p-2 text-secondary-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button
                          className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <Edit className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Henüz yazınız yok
              </h3>
              <p className="text-secondary-600 mb-6">
                İlk yazınızı oluşturmak için aşağıdaki butona tıklayın.
              </p>
              <Link
                to="/create-post"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>İlk Yazımı Oluştur</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthorDashboard;