'use client';

import { useSiteStore } from '@/lib/store/site-store';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

export function DesignSystemPanel() {
  const { designSystem, updateDesignSystem } = useSiteStore();
  const [activeSection, setActiveSection] = useState('colors');

  const updateColor = (key: string, value: string) => {
    updateDesignSystem({
      colors: { ...designSystem.colors, [key]: value },
    });
  };

  const updateTypography = (key: string, value: string | number) => {
    updateDesignSystem({
      typography: { ...designSystem.typography, [key]: value },
    });
  };

  return (
    <div>
      {/* Section Tabs */}
      <div className="flex border-b border-surface-200 mb-4">
        {['colors', 'typography', 'spacing', 'theme'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeSection === section
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Colors */}
      {activeSection === 'colors' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Global Colors</h3>
          <p className="text-xs text-surface-500 mb-4">
            These colors are used throughout your website. Changes apply globally.
          </p>
          <div className="space-y-3">
            {Object.entries(designSystem.colors)
              .filter(([key]) => key !== 'custom')
              .map(([key, value]) => (
                <ColorPicker
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                  value={value as string}
                  onChange={(v) => updateColor(key, v)}
                />
              ))}
          </div>
          <button className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium">
            + Add Custom Color
          </button>
        </div>
      )}

      {/* Typography */}
      {activeSection === 'typography' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Typography</h3>
          <Select
            label="Heading Font"
            value={designSystem.typography.headingFont}
            onChange={(e) => updateTypography('headingFont', e.target.value)}
            options={[
              { value: 'Inter', label: 'Inter' },
              { value: 'Poppins', label: 'Poppins' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Montserrat', label: 'Montserrat' },
              { value: 'Playfair Display', label: 'Playfair Display' },
              { value: 'Georgia', label: 'Georgia' },
              { value: 'Merriweather', label: 'Merriweather' },
              { value: 'Lato', label: 'Lato' },
              { value: 'Open Sans', label: 'Open Sans' },
            ]}
          />
          <Select
            label="Body Font"
            value={designSystem.typography.bodyFont}
            onChange={(e) => updateTypography('bodyFont', e.target.value)}
            options={[
              { value: 'Inter', label: 'Inter' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Open Sans', label: 'Open Sans' },
              { value: 'Lato', label: 'Lato' },
              { value: 'Source Sans Pro', label: 'Source Sans Pro' },
              { value: 'Nunito', label: 'Nunito' },
              { value: 'Georgia', label: 'Georgia' },
            ]}
          />
          <Input
            label="Base Font Size (px)"
            type="number"
            value={designSystem.typography.baseSize}
            onChange={(e) => updateTypography('baseSize', parseInt(e.target.value))}
          />
          <Input
            label="Line Height"
            type="number"
            step="0.1"
            value={designSystem.typography.lineHeight}
            onChange={(e) => updateTypography('lineHeight', parseFloat(e.target.value))}
          />

          <h4 className="text-xs font-semibold text-surface-500 uppercase mt-6 mb-2">Heading Previews</h4>
          {Object.entries(designSystem.typography.headings).map(([tag, style]) => (
            <div key={tag} className="pb-2 border-b border-surface-100">
              <span className="text-[10px] text-surface-400 uppercase">{tag}</span>
              <p style={{
                fontFamily: designSystem.typography.headingFont,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
              }}>
                Heading Preview
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Spacing */}
      {activeSection === 'spacing' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Spacing Scale</h3>
          <p className="text-xs text-surface-500">Base unit and spacing scale used for consistent layouts.</p>
          <Input
            label="Base Unit (px)"
            type="number"
            value={designSystem.spacing.unit}
            onChange={(e) => updateDesignSystem({
              spacing: { ...designSystem.spacing, unit: parseInt(e.target.value) },
            })}
          />
          <h4 className="text-xs font-semibold text-surface-500 uppercase mt-4 mb-2">Scale Preview</h4>
          <div className="space-y-1">
            {designSystem.spacing.scale.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-surface-400 w-6">{i}</span>
                <div className="h-4 bg-brand-200 rounded" style={{ width: `${val}px` }} />
                <span className="text-xs text-surface-500">{val}px</span>
              </div>
            ))}
          </div>

          <h4 className="text-xs font-semibold text-surface-500 uppercase mt-6 mb-2">Border Radius</h4>
          {Object.entries(designSystem.borderRadius).map(([key, value]) => (
            <Input
              key={key}
              label={key}
              value={value}
              onChange={(e) => updateDesignSystem({
                borderRadius: { ...designSystem.borderRadius, [key]: e.target.value },
              })}
            />
          ))}
        </div>
      )}

      {/* Theme Presets */}
      {activeSection === 'theme' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-surface-900">Theme Presets</h3>
          <p className="text-xs text-surface-500">Apply a pre-built color scheme and typography combination.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Default', colors: ['#4c6ef5', '#748ffc', '#ffffff', '#212529'] },
              { name: 'Dark Mode', colors: ['#7c3aed', '#a78bfa', '#1a1a2e', '#e2e8f0'] },
              { name: 'Nature', colors: ['#059669', '#34d399', '#ffffff', '#1f2937'] },
              { name: 'Sunset', colors: ['#ea580c', '#fb923c', '#fffbeb', '#1c1917'] },
              { name: 'Ocean', colors: ['#0284c7', '#38bdf8', '#f0f9ff', '#0c4a6e'] },
              { name: 'Rose', colors: ['#e11d48', '#fb7185', '#fff1f2', '#1c1917'] },
              { name: 'Minimal', colors: ['#18181b', '#71717a', '#ffffff', '#18181b'] },
              { name: 'Neon', colors: ['#8b5cf6', '#22d3ee', '#0f172a', '#f8fafc'] },
            ].map(preset => (
              <button
                key={preset.name}
                className="p-3 border border-surface-200 rounded-xl hover:border-brand-300 transition-colors text-left group"
                onClick={() => {
                  updateDesignSystem({
                    colors: {
                      ...designSystem.colors,
                      primary: preset.colors[0],
                      secondary: preset.colors[1],
                      background: preset.colors[2],
                      text: preset.colors[3],
                    },
                  });
                }}
              >
                <div className="flex gap-1 mb-2">
                  {preset.colors.map((color, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-surface-200" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-xs font-medium text-surface-700 group-hover:text-brand-600">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
