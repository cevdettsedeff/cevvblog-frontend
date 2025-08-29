// src/types/index.ts

// User tipleri - Backend DTO'ya uygun
export interface User {
  id: string;
  email: string;
  username: string; // Backend'de var
  firstName: string;
  lastName: string;
  role: string; // Backend'de string olarak geliyor
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth tipleri - Backend DTO'ya uygun
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string; // Backend'de zorunlu
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

// Category tipleri
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Post tipleri
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  images?: string[];
  tags?: string[]; // Tags field'i eklendi
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  readingTime?: number; // Optional yapıldı
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // İlişkiler
  author: User;
  category: Category;
  comments: Comment[];
}

// Comment tipleri
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  
  // İlişkiler
  author: User;
  postId: string;
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form tipleri
export interface CreatePostForm {
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  featuredImage?: File;
}

export interface CreateCommentForm {
  content: string;
  postId: string;
}

// React Context tipleri
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Component Props tipleri
export interface PostCardProps {
  post: Post;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
}

export interface CommentProps {
  comment: Comment;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}