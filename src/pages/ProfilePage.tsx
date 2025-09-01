// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar, Edit3, Save, X, Camera, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Error mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı zorunludur';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Burada API'ye profil güncelleme isteği atılacak
      // await api.users.updateProfile(formData);
      
      // Demo için bekleme
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
      
    } catch (error: any) {
      setErrors({ submit: 'Profil güncellenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'AUTHOR':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Yönetici';
      case 'AUTHOR':
        return 'Yazar';
      case 'USER':
        return 'Kullanıcı';
      default:
        return role;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Profil
            </h1>
            <p className="text-secondary-600 mt-1">
              Hesap bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Düzenle</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Sol Panel - Profil Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user.firstName[0]?.toUpperCase()}{user.lastName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-secondary-900 mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-secondary-600 mb-3">@{user.username}</p>
                
                {/* Role Badge */}
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                  <Shield className="w-4 h-4 mr-1" />
                  {getRoleText(user.role)}
                </span>
              </div>

              {/* Profil İstatistikleri */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-secondary-400" />
                  <span className="text-secondary-600">{user.email}</span>
                </div>
                
                {user.createdAt && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-secondary-400" />
                    <span className="text-secondary-600">
                      Üye: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <h3 className="font-medium text-secondary-900 mb-2">Hakkımda</h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Panel - Profil Düzenleme */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">
                  {isEditing ? 'Profili Düzenle' : 'Profil Bilgileri'}
                </h2>
                
                {isEditing && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 text-secondary-700 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>İptal</span>
                    </button>
                    
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Kaydediliyor...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Kaydet</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Error Messages */}
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Ad */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Ad *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.firstName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-secondary-300 bg-white hover:border-secondary-400'
                      }`}
                      placeholder="Adınızı girin"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-700">
                      {user.firstName}
                    </div>
                  )}
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Soyad */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Soyad *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.lastName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-secondary-300 bg-white hover:border-secondary-400'
                      }`}
                      placeholder="Soyadınızı girin"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-700">
                      {user.lastName}
                    </div>
                  )}
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                {/* Kullanıcı Adı */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
                    Kullanıcı Adı *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.username 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-secondary-300 bg-white hover:border-secondary-400'
                      }`}
                      placeholder="Kullanıcı adınızı girin"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-700">
                      @{user.username}
                    </div>
                  )}
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* E-posta */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    E-posta *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-secondary-300 bg-white hover:border-secondary-400'
                      }`}
                      placeholder="E-posta adresinizi girin"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-700">
                      {user.email}
                    </div>
                  )}
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-secondary-700 mb-2">
                  Hakkımda
                </label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical"
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-700 min-h-[100px]">
                    {user.bio || (
                      <span className="text-secondary-400 italic">
                        Henüz bir bio eklenmemiş
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-1 text-xs text-secondary-500">
                  Maksimum 500 karakter
                  {formData.bio && (
                    <span className="ml-2">
                      ({formData.bio.length}/500)
                    </span>
                  )}
                </p>
              </div>

              {/* Hesap Bilgileri */}
              {!isEditing && (
                <div className="mt-8 pt-6 border-t border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Hesap Bilgileri
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-1">Kullanıcı ID</p>
                      <p className="text-sm text-secondary-600 font-mono">{user.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-secondary-700 mb-1">Hesap Rolü</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {getRoleText(user.role)}
                      </span>
                    </div>
                    
                    {user.createdAt && (
                      <div>
                        <p className="text-sm font-medium text-secondary-700 mb-1">Üyelik Tarihi</p>
                        <p className="text-sm text-secondary-600">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    
                    {user.updatedAt && (
                      <div>
                        <p className="text-sm font-medium text-secondary-700 mb-1">Son Güncelleme</p>
                        <p className="text-sm text-secondary-600">
                          {new Date(user.updatedAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Güvenlik Ayarları */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Güvenlik
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors">
                  Şifre Değiştir
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors">
                  İki Faktörlü Kimlik Doğrulama
                </button>
                
                <button className="w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors">
                  Giriş Geçmişi
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Panel - Etkinlik & İstatistikler */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Yazar İstatistikleri (Sadece AUTHOR/ADMIN için) */}
            {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                  Yazar İstatistikleri
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                    <div className="text-sm text-blue-700">Toplam Yazı</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">12.4K</div>
                    <div className="text-sm text-green-700">Toplam Görüntüleme</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
                    <div className="text-sm text-purple-700">Toplam Beğeni</div>
                  </div>
                </div>
              </div>
            )}

            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Son Aktiviteler
              </h3>
              
              <div className="space-y-4">
                {/* Demo aktiviteler */}
                <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Profil bilgileri güncellendi
                    </p>
                    <p className="text-xs text-secondary-500">2 saat önce</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Yeni yazı yayınlandı: "React 18 Özellikleri"
                    </p>
                    <p className="text-xs text-secondary-500">1 gün önce</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      Hesap oluşturuldu
                    </p>
                    <p className="text-xs text-secondary-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '15 gün önce'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tercihler */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Tercihler
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">E-posta Bildirimleri</p>
                    <p className="text-sm text-secondary-600">Yeni yorumlar ve yazılar için bildirim al</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">Koyu Tema</p>
                    <p className="text-sm text-secondary-600">Gece modu kullan</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-secondary-900">Profili Herkese Açık Yap</p>
                    <p className="text-sm text-secondary-600">Profilinizi diğer kullanıcılar görebilsin</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;