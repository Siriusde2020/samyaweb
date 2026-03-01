'use client';

import { useCallback } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { CanvasElement } from './CanvasElement';
import { cn } from '@/lib/utils';
import type { ElementType, Breakpoint } from '@/types/builder';

const breakpointWidths: Record<Breakpoint, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function BuilderCanvas() {
  const {
    elements,
    rootElementIds,
    selectedElementId,
    breakpoint,
    zoom,
    showGrid,
    selectElement,
    addElement,
  } = useBuilderStore();

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  }, [selectElement]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    if (elementType) {
      addElement(elementType);
    }
  }, [addElement]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      className="w-full h-full overflow-auto bg-surface-100 dark:bg-surface-900 p-8"
      onClick={handleCanvasClick}
    >
      <div
        className="mx-auto transition-all duration-200"
        style={{
          width: breakpointWidths[breakpoint],
          maxWidth: breakpoint === 'desktop' ? '100%' : breakpointWidths[breakpoint],
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          className={cn(
            'min-h-[600px] bg-white dark:bg-surface-800 shadow-xl rounded-lg overflow-hidden transition-shadow',
            showGrid && 'canvas-grid'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {rootElementIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[600px] text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-3xl mb-4">
                +
              </div>
              <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Start Building
              </h3>
              <p className="text-sm text-surface-500 max-w-sm mb-6">
                Drag and drop elements from the left panel, or click an element to add it to the canvas.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => addElement('hero')}
                  className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Add Hero Section
                </button>
                <button
                  onClick={() => addElement('section')}
                  className="px-4 py-2 text-sm font-medium bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>
          ) : (
            rootElementIds.map(id => (
              <CanvasElement key={id} elementId={id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
