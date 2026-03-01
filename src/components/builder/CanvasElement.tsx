'use client';

import { useState, useCallback, useRef } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { cn, cssPropertiesToString } from '@/lib/utils';
import type { ElementType } from '@/types/builder';

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
  const contentRef = useRef<HTMLDivElement>(null);

  if (!element || element.hidden) return null;

  const isSelected = selectedElementId === elementId;
  const isHovered = hoveredElementId === elementId;

  // Merge responsive styles
  const mergedStyles = {
    ...element.styles,
    ...(breakpoint === 'tablet' ? element.responsiveStyles?.tablet : {}),
    ...(breakpoint === 'mobile' ? element.responsiveStyles?.mobile : {}),
  };

  const styleString = Object.entries(mergedStyles)
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

  const isContainer = element.children !== undefined;

  // Context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectElement(elementId);
    // Could show context menu here
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
      style={styleString as React.CSSProperties}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => hoverElement(elementId)}
      onMouseLeave={() => hoverElement(null)}
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
      {isEditing ? (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          className="outline-none min-w-[20px]"
          dangerouslySetInnerHTML={{ __html: element.content || '' }}
        />
      ) : element.tag === 'img' ? (
        <img
          src={element.src || '/api/placeholder/800/400'}
          alt={element.alt || ''}
          className="pointer-events-none"
          style={{ width: '100%', height: 'auto' }}
        />
      ) : isContainer ? (
        <>
          {element.children && element.children.length > 0 ? (
            element.children.map(childId => (
              <CanvasElement key={childId} elementId={childId} />
            ))
          ) : (
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg m-2 opacity-50">
              <span className="text-xs text-surface-400">Drop elements here</span>
            </div>
          )}
        </>
      ) : (
        <span>{element.content}</span>
      )}

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
