// src/pages/PostDetailPage.tsx - TypeScript hataları düzeltildi
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { api } from '@/services/api';
import { Post } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('Post slug bulunamadı');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.posts.getBySlug(slug);
        const postData = response.data?.data || response.data;
        
        if (postData) {
          setPost(postData);
        } else {
          setError('Post bulunamadı');
        }
        
      } catch (err: any) {
        console.error('Post yükleme hatası:', err);
        
        if (err.response?.status === 404) {
          setError('Post bulunamadı');
        } else if (err.code === 'ECONNREFUSED') {
          setError('Backend sunucusuna bağlanılamıyor');
        } else {
          setError('Post yüklenirken bir hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // Loading durumu
  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-secondary-600">Post yükleniyor...</p>
      </div>
    );
  }

  // Error durumu
  if (error || !post) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {error || 'Post Bulunamadı'}
            </h3>
            <p className="text-red-600 mb-4">
              Aradığınız post mevcut değil veya kaldırılmış olabilir.
            </p>
            <div className="space-x-2">
              <button 
                onClick={() => navigate(-1)} 
                className="btn-secondary"
              >
                Geri Dön
              </button>
              <Link to="/" className="btn-primary">
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-secondary-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link to="/posts" className="hover:text-primary-600">Blog</Link>
        <span className="mx-2">/</span>
        {post.category?.name && (
          <>
            <Link 
              to={`/category/${post.category.slug || post.category.id}`}
              className="hover:text-primary-600"
            >
              {post.category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-secondary-700">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ana İçerik */}
        <main className="lg:col-span-2">
          <article className="card">
            {/* Featured Image */}
            {post.featuredImage && (
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-64 object-cover card-image"
              />
            )}
            
            <div className="card-body">
              {/* Post Header */}
              <header className="mb-6">
                {post.category?.name && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
                    {post.category.name}
                  </span>
                )}
                
                <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-lg text-secondary-600 mb-4">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Meta bilgiler */}
                <div className="flex items-center text-sm text-secondary-500 space-x-4 pb-4 border-b">
                  {post.author?.firstName && (
                    <span>{post.author.firstName} {post.author.lastName}</span>
                  )}
                  {post.publishedAt && (
                    <span>{formatDate(post.publishedAt)}</span>
                  )}
                  {post.readingTime && (
                    <span>{post.readingTime} dk okuma</span>
                  )}
                  <span>{post.viewCount || 0} görüntülenme</span>
                </div>
              </header>

              {/* Post Content - Markdown Rendering - TypeScript düzeltildi */}
              <div className="prose prose-lg max-w-none mb-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const { node, inline, className, children, ...rest } = props as any;
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow as any}
                          language={match[1]}
                          PreTag="div"
                          {...rest}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({children}) => (
                      <h1 className="text-3xl font-bold text-secondary-900 mt-8 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl font-bold text-secondary-800 mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl font-semibold text-secondary-800 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({children}) => (
                      <p className="text-secondary-700 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({children}) => (
                      <ul className="list-disc list-inside text-secondary-700 mb-4 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="list-decimal list-inside text-secondary-700 mb-4 space-y-1">
                        {children}
                      </ol>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-primary-50 text-secondary-700 italic">
                        {children}
                      </blockquote>
                    ),
                    a: ({children, href}) => (
                      <a 
                        href={href} 
                        className="text-primary-600 hover:text-primary-700 underline"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    img: ({src, alt}) => (
                      <img 
                        src={src} 
                        alt={alt} 
                        className="max-w-full h-auto rounded-lg my-4 mx-auto shadow-md"
                      />
                    ),
                    table: ({children}) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-secondary-200 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-secondary-50">
                        {children}
                      </thead>
                    ),
                    th: ({children}) => (
                      <th className="px-4 py-2 text-left border-b border-secondary-200 font-semibold text-secondary-900">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="px-4 py-2 border-b border-secondary-100 text-secondary-700">
                        {children}
                      </td>
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full hover:bg-secondary-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Comments Section */}
          <section className="card mt-8">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-6">Yorumlar ({post.comments?.length || 0})</h3>
              
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-secondary-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.author?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-secondary-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-600 text-center py-8">
                  Henüz yorum yapılmamış. İlk yorumu sen yap!
                </p>
              )}

              {/* Comment Form */}
              <div className="mt-8 p-6 bg-secondary-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Yorum Yap</h4>
                <form className="space-y-4">
                  <textarea
                    placeholder="Yorumunuzu yazın..."
                    rows={4}
                    className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled
                  >
                    Yorum Gönder (Yakında)
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside>
          {/* Post Bilgileri */}
          <div className="card mb-6">
            <div className="card-body">
              <h3 className="font-semibold mb-4">Bu Yazı Hakkında</h3>
              <div className="space-y-2">
                {post.author?.firstName && (
                  <p className="text-sm text-secondary-600">
                    <strong>Yazar:</strong> {post.author.firstName} {post.author.lastName}
                  </p>
                )}
                {post.category?.name && (
                  <p className="text-sm text-secondary-600">
                    <strong>Kategori:</strong> {post.category.name}
                  </p>
                )}
                <p className="text-sm text-secondary-600">
                  <strong>Yayın Tarihi:</strong> {formatDate(post.publishedAt || post.createdAt)}
                </p>
                <p className="text-sm text-secondary-600">
                  <strong>Görüntülenme:</strong> {post.viewCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Paylaş Butonları */}
          <div className="card">
            <div className="card-body">
              <h3 className="font-semibold mb-4">Paylaş</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: post.title, url });
                    } else {
                      navigator.clipboard.writeText(url);
                      alert('Link panoya kopyalandı!');
                    }
                  }}
                  className="w-full btn-primary text-sm"
                >
                  Linki Kopyala
                </button>
                <button 
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full btn-secondary text-sm"
                >
                  Twitter'da Paylaş
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostDetailPage;