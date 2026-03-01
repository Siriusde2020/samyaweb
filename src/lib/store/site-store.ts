import { create } from 'zustand';
import type { SiteConfig, AuthUser, AnalyticsData } from '@/types';
import type { DesignSystem } from '@/types/builder';

interface SiteState {
  currentSite: SiteConfig | null;
  sites: SiteConfig[];
  user: AuthUser | null;
  analytics: AnalyticsData | null;
  designSystem: DesignSystem;
  isLoading: boolean;
}

interface SiteActions {
  setCurrentSite: (site: SiteConfig | null) => void;
  setSites: (sites: SiteConfig[]) => void;
  setUser: (user: AuthUser | null) => void;
  setAnalytics: (data: AnalyticsData | null) => void;
  updateDesignSystem: (updates: Partial<DesignSystem>) => void;
  setDesignSystem: (system: DesignSystem) => void;
  setLoading: (loading: boolean) => void;
}

const defaultDesignSystem: DesignSystem = {
  colors: {
    primary: '#4c6ef5',
    secondary: '#748ffc',
    accent: '#f59f00',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#868e96',
    border: '#dee2e6',
    error: '#fa5252',
    success: '#40c057',
    warning: '#fd7e14',
    custom: {},
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    scale: 1.25,
    lineHeight: 1.6,
    headings: {
      h1: { fontSize: '48px', fontWeight: '800', lineHeight: '1.1' },
      h2: { fontSize: '36px', fontWeight: '700', lineHeight: '1.2' },
      h3: { fontSize: '28px', fontWeight: '700', lineHeight: '1.3' },
      h4: { fontSize: '22px', fontWeight: '600', lineHeight: '1.4' },
      h5: { fontSize: '18px', fontWeight: '600', lineHeight: '1.4' },
      h6: { fontSize: '16px', fontWeight: '600', lineHeight: '1.5' },
    },
    body: {
      large: { fontSize: '18px', fontWeight: '400', lineHeight: '1.6' },
      base: { fontSize: '16px', fontWeight: '400', lineHeight: '1.6' },
      small: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },
      tiny: { fontSize: '12px', fontWeight: '400', lineHeight: '1.4' },
    },
  },
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
  },
  breakpoints: {
    desktop: 1280,
    tablet: 768,
    mobile: 375,
  },
};

export const useSiteStore = create<SiteState & SiteActions>()((set) => ({
  currentSite: null,
  sites: [],
  user: null,
  analytics: null,
  designSystem: defaultDesignSystem,
  isLoading: false,

  setCurrentSite: (site) => set({ currentSite: site }),
  setSites: (sites) => set({ sites }),
  setUser: (user) => set({ user }),
  setAnalytics: (data) => set({ analytics: data }),
  updateDesignSystem: (updates) =>
    set((state) => ({
      designSystem: { ...state.designSystem, ...updates },
    })),
  setDesignSystem: (system) => set({ designSystem: system }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export { defaultDesignSystem };
