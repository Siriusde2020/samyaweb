'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn, formatBytes } from '@/lib/utils';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  folder: string;
  createdAt: string;
}

const mockMedia: MediaItem[] = [
  { id: '1', filename: 'hero-image.jpg', url: '/placeholder', type: 'IMAGE', size: 245000, width: 1920, height: 1080, folder: 'images', createdAt: '2026-02-28' },
  { id: '2', filename: 'about-photo.png', url: '/placeholder', type: 'IMAGE', size: 182000, width: 800, height: 600, folder: 'images', createdAt: '2026-02-27' },
  { id: '3', filename: 'product-1.jpg', url: '/placeholder', type: 'IMAGE', size: 321000, width: 1200, height: 1200, folder: 'products', createdAt: '2026-02-26' },
  { id: '4', filename: 'intro-video.mp4', url: '/placeholder', type: 'VIDEO', size: 5240000, folder: 'videos', createdAt: '2026-02-25' },
  { id: '5', filename: 'brochure.pdf', url: '/placeholder', type: 'DOCUMENT', size: 1240000, folder: 'documents', createdAt: '2026-02-24' },
  { id: '6', filename: 'team-photo.jpg', url: '/placeholder', type: 'IMAGE', size: 198000, width: 1600, height: 900, folder: 'images', createdAt: '2026-02-23' },
];

export function MediaManager({ onSelect }: { onSelect?: (media: MediaItem) => void }) {
  const [media] = useState(mockMedia);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const filtered = media.filter(m => {
    const matchesSearch = !search || m.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = folder === 'all' || m.folder === folder;
    return matchesSearch && matchesFolder;
  });

  const folders = ['all', ...new Set(media.map(m => m.folder))];

  const typeIcons: Record<string, string> = {
    IMAGE: '🖼',
    VIDEO: '🎬',
    DOCUMENT: '📄',
    AUDIO: '🎵',
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <div className="flex items-center gap-1 p-0.5 bg-surface-100 rounded-lg">
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={cn(
                  'px-3 py-1 text-xs rounded-md capitalize',
                  folder === f ? 'bg-white shadow-sm text-surface-900 font-medium' : 'text-surface-500'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex p-0.5 bg-surface-100 rounded-lg">
            <button
              onClick={() => setView('grid')}
              className={cn('p-1.5 rounded-md', view === 'grid' ? 'bg-white shadow-sm' : '')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-1.5 rounded-md', view === 'list' ? 'bg-white shadow-sm' : '')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          </div>
          <Button onClick={() => setShowUpload(true)}>Upload Files</Button>
        </div>
      </div>

      {/* Media Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedMedia(item);
                onSelect?.(item);
              }}
              className={cn(
                'group rounded-xl border overflow-hidden text-left transition-all',
                selectedMedia?.id === item.id
                  ? 'border-brand-500 ring-2 ring-brand-200'
                  : 'border-surface-200 hover:border-surface-300 hover:shadow-md'
              )}
            >
              <div className="aspect-square bg-surface-100 flex items-center justify-center relative">
                {item.type === 'IMAGE' ? (
                  <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-300" />
                ) : (
                  <span className="text-3xl">{typeIcons[item.type]}</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-surface-900 truncate">{item.filename}</p>
                <p className="text-[10px] text-surface-400">{formatBytes(item.size)}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-200">
          {filtered.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedMedia(item);
                onSelect?.(item);
              }}
              className={cn(
                'w-full flex items-center gap-4 p-3 border-b border-surface-100 last:border-0 text-left hover:bg-surface-50 transition-colors',
                selectedMedia?.id === item.id && 'bg-brand-50'
              )}
            >
              <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {typeIcons[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">{item.filename}</p>
                <p className="text-xs text-surface-400">{item.folder}</p>
              </div>
              <span className="text-xs text-surface-400">{formatBytes(item.size)}</span>
              {item.width && (
                <span className="text-xs text-surface-400">{item.width}x{item.height}</span>
              )}
              <span className="text-xs text-surface-400">{item.createdAt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Files" size="md">
        <div className="border-2 border-dashed border-surface-300 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">📤</div>
          <p className="text-sm font-medium text-surface-700">Drag & drop files here</p>
          <p className="text-xs text-surface-400 mt-1">or click to browse</p>
          <p className="text-xs text-surface-400 mt-4">
            Supported: JPG, PNG, GIF, SVG, MP4, PDF, DOC (Max 50MB)
          </p>
          <p className="text-xs text-surface-400 mt-1">
            Images will be automatically optimized and converted to WebP
          </p>
        </div>
      </Modal>
    </div>
  );
}
