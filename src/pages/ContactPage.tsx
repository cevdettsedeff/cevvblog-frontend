// src/pages/ContactPage.tsx
import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
  
  // FAQ Accordion için state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  // FAQ verileri
  const faqs = [
    {
      question: "Ne kadar sürede geri dönüş yaparsınız?",
      answer: "Genellikle 24 saat içerisinde e-posta mesajlarına yanıt vermeye çalışırız. Acil durumlar için telefon numaramızı kullanabilirsiniz."
    },
    {
      question: "Blog yazarı olmak istiyorum, nasıl başvururum?",
      answer: "Yazar olmak için editor@cevvblog.com adresine özgeçmişiniz ve örnek yazılarınızla birlikte başvurabilirsiniz."
    },
    {
      question: "Reklam ve sponsorluk nasıl yapılır?",
      answer: "İş birliği teklifleri için partnership@cevvblog.com adresinden bizimle iletişime geçebilirsiniz."
    },
    {
      question: "Teknik bir sorun yaşıyorum, ne yapmalıyım?",
      answer: "Teknik sorunlar için support@cevvblog.com adresine detaylı bir açıklama ile yazabilirsiniz."
    },
    {
      question: "Blog içeriklerini başka yerde kullanabilir miyim?",
      answer: "İçeriklerimiz telif hakkı ile korunmaktadır. Kaynak göstererek kısa alıntılar yapabilirsiniz, ancak tam makale paylaşımları için izin almanız gerekmektedir."
    },
    {
      question: "Hangi konularda yazı kabul ediyorsunuz?",
      answer: "Teknoloji, yaşam tarzı, kişisel gelişim, seyahat, yemek ve kültür konularında kaliteli içerikleri değerlendiriyoruz."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

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
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 hover:shadow-md transition-shadow duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                  İletişim Bilgileri
                </h2>
                <p className="text-secondary-600 text-sm">
                  Size en uygun iletişim yolunu seçin
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="group p-4 rounded-lg hover:bg-primary-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                        <Mail className="w-6 h-6 text-blue-600 group-hover:text-primary-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-800 transition-colors duration-300">E-posta</h3>
                      <div className="space-y-1">
                        <a href="mailto:info@cevvblog.com" className="block text-secondary-600 hover:text-primary-600 transition-colors duration-200 text-sm">
                          info@cevvblog.com
                        </a>
                        <a href="mailto:editor@cevvblog.com" className="block text-secondary-600 hover:text-primary-600 transition-colors duration-200 text-sm">
                          editor@cevvblog.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-lg hover:bg-green-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                        <Phone className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-green-800 transition-colors duration-300">Telefon</h3>
                      <a href="tel:+902125550123" className="block text-secondary-600 hover:text-green-600 transition-colors duration-200 font-medium">
                        +90 (212) 555 0123
                      </a>
                      <p className="text-xs text-secondary-500 mt-1 bg-secondary-100 px-2 py-1 rounded-full inline-block">
                        Pazartesi - Cuma, 09:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-lg hover:bg-purple-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-purple-800 transition-colors duration-300">Konum</h3>
                      <p className="text-secondary-600 leading-relaxed">
                        Beşiktaş, İstanbul<br />
                        <span className="text-secondary-500">Türkiye</span>
                      </p>
                      <button className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 group-hover:underline">
                        <span>Haritada Görüntüle</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-lg hover:bg-indigo-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
                        <MessageCircle className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-indigo-800 transition-colors duration-300">Sosyal Medya</h3>
                      <div className="space-y-2">
                        <a href="https://twitter.com/cevvblog" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-secondary-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>Twitter: @cevvblog</span>
                        </a>
                        <a href="https://linkedin.com/company/cevvblog" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-secondary-600 hover:text-indigo-600 transition-colors duration-200 text-sm">
                          <span className="w-2 h-2 bg-blue-700 rounded-full"></span>
                          <span>LinkedIn: /company/cevvblog</span>
                        </a>
                      </div>
                    </div>
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

        {/* Yeni Modern FAQ Accordion Bölümü */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
              Sıkça Sorulan Sorular
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-secondary-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-secondary-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-primary-600 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-400 transition-transform duration-200" />
                      )}
                    </div>
                  </button>
                  
                  <div
                    className={`px-6 bg-secondary-50 transition-all duration-300 ease-in-out ${
                      openFAQIndex === index
                        ? 'py-4 opacity-100 max-h-96'
                        : 'py-0 opacity-0 max-h-0'
                    }`}
                  >
                    <div className={`transition-all duration-300 ${openFAQIndex === index ? 'translate-y-0' : '-translate-y-2'}`}>
                      <p className="text-secondary-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alt kısım - İlave bilgi */}
            <div className="mt-8 pt-6 border-t border-secondary-200">
              <div className="text-center">
                <p className="text-secondary-600 text-sm mb-3">
                  Sorunuzun cevabını bulamadınız mı?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href="mailto:info@cevvblog.com"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    Bizimle İletişime Geçin
                  </a>
                  <span className="text-secondary-400 text-sm">veya</span>
                  <a
                    href="tel:+902125550123"
                    className="inline-flex items-center px-4 py-2 border border-secondary-300 text-secondary-700 text-sm font-medium rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                  >
                    Bizi Arayın
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;