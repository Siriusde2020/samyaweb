'use client';

import { useBuilderStore } from '@/lib/store/builder-store';
import { cn } from '@/lib/utils';

export function LayersPanel() {
  const {
    elements,
    rootElementIds,
    selectedElementId,
    selectElement,
    updateElement,
    deleteElement,
  } = useBuilderStore();

  const renderLayer = (elementId: string, depth: number = 0) => {
    const element = elements[elementId];
    if (!element) return null;

    const isSelected = selectedElementId === elementId;
    const hasChildren = element.children && element.children.length > 0;

    return (
      <div key={elementId}>
        <div
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors text-sm group',
            isSelected
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
              : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectElement(elementId)}
        >
          {/* Expand indicator */}
          {hasChildren && (
            <svg className="w-3 h-3 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
          {!hasChildren && <span className="w-3" />}

          {/* Type indicator */}
          <span className="text-[10px] font-medium text-surface-400 uppercase w-5">
            {element.type.charAt(0).toUpperCase()}
          </span>

          {/* Label */}
          <span className="flex-1 truncate text-xs">
            {element.label || element.type}
            {element.content ? ` - ${element.content.substring(0, 20)}` : ''}
          </span>

          {/* Actions */}
          <div className="hidden group-hover:flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(elementId, { hidden: !element.hidden });
              }}
              className={cn('p-0.5 rounded', element.hidden ? 'text-surface-400' : 'text-surface-500')}
              title={element.hidden ? 'Show' : 'Hide'}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {element.hidden ? (
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(elementId, { locked: !element.locked });
              }}
              className="p-0.5 rounded text-surface-500"
              title={element.locked ? 'Unlock' : 'Lock'}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {element.locked ? (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </>
                ) : (
                  <>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 019.9-1" />
                  </>
                )}
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(elementId);
              }}
              className="p-0.5 rounded text-red-400 hover:text-red-500"
              title="Delete"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && element.children!.map(childId => renderLayer(childId, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-surface-200 dark:border-surface-700">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Layers</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {rootElementIds.length === 0 ? (
          <div className="p-4 text-center text-xs text-surface-400">
            No elements yet. Add elements to see them here.
          </div>
        ) : (
          rootElementIds.map(id => renderLayer(id))
        )}
      </div>
    </div>
  );
}
