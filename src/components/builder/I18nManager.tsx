'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  flag: string;
  isDefault: boolean;
  progress: number; // Translation completion %
}

interface TranslationEntry {
  key: string;
  original: string;
  translations: Record<string, string>;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', isDefault: true, progress: 100 },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', isDefault: false, progress: 78 },
  { code: 'fr', name: 'French', flag: '🇫🇷', isDefault: false, progress: 65 },
  { code: 'de', name: 'German', flag: '🇩🇪', isDefault: false, progress: 42 },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', isDefault: false, progress: 30 },
];

const translations: TranslationEntry[] = [
  { key: 'hero.title', original: 'Build Something Amazing', translations: { es: 'Construye Algo Increíble', fr: 'Construisez Quelque Chose d\'Incroyable', de: '', ar: '' } },
  { key: 'hero.subtitle', original: 'The fastest way to build websites', translations: { es: 'La forma más rápida de crear sitios web', fr: 'Le moyen le plus rapide de créer des sites web', de: '', ar: '' } },
  { key: 'cta.button', original: 'Get Started Free', translations: { es: 'Comienza Gratis', fr: 'Commencer Gratuitement', de: 'Kostenlos starten', ar: '' } },
  { key: 'nav.features', original: 'Features', translations: { es: 'Características', fr: 'Fonctionnalités', de: 'Funktionen', ar: 'الميزات' } },
  { key: 'nav.pricing', original: 'Pricing', translations: { es: 'Precios', fr: 'Tarifs', de: 'Preise', ar: 'الأسعار' } },
];

export function I18nManager() {
  const [activeLang, setActiveLang] = useState('es');
  const [search, setSearch] = useState('');

  const activeLanguage = languages.find(l => l.code === activeLang);

  const filtered = translations.filter(t =>
    !search || t.key.includes(search) || t.original.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Language List */}
      <div className="w-64 border-r border-surface-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">Languages</h3>
          <Button variant="ghost" size="sm">+ Add</Button>
        </div>
        <div className="space-y-1">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                activeLang === lang.code
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-50'
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{lang.name}</span>
                  {lang.isDefault && <Badge>Default</Badge>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${lang.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-surface-400">{lang.progress}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-3 bg-brand-50 rounded-lg">
          <p className="text-xs font-medium text-brand-700 mb-2">Auto-Translate</p>
          <p className="text-[10px] text-brand-600 mb-2">Use AI to translate all missing strings</p>
          <Button size="sm" className="w-full">Translate All</Button>
        </div>

        <div className="mt-4 p-3 bg-surface-50 rounded-lg">
          <p className="text-xs font-medium text-surface-700 mb-2">Settings</p>
          <Select
            label="URL Strategy"
            options={[
              { value: 'subdirectory', label: '/en/, /es/, /fr/' },
              { value: 'subdomain', label: 'en., es., fr.' },
              { value: 'parameter', label: '?lang=en' },
            ]}
          />
          <label className="flex items-center gap-2 text-xs text-surface-600 mt-3">
            <input type="checkbox" defaultChecked className="rounded" />
            Auto-detect browser language
          </label>
          <label className="flex items-center gap-2 text-xs text-surface-600 mt-2">
            <input type="checkbox" defaultChecked className="rounded" />
            Show language switcher
          </label>
        </div>
      </div>

      {/* Translation Editor */}
      <div className="flex-1 p-6">
        {activeLanguage && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-900">
                  {activeLanguage.flag} {activeLanguage.name} Translations
                </h2>
                <p className="text-sm text-surface-500">
                  {activeLanguage.progress}% complete - {translations.filter(t => t.translations[activeLang]).length} of {translations.length} strings translated
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Import</Button>
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm">Auto-Translate Missing</Button>
              </div>
            </div>

            <Input
              placeholder="Search translations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />

            <div className="bg-white rounded-xl border border-surface-200">
              <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
                <span className="col-span-3">Key</span>
                <span className="col-span-4">Original (English)</span>
                <span className="col-span-4">Translation</span>
                <span className="col-span-1">Status</span>
              </div>
              {filtered.map(entry => (
                <div key={entry.key} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center gap-2">
                  <span className="col-span-3 text-xs font-mono text-surface-500">{entry.key}</span>
                  <span className="col-span-4 text-sm text-surface-700">{entry.original}</span>
                  <div className="col-span-4">
                    <input
                      className="builder-input text-sm"
                      defaultValue={entry.translations[activeLang] || ''}
                      placeholder="Enter translation..."
                    />
                  </div>
                  <div className="col-span-1">
                    {entry.translations[activeLang] ? (
                      <Badge variant="success">Done</Badge>
                    ) : (
                      <Badge variant="warning">Missing</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
