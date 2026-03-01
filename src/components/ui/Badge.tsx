'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
    success: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      variants[variant],
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {children}
    </span>
  );
}
