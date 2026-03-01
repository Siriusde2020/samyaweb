// ============================================
// BUILDER ELEMENT TYPES
// ============================================

export type ElementType =
  // Layout
  | 'section'
  | 'container'
  | 'columns'
  | 'column'
  // Basic
  | 'text'
  | 'heading'
  | 'image'
  | 'video'
  | 'button'
  | 'link'
  | 'icon'
  | 'divider'
  | 'spacer'
  | 'shape'
  // Forms
  | 'form'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'label'
  // Rich elements
  | 'embed'
  | 'code'
  | 'map'
  | 'list'
  | 'accordion'
  | 'tabs'
  | 'slider'
  | 'gallery'
  | 'table'
  // Page sections
  | 'navbar'
  | 'footer'
  | 'sidebar'
  | 'modal'
  | 'hero'
  | 'cta'
  | 'feature-grid'
  // Commerce
  | 'collection-list'
  | 'product-card'
  | 'cart-button'
  // Social / Misc
  | 'search'
  | 'social-links'
  | 'countdown'
  | 'progress'
  | 'testimonial'
  | 'pricing-table'
  // Widgets
  | 'rating'
  | 'badge'
  | 'alert'
  | 'breadcrumb'
  | 'pagination'
  | 'figure'
  | 'blockquote'
  | 'audio'
  | 'flip-box'
  | 'counter'
  | 'image-compare'
  | 'lottie'
  // Custom
  | 'custom';

export interface BuilderElement {
  id: string;
  type: ElementType;
  tag?: string;
  content?: string;
  src?: string;
  href?: string;
  alt?: string;
  placeholder?: string;
  children?: string[]; // Child element IDs
  parentId?: string | null;
  styles: ElementStyles;
  responsiveStyles?: {
    tablet?: Partial<ElementStyles>;
    mobile?: Partial<ElementStyles>;
  };
  props?: Record<string, string>;
  attributes?: Record<string, string>;
  animations?: Animation[];
  hoverStyles?: Partial<ElementStyles>;
  interactions?: Interaction[];
  dataBinding?: DataBinding;
  conditions?: DisplayCondition[];
  locked?: boolean;
  hidden?: boolean;
  label?: string; // Custom label in layers panel
}

export interface ElementStyles {
  // Layout
  display?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  overflow?: string;
  zIndex?: number;

  // Flexbox
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  gap?: string;
  flex?: string;
  alignSelf?: string;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  gridGap?: string;

  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  color?: string;
  whiteSpace?: string;
  wordBreak?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  gradient?: string;

  // Border
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;

  // Shadow & Effects
  boxShadow?: string;
  textShadow?: string;
  opacity?: number;
  filter?: string;
  backdropFilter?: string;
  mixBlendMode?: string;

  // Transform
  transform?: string;
  transformOrigin?: string;
  transition?: string;

  // Cursor
  cursor?: string;
  pointerEvents?: string;

  // Custom
  [key: string]: string | number | undefined;
}

export interface Animation {
  type: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'bounce' | 'custom';
  trigger: 'onLoad' | 'onScroll' | 'onHover' | 'onClick';
  duration: number;
  delay: number;
  easing: string;
  repeat?: boolean;
  customKeyframes?: string;
}

export interface Interaction {
  trigger: 'click' | 'hover' | 'scroll' | 'load';
  action: 'navigate' | 'toggle' | 'animate' | 'openModal' | 'submitForm' | 'scrollTo' | 'custom';
  target?: string;
  value?: string;
}

export interface DataBinding {
  collectionId: string;
  field: string;
  fallback?: string;
}

export interface DisplayCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'exists';
  value: string;
}

// ============================================
// BUILDER STATE
// ============================================

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export interface BuilderState {
  // Page
  siteId: string;
  pageId: string;
  pageName: string;
  pageSlug: string;

  // Elements
  elements: Record<string, BuilderElement>;
  rootElementIds: string[];
  selectedElementId: string | null;
  hoveredElementId: string | null;
  copiedElementId: string | null;

  // Canvas
  breakpoint: Breakpoint;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Panels
  leftPanel: 'elements' | 'layers' | 'pages' | 'components' | 'navigator' | 'blocks' | null;
  rightPanel: 'style' | 'settings' | 'data' | 'animations' | 'interactions' | null;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Status
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastSaved: string | null;
}

export interface HistoryEntry {
  elements: Record<string, BuilderElement>;
  rootElementIds: string[];
  timestamp: number;
  action: string;
}

// ============================================
// DESIGN SYSTEM
// ============================================

export interface DesignSystem {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    custom: Record<string, string>;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    scale: number;
    lineHeight: number;
    headings: Record<string, TypographyStyle>;
    body: Record<string, TypographyStyle>;
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: Record<string, string>;
  breakpoints: {
    desktop: number;
    tablet: number;
    mobile: number;
    custom?: Record<string, number>;
  };
}

export interface TypographyStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
}

// ============================================
// TEMPLATES
// ============================================

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  industry?: string;
  thumbnail: string;
  preview: string;
  elements: Record<string, BuilderElement>;
  rootElementIds: string[];
  designSystem: DesignSystem;
  pages: TemplatePage[];
  featured: boolean;
  downloads: number;
}

export type TemplateCategory =
  | 'landing'
  | 'onepage'
  | 'blog'
  | 'corporate'
  | 'startup'
  | 'ecommerce'
  | 'portfolio'
  | 'saas'
  | 'agency'
  | 'restaurant'
  | 'travel'
  | 'law'
  | 'medical'
  | 'education'
  | 'nonprofit'
  | 'personal';

export interface TemplatePage {
  name: string;
  slug: string;
  elements: Record<string, BuilderElement>;
  rootElementIds: string[];
}

// ============================================
// CMS TYPES
// ============================================

export type FieldType =
  | 'text'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'image'
  | 'file'
  | 'color'
  | 'select'
  | 'multiselect'
  | 'reference'
  | 'json'
  | 'slug'
  | 'markdown';

export interface CollectionField {
  id: string;
  name: string;
  slug: string;
  type: FieldType;
  required: boolean;
  unique?: boolean;
  defaultValue?: unknown;
  validation?: FieldValidation;
  options?: string[]; // For select/multiselect
  referenceCollection?: string; // For reference type
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportConfig {
  format: 'html' | 'nextjs' | 'gatsby' | 'zip';
  includeAssets: boolean;
  minify: boolean;
  cleanCode: boolean;
}

export interface ExportResult {
  files: ExportFile[];
  totalSize: number;
}

export interface ExportFile {
  path: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'image';
  size: number;
}
