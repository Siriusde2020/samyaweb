'use client';

import { useBuilderStore } from '@/lib/store/builder-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function NavigatorPanel() {
  const { elements, rootElementIds, selectedElementId, selectElement } = useBuilderStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (id: string, depth: number = 0) => {
    const el = elements[id];
    if (!el) return null;

    const hasChildren = el.children && el.children.length > 0;
    const isExpanded = expanded.has(id);
    const isSelected = selectedElementId === id;

    return (
      <div key={id}>
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 cursor-pointer text-xs transition-colors',
            isSelected
              ? 'bg-brand-50 text-brand-700 font-medium'
              : 'text-surface-600 hover:bg-surface-50'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => selectElement(id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(id); }}
              className="p-0.5"
            >
              <svg className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-90')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="text-surface-400">&lt;</span>
          <span>{el.tag || 'div'}</span>
          <span className="text-surface-400">&gt;</span>
          {el.label && <span className="text-surface-400 ml-1 truncate">.{el.label}</span>}
        </div>
        {hasChildren && isExpanded && el.children!.map(childId => renderNode(childId, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-surface-200">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Navigator</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-1 font-mono">
        <div className="px-2 py-1 text-xs text-surface-400">&lt;body&gt;</div>
        {rootElementIds.map(id => renderNode(id, 1))}
        <div className="px-2 py-1 text-xs text-surface-400">&lt;/body&gt;</div>
      </div>
    </div>
  );
}
