'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { TemplateGallery } from '@/components/templates/TemplateGallery';
import { cn } from '@/lib/utils';

type Step = 'choose' | 'ai-prompt' | 'configure';

interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSiteModal({ isOpen, onClose }: CreateSiteModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [siteName, setSiteName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'ai') {
      setStep('ai-prompt');
    } else {
      setSelectedTemplate(templateId);
      setStep('configure');
    }
  };

  const handleCreate = async () => {
    if (!siteName.trim()) { setError('Please enter a site name'); return; }
    setIsCreating(true);
    setError('');

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: siteName,
          template: selectedTemplate || 'blank',
          aiPrompt: aiPrompt || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.site) {
        router.push(`/builder/${data.site.id}/home`);
      } else {
        setError(data.error || 'Failed to create site');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep('choose');
    setSelectedTemplate(null);
    setSiteName('');
    setAiPrompt('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Website" size="xl">
      {step === 'choose' && (
        <div>
          {/* AI Generation Option */}
          <button
            onClick={() => handleTemplateSelect('ai')}
            className="w-full mb-6 p-5 border-2 border-brand-200 bg-brand-50 rounded-2xl text-left hover:border-brand-400 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">Generate with AI</h3>
                <p className="text-sm text-surface-500 mt-0.5">Describe your website and AI will build it for you</p>
              </div>
            </div>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-surface-400 uppercase tracking-wider">or choose a template</span>
            </div>
          </div>

          <TemplateGallery onSelect={handleTemplateSelect} />
        </div>
      )}

      {step === 'ai-prompt' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">✨</div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">Describe Your Website</h2>
            <p className="text-sm text-surface-500">Tell us what kind of website you want and AI will generate it</p>
          </div>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., A modern SaaS landing page for a project management tool with a hero section, features grid, pricing table, and testimonials..."
            className="w-full h-32 builder-input resize-none mb-4"
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              'SaaS landing page for a project management tool',
              'Portfolio for a photographer',
              'E-commerce store for handmade jewelry',
              'Restaurant website with menu and reservations',
              'Tech startup with waitlist signup',
            ].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setAiPrompt(suggestion)}
                className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('choose')} className="flex-1">Back</Button>
            <Button
              onClick={() => { setSelectedTemplate('ai'); setStep('configure'); }}
              disabled={!aiPrompt.trim()}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 'configure' && (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">Almost There!</h2>
            <p className="text-sm text-surface-500">
              {selectedTemplate === 'ai' ? 'AI will generate your website' : `Using template: ${selectedTemplate}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
          )}

          <Input
            label="Website Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="My Awesome Website"
            className="mb-6"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(selectedTemplate === 'ai' ? 'ai-prompt' : 'choose')}
              className="flex-1"
            >
              Back
            </Button>
            <Button onClick={handleCreate} loading={isCreating} className="flex-1">
              {isCreating ? 'Creating...' : 'Create Website'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
