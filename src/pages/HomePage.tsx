// src/pages/HomePage.tsx - Gerçek API kullanımı (hata yönetimi ile)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Post, Category } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Homepage veri yükleme başladı...');
        console.log('📍 API Base URL:', import.meta.env.VITE_API_BASE_URL);
        
        // Gerçek API çağrıları - Backend logları çalıştığını gösteriyor
        console.log('🔄 API çağrıları başlatılıyor...');
        
        // Posts API'leri çalışıyor
        const [recentResponse, popularResponse] = await Promise.all([
          api.posts.getRecent(),
          api.posts.getPopular()
        ]);
        
        console.log('✅ Posts responses:', { recent: recentResponse.data, popular: popularResponse.data });
        
        // Backend response yapınıza göre
        const recentData = recentResponse.data?.data || recentResponse.data?.items || recentResponse.data || [];
        const popularData = popularResponse.data?.data || popularResponse.data?.items || popularResponse.data || [];
        
        setRecentPosts(Array.isArray(recentData) ? recentData : []);
        setPopularPosts(Array.isArray(popularData) ? popularData : []);

        // Categories için aktif kategoriler endpoint'ini kullan (pagination gerektirmez)
        try {
          console.log('Categories verisi çekiliyor (aktif kategoriler)...');
          const categoriesResponse = await api.categories.getActive();
          console.log('Categories response:', categoriesResponse.data);
          
          const categoriesData = categoriesResponse.data?.data || categoriesResponse.data?.items || categoriesResponse.data || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          
        } catch (categoriesError: any) {
          console.error('Categories API hatası:', categoriesError);
          setCategories([]);
        }

        console.log('✅ Homepage veri yükleme tamamlandı');
        
      } catch (err: any) {
        console.error('❌ Homepage veri yükleme genel hatası:', err);
        
        // Hata türüne göre mesaj belirle
        let errorMessage = 'Veriler yüklenirken bir hata oluştu.';
        
        if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
          errorMessage = 'Backend sunucusuna bağlanılamıyor. Backend\'in çalıştığından emin olun (port 3001).';
        } else if (err.code === 'ERR_NETWORK') {
          errorMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
        } else if (err.response?.status === 404) {
          errorMessage = 'API endpoint\'i bulunamadı. Backend route\'larını kontrol edin.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Sunucu hatası oluştu. Backend log\'larını kontrol edin.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  // Loading durumu
  if (loading) {
    return <LoadingSpinner fullScreen text="Veriler yükleniyor..." />;
  }

  // Error durumu - daha detaylı
  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">
              Bir Hata Oluştu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            
            <div className="space-y-2 mb-6 text-sm text-left">
              <p><strong>Kontrol edilecekler:</strong></p>
              <ul className="list-disc list-inside text-red-700">
                <li>Backend sunucusu çalışıyor mu? (http://localhost:3001)</li>
                <li>API endpoint'leri doğru mu?</li>
                <li>CORS ayarları yapılmış mı?</li>
                <li>Database bağlantısı çalışıyor mu?</li>
              </ul>
            </div>
            
            <div className="space-x-2">
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Tekrar Dene
              </button>
              <a 
                href="/backend-test" 
                className="btn-secondary"
              >
                API Test Et
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Teknoloji ve Yazılım
              <span className="block text-primary-200">Dünyasına Hoş Geldiniz</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Modern web teknolojileri, yazılım geliştirme süreçleri ve 
              kişisel deneyimlerimi paylaştığım blog platformum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/posts" className="btn-lg bg-white text-primary-700 hover:bg-primary-50">
                Yazıları Keşfet
              </Link>
              <Link to="/about" className="btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-700">
                Hakkımda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-secondary-900">Son Yazılar</h2>
            <Link 
              to="/posts" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center group"
            >
              Tümünü Gör
              <svg 
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
              </svg>
            </Link>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Henüz yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Posts Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Popüler Yazılar</h2>
          
          {popularPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {popularPosts.slice(0, 4).map((post, index) => (
                <PopularPostCard key={post.id} post={post} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Popüler yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Kategoriler</h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Kategori bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Güncellemelerden Haberdar Olun</h2>
            <p className="text-secondary-300 mb-8">
              Yeni yazılarımdan ve güncellemelerden haberdar olmak için 
              e-posta listemize katılın.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="btn-primary px-6 py-3 whitespace-nowrap"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

// Post Card Component
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="card group cursor-pointer">
      <Link to={`/post/${post.slug || post.id}`}>
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden rounded-t-xl">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="card-body">
          <div className="flex items-center gap-2 mb-3">
            {post.category && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-md">
                {post.category.name}
              </span>
            )}
            <span className="text-secondary-500 text-sm">
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.author?.firstName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm text-secondary-600">
                {post.author?.firstName} {post.author?.lastName}
              </span>
            </div>
            {post.viewCount !== undefined && (
              <div className="flex items-center text-secondary-500 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

// Popular Post Card Component
interface PopularPostCardProps {
  post: Post;
  rank: number;
}

const PopularPostCard: React.FC<PopularPostCardProps> = ({ post, rank }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <article className="card">
      <Link to={`/post/${post.slug || post.id}`} className="block">
        <div className="card-body">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{rank}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {post.category && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-md">
                    {post.category.name}
                  </span>
                )}
                <span className="text-secondary-500 text-xs">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">
                  {post.author?.firstName} {post.author?.lastName}
                </span>
                {post.viewCount !== undefined && (
                  <div className="flex items-center text-secondary-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.viewCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

// Category Card Component
interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug || category.id}`}
      className="card group hover:border-primary-300 transition-colors"
    >
      <div className="card-body text-center">
        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default HomePage;