'use client';

import { useState, useCallback, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useBuilderStore } from '@/lib/store/builder-store';
import { useSiteStore } from '@/lib/store/site-store';
import { formatBytes } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeployStatus = 'idle' | 'building' | 'deploying' | 'live' | 'error';

interface DeployState {
  status: DeployStatus;
  progress: number;
  liveUrl: string;
  previewUrl: string;
  error: string;
  buildTime: number;
}

interface ExportEstimate {
  format: string;
  fileCount: number;
  totalSize: number;
}

// --------------------------------------------------------
// Icons (inline SVGs matching project style)
// --------------------------------------------------------

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

// --------------------------------------------------------
// Main component
// --------------------------------------------------------

export function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const [activeTab, setActiveTab] = useState('cdn');

  const tabs = [
    { id: 'cdn', label: 'Publish', icon: <GlobeIcon className="w-3.5 h-3.5" /> },
    { id: 'export', label: 'Export', icon: <DownloadIcon className="w-3.5 h-3.5" /> },
    { id: 'deploy', label: 'Deploy', icon: <RocketIcon className="w-3.5 h-3.5" /> },
    { id: 'domain', label: 'Domain', icon: <LinkIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Your Site" size="xl">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="sm" />
      <div className="mt-6 min-h-[420px]">
        {activeTab === 'cdn' && <CDNPublishTab />}
        {activeTab === 'export' && <ExportTab />}
        {activeTab === 'deploy' && <PlatformDeployTab />}
        {activeTab === 'domain' && <CustomDomainTab />}
      </div>
    </Modal>
  );
}

// ============================================================
// Tab 1 - Publish to CDN
// ============================================================

function CDNPublishTab() {
  const { elements, rootElementIds, siteId } = useBuilderStore();
  const { currentSite, designSystem } = useSiteStore();
  const [deploy, setDeploy] = useState<DeployState>({
    status: 'idle',
    progress: 0,
    liveUrl: '',
    previewUrl: '',
    error: '',
    buildTime: 0,
  });
  const [copied, setCopied] = useState(false);

  const siteName = currentSite?.name || 'my-site';
  const siteSlug = currentSite?.slug || siteId || 'my-site';

  const handlePublish = useCallback(async () => {
    setDeploy({ status: 'building', progress: 0, liveUrl: '', previewUrl: '', error: '', buildTime: 0 });

    const startTime = Date.now();

    try {
      // Simulate build phase
      for (let i = 0; i <= 40; i += 8) {
        await new Promise(r => setTimeout(r, 120));
        setDeploy(prev => ({ ...prev, progress: i }));
      }

      setDeploy(prev => ({ ...prev, status: 'deploying', progress: 50 }));

      // Call deploy API
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteSlug,
          environment: 'production',
          elements,
          rootElementIds,
        }),
      });

      // Progress simulation during deploy
      for (let i = 55; i <= 90; i += 7) {
        await new Promise(r => setTimeout(r, 150));
        setDeploy(prev => ({ ...prev, progress: i }));
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      const buildTime = Date.now() - startTime;

      setDeploy({
        status: 'live',
        progress: 100,
        liveUrl: result.data.url,
        previewUrl: result.data.previewUrl,
        error: '',
        buildTime,
      });
    } catch (err) {
      setDeploy(prev => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Deployment failed. Please try again.',
      }));
    }
  }, [elements, rootElementIds, designSystem, siteSlug]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deploy.liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Idle state
  if (deploy.status === 'idle') {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 shadow-lg">
          <GlobeIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
          Ready to Go Live
        </h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-md">
          Publish <span className="font-semibold text-surface-700 dark:text-surface-300">{siteName}</span> to
          our global edge CDN. Your site will be live in seconds with automatic HTTPS and optimized performance.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-sm">
          {[
            { label: 'Global CDN', desc: '300+ edge nodes' },
            { label: 'Auto HTTPS', desc: 'Free SSL certificate' },
            { label: 'Instant Deploy', desc: 'Zero downtime' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700">
              <p className="text-xs font-semibold text-surface-800 dark:text-surface-200">{item.label}</p>
              <p className="text-[10px] text-surface-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={handlePublish}>
          Publish to CDN
        </Button>

        <p className="text-[11px] text-surface-400 mt-3">
          Your site will be available at <span className="font-mono text-surface-500">{siteSlug}.jamstack.app</span>
        </p>
      </div>
    );
  }

  // Building / Deploying state
  if (deploy.status === 'building' || deploy.status === 'deploying') {
    const stepLabels: Record<string, string> = {
      building: 'Building your site...',
      deploying: 'Deploying to edge network...',
    };

    return (
      <div className="flex flex-col items-center text-center py-10">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mb-6">
          <svg className="animate-spin w-20 h-20" viewBox="0 0 80 80">
            <circle
              className="text-surface-200 dark:text-surface-700"
              cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="4"
            />
            <circle
              className="text-brand-600"
              cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="4"
              strokeDasharray={`${deploy.progress * 2.14} 214`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-surface-700 dark:text-surface-300">
            {deploy.progress}%
          </span>
        </div>

        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
          {stepLabels[deploy.status]}
        </h3>
        <p className="text-sm text-surface-400">This usually takes a few seconds</p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mt-6">
          <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${deploy.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-surface-400">
            <span className={deploy.progress >= 10 ? 'text-brand-600 font-medium' : ''}>Build</span>
            <span className={deploy.progress >= 50 ? 'text-brand-600 font-medium' : ''}>Optimize</span>
            <span className={deploy.progress >= 80 ? 'text-brand-600 font-medium' : ''}>Deploy</span>
            <span className={deploy.progress >= 100 ? 'text-brand-600 font-medium' : ''}>Live</span>
          </div>
        </div>
      </div>
    );
  }

  // Live state
  if (deploy.status === 'live') {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-5">
          <CheckCircleIcon className="w-9 h-9 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
          Your Site is Live!
        </h3>
        <p className="text-sm text-surface-400 mb-6">
          Deployed in {(deploy.buildTime / 1000).toFixed(1)}s
        </p>

        {/* URL card */}
        <div className="w-full max-w-md p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-surface-400 font-medium mb-1">Live URL</p>
              <p className="text-sm font-mono text-brand-600 dark:text-brand-400 truncate">{deploy.liveUrl}</p>
            </div>
            <button
              onClick={handleCopyUrl}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <CopyIcon className="w-4 h-4 text-surface-400" />
              )}
            </button>
            <a
              href={deploy.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              title="Open in new tab"
            >
              <ExternalLinkIcon className="w-4 h-4 text-surface-400" />
            </a>
          </div>
        </div>

        {/* Preview URL */}
        {deploy.previewUrl && (
          <p className="text-xs text-surface-400 mb-6">
            Preview: <a href={deploy.previewUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline font-mono">{deploy.previewUrl}</a>
          </p>
        )}

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handlePublish}>
            Re-deploy
          </Button>
          <a href={deploy.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" icon={<ExternalLinkIcon className="w-3.5 h-3.5" />}>
              Visit Site
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Deployment Failed</h3>
      <p className="text-sm text-red-500 mb-6 max-w-sm">{deploy.error}</p>
      <Button onClick={handlePublish}>Try Again</Button>
    </div>
  );
}

// ============================================================
// Tab 2 - Export & Self-Host
// ============================================================

type ExportFormat = 'html' | 'nextjs' | 'gatsby' | 'zip';

function ExportTab() {
  const { elements, rootElementIds } = useBuilderStore();
  const { designSystem } = useSiteStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html');
  const [isExporting, setIsExporting] = useState(false);
  const [estimate, setEstimate] = useState<ExportEstimate | null>(null);

  // Calculate size estimate based on element count and format
  useEffect(() => {
    const elementCount = Object.keys(elements).length;
    const baseSize = elementCount * 400; // rough estimate: 400 bytes per element
    const formatMultipliers: Record<string, number> = { html: 1, nextjs: 2.5, gatsby: 2.5, zip: 1.2 };
    const formatFiles: Record<string, number> = { html: Math.max(3, elementCount / 3), nextjs: elementCount + 8, gatsby: elementCount + 10, zip: Math.max(3, elementCount / 3) };
    setEstimate({
      format: selectedFormat,
      fileCount: Math.round(formatFiles[selectedFormat] || 3),
      totalSize: Math.round(baseSize * (formatMultipliers[selectedFormat] || 1)),
    });
  }, [elements, selectedFormat]);

  const formats: Array<{ id: ExportFormat; label: string; desc: string; badge?: string }> = [
    { id: 'html', label: 'Static HTML/CSS/JS', desc: 'Clean, production-ready code. Works anywhere.' },
    { id: 'nextjs', label: 'Next.js Project', desc: 'Full Next.js app with pages, components, and styles.', badge: 'Popular' },
    { id: 'gatsby', label: 'Gatsby Project', desc: 'Gatsby static site with GraphQL data layer.' },
    { id: 'zip', label: 'Download ZIP', desc: 'All files bundled in a single archive.' },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: 'current-site',
          format: selectedFormat,
          includeAssets: true,
          minify: true,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.downloadUrl) {
        // Trigger download
        const a = document.createElement('a');
        a.href = result.data.downloadUrl;
        a.download = `site-export.${selectedFormat === 'zip' ? 'zip' : 'tar.gz'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      // silently handle - in demo mode the endpoint may not return a real file
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-5">
        Export your site as clean, production-ready code. Choose a format below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {formats.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id)}
            className={cn(
              'relative text-left p-4 rounded-xl border-2 transition-all',
              selectedFormat === fmt.id
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
            )}
          >
            {fmt.badge && (
              <Badge variant="info" size="sm">
                {fmt.badge}
              </Badge>
            )}
            <p className={cn(
              'text-sm font-semibold mt-1',
              selectedFormat === fmt.id
                ? 'text-brand-700 dark:text-brand-400'
                : 'text-surface-800 dark:text-surface-200'
            )}>
              {fmt.label}
            </p>
            <p className="text-xs text-surface-400 mt-0.5">{fmt.desc}</p>
          </button>
        ))}
      </div>

      {/* Size estimate */}
      {estimate && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700 mb-6">
          <div>
            <p className="text-xs text-surface-400">Files</p>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{estimate.fileCount}</p>
          </div>
          <div className="w-px h-8 bg-surface-200 dark:bg-surface-700" />
          <div>
            <p className="text-xs text-surface-400">Estimated Size</p>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{formatBytes(estimate.totalSize)}</p>
          </div>
          <div className="w-px h-8 bg-surface-200 dark:bg-surface-700" />
          <div>
            <p className="text-xs text-surface-400">Format</p>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 capitalize">{selectedFormat === 'html' ? 'HTML' : selectedFormat === 'nextjs' ? 'Next.js' : selectedFormat}</p>
          </div>
        </div>
      )}

      <Button onClick={handleExport} loading={isExporting} icon={<DownloadIcon className="w-4 h-4" />}>
        {isExporting ? 'Exporting...' : `Export as ${selectedFormat === 'html' ? 'HTML' : selectedFormat === 'nextjs' ? 'Next.js' : selectedFormat === 'gatsby' ? 'Gatsby' : 'ZIP'}`}
      </Button>
    </div>
  );
}

// ============================================================
// Tab 3 - Deploy to Platform
// ============================================================

type Platform = 'netlify' | 'vercel' | 'github';

interface PlatformConfig {
  id: Platform;
  name: string;
  color: string;
  logo: React.ReactNode;
  fields: Array<{ key: string; label: string; placeholder: string; type?: string }>;
}

function PlatformDeployTab() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('netlify');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [deploying, setDeploying] = useState(false);
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [deployResult, setDeployResult] = useState<{ url: string; platform: string } | null>(null);

  const platforms: PlatformConfig[] = [
    {
      id: 'netlify',
      name: 'Netlify',
      color: 'bg-[#00C7B7]/10 text-[#00C7B7] border-[#00C7B7]/30',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.23l2.349-1.045-.652-1.542-2.43.964a1.04 1.04 0 0 1-.38-.401l-.063-.137-2.248.895.652 1.542 2.166-.859a1.04 1.04 0 0 1 .303.353zM6.066 15.48a1.044 1.044 0 0 1-.303-.23L3.414 16.3l.652 1.542 2.43-.964c.105.165.233.303.38.401l.063.137 2.248-.895-.652-1.542-2.166.859a1.04 1.04 0 0 1-.303-.353zM12 2L1 12l11 10 11-10L12 2z" />
        </svg>
      ),
      fields: [
        { key: 'token', label: 'Personal Access Token', placeholder: 'Enter your Netlify API token', type: 'password' },
        { key: 'siteName', label: 'Site Name', placeholder: 'my-awesome-site' },
      ],
    },
    {
      id: 'vercel',
      name: 'Vercel',
      color: 'bg-black/5 text-black dark:bg-white/10 dark:text-white border-black/20 dark:border-white/20',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 19.5h20L12 2z" />
        </svg>
      ),
      fields: [
        { key: 'token', label: 'Vercel Token', placeholder: 'Enter your Vercel access token', type: 'password' },
      ],
    },
    {
      id: 'github',
      name: 'GitHub Pages',
      color: 'bg-[#333]/10 text-[#333] dark:bg-white/10 dark:text-white border-[#333]/20 dark:border-white/20',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
      fields: [
        { key: 'repo', label: 'Repository', placeholder: 'username/repository-name' },
        { key: 'token', label: 'GitHub Token', placeholder: 'ghp_xxxxxxxxxxxx', type: 'password' },
      ],
    },
  ];

  const activePlatform = platforms.find(p => p.id === selectedPlatform)!;

  const handleConnect = () => {
    setConnected(prev => ({ ...prev, [selectedPlatform]: true }));
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      // Simulate platform deployment
      await new Promise(r => setTimeout(r, 2500));
      setDeployResult({
        url: selectedPlatform === 'netlify'
          ? `https://${formData.siteName || 'my-site'}.netlify.app`
          : selectedPlatform === 'vercel'
            ? 'https://my-site.vercel.app'
            : `https://${(formData.repo || 'user/site').split('/')[0]}.github.io/${(formData.repo || 'user/site').split('/')[1] || 'site'}`,
        platform: activePlatform.name,
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-5">
        Deploy directly to your preferred hosting platform.
      </p>

      {/* Platform selector */}
      <div className="flex gap-2 mb-6">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelectedPlatform(p.id); setDeployResult(null); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
              selectedPlatform === p.id
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 text-brand-700 dark:text-brand-400'
                : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300'
            )}
          >
            {p.logo}
            {p.name}
          </button>
        ))}
      </div>

      {/* Deploy result */}
      {deployResult && deployResult.platform === activePlatform.name ? (
        <div className="p-5 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              Deployed to {deployResult.platform}
            </p>
          </div>
          <a
            href={deployResult.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 dark:text-green-400 font-mono hover:underline"
          >
            {deployResult.url}
          </a>
        </div>
      ) : (
        /* Platform form */
        <div className="space-y-4 mb-6">
          {activePlatform.fields.map((field) => (
            <Input
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              type={field.type || 'text'}
              value={formData[`${selectedPlatform}_${field.key}`] || ''}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  [`${selectedPlatform}_${field.key}`]: e.target.value,
                  [field.key]: e.target.value,
                }))
              }
            />
          ))}
        </div>
      )}

      {!deployResult || deployResult.platform !== activePlatform.name ? (
        <div className="flex gap-3">
          {!connected[selectedPlatform] ? (
            <Button variant="outline" onClick={handleConnect}>
              Connect {activePlatform.name}
            </Button>
          ) : (
            <Badge variant="success">Connected</Badge>
          )}
          <Button
            onClick={handleDeploy}
            loading={deploying}
            disabled={!connected[selectedPlatform]}
            icon={<RocketIcon className="w-4 h-4" />}
          >
            {deploying ? 'Deploying...' : `Deploy to ${activePlatform.name}`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// ============================================================
// Tab 4 - Custom Domain
// ============================================================

type SSLStatus = 'none' | 'provisioning' | 'active' | 'expired';

function CustomDomainTab() {
  const { currentSite } = useSiteStore();
  const [domain, setDomain] = useState(currentSite?.domain || '');
  const [addingDomain, setAddingDomain] = useState(false);
  const [domainAdded, setDomainAdded] = useState(false);
  const [sslStatus, setSslStatus] = useState<SSLStatus>('none');

  const siteSlug = currentSite?.slug || 'my-site';

  const handleAddDomain = async () => {
    if (!domain.trim()) return;
    setAddingDomain(true);
    try {
      // Simulate domain verification
      await new Promise(r => setTimeout(r, 1500));
      setDomainAdded(true);
      setSslStatus('provisioning');

      // Simulate SSL provisioning
      await new Promise(r => setTimeout(r, 2000));
      setSslStatus('active');
    } finally {
      setAddingDomain(false);
    }
  };

  const sslLabels: Record<SSLStatus, { text: string; variant: 'default' | 'success' | 'warning' | 'info' }> = {
    none: { text: 'Not configured', variant: 'default' },
    provisioning: { text: 'Provisioning...', variant: 'warning' },
    active: { text: 'Active', variant: 'success' },
    expired: { text: 'Expired', variant: 'warning' },
  };

  return (
    <div>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-5">
        Connect a custom domain to your site. Free SSL certificate included.
      </p>

      {/* Domain input */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input
            label="Custom Domain"
            placeholder="www.example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div className="pt-5">
          <Button onClick={handleAddDomain} loading={addingDomain} disabled={!domain.trim()}>
            {domainAdded ? 'Update' : 'Add Domain'}
          </Button>
        </div>
      </div>

      {domainAdded && (
        <>
          {/* DNS Configuration */}
          <div className="p-5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 mb-5">
            <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-3 flex items-center gap-2">
              <GlobeIcon className="w-4 h-4" />
              DNS Configuration
            </h4>
            <p className="text-xs text-surface-400 mb-4">
              Add these DNS records to your domain provider to connect your domain.
            </p>

            <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-100 dark:bg-surface-800">
                    <th className="text-left px-4 py-2 font-semibold text-surface-600 dark:text-surface-300">Type</th>
                    <th className="text-left px-4 py-2 font-semibold text-surface-600 dark:text-surface-300">Name</th>
                    <th className="text-left px-4 py-2 font-semibold text-surface-600 dark:text-surface-300">Value</th>
                    <th className="text-left px-4 py-2 font-semibold text-surface-600 dark:text-surface-300">TTL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-surface-200 dark:border-surface-700">
                    <td className="px-4 py-2.5">
                      <Badge variant="info">A</Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-surface-700 dark:text-surface-300">@</td>
                    <td className="px-4 py-2.5 font-mono text-surface-700 dark:text-surface-300">76.76.21.21</td>
                    <td className="px-4 py-2.5 text-surface-500">3600</td>
                  </tr>
                  <tr className="border-t border-surface-200 dark:border-surface-700">
                    <td className="px-4 py-2.5">
                      <Badge variant="info">CNAME</Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-surface-700 dark:text-surface-300">www</td>
                    <td className="px-4 py-2.5 font-mono text-surface-700 dark:text-surface-300">{siteSlug}.jamstack.app</td>
                    <td className="px-4 py-2.5 text-surface-500">3600</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SSL Status */}
          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldIcon className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">SSL Certificate</p>
                  <p className="text-xs text-surface-400">
                    {sslStatus === 'active'
                      ? 'Your site is secured with a free SSL certificate from Let\'s Encrypt.'
                      : sslStatus === 'provisioning'
                        ? 'Provisioning your SSL certificate. This usually takes a few minutes.'
                        : 'Add a domain to provision an SSL certificate.'}
                  </p>
                </div>
              </div>
              <Badge variant={sslLabels[sslStatus].variant}>
                {sslLabels[sslStatus].text}
              </Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
