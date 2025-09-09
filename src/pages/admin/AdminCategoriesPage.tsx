import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, FolderOpen } from 'lucide-react';
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
  createdAt: string;
  updatedAt: string;
  postsCount?: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'folder',
    isActive: true
  });

  // Icon seçenekleri
  const iconOptions = [
    'folder', 'code', 'laptop', 'smartphone', 'server', 'bar-chart',
    'palette', 'briefcase', 'github', 'settings', 'globe', 'database',
    'cpu', 'monitor', 'wifi', 'cloud', 'lock', 'shield'
  ];

  // Renk seçenekleri
  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#f43f5e'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.categories.getAll({ 
        sortBy: 'sortOrder', 
        sortOrder: 'asc',
        limit: 100 
      });
      setCategories(response.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kategoriler yüklenirken hata oluştu');
      console.error('Kategoriler yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Kategori adı gereklidir');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        await api.categories.update(editingCategory.id, formData);
      } else {
        await api.categories.create(formData);
      }
      
      await loadCategories();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'İşlem sırasında hata oluştu');
      console.error('Form gönderim hatası:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!window.confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }
    
    try {
      await api.categories.delete(id);
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kategori silinirken hata oluştu');
      console.error('Silme hatası:', err);
    }
  };

  const handleSortChange = async (categoryId: string, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const currentIndex = categories.findIndex(c => c.id === categoryId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const targetCategory = categories[targetIndex];
    
    try {
      // Sıralama değerlerini değiştir
      await Promise.all([
        api.categories.updateSortOrder(category.id, targetCategory.sortOrder),
        api.categories.updateSortOrder(targetCategory.id, category.sortOrder)
      ]);
      
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sıralama güncellenirken hata oluştu');
      console.error('Sıralama hatası:', err);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon,
      isActive: category.isActive
    });
    setShowCreateForm(true);
    setError(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3b82f6',
      icon: 'folder',
      isActive: true
    });
    setEditingCategory(null);
    setShowCreateForm(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Kategori Yönetimi</h1>
            <p className="text-secondary-600 mt-1">
              Blog kategorilerini oluşturun, düzenleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Yeni Kategori
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Oluştur'}
              </h2>
              <button
                onClick={resetForm}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kategori Adı */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Kategori adını girin"
                  required
                />
              </div>

              {/* Renk Seçimi */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Renk
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-12 border border-secondary-300 rounded-lg cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-secondary-900' : 'border-secondary-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* İkon Seçimi */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  İkon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>
                      {icon.charAt(0).toUpperCase() + icon.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Durum */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-secondary-700">
                  Durum
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-3 text-sm text-secondary-700">
                    Aktif
                  </label>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Kategori açıklaması (isteğe bağlı)"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {submitting ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Oluştur')}
              </button>
              <button
                onClick={resetForm}
                type="button"
                className="bg-secondary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-secondary-600 transition-colors"
              >
                <X size={16} />
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-lg border border-secondary-200">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900">
              Kategoriler ({categories.length})
            </h3>
          </div>
          
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Oluşturulma
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-secondary-900">
                            {category.sortOrder}
                          </span>
                          <div className="flex flex-col">
                            {index > 0 && (
                              <button
                                onClick={() => handleSortChange(category.id, 'up')}
                                className="text-secondary-400 hover:text-secondary-600 p-1"
                                title="Yukarı taşı"
                              >
                                <ArrowUp size={12} />
                              </button>
                            )}
                            {index < categories.length - 1 && (
                              <button
                                onClick={() => handleSortChange(category.id, 'down')}
                                className="text-secondary-400 hover:text-secondary-600 p-1"
                                title="Aşağı taşı"
                              >
                                <ArrowDown size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {category.name}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {category.icon}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-secondary-600 font-mono bg-secondary-100 px-2 py-1 rounded">
                          {category.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-secondary-900 max-w-xs truncate">
                          {category.description || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(category)}
                            className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                Henüz kategori bulunmuyor
              </h3>
              <p className="text-secondary-500 mb-6">
                İlk kategoriyi oluşturmak için yukarıdaki butona tıklayın.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateForm(true);
                }}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                İlk Kategoriyi Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;