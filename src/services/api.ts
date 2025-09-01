// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const IS_DEV = import.meta.env.DEV;

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // JWT kullandığımız için false
});

// Request Interceptor: accessToken ekle
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (IS_DEV) {
    console.log(
      '🚀 API Request:',
      config.method?.toUpperCase(),
      config.url,
      config.params,
      config.data
    );
  }

  return config;
});

// Response Interceptor: 401 → refresh dene
apiClient.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log('✅ API Response:', response.config.url, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Backend'deki refresh endpoint'i ile uyumlu
        const response = await axios.post(`${API_BASE_URL}/users/refresh`, {
          refreshToken,
        });

        const tokenData = response.data?.data || response.data;
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokenData;

        localStorage.setItem('token', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete apiClient.defaults.headers.common['Authorization'];
        
        // Sadece login sayfasında değilsek yönlendir
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (IS_DEV) {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints - Backend routes ile uyumlu
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/users/login', { email, password }),

    register: (userData: {
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => apiClient.post('/users/register', userData),

    getProfile: () => apiClient.get('/users/profile'),

    refreshToken: (refreshToken: string) =>
      apiClient.post('/users/refresh', { refreshToken }),

    logout: (accessToken: string, refreshToken: string | null = null) => {
      // Backend AuthService.logout parametrelerine uygun
      const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      
      if (refreshToken) {
        config.headers!['X-Refresh-Token'] = refreshToken;
      }
      
      return apiClient.post('/users/logout', {}, config);
    },

    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
      apiClient.post('/users/change-password', { 
        currentPassword, 
        newPassword, 
        confirmPassword 
      }),
  },

  // User endpoints
  users: {
    getById: (id: string) => apiClient.get(`/users/${id}`),
    getAll: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
      apiClient.get('/users', { params }),
    getAuthors: () => apiClient.get('/users/authors'),
    getUserStats: (id: string) => apiClient.get(`/users/${id}/stats`),
    promoteToAuthor: (id: string) => apiClient.post(`/users/${id}/promote`),
    demoteToUser: (id: string) => apiClient.post(`/users/${id}/demote`),
    activateUser: (id: string) => apiClient.post(`/users/${id}/activate`),
    deactivateUser: (id: string) => apiClient.post(`/users/${id}/deactivate`),
    updateProfile: (profileData: any) => apiClient.put('/users/profile', profileData),
  },

  // Posts endpoints - Backend routes ile uyumlu
  posts: {
    getAll: (params?: { page?: number; limit?: number; category?: string }) =>
      apiClient.get('/posts', { params }),
    getById: (id: string) => apiClient.get(`/posts/${id}`),
    getBySlug: (slug: string) => apiClient.get(`/posts/slug/${slug}`),
    getPopular: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/posts/popular', { params }),
    getRecent: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/posts/recent', { params }),
    search: (query: string, params?: { page?: number; limit?: number }) =>
      apiClient.get('/posts/search', { params: { q: query, ...params } }),
    getByCategory: (categorySlug: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/posts/category/${categorySlug}`, { params }),
    getByAuthor: (authorId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/posts/author/${authorId}`, { params }),
    create: (postData: {
      title: string;
      content: string;
      excerpt?: string;
      categoryId: string;
      tags?: string[];
      featuredImage?: string;
    }) => apiClient.post('/posts', postData),
    update: (id: string, postData: any) => apiClient.put(`/posts/${id}`, postData),
    delete: (id: string) => apiClient.delete(`/posts/${id}`),
    uploadImage: (id: string, imageData: FormData) =>
      apiClient.post(`/posts/${id}/upload-image`, imageData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    uploadMultipleImages: (id: string, imagesData: FormData) =>
      apiClient.post(`/posts/${id}/upload-images`, imagesData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
  },

  // Categories endpoints
  categories: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }) => apiClient.get('/categories', { params }),
    getActive: () => apiClient.get('/categories/active'),
    getById: (id: string) => apiClient.get(`/categories/${id}`),
    getBySlug: (slug: string) => apiClient.get(`/categories/slug/${slug}`),
    getCategoryPosts: (id: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/categories/${id}/posts`, { params }),
    create: (categoryData: { 
      name: string; 
      slug?: string;
      description?: string; 
      color?: string;
      icon?: string;
    }) => apiClient.post('/categories', categoryData),
    update: (id: string, categoryData: any) =>
      apiClient.put(`/categories/${id}`, categoryData),
    delete: (id: string) => apiClient.delete(`/categories/${id}`),
    updateSortOrder: (id: string, sortOrder: number) =>
      apiClient.put(`/categories/${id}/sort-order`, { sortOrder }),
    bulkUpdateSortOrder: (updates: { id: string; sortOrder: number }[]) =>
      apiClient.put('/categories/bulk-sort-order', { updates }),
    getStats: () => apiClient.get('/categories/admin/stats'),
  },

  // Comments endpoints
  comments: {
    getByPost: (postId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/comments/post/${postId}`, { params }),
    getById: (id: string) => apiClient.get(`/comments/${id}`),
    getRecent: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/comments/recent', { params }),
    getByAuthor: (authorId: string, params?: { page?: number; limit?: number }) =>
      apiClient.get(`/comments/author/${authorId}`, { params }),
    getTopCommentedPosts: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/comments/top-posts', { params }),
    countByPost: (blogPostId: string) =>
      apiClient.get(`/comments/count/${blogPostId}`),
    create: (commentData: { 
      content: string; 
      blogPostId: string;
      parentId?: string;
    }) => apiClient.post('/comments', commentData),
    createWithSpamDetection: (commentData: {
      content: string;
      blogPostId: string;
      parentId?: string;
    }) => apiClient.post('/comments/with-spam-detection', commentData),
    update: (id: string, content: string) => 
      apiClient.put(`/comments/${id}`, { content }),
    delete: (id: string) => apiClient.delete(`/comments/${id}`),
    
    // Admin endpoints
    getPending: (params?: { page?: number; limit?: number }) =>
      apiClient.get('/comments/pending', { params }),
    approve: (id: string) => apiClient.put(`/comments/${id}/approve`),
    reject: (id: string) => apiClient.put(`/comments/${id}/reject`),
    bulkApprove: (commentIds: string[]) =>
      apiClient.post('/comments/bulk-approve', { commentIds }),
    bulkReject: (commentIds: string[]) =>
      apiClient.post('/comments/bulk-reject', { commentIds }),
    getByDateRange: (startDate: string, endDate: string) =>
      apiClient.get('/comments/date-range', { 
        params: { startDate, endDate } 
      }),
    getStats: () => apiClient.get('/comments/stats'),
  },
};

export default apiClient;