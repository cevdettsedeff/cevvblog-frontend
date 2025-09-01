// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    if (!formData.name.trim()) {
      newErrors.name = 'İsim alanı zorunludur';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Konu alanı zorunludur';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Burada backend API'ye istek atılacak
      // Şimdilik simüle edelim
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (err: any) {
      setErrors({ submit: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            İletişim
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Bizimle iletişime geçin. Sorularınız, önerileriniz veya iş birliği teklifleriniz için 
            aşağıdaki formu kullanabilir veya direkt iletişim bilgilerimizden ulaşabilirsiniz.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                İletişim Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">E-posta</h3>
                    <p className="text-secondary-600">info@cevvblog.com</p>
                    <p className="text-secondary-600">editor@cevvblog.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Telefon</h3>
                    <p className="text-secondary-600">+90 (212) 555 0123</p>
                    <p className="text-sm text-secondary-500">Pazartesi - Cuma, 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Adres</h3>
                    <p className="text-secondary-600">
                      Beşiktaş, İstanbul<br />
                      Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">Sosyal Medya</h3>
                    <div className="space-y-1">
                      <p className="text-secondary-600">Twitter: @cevvblog</p>
                      <p className="text-secondary-600">LinkedIn: /company/cevvblog</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hızlı İletişim Konuları */}
              <div className="mt-8 pt-8 border-t border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4">Hızlı İletişim</h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-secondary-700">Editörlük:</span>
                    <span className="text-secondary-600 ml-1">editor@cevvblog.com</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-secondary-700">İş Birliği:</span>
                    <span className="text-secondary-600 ml-1">partnership@cevvblog.com</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-secondary-700">Teknik Destek:</span>
                    <span className="text-secondary-600 ml-1">support@cevvblog.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Mesaj Gönder
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      Mesajınız başarıyla gönderildi! Size en kısa sürede geri dönüş yapacağız.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      İsim Soyisim *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.name 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-secondary-300 bg-white hover:border-secondary-400'
                      }`}
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      E-posta Adresi *
                    </label>
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
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.subject 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-secondary-300 bg-white hover:border-secondary-400'
                    }`}
                    placeholder="Mesajınızın konusunu belirtin"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical ${
                      errors.message 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-secondary-300 bg-white hover:border-secondary-400'
                    }`}
                    placeholder="Mesajınızı buraya yazın..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Mesajı Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* SSS Bölümü */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
              Sıkça Sorulan Sorular
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Ne kadar sürede geri dönüş yaparsınız?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Genellikle 24 saat içerisinde e-posta mesajlarına yanıt vermeye çalışırız. 
                  Acil durumlar için telefon numaramızı kullanabilirsiniz.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Blog yazarı olmak istiyorum, nasıl başvururum?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Yazar olmak için editor@cevvblog.com adresine özgeçmişiniz ve 
                  örnek yazılarınızla birlikte başvurabilirsiniz.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Reklam ve sponsorluk nasıl yapılır?
                </h3>
                <p className="text-secondary-600 text-sm">
                  İş birliği teklifleri için partnership@cevvblog.com adresinden 
                  bizimle iletişime geçebilirsiniz.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Teknik bir sorun yaşıyorum, ne yapmalıyım?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Teknik sorunlar için support@cevvblog.com adresine detaylı bir 
                  açıklama ile yazabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;