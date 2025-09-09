import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, FileText, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  postsCount?: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.categories.getActive();
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kategoriler
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              İlgilendiğiniz konularda yazıları keşfetmek için kategorilerimizi inceleyin
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-custom py-12">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : categories.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Tüm Kategoriler ({categories.length})
              </h2>
              <p className="text-secondary-600">
                Merak ettiğiniz konularda yazıları keşfedin
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-700 mb-2">
              Henüz kategori bulunmuyor
            </h3>
            <p className="text-secondary-500">
              Yakında çeşitli kategorilerde içerikler eklenecek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary-100 overflow-hidden"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <Link to={`/category/${category.slug}`} className="block">
        {/* Category Header */}
        <div 
          className="h-24 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${category.color}15, ${category.color}25)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
          <div className="relative h-full flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: category.color }}
            >
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Category Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
              {category.name}
            </h3>
            <ArrowRight className="w-5 h-5 text-secondary-400 group-hover:text-primary-600 transform group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {category.description && (
            <p className="text-secondary-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                {category.slug}
              </span>
            </div>

            {category.postsCount !== undefined && (
              <span className="text-sm text-secondary-500">
                {category.postsCount} yazı
              </span>
            )}
          </div>
        </div>

        {/* Hover Effect */}
        <div 
          className="h-1 w-0 group-hover:w-full transition-all duration-300"
          style={{ backgroundColor: category.color }}
        />
      </Link>
    </div>
  );
};

export default CategoriesPage;