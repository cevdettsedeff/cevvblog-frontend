// src/services/api.ts - Categories endpoint'i düzeltilmiş
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const IS_DEV = import.meta.env.DEV;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// JWT token'ı otomatik olarak header'a ekleme
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (IS_DEV) {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.params, config.data);
  }
  
  return config;
});

// Response interceptor - hata yönetimi
apiClient.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log('✅ API Response:', response.config.url, response.data);
    }
    return response;
  },
  (error) => {
    if (IS_DEV) {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/users/login', { email, password }),
    
    register: (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => apiClient.post('/users/register', userData),
    
    getProfile: () => apiClient.get('/users/profile'),
  },

  // Posts endpoints
  posts: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
    }) => apiClient.get('/posts', { params }),
    
    getById: (id: string) => apiClient.get(`/posts/${id}`),
    
    getBySlug: (slug: string) => apiClient.get(`/posts/slug/${slug}`),
    
    // Backend'inizde bu endpoint'ler çalışıyor
    getPopular: (params?: { page?: number; limit?: number }) => 
      apiClient.get('/posts/popular', { params }),
    
    getRecent: (params?: { page?: number; limit?: number }) => 
      apiClient.get('/posts/recent', { params }),
    
    search: (query: string) => 
      apiClient.get('/posts/search', { params: { q: query } }),
    
    create: (postData: {
      title: string;
      content: string;
      excerpt: string;
      categoryId: string;
    }) => apiClient.post('/posts', postData),
    
    update: (id: string, postData: any) => 
      apiClient.put(`/posts/${id}`, postData),
    
    delete: (id: string) => apiClient.delete(`/posts/${id}`),
  },

  // Categories endpoints
  categories: {
    // Tüm kategoriler (pagination ile)
    getAll: (params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }) => apiClient.get('/categories', { params }),
    
    // Aktif kategoriler (navbar için - pagination yok)
    getActive: () => apiClient.get('/categories/active'),
    
    create: (categoryData: { name: string; description?: string }) =>
      apiClient.post('/categories', categoryData),
  },

  // Comments endpoints  
  comments: {
    getAll: () => apiClient.get('/comments'),
    
    create: (commentData: {
      content: string;
      postId: string;
    }) => apiClient.post('/comments', commentData),
    
    update: (id: string, content: string) =>
      apiClient.put(`/comments/${id}`, { content }),
      
    delete: (id: string) => apiClient.delete(`/comments/${id}`),
  },
};

export default apiClient;