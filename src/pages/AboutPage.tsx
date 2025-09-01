// src/pages/AboutPage.tsx
import React from 'react';
import { Users, Target, Heart, Award, Calendar, BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            CevvBlog Hakkında
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Teknoloji, yaşam ve kişisel gelişim konularında kaliteli içerikler üreten, 
            bilgi paylaşımını seven bir topluluk oluşturmayı hedefliyoruz.
          </p>
        </div>

        {/* Misyon & Vizyon */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Misyonumuz</h2>
            </div>
            <p className="text-secondary-600 leading-relaxed">
              Teknolojinin hızla geliştiği bu çağda, karmaşık konuları herkesin anlayabileceği 
              şekilde anlatmak ve bilgiyi demokratikleştirmek. Okuyucularımızın günlük yaşamlarında 
              kullanabilecekleri pratik bilgiler sunarak, onların kişisel ve profesyonel gelişimlerine 
              katkıda bulunmak.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Vizyonumuz</h2>
            </div>
            <p className="text-secondary-600 leading-relaxed">
              Türkiye'nin en güvenilir ve kaliteli teknoloji blog platformu olmak. 
              Yazarlarımız ve okuyucularımızdan oluşan güçlü bir topluluk yaratarak, 
              bilgi paylaşımının gücüyle herkesin hayatına dokunmak ve pozitif değişim 
              yaratmak için ilham vermek.
            </p>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Değerlerimiz
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Kalite</h3>
              <p className="text-secondary-600">
                Her yazımızı titizlikle araştırır, editöryal süreçten geçirir ve 
                okuyucularımıza en yüksek kalitede içerik sunarız.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Topluluk</h3>
              <p className="text-secondary-600">
                Yazarlarımız ve okuyucularımızla güçlü bağlar kurarak, 
                öğrenmeyi ve paylaşımı destekleyen bir ekosistem yaratıyoruz.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Güven</h3>
              <p className="text-secondary-600">
                Şeffaflık, dürüstlük ve etik değerleri temel alarak, 
                okuyucularımızın güvenini kazanmaya ve korumaya odaklanıyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* Hikayemiz */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            Hikayemiz
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-secondary-600">
              <p className="mb-6">
                CevvBlog, 2024 yılında teknoloji tutkunları ve deneyimli yazarlar tarafından kuruldu. 
                Amacımız, sürekli değişen teknoloji dünyasında kaybolmuş okuyucular için bir pusula olmaktı.
              </p>
              
              <p className="mb-6">
                İlk yazımızı yayınladığımız günden beri, sadece teknik bilgi paylaşmakla kalmadık; 
                teknolojinin insan yaşamına etkilerini, dijital dönüşümün getirdiği fırsatları ve 
                zorlukları da ele aldık. Yazılarımızda hem başlangıç seviyesindeki kullanıcıları 
                hem de ileri düzey teknisyenleri düşünerek, herkesin öğrenebileceği bir dil kullanıyoruz.
              </p>
              
              <p className="mb-6">
                Bugün 50+ yazar arkadaşımızla birlikte, günlük binlerce okuyucuya ulaşıyoruz. 
                Toplululuğumuz sadece bir blog değil; öğrenmeyi seven, bilgi paylaşan ve 
                birlikte büyüyen bir aileyiz.
              </p>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-secondary-600">Yayınlanan Makale</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-secondary-600">Aktif Yazar</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-secondary-600">Aylık Okuyucu</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">2024</div>
            <div className="text-secondary-600">Kuruluş Yılı</div>
          </div>
        </div>

        {/* Ekip Bölümü */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            Ekibimiz
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">CE</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Cem Evcimen</h3>
              <p className="text-primary-600 mb-2">Kurucu & Baş Editör</p>
              <p className="text-secondary-600 text-sm">
                10+ yıllık teknoloji deneyimi ile CevvBlog'u kurdu. 
                Yazılım geliştirme ve dijital pazarlama uzmanı.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">AY</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Ayşe Yılmaz</h3>
              <p className="text-primary-600 mb-2">İçerik Editörü</p>
              <p className="text-secondary-600 text-sm">
                Gazetecilik geçmişi ile teknik konuları anlaşılır hale getiriyor. 
                İçerik kalitesi ve editörlük süreçlerinden sorumlu.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">MK</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Mehmet Kaya</h3>
              <p className="text-primary-600 mb-2">Teknoloji Uzmanı</p>
              <p className="text-secondary-600 text-sm">
                Cybersecurity ve AI konularında uzman. Teknik derinlik ve 
                doğruluk kontrolünden sorumlu kıdemli yazarımız.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Topluluğumuza Katılın!
            </h2>
            <p className="text-primary-100 mb-6 text-lg">
              Yeni yazılarımızdan haberdar olmak ve topluluk etkinliklerimize katılmak için 
              bize katılın. Birlikte öğrenelim, gelişelim!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-secondary-50 transition-colors"
              >
                Üye Ol
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;