export * from './builder';

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ============================================
// SITE TYPES
// ============================================

export interface SiteConfig {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  globalStyles: import('./builder').DesignSystem | null;
  settings: SiteSettings;
}

export interface SiteSettings {
  favicon?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  gtmId?: string;
  customHead?: string;
  customBody?: string;
  cookieBanner: boolean;
  maintenanceMode: boolean;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; visits: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  conversionRate: number;
}

// ============================================
// AI TYPES
// ============================================

export interface AIGenerateRequest {
  prompt: string;
  type: 'website' | 'page' | 'section' | 'copy' | 'seo' | 'image' | 'logo' | 'brand';
  context?: Record<string, unknown>;
}

export interface AIGenerateResponse {
  result: unknown;
  suggestions?: string[];
  tokens: number;
}

// ============================================
// DEPLOYMENT TYPES
// ============================================

export interface DeploymentConfig {
  siteId: string;
  environment: 'production' | 'staging' | 'preview';
  customDomain?: string;
}

export interface DeploymentResult {
  id: string;
  url: string;
  previewUrl: string;
  status: 'BUILDING' | 'DEPLOYING' | 'LIVE' | 'FAILED';
  duration?: number;
}
