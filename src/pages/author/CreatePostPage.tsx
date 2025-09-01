// src/pages/author/CreatePostPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Send, Eye, ArrowLeft, Upload, X } from 'lucide-react';

interface PostForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'draft' | 'published';
  publishDate: string;
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PostForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    featuredImage: '',
    status: 'draft',
    publishDate: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Kategoriler - normalde API'den gelecek
  const categories = [
    'Frontend',
    'Backend', 
    'Mobile',
    'DevOps',
    'AI & Machine Learning',
    'Cybersecurity',
    'Yazılım Mimarisi',
    'Programlama',
    'Veritabanı',
    'Cloud Computing'
  ];

  // Başlık değiştiğinde slug otomatik oluştur
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      title,
      slug
    }));
    
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Form input değişikliklerini handle et
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Tag ekleme
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      setTagInput('');
    }
  };

  // Tag silme
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'İçerik zorunludur';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'İçerik en az 100 karakter olmalıdır';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Özet zorunludur';
    } else if (formData.excerpt.trim().length < 50) {
      newErrors.excerpt = 'Özet en az 50 karakter olmalıdır';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Kaydetme işlemi
  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateForm() && status === 'published') {
      return;
    }

    try {
      setLoading(true);
      
      const postData = {
        ...formData,
        status,
        publishDate: status === 'published' ? new Date().toISOString() : formData.publishDate
      };

      // Burada API'ye istek atılacak
      console.log('Post kaydediliyor:', postData);
      
      // Demo için bekleme
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Başarı durumunda yazar paneline yönlendir
      navigate('/author-dashboard');
      
    } catch (error) {
      setErrors({ submit: 'Kaydetme işlemi başarısız oldu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/author-dashboard')}
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">Yeni Yazı Oluştur</h1>
              <p className="text-secondary-600">Yazınızı oluşturun ve paylaşın</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="px-4 py-2 text-secondary-700 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Taslak Kaydet</span>
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Yayınla</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hata mesajı */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{errors.submit}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Başlık */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                className={`w-full px-4 py-3 text-xl border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-secondary-300 bg-white hover:border-secondary-400'
                }`}
                placeholder="Yazınızın başlığını girin..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              
              {/* Slug Preview */}
              {formData.slug && (
                <div className="mt-2 text-sm text-secondary-500">
                  URL: /post/<span className="font-mono">{formData.slug}</span>
                </div>
              )}
            </div>

            {/* İçerik */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
                İçerik *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={20}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical font-mono text-sm ${
                  errors.content 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-secondary-300 bg-white hover:border-secondary-400'
                }`}
                placeholder="Yazınızın içeriğini buraya yazın... (Markdown desteklenir)"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-2 text-xs text-secondary-500">
                Markdown formatını kullanabilirsiniz. Minimum 100 karakter.
                {formData.content && (
                  <span className="ml-2">
                    Karakter sayısı: {formData.content.length}
                  </span>
                )}
              </p>
            </div>

            {/* Özet */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-2">
                Özet *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical ${
                  errors.excerpt 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-secondary-300 bg-white hover:border-secondary-400'
                }`}
                placeholder="Yazınızın kısa özetini buraya yazın..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
              <p className="mt-2 text-xs text-secondary-500">
                Yazınızın ana sayfada ve arama sonuçlarında görünecek özeti. Minimum 50 karakter.
                {formData.excerpt && (
                  <span className="ml-2">
                    Karakter sayısı: {formData.excerpt.length}
                  </span>
                )}
              </p>
            </div>

          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            
            {/* Yayın Ayarları */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Yayın Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-2">
                    Durum
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınlanmış</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Kategori */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kategori</h3>
              
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.category 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-secondary-300 bg-white'
                }`}
              >
                <option value="">Kategori Seçin</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Etiketler */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Etiketler</h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Etiket eklemek için yazın ve Enter'a basın"
                />
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-secondary-500">
                  Enter veya virgül ile etiket ekleyebilirsiniz
                </p>
              </div>
            </div>

            {/* Öne Çıkan Görsel */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Öne Çıkan Görsel</h3>
              
              <div className="space-y-3">
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 mb-1">Görsel Yükle</p>
                  <p className="text-xs text-secondary-500">veya URL girin</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-2 inline-flex items-center px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded cursor-pointer hover:bg-primary-100"
                  >
                    Dosya Seç
                  </label>
                </div>
                
                {formData.featuredImage && (
                  <div className="relative">
                    <img
                      src={formData.featuredImage}
                      alt="Önizleme"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO Ayarları */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">SEO Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="url-slug"
                  />
                  <p className="mt-1 text-xs text-secondary-500">
                    Yazının URL'inde görünecek kısım
                  </p>
                </div>
                
                <div className="text-sm text-secondary-600 space-y-1">
                  <p><strong>Başlık uzunluğu:</strong> {formData.title.length}/60</p>
                  <p><strong>Özet uzunluğu:</strong> {formData.excerpt.length}/160</p>
                </div>
              </div>
            </div>

            {/* Önizleme */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Önizleme</h3>
              
              <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
                <div className="space-y-2">
                  <h4 className="font-semibold text-secondary-900 line-clamp-2">
                    {formData.title || 'Başlık buraya gelecek'}
                  </h4>
                  <p className="text-sm text-secondary-600 line-clamp-3">
                    {formData.excerpt || 'Özet buraya gelecek...'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-secondary-500">
                    <span>{formData.category || 'Kategori'}</span>
                    <span>{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-xs text-secondary-500">
                Yazınız blog listesinde böyle görünecek
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePostPage;