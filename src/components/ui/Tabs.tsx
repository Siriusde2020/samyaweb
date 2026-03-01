'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab?: string;
  onChange?: (id: string) => void;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Tabs({ tabs, activeTab, onChange, size = 'md' }: TabsProps) {
  const [active, setActive] = useState(activeTab || tabs[0]?.id);

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="flex border-b border-surface-200 dark:border-surface-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 border-b-2 transition-colors',
            size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm',
            (activeTab || active) === tab.id
              ? 'border-brand-600 text-brand-600 font-medium'
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
