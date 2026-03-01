'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, onSelect, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={cn(
          'absolute top-full mt-1 z-50 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 py-1 min-w-[180px] animate-scale-in',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item, i) => (
            item.divider ? (
              <div key={i} className="my-1 border-t border-surface-200 dark:border-surface-700" />
            ) : (
              <button
                key={item.value}
                onClick={() => { onSelect(item.value); setIsOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                  item.danger
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
