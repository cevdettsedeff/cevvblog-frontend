import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import { Post, Category } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const HomePage: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliderPosts, setSliderPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadHomepageData = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log("🔄 Homepage veri yükleme başladı...");
    console.log("📍 API Base URL:", import.meta.env.VITE_API_BASE_URL);

    // Paralel olarak posts ve kategorileri yükle
    const [recentResponse, popularResponse, categoriesResponse] = await Promise.all([
      api.posts.getRecent(),
      api.posts.getPopular(),
      api.categories.getActive(), // Sadece aktif kategorileri al
    ]);

    // Posts verilerini işle
    const recentData =
      recentResponse.data?.data ||
      recentResponse.data?.items ||
      recentResponse.data ||
      [];
    const popularData =
      popularResponse.data?.data ||
      popularResponse.data?.items ||
      popularResponse.data ||
      [];

    setRecentPosts(Array.isArray(recentData) ? recentData : []);
    setPopularPosts(Array.isArray(popularData) ? popularData : []);
    setSliderPosts(Array.isArray(recentData) ? recentData.slice(0, 5) : []);

    // Kategoriler verilerini işle - aktif kategoriler
    const categoriesData =
      categoriesResponse.data?.data ||
      categoriesResponse.data?.items ||
      categoriesResponse.data ||
      [];
    
    console.log("✅ Aktif kategoriler yüklendi:", categoriesData);
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);

  } catch (err: any) {
    console.error("❌ Homepage veri yükleme genel hatası:", err);
    let errorMessage = "Veriler yüklenirken bir hata oluştu.";
    
    if (err.code === "ECONNREFUSED" || err.message?.includes("ECONNREFUSED")) {
      errorMessage = "Backend sunucusuna bağlanılamıyor.";
    } else if (err.code === "ERR_NETWORK") {
      errorMessage = "Ağ bağlantısı hatası.";
    } else if (err.response?.status === 404) {
      errorMessage = "API endpoint'i bulunamadı.";
    } else if (err.response?.status === 500) {
      errorMessage = "Sunucu hatası oluştu.";
    }
    
    setError(errorMessage);
    
    // Hata durumunda da boş array'ler set et
    setRecentPosts([]);
    setPopularPosts([]);
    setCategories([]);
    setSliderPosts([]);
  } finally {
    setLoading(false);
  }
};

    loadHomepageData();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || sliderPosts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
    }, 4000); // Increased interval for smoother experience
    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Veriler yükleniyor..." />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container-custom py-16 text-center"
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Bir Hata Oluştu</h3>
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
                className="btn-primary px-6 py-2 rounded-lg hover:bg-primary-700 transition-all"
              >
                Tekrar Dene
              </button>
              <a href="/backend-test" className="btn-secondary px-6 py-2 rounded-lg">
                API Test Et
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-12 bg-white"
      >
        <div className="container-custom px-4 md:px-8">
          {sliderPosts.length > 0 ? (
            <div className="relative h-[70vh] min-h-[450px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="h-full flex-shrink-0 relative w-full"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {sliderPosts[currentSlide].featuredImage && (
                    <div className="absolute inset-0">
                      <img
                        src={sliderPosts[currentSlide].featuredImage}
                        alt={sliderPosts[currentSlide].title}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                    </div>
                  )}
                  <div className="relative z-10 h-full flex items-center px-6 md:px-12">
                    <div className="max-w-2xl text-white">
                      {sliderPosts[currentSlide].category && (
                        <motion.span
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="inline-block px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-full mb-4 hover:bg-primary-700 transition-colors"
                        >
                          {sliderPosts[currentSlide].category.name}
                        </motion.span>
                      )}
                      <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight hover:text-primary-200 transition-colors cursor-pointer"
                      >
                        <Link to={`/post/${sliderPosts[currentSlide].slug || sliderPosts[currentSlide].id}`}>
                          {sliderPosts[currentSlide].title}
                        </Link>
                      </motion.h1>
                      {sliderPosts[currentSlide].excerpt && (
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed line-clamp-3"
                        >
                          {sliderPosts[currentSlide].excerpt}
                        </motion.p>
                      )}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center gap-6 mb-8 text-gray-300"
                      >
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {sliderPosts[currentSlide].author?.firstName} {sliderPosts[currentSlide].author?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {formatDate(sliderPosts[currentSlide].publishedAt || sliderPosts[currentSlide].createdAt)}
                          </span>
                        </div>
                        {sliderPosts[currentSlide].viewCount !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{sliderPosts[currentSlide].viewCount} görüntüleme</span>
                          </div>
                        )}
                      </motion.div>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Link
                          to={`/post/${sliderPosts[currentSlide].slug || sliderPosts[currentSlide].id}`}
                          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          Yazıyı Oku
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {sliderPosts.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {sliderPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index ? "bg-primary-600 scale-125" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="h-[70vh] min-h-[450px] rounded-3xl flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 shadow-2xl"
            >
              <div className="text-center text-white max-w-4xl mx-auto px-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Teknoloji ve Yazılım
                  <span className="block text-primary-200">Dünyasına Hoş Geldiniz</span>
                </h1>
                <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
                  Modern web teknolojileri, yazılım geliştirme süreçleri ve kişisel deneyimlerimi paylaştığım blog platformum.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/posts"
                    className="btn-lg bg-white text-primary-700 hover:bg-primary-50 rounded-lg px-6 py-3 transition-all hover:scale-105"
                  >
                    Yazıları Keşfet
                  </Link>
                  <Link
                    to="/about"
                    className="btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-700 rounded-lg px-6 py-3 transition-all hover:scale-105"
                  >
                    Hakkımda
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Recent Posts Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">Son Yazılar</h2>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7-7"
                />
              </svg>
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Henüz yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Popular Posts Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-secondary-50"
      >
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">Popüler Yazılar</h2>
          {popularPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {popularPosts.slice(0, 4).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PopularPostCard post={post} rank={index + 1} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Popüler yazı bulunmuyor.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white"
      >
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-8">Kategoriler</h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Kategori bulunmuyor.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-secondary-900 text-white"
      >
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Güncellemelerden Haberdar Olun</h2>
            <p className="text-secondary-300 mb-8 text-lg">
              Yeni yazılarımdan ve güncellemelerden haberdar olmak için e-posta listemize katılın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90"
              />
              <button
                type="button"
                className="btn-primary px-6 py-3 whitespace-nowrap rounded-lg hover:scale-105 transition-all"
              >
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="card group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
      <Link to={`/post/${post.slug || post.id}`}>
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="card-body p-6">
          <div className="flex items-center gap-2 mb-3">
            {post.category && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-md">
                {post.category.name}
              </span>
            )}
            <span className="text-secondary-500 text-sm">{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-secondary-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {post.author?.firstName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm text-secondary-600">
                {post.author?.firstName} {post.author?.lastName}
              </span>
            </div>
            {post.viewCount !== undefined && (
              <div className="flex items-center text-secondary-500 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {post.viewCount}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

interface PopularPostCardProps {
  post: Post;
  rank: number;
}

const PopularPostCard: React.FC<PopularPostCardProps> = ({ post, rank }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  return (
    <article className="card shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <Link to={`/post/${post.slug || post.id}`} className="block">
        <div className="card-body p-6">
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
                <span className="text-secondary-500 text-xs">{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-secondary-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">
                  {post.author?.firstName} {post.author?.lastName}
                </span>
                {post.viewCount !== undefined && (
                  <div className="flex items-center text-secondary-500 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
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

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug || category.id}`}
      className="card group hover:border-primary-300 transition-colors shadow-md hover:shadow-xl rounded-xl p-4"
    >
      <div className="card-body text-center">
        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors text-lg">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-secondary-600 mt-1 line-clamp-2">{category.description}</p>
        )}
      </div>
    </Link>
  );
};

export default HomePage;