'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { useSiteStore } from '@/lib/store/site-store';
import { Tooltip } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/Button';
import { PublishModal } from '@/components/builder/PublishModal';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function BuilderToolbar() {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const {
    breakpoint,
    setBreakpoint,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    leftPanel,
    setLeftPanel,
    rightPanel,
    setRightPanel,
    undo,
    redo,
    historyIndex,
    history,
    isDirty,
    isSaving,
    lastSaved,
  } = useBuilderStore();

  const { currentSite } = useSiteStore();

  const breakpoints = [
    { id: 'desktop' as const, label: 'Desktop', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )},
    { id: 'tablet' as const, label: 'Tablet', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    )},
    { id: 'mobile' as const, label: 'Mobile', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    )},
  ];

  return (
    <div className="h-12 flex items-center justify-between px-3 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700 z-40">
      {/* Left Controls */}
      <div className="flex items-center gap-1">
        <Link href="/dashboard" className="mr-2 p-1.5 text-surface-500 hover:text-surface-700 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>

        <div className="flex items-center gap-0.5 p-0.5 bg-surface-100 dark:bg-surface-800 rounded-lg">
          {[
            { id: 'elements' as const, label: 'Elements', icon: '⊞' },
            { id: 'blocks' as const, label: 'Blocks', icon: '🧩' },
            { id: 'layers' as const, label: 'Layers', icon: '☰' },
            { id: 'navigator' as const, label: 'Navigator', icon: '⊟' },
          ].map(panel => (
            <Tooltip key={panel.id} content={panel.label}>
              <button
                onClick={() => setLeftPanel(panel.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                  leftPanel === panel.id
                    ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                )}
              >
                {panel.icon}
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-2" />

        {/* Undo/Redo */}
        <Tooltip content="Undo (Ctrl+Z)">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="builder-btn disabled:opacity-30"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6M3 13a9 9 0 0 1 15.36-6.36" />
            </svg>
          </button>
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Shift+Z)">
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="builder-btn disabled:opacity-30"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6M21 13a9 9 0 0 0-15.36-6.36" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Center Controls - Breakpoint & Zoom */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5 p-0.5 bg-surface-100 dark:bg-surface-800 rounded-lg">
          {breakpoints.map(bp => (
            <Tooltip key={bp.id} content={bp.label}>
              <button
                onClick={() => setBreakpoint(bp.id)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  breakpoint === bp.id
                    ? 'bg-white dark:bg-surface-700 text-brand-600 shadow-sm'
                    : 'text-surface-400 hover:text-surface-600'
                )}
              >
                {bp.icon}
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(zoom - 0.1)} className="builder-btn text-xs">-</button>
          <span className="text-xs text-surface-500 font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(zoom + 0.1)} className="builder-btn text-xs">+</button>
        </div>

        <Tooltip content={showGrid ? 'Hide Grid' : 'Show Grid'}>
          <button
            onClick={toggleGrid}
            className={cn('builder-btn', showGrid && 'text-brand-600')}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {isDirty && (
          <span className="text-xs text-surface-400">
            {isSaving ? 'Saving...' : 'Unsaved changes'}
          </span>
        )}
        {lastSaved && !isDirty && (
          <span className="text-xs text-green-500">Saved</span>
        )}

        <Tooltip content="Preview">
          <button className="builder-btn">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </Tooltip>

        <Button variant="secondary" size="sm" onClick={() => setShowPublishModal(true)}>
          Export
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowPublishModal(true)}>
          Publish
        </Button>
      </div>

      {/* Publish Modal */}
      <PublishModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} />
    </div>
  );
}
