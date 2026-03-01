'use client';

import { useEffect, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { BuilderToolbar } from './BuilderToolbar';
import { ElementsPanel } from './ElementsPanel';
import { LayersPanel } from './LayersPanel';
import { StylePanel } from './StylePanel';
import { BuilderCanvas } from './BuilderCanvas';
import { NavigatorPanel } from './NavigatorPanel';
import { cn } from '@/lib/utils';

export function BuilderLayout() {
  const {
    leftPanel,
    rightPanel,
    selectedElementId,
    undo,
    redo,
    deleteElement,
    copyElement,
    pasteElement,
    duplicateElement,
  } = useBuilderStore();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isCmd = e.metaKey || e.ctrlKey;

    if (isCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (isCmd && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    } else if (isCmd && e.key === 'c' && selectedElementId) {
      e.preventDefault();
      copyElement(selectedElementId);
    } else if (isCmd && e.key === 'v') {
      e.preventDefault();
      pasteElement();
    } else if (isCmd && e.key === 'd' && selectedElementId) {
      e.preventDefault();
      duplicateElement(selectedElementId);
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      // Only delete if not editing text
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        deleteElement(selectedElementId);
      }
    }
  }, [undo, redo, selectedElementId, copyElement, pasteElement, duplicateElement, deleteElement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-surface-100 dark:bg-surface-900 overflow-hidden">
      {/* Top Toolbar */}
      <BuilderToolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        {leftPanel && (
          <div className="w-64 flex-shrink-0 builder-panel overflow-y-auto animate-slide-in">
            {leftPanel === 'elements' && <ElementsPanel />}
            {leftPanel === 'layers' && <LayersPanel />}
            {leftPanel === 'navigator' && <NavigatorPanel />}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <BuilderCanvas />
        </div>

        {/* Right Panel */}
        {rightPanel && selectedElementId && (
          <div className="w-72 flex-shrink-0 builder-panel overflow-y-auto animate-slide-in">
            <StylePanel />
          </div>
        )}
      </div>
    </div>
  );
}
