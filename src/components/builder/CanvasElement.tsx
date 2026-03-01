'use client';

import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { cn } from '@/lib/utils';
import type { BuilderElement, ElementType } from '@/types/builder';

// ============================================
// ICON SVG MAP
// ============================================
const ICON_SVGS: Record<string, string> = {
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
};

// Social media SVG icons
const SOCIAL_ICONS: Record<string, string> = {
  twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  youtube: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
};

function SvgIcon({ name, size = 24, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const svgContent = ICON_SVGS[name];
  if (!svgContent) {
    return <span style={{ fontSize: size, color }}>{name}</span>;
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

function SocialIcon({ name, size = 20 }: { name: string; size?: number }) {
  const svgContent = SOCIAL_ICONS[name] || ICON_SVGS[name];
  if (!svgContent) return <span>{name}</span>;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// ============================================
// HELPERS
// ============================================

/** Parse a YouTube/Vimeo URL to get an embed URL */
function getVideoEmbedUrl(src: string): string | null {
  if (!src) return null;
  // YouTube
  const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

/** Parse list content: supports newline-separated items or JSON array */
function parseListItems(content?: string): string[] {
  if (!content) return ['List item 1', 'List item 2', 'List item 3'];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON - split by newlines
  }
  return content.split('\n').filter(Boolean);
}

/** Parse select options */
function parseSelectOptions(content?: string): string[] {
  if (!content) return ['Option 1', 'Option 2', 'Option 3'];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON
  }
  return content.split('\n').filter(Boolean);
}

/** Parse accordion/tabs sections: expects JSON array of { title, content } */
function parseSections(content?: string): Array<{ title: string; content: string }> {
  if (!content) {
    return [
      { title: 'Section 1', content: 'Content for section 1' },
      { title: 'Section 2', content: 'Content for section 2' },
      { title: 'Section 3', content: 'Content for section 3' },
    ];
  }
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON
  }
  return [{ title: 'Section 1', content }];
}

/** Parse slider/gallery images: expects JSON array of { src, alt } or newline-separated URLs */
function parseGalleryImages(content?: string, src?: string): Array<{ src: string; alt: string }> {
  const fallback = [
    { src: '', alt: 'Slide 1' },
    { src: '', alt: 'Slide 2' },
    { src: '', alt: 'Slide 3' },
  ];
  if (!content && !src) return fallback;
  const text = content || src || '';
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON
  }
  const urls = text.split('\n').filter(Boolean);
  if (urls.length > 0) return urls.map((u, i) => ({ src: u.trim(), alt: `Slide ${i + 1}` }));
  return fallback;
}

/** Parse pricing features: expects JSON { name, price, period, features[], cta } */
function parsePricing(content?: string) {
  const fallback = {
    name: 'Pro Plan',
    price: '$29',
    period: '/month',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    cta: 'Get Started',
  };
  if (!content) return fallback;
  try {
    return { ...fallback, ...JSON.parse(content) };
  } catch {
    return { ...fallback, name: content };
  }
}

// ============================================
// CANVAS ELEMENT COMPONENT
// ============================================

interface CanvasElementProps {
  elementId: string;
}

export function CanvasElement({ elementId }: CanvasElementProps) {
  const element = useBuilderStore(s => s.elements[elementId]);
  const selectedElementId = useBuilderStore(s => s.selectedElementId);
  const hoveredElementId = useBuilderStore(s => s.hoveredElementId);
  const breakpoint = useBuilderStore(s => s.breakpoint);
  const {
    selectElement,
    hoverElement,
    updateElement,
    addElement,
    moveElement,
    deleteElement,
    duplicateElement,
  } = useBuilderStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showDropIndicator, setShowDropIndicator] = useState(false);
  const [isHoverStyleActive, setIsHoverStyleActive] = useState(false);
  // Interactive element states
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!element || element.hidden) return null;

  const isSelected = selectedElementId === elementId;
  const isHovered = hoveredElementId === elementId;

  // Merge responsive styles
  const mergedStyles: Record<string, string | number | undefined> = {
    ...element.styles,
    ...(breakpoint === 'tablet' ? element.responsiveStyles?.tablet : {}),
    ...(breakpoint === 'mobile' ? element.responsiveStyles?.mobile : {}),
    ...(isHoverStyleActive && element.hoverStyles ? element.hoverStyles : {}),
  };

  const styleObject = Object.entries(mergedStyles)
    .filter(([, v]) => v !== undefined && v !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(elementId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (['text', 'heading', 'button', 'link'].includes(element.type)) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing && contentRef.current) {
      updateElement(elementId, { content: contentRef.current.textContent || '' });
      setIsEditing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const elementType = e.dataTransfer.types.includes('elementType');
    if (elementType && element.children !== undefined) {
      setShowDropIndicator(true);
    }
  };

  const handleDragLeave = () => {
    setShowDropIndicator(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropIndicator(false);

    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    if (elementType && element.children !== undefined) {
      addElement(elementType, elementId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectElement(elementId);
  };

  const handleMouseEnter = () => {
    hoverElement(elementId);
    if (element.hoverStyles) {
      setIsHoverStyleActive(true);
    }
  };

  const handleMouseLeave = () => {
    hoverElement(null);
    if (element.hoverStyles) {
      setIsHoverStyleActive(false);
    }
  };

  // ============================================
  // RENDER ELEMENT CONTENT
  // ============================================
  const renderContent = (): React.ReactNode => {
    // Inline editing mode for text-editable elements
    if (isEditing) {
      return (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="outline-none min-w-[20px]"
          dangerouslySetInnerHTML={{ __html: element.content || '' }}
        />
      );
    }

    switch (element.type) {
      // ------------------------------------------
      // LAYOUT CONTAINERS
      // ------------------------------------------
      case 'section':
      case 'container':
      case 'columns':
      case 'column':
        return renderChildren();

      // ------------------------------------------
      // TEXT
      // ------------------------------------------
      case 'text': {
        const Tag = (element.tag as 'p' | 'span' | 'div') || 'p';
        return <Tag>{element.content || 'Start typing here...'}</Tag>;
      }

      case 'heading': {
        const level = element.tag || 'h2';
        const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return <Tag style={{ margin: 0 }}>{element.content || 'Heading'}</Tag>;
      }

      // ------------------------------------------
      // IMAGE
      // ------------------------------------------
      case 'image': {
        const imgSrc = element.src || element.attributes?.src;
        if (imgSrc) {
          return (
            <img
              src={imgSrc}
              alt={element.alt || element.attributes?.alt || 'Image'}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              className="pointer-events-none"
            />
          );
        }
        // Gradient placeholder
        return (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        );
      }

      // ------------------------------------------
      // VIDEO
      // ------------------------------------------
      case 'video': {
        const videoSrc = element.src || element.attributes?.src || '';
        const embedUrl = getVideoEmbedUrl(videoSrc);
        if (embedUrl) {
          return (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
              <iframe
                src={embedUrl}
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="pointer-events-none"
              />
            </div>
          );
        }
        if (videoSrc) {
          return (
            <video
              src={videoSrc}
              controls
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              className="pointer-events-none"
            />
          );
        }
        // Placeholder
        return (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        );
      }

      // ------------------------------------------
      // BUTTON
      // ------------------------------------------
      case 'button': {
        const btnContent = element.content || 'Click Me';
        if (element.href) {
          return (
            <a
              href={element.href}
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
              className="pointer-events-none"
            >
              {btnContent}
            </a>
          );
        }
        return (
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              cursor: 'pointer',
              padding: 0,
            }}
            className="pointer-events-none"
          >
            {btnContent}
          </button>
        );
      }

      // ------------------------------------------
      // LINK
      // ------------------------------------------
      case 'link': {
        return (
          <a
            href={element.href || '#'}
            onClick={(e) => e.preventDefault()}
            style={{ color: element.styles.color || '#4c6ef5', textDecoration: 'underline' }}
            className="pointer-events-none"
          >
            {element.content || 'Link text'}
          </a>
        );
      }

      // ------------------------------------------
      // ICON
      // ------------------------------------------
      case 'icon': {
        const iconName = element.content || 'star';
        const iconSize = parseInt(element.styles.fontSize || '24', 10);
        const iconColor = element.styles.color || '#4c6ef5';
        return <SvgIcon name={iconName} size={iconSize} color={iconColor} />;
      }

      // ------------------------------------------
      // DIVIDER
      // ------------------------------------------
      case 'divider': {
        return (
          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: `${element.styles.height || '1px'} solid ${element.styles.borderColor || element.styles.backgroundColor || '#e0e0e0'}`,
              margin: 0,
            }}
          />
        );
      }

      // ------------------------------------------
      // SPACER
      // ------------------------------------------
      case 'spacer': {
        return <div style={{ width: '100%', height: element.styles.height || '40px' }} />;
      }

      // ------------------------------------------
      // SHAPE
      // ------------------------------------------
      case 'shape': {
        const shapeType = element.content || 'rectangle';
        const shapeColor = element.styles.backgroundColor || '#4c6ef5';
        const w = 200;
        const h = 200;
        let shapeEl: React.ReactNode;
        switch (shapeType) {
          case 'circle':
            shapeEl = <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2} fill={shapeColor} />;
            break;
          case 'triangle':
            shapeEl = <polygon points={`${w / 2},4 ${w - 4},${h - 4} 4,${h - 4}`} fill={shapeColor} />;
            break;
          case 'diamond':
            shapeEl = <polygon points={`${w / 2},4 ${w - 4},${h / 2} ${w / 2},${h - 4} 4,${h / 2}`} fill={shapeColor} />;
            break;
          case 'star':
            shapeEl = (
              <polygon
                points="100,10 123,78 195,78 135,120 155,190 100,148 45,190 65,120 5,78 77,78"
                fill={shapeColor}
              />
            );
            break;
          default: // rectangle
            shapeEl = <rect x="2" y="2" width={w - 4} height={h - 4} rx="8" fill={shapeColor} />;
        }
        return (
          <svg
            viewBox={`0 0 ${w} ${h}`}
            style={{ width: element.styles.width || '100px', height: element.styles.height || '100px' }}
          >
            {shapeEl}
          </svg>
        );
      }

      // ------------------------------------------
      // FORM ELEMENTS
      // ------------------------------------------
      case 'form': {
        return (
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
          >
            {renderChildren()}
          </form>
        );
      }

      case 'input': {
        return (
          <input
            type={element.attributes?.type || 'text'}
            placeholder={element.placeholder || element.attributes?.placeholder || 'Enter text...'}
            readOnly
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#333',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        );
      }

      case 'textarea': {
        return (
          <textarea
            placeholder={element.placeholder || element.attributes?.placeholder || 'Enter text...'}
            readOnly
            rows={4}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#333',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            defaultValue={element.content || ''}
          />
        );
      }

      case 'select': {
        const options = parseSelectOptions(element.content);
        return (
          <select
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#333',
              outline: 'none',
              boxSizing: 'border-box',
              appearance: 'auto',
            }}
            onChange={(e) => e.preventDefault()}
          >
            {element.placeholder && (
              <option value="" disabled selected>
                {element.placeholder}
              </option>
            )}
            {options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      }

      case 'checkbox': {
        return (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#333',
              cursor: 'default',
            }}
          >
            <input
              type="checkbox"
              readOnly
              style={{ width: '18px', height: '18px', accentColor: '#4c6ef5' }}
            />
            <span>{element.content || 'Checkbox label'}</span>
          </label>
        );
      }

      // ------------------------------------------
      // EMBED
      // ------------------------------------------
      case 'embed': {
        const embedSrc = element.src || element.attributes?.src || '';
        if (embedSrc) {
          return (
            <iframe
              src={embedSrc}
              style={{
                width: '100%',
                height: element.styles.height || '400px',
                border: 'none',
                borderRadius: '8px',
              }}
              className="pointer-events-none"
            />
          );
        }
        return (
          <div
            style={{
              width: '100%',
              height: '200px',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '2px dashed #ccc',
              color: '#999',
              fontSize: '14px',
            }}
          >
            Embed - Set a URL in properties
          </div>
        );
      }

      // ------------------------------------------
      // CODE
      // ------------------------------------------
      case 'code': {
        return (
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '16px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
              overflow: 'auto',
              margin: 0,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <code>{element.content || '// Your code here\nconsole.log("Hello, world!");'}</code>
          </pre>
        );
      }

      // ------------------------------------------
      // MAP
      // ------------------------------------------
      case 'map': {
        const mapSrc = element.src || element.attributes?.src;
        if (mapSrc) {
          return (
            <iframe
              src={mapSrc}
              style={{
                width: '100%',
                height: element.styles.height || '300px',
                border: 'none',
                borderRadius: '8px',
              }}
              className="pointer-events-none"
            />
          );
        }
        // Default OpenStreetMap embed
        return (
          <div style={{ position: 'relative', width: '100%', height: element.styles.height || '300px', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1318359375%2C51.4868433%2C-0.0549316406%2C51.5228051&layer=mapnik"
              style={{ width: '100%', height: '100%', border: 'none' }}
              className="pointer-events-none"
            />
          </div>
        );
      }

      // ------------------------------------------
      // LIST
      // ------------------------------------------
      case 'list': {
        const items = parseListItems(element.content);
        const isOrdered = element.tag === 'ol' || element.attributes?.type === 'ordered';
        const Tag = isOrdered ? 'ol' : 'ul';
        return (
          <Tag
            style={{
              margin: 0,
              paddingLeft: '24px',
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333',
            }}
          >
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </Tag>
        );
      }

      // ------------------------------------------
      // ACCORDION
      // ------------------------------------------
      case 'accordion': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        const sections = parseSections(element.content);
        return (
          <div style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            {sections.map((section, i) => (
              <div key={i} style={{ borderBottom: i < sections.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveAccordion(activeAccordion === i ? -1 : i); }}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: activeAccordion === i ? '#f8f9fa' : '#fff',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#333',
                  }}
                >
                  {section.title}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transition: 'transform 0.2s',
                      transform: activeAccordion === i ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {activeAccordion === i && (
                  <div style={{ padding: '16px 20px', backgroundColor: '#fff', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      // ------------------------------------------
      // TABS
      // ------------------------------------------
      case 'tabs': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        const tabSections = parseSections(element.content);
        return (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #e0e0e0', gap: '0' }}>
              {tabSections.map((tab, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveTab(i); }}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderBottom: activeTab === i ? '2px solid #4c6ef5' : '2px solid transparent',
                    marginBottom: '-2px',
                    background: 'transparent',
                    color: activeTab === i ? '#4c6ef5' : '#666',
                    fontWeight: activeTab === i ? '600' : '400',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div style={{ padding: '20px 0', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
              {tabSections[activeTab]?.content || ''}
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // SLIDER / GALLERY
      // ------------------------------------------
      case 'slider':
      case 'gallery': {
        const images = parseGalleryImages(element.content, element.src);
        const safeSlide = Math.min(currentSlide, images.length - 1);
        return (
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                background: images[safeSlide]?.src
                  ? `url(${images[safeSlide].src}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][safeSlide % 5]} 0%, ${['#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][safeSlide % 5]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s ease',
              }}
            >
              {!images[safeSlide]?.src && (
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                  {images[safeSlide]?.alt || `Slide ${safeSlide + 1}`}
                </span>
              )}
            </div>
            {/* Prev/Next buttons */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(safeSlide > 0 ? safeSlide - 1 : images.length - 1);
              }}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(safeSlide < images.length - 1 ? safeSlide + 1 : 0);
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {/* Dots indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
              }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: i === safeSlide ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // NAVBAR
      // ------------------------------------------
      case 'navbar': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        return (
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontWeight: '700', fontSize: '20px', color: '#1a1a1a' }}>
              {element.content || 'Logo'}
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {['Home', 'About', 'Services', 'Contact'].map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ textDecoration: 'none', color: '#555', fontSize: '14px', fontWeight: '500' }}
                  className="pointer-events-none"
                >
                  {link}
                </a>
              ))}
              <button
                type="button"
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#4c6ef5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                className="pointer-events-none"
              >
                Get Started
              </button>
            </div>
          </nav>
        );
      }

      // ------------------------------------------
      // FOOTER
      // ------------------------------------------
      case 'footer': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        return (
          <footer style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '32px' }}>
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#fff' }}>Company</h4>
                {['About', 'Careers', 'Press'].map((link) => (
                  <a key={link} href="#" onClick={(e) => e.preventDefault()} style={{ display: 'block', color: '#999', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }} className="pointer-events-none">{link}</a>
                ))}
              </div>
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#fff' }}>Product</h4>
                {['Features', 'Pricing', 'Docs'].map((link) => (
                  <a key={link} href="#" onClick={(e) => e.preventDefault()} style={{ display: 'block', color: '#999', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }} className="pointer-events-none">{link}</a>
                ))}
              </div>
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#fff' }}>Resources</h4>
                {['Blog', 'Help Center', 'Community'].map((link) => (
                  <a key={link} href="#" onClick={(e) => e.preventDefault()} style={{ display: 'block', color: '#999', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }} className="pointer-events-none">{link}</a>
                ))}
              </div>
              <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: '#fff' }}>Legal</h4>
                {['Privacy', 'Terms', 'Cookie Policy'].map((link) => (
                  <a key={link} href="#" onClick={(e) => e.preventDefault()} style={{ display: 'block', color: '#999', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }} className="pointer-events-none">{link}</a>
                ))}
              </div>
            </div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              {element.content || '\u00A9 2025 Company. All rights reserved.'}
            </div>
          </footer>
        );
      }

      // ------------------------------------------
      // SIDEBAR
      // ------------------------------------------
      case 'sidebar': {
        if (element.children && element.children.length > 0) {
          return (
            <aside style={{ width: '100%' }}>
              {renderChildren()}
            </aside>
          );
        }
        return (
          <aside
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#555',
            }}
          >
            {element.content || 'Sidebar content'}
          </aside>
        );
      }

      // ------------------------------------------
      // MODAL
      // ------------------------------------------
      case 'modal': {
        return (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              margin: '0 auto',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {element.content || 'Modal Title'}
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '4px',
                }}
                className="pointer-events-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <div style={{ padding: '20px' }}>
              {element.children && element.children.length > 0
                ? renderChildren()
                : <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>Modal content goes here.</p>
              }
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // HERO
      // ------------------------------------------
      case 'hero': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              minHeight: '400px',
              background: element.styles.backgroundImage || element.styles.backgroundColor
                ? undefined
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '60px 20px',
            }}
          >
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', margin: '0 0 16px', lineHeight: '1.1' }}>
              {element.content || 'Build Something Amazing'}
            </h1>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 0 32px', lineHeight: '1.5' }}>
              Create stunning websites with our powerful visual builder. No coding required.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#fff',
                  color: '#4c6ef5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
                className="pointer-events-none"
              >
                Get Started
              </button>
              <button
                type="button"
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                className="pointer-events-none"
              >
                Learn More
              </button>
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // CTA
      // ------------------------------------------
      case 'cta': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              padding: '48px 24px',
              background: element.styles.backgroundColor ? undefined : 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)',
              borderRadius: '12px',
            }}
          >
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', margin: '0 0 12px' }}>
              {element.content || 'Ready to get started?'}
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', maxWidth: '500px' }}>
              Join thousands of creators building their dream websites today.
            </p>
            <button
              type="button"
              style={{
                padding: '14px 32px',
                backgroundColor: '#fff',
                color: '#4c6ef5',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
              className="pointer-events-none"
            >
              Start Free Trial
            </button>
          </div>
        );
      }

      // ------------------------------------------
      // FEATURE GRID
      // ------------------------------------------
      case 'feature-grid': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        const features = [
          { icon: 'zap', title: 'Lightning Fast', desc: 'Optimized for speed and performance.' },
          { icon: 'shield', title: 'Secure', desc: 'Enterprise-grade security built in.' },
          { icon: 'globe', title: 'Global CDN', desc: 'Content delivered worldwide.' },
          { icon: 'users', title: 'Team Ready', desc: 'Collaborate with your whole team.' },
          { icon: 'settings', title: 'Customizable', desc: 'Tailor everything to your needs.' },
          { icon: 'check', title: 'Reliable', desc: '99.9% uptime guaranteed.' },
        ];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  <SvgIcon name={f.icon} size={32} color="#4c6ef5" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        );
      }

      // ------------------------------------------
      // COLLECTION LIST
      // ------------------------------------------
      case 'collection-list': {
        if (element.children && element.children.length > 0) {
          return renderChildren();
        }
        const items = [
          { title: 'Item 1', desc: 'Description for item 1' },
          { title: 'Item 2', desc: 'Description for item 2' },
          { title: 'Item 3', desc: 'Description for item 3' },
          { title: 'Item 4', desc: 'Description for item 4' },
          { title: 'Item 5', desc: 'Description for item 5' },
          { title: 'Item 6', desc: 'Description for item 6' },
        ];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: `linear-gradient(135deg, ${['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'][i % 6]}, ${['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#fee140', '#fa709a'][i % 6]})`,
                  }}
                />
                <div style={{ padding: '16px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#333' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }

      // ------------------------------------------
      // PRODUCT CARD
      // ------------------------------------------
      case 'product-card': {
        const productSrc = element.src || element.attributes?.src;
        let productData = { title: 'Product Name', price: '$49.99', desc: 'Premium quality product.' };
        if (element.content) {
          try { productData = { ...productData, ...JSON.parse(element.content) }; } catch { productData.title = element.content; }
        }
        return (
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', maxWidth: '320px' }}>
            {productSrc ? (
              <img src={productSrc} alt={element.alt || productData.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} className="pointer-events-none" />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#333' }}>{productData.title}</h3>
              <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#666' }}>{productData.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#333' }}>{productData.price}</span>
                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4c6ef5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  className="pointer-events-none"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // CART BUTTON
      // ------------------------------------------
      case 'cart-button': {
        return (
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: element.styles.backgroundColor || '#4c6ef5',
              color: element.styles.color || '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            className="pointer-events-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {element.content || 'Add to Cart'}
          </button>
        );
      }

      // ------------------------------------------
      // SEARCH
      // ------------------------------------------
      case 'search': {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '400px',
              boxSizing: 'border-box',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={element.placeholder || element.content || 'Search...'}
              readOnly
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '15px',
                color: '#333',
                background: 'transparent',
                width: '100%',
              }}
            />
          </div>
        );
      }

      // ------------------------------------------
      // SOCIAL LINKS
      // ------------------------------------------
      case 'social-links': {
        const platforms = ['twitter', 'facebook', 'instagram', 'linkedin', 'github', 'youtube'];
        return (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {platforms.map((platform) => (
              <a
                key={platform}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  color: '#555',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                className="pointer-events-none"
              >
                <SocialIcon name={platform} size={18} />
              </a>
            ))}
          </div>
        );
      }

      // ------------------------------------------
      // COUNTDOWN
      // ------------------------------------------
      case 'countdown': {
        // Static display for builder
        const parts = [
          { label: 'Days', value: '12' },
          { label: 'Hours', value: '08' },
          { label: 'Minutes', value: '45' },
          { label: 'Seconds', value: '30' },
        ];
        return (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            {parts.map((part) => (
              <div
                key={part.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  minWidth: '80px',
                }}
              >
                <span style={{ fontSize: '36px', fontWeight: '800', color: '#333', lineHeight: '1' }}>{part.value}</span>
                <span style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{part.label}</span>
              </div>
            ))}
          </div>
        );
      }

      // ------------------------------------------
      // PROGRESS
      // ------------------------------------------
      case 'progress': {
        let percent = 65;
        if (element.content) {
          const parsed = parseInt(element.content, 10);
          if (!isNaN(parsed)) percent = Math.max(0, Math.min(100, parsed));
        }
        return (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>
                {element.attributes?.label || 'Progress'}
              </span>
              <span style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>{percent}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  backgroundColor: element.styles.backgroundColor || '#4c6ef5',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // TESTIMONIAL
      // ------------------------------------------
      case 'testimonial': {
        let testimonialData = {
          quote: 'This product has completely transformed how we work. Highly recommended!',
          author: 'Jane Smith',
          role: 'CEO at TechCorp',
        };
        if (element.content) {
          try { testimonialData = { ...testimonialData, ...JSON.parse(element.content) }; } catch { testimonialData.quote = element.content; }
        }
        return (
          <div
            style={{
              padding: '32px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              borderLeft: '4px solid #4c6ef5',
              maxWidth: '600px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4c6ef5" opacity="0.2" style={{ marginBottom: '12px' }}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', margin: '0 0 20px', fontStyle: 'italic' }}>
              &ldquo;{testimonialData.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Avatar placeholder */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4c6ef5, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                {testimonialData.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px', color: '#333' }}>{testimonialData.author}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>{testimonialData.role}</div>
              </div>
            </div>
          </div>
        );
      }

      // ------------------------------------------
      // PRICING TABLE
      // ------------------------------------------
      case 'pricing-table': {
        const pricing = parsePricing(element.content);
        return (
          <div
            style={{
              border: '2px solid #e0e0e0',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              maxWidth: '360px',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 8px' }}>{pricing.name}</h3>
            <div style={{ margin: '0 0 24px' }}>
              <span style={{ fontSize: '48px', fontWeight: '800', color: '#333' }}>{pricing.price}</span>
              <span style={{ fontSize: '16px', color: '#888' }}>{pricing.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', textAlign: 'left' }}>
              {pricing.features.map((feature: string, i: number) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    borderBottom: i < pricing.features.length - 1 ? '1px solid #f0f0f0' : 'none',
                    fontSize: '15px',
                    color: '#555',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#4c6ef5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
              className="pointer-events-none"
            >
              {pricing.cta}
            </button>
          </div>
        );
      }

      // ------------------------------------------
      // CUSTOM
      // ------------------------------------------
      case 'custom': {
        if (element.content) {
          return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
        }
        return (
          <div style={{ padding: '16px', border: '2px dashed #ccc', borderRadius: '8px', color: '#999', textAlign: 'center', fontSize: '14px' }}>
            Custom HTML - Set content in properties
          </div>
        );
      }

      // ------------------------------------------
      // FALLBACK for any unknown type
      // ------------------------------------------
      default: {
        // If it has children, render as container
        if (element.children !== undefined) {
          return renderChildren();
        }
        // Otherwise render content as span
        return <span>{element.content || element.type}</span>;
      }
    }
  };

  /** Render child elements or empty drop zone */
  const renderChildren = (): React.ReactNode => {
    if (element.children && element.children.length > 0) {
      return element.children.map((childId) => (
        <CanvasElement key={childId} elementId={childId} />
      ));
    }
    return (
      <div className="flex items-center justify-center p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg m-2 opacity-50">
        <span className="text-xs text-surface-400">Drop elements here</span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'relative group',
        isSelected && 'element-selected',
        isHovered && !isSelected && 'element-highlight',
        element.locked && 'pointer-events-none opacity-60',
        showDropIndicator && 'ring-2 ring-brand-400 ring-dashed',
      )}
      style={styleObject as React.CSSProperties}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      data-element-id={elementId}
      data-element-type={element.type}
    >
      {/* Element Label */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-5 left-0 z-20 flex items-center gap-1">
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-brand-600 text-white rounded">
            {element.label || element.type}
          </span>
        </div>
      )}

      {/* Action buttons */}
      {isSelected && (
        <div className="absolute -top-5 right-0 z-20 flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); duplicateElement(elementId); }}
            className="p-0.5 bg-surface-700 text-white rounded hover:bg-surface-600 transition-colors"
            title="Duplicate"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteElement(elementId); }}
            className="p-0.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      {renderContent()}

      {/* Resize handles */}
      {isSelected && !element.locked && (
        <>
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-brand-600 rounded-full cursor-ew-resize z-20" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-brand-600 rounded-full cursor-ns-resize z-20" />
          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-brand-600 rounded-full cursor-nwse-resize z-20" />
        </>
      )}
    </div>
  );
}
