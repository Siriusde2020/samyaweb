'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

export function StylePanel() {
  const {
    elements,
    selectedElementId,
    breakpoint,
    updateStyles,
    updateResponsiveStyles,
    updateHoverStyles,
    updateElement,
  } = useBuilderStore();

  const [activeTab, setActiveTab] = useState('style');

  if (!selectedElementId) return null;
  const element = elements[selectedElementId];
  if (!element) return null;

  const currentStyles = {
    ...element.styles,
    ...(breakpoint === 'tablet' ? element.responsiveStyles?.tablet : {}),
    ...(breakpoint === 'mobile' ? element.responsiveStyles?.mobile : {}),
  };

  const handleStyleChange = (key: string, value: string) => {
    if (breakpoint === 'desktop') {
      updateStyles(selectedElementId, { [key]: value });
    } else {
      updateResponsiveStyles(selectedElementId, breakpoint, { [key]: value });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs
        tabs={[
          { id: 'style', label: 'Style' },
          { id: 'settings', label: 'Settings' },
          { id: 'animation', label: 'Motion' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        size="sm"
      />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'style' && (
          <div>
            {/* Layout */}
            <PanelSection title="Layout">
              <div className="grid grid-cols-2 gap-2">
                <Select
                  label="Display"
                  value={currentStyles.display || 'block'}
                  onChange={(e) => handleStyleChange('display', e.target.value)}
                  options={[
                    { value: 'block', label: 'Block' },
                    { value: 'flex', label: 'Flex' },
                    { value: 'grid', label: 'Grid' },
                    { value: 'inline', label: 'Inline' },
                    { value: 'inline-flex', label: 'Inline Flex' },
                    { value: 'none', label: 'None' },
                  ]}
                />
                <Select
                  label="Position"
                  value={currentStyles.position || 'relative'}
                  onChange={(e) => handleStyleChange('position', e.target.value)}
                  options={[
                    { value: 'relative', label: 'Relative' },
                    { value: 'absolute', label: 'Absolute' },
                    { value: 'fixed', label: 'Fixed' },
                    { value: 'sticky', label: 'Sticky' },
                    { value: 'static', label: 'Static' },
                  ]}
                />
              </div>
              {(currentStyles.display === 'flex' || currentStyles.display === 'inline-flex') && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Select
                    label="Direction"
                    value={currentStyles.flexDirection || 'row'}
                    onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                    options={[
                      { value: 'row', label: 'Row' },
                      { value: 'column', label: 'Column' },
                      { value: 'row-reverse', label: 'Row Rev' },
                      { value: 'column-reverse', label: 'Col Rev' },
                    ]}
                  />
                  <Select
                    label="Justify"
                    value={currentStyles.justifyContent || 'flex-start'}
                    onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                    options={[
                      { value: 'flex-start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'flex-end', label: 'End' },
                      { value: 'space-between', label: 'Between' },
                      { value: 'space-around', label: 'Around' },
                    ]}
                  />
                  <Select
                    label="Align"
                    value={currentStyles.alignItems || 'stretch'}
                    onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                    options={[
                      { value: 'stretch', label: 'Stretch' },
                      { value: 'flex-start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'flex-end', label: 'End' },
                    ]}
                  />
                  <Input
                    label="Gap"
                    value={currentStyles.gap || ''}
                    onChange={(e) => handleStyleChange('gap', e.target.value)}
                    placeholder="0px"
                  />
                </div>
              )}
            </PanelSection>

            {/* Size */}
            <PanelSection title="Size">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Width"
                  value={currentStyles.width || ''}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  placeholder="auto"
                />
                <Input
                  label="Height"
                  value={currentStyles.height || ''}
                  onChange={(e) => handleStyleChange('height', e.target.value)}
                  placeholder="auto"
                />
                <Input
                  label="Min W"
                  value={currentStyles.minWidth || ''}
                  onChange={(e) => handleStyleChange('minWidth', e.target.value)}
                  placeholder="none"
                />
                <Input
                  label="Max W"
                  value={currentStyles.maxWidth || ''}
                  onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                  placeholder="none"
                />
              </div>
            </PanelSection>

            {/* Spacing */}
            <PanelSection title="Spacing">
              <div className="mb-2">
                <span className="builder-label">Margin</span>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {['Top', 'Right', 'Bottom', 'Left'].map(side => (
                    <Input
                      key={side}
                      placeholder={side[0]}
                      value={currentStyles[`margin${side}` as keyof typeof currentStyles] as string || ''}
                      onChange={(e) => handleStyleChange(`margin${side}`, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="builder-label">Padding</span>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {['Top', 'Right', 'Bottom', 'Left'].map(side => (
                    <Input
                      key={side}
                      placeholder={side[0]}
                      value={currentStyles[`padding${side}` as keyof typeof currentStyles] as string || ''}
                      onChange={(e) => handleStyleChange(`padding${side}`, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </PanelSection>

            {/* Typography */}
            <PanelSection title="Typography">
              <div className="space-y-2">
                <Select
                  label="Font Family"
                  value={currentStyles.fontFamily || 'Inter'}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                  options={[
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Georgia', label: 'Georgia' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Poppins', label: 'Poppins' },
                    { value: 'Montserrat', label: 'Montserrat' },
                    { value: 'Playfair Display', label: 'Playfair' },
                    { value: 'monospace', label: 'Monospace' },
                  ]}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Size"
                    value={currentStyles.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                  <Select
                    label="Weight"
                    value={currentStyles.fontWeight || '400'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                    options={[
                      { value: '300', label: 'Light' },
                      { value: '400', label: 'Regular' },
                      { value: '500', label: 'Medium' },
                      { value: '600', label: 'Semi Bold' },
                      { value: '700', label: 'Bold' },
                      { value: '800', label: 'Extra Bold' },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Line Height"
                    value={currentStyles.lineHeight || ''}
                    onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                    placeholder="1.5"
                  />
                  <Input
                    label="Letter Spacing"
                    value={currentStyles.letterSpacing || ''}
                    onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
                    placeholder="0px"
                  />
                </div>
                <Select
                  label="Text Align"
                  value={currentStyles.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' },
                  ]}
                />
                <ColorPicker
                  label="Color"
                  value={currentStyles.color || '#000000'}
                  onChange={(v) => handleStyleChange('color', v)}
                />
              </div>
            </PanelSection>

            {/* Background */}
            <PanelSection title="Background">
              <ColorPicker
                label="Background Color"
                value={currentStyles.backgroundColor || '#ffffff'}
                onChange={(v) => handleStyleChange('backgroundColor', v)}
              />
              <Input
                label="Background Image"
                value={currentStyles.backgroundImage || ''}
                onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
                placeholder="url(...)"
                className="mt-2"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Select
                  label="Size"
                  value={currentStyles.backgroundSize || 'auto'}
                  onChange={(e) => handleStyleChange('backgroundSize', e.target.value)}
                  options={[
                    { value: 'auto', label: 'Auto' },
                    { value: 'cover', label: 'Cover' },
                    { value: 'contain', label: 'Contain' },
                  ]}
                />
                <Select
                  label="Position"
                  value={currentStyles.backgroundPosition || 'center'}
                  onChange={(e) => handleStyleChange('backgroundPosition', e.target.value)}
                  options={[
                    { value: 'center', label: 'Center' },
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                  ]}
                />
              </div>
            </PanelSection>

            {/* Border */}
            <PanelSection title="Border">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Width"
                  value={currentStyles.borderWidth || ''}
                  onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                  placeholder="0px"
                />
                <Select
                  label="Style"
                  value={currentStyles.borderStyle || 'solid'}
                  onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                  ]}
                />
              </div>
              <ColorPicker
                label="Border Color"
                value={currentStyles.borderColor || '#dee2e6'}
                onChange={(v) => handleStyleChange('borderColor', v)}
              />
              <Input
                label="Border Radius"
                value={currentStyles.borderRadius || ''}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                placeholder="0px"
                className="mt-2"
              />
            </PanelSection>

            {/* Effects */}
            <PanelSection title="Effects">
              <Input
                label="Box Shadow"
                value={currentStyles.boxShadow || ''}
                onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                placeholder="0 0 0 rgba(0,0,0,0)"
              />
              <Input
                label="Opacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentStyles.opacity ?? 1}
                onChange={(e) => handleStyleChange('opacity', e.target.value)}
                className="mt-2"
              />
              <Input
                label="Transform"
                value={currentStyles.transform || ''}
                onChange={(e) => handleStyleChange('transform', e.target.value)}
                placeholder="none"
                className="mt-2"
              />
              <Input
                label="Filter"
                value={currentStyles.filter || ''}
                onChange={(e) => handleStyleChange('filter', e.target.value)}
                placeholder="none"
                className="mt-2"
              />
              <Input
                label="Transition"
                value={currentStyles.transition || ''}
                onChange={(e) => handleStyleChange('transition', e.target.value)}
                placeholder="all 0.2s ease"
                className="mt-2"
              />
            </PanelSection>

            {/* Custom CSS */}
            <PanelSection title="Custom CSS">
              <textarea
                className="builder-input font-mono text-xs h-24 resize-none"
                placeholder="property: value;"
                defaultValue=""
              />
            </PanelSection>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <PanelSection title="Element Settings">
              <Input
                label="Label"
                value={element.label || ''}
                onChange={(e) => updateElement(selectedElementId, { label: e.target.value })}
                placeholder="Element name"
              />
              {element.content !== undefined && (
                <Input
                  label="Content"
                  value={element.content || ''}
                  onChange={(e) => updateElement(selectedElementId, { content: e.target.value })}
                  placeholder="Text content"
                  className="mt-2"
                />
              )}
              {element.src !== undefined && (
                <Input
                  label="Source URL"
                  value={element.src || ''}
                  onChange={(e) => updateElement(selectedElementId, { src: e.target.value })}
                  placeholder="https://..."
                  className="mt-2"
                />
              )}
              {element.href !== undefined && (
                <Input
                  label="Link URL"
                  value={element.href || ''}
                  onChange={(e) => updateElement(selectedElementId, { href: e.target.value })}
                  placeholder="https://..."
                  className="mt-2"
                />
              )}
              {element.alt !== undefined && (
                <Input
                  label="Alt Text"
                  value={element.alt || ''}
                  onChange={(e) => updateElement(selectedElementId, { alt: e.target.value })}
                  placeholder="Image description"
                  className="mt-2"
                />
              )}
              <Select
                label="HTML Tag"
                value={element.tag || 'div'}
                onChange={(e) => updateElement(selectedElementId, { tag: e.target.value })}
                options={[
                  { value: 'div', label: 'div' },
                  { value: 'section', label: 'section' },
                  { value: 'article', label: 'article' },
                  { value: 'main', label: 'main' },
                  { value: 'aside', label: 'aside' },
                  { value: 'header', label: 'header' },
                  { value: 'footer', label: 'footer' },
                  { value: 'nav', label: 'nav' },
                  { value: 'h1', label: 'h1' },
                  { value: 'h2', label: 'h2' },
                  { value: 'h3', label: 'h3' },
                  { value: 'h4', label: 'h4' },
                  { value: 'p', label: 'p' },
                  { value: 'span', label: 'span' },
                  { value: 'a', label: 'a' },
                  { value: 'img', label: 'img' },
                  { value: 'form', label: 'form' },
                  { value: 'input', label: 'input' },
                  { value: 'button', label: 'button' },
                ]}
                className="mt-2"
              />
            </PanelSection>

            <PanelSection title="Visibility">
              <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
                <input
                  type="checkbox"
                  checked={element.hidden || false}
                  onChange={(e) => updateElement(selectedElementId, { hidden: e.target.checked })}
                  className="rounded"
                />
                Hidden
              </label>
              <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 mt-2">
                <input
                  type="checkbox"
                  checked={element.locked || false}
                  onChange={(e) => updateElement(selectedElementId, { locked: e.target.checked })}
                  className="rounded"
                />
                Locked
              </label>
            </PanelSection>

            <PanelSection title="Custom Attributes">
              <Input
                placeholder="data-attribute"
                className="mb-1"
              />
              <Input
                placeholder="value"
              />
              <button className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-medium">
                + Add Attribute
              </button>
            </PanelSection>
          </div>
        )}

        {activeTab === 'animation' && (
          <div>
            <PanelSection title="Scroll Animation">
              <Select
                label="Animation"
                value=""
                onChange={() => {}}
                options={[
                  { value: '', label: 'None' },
                  { value: 'fadeIn', label: 'Fade In' },
                  { value: 'slideUp', label: 'Slide Up' },
                  { value: 'slideDown', label: 'Slide Down' },
                  { value: 'slideLeft', label: 'Slide Left' },
                  { value: 'slideRight', label: 'Slide Right' },
                  { value: 'scaleIn', label: 'Scale In' },
                  { value: 'rotateIn', label: 'Rotate In' },
                  { value: 'bounce', label: 'Bounce' },
                ]}
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Duration" placeholder="0.3s" />
                <Input label="Delay" placeholder="0s" />
              </div>
              <Select
                label="Easing"
                value="ease-out"
                onChange={() => {}}
                options={[
                  { value: 'ease', label: 'Ease' },
                  { value: 'ease-in', label: 'Ease In' },
                  { value: 'ease-out', label: 'Ease Out' },
                  { value: 'ease-in-out', label: 'Ease In Out' },
                  { value: 'linear', label: 'Linear' },
                ]}
                className="mt-2"
              />
            </PanelSection>

            <PanelSection title="Hover Effects">
              <ColorPicker
                label="Hover Background"
                value={element.hoverStyles?.backgroundColor || '#ffffff'}
                onChange={(v) => updateHoverStyles(selectedElementId, { backgroundColor: v })}
              />
              <ColorPicker
                label="Hover Color"
                value={element.hoverStyles?.color || '#000000'}
                onChange={(v) => updateHoverStyles(selectedElementId, { color: v })}
              />
              <Input
                label="Hover Transform"
                value={element.hoverStyles?.transform || ''}
                onChange={(e) => updateHoverStyles(selectedElementId, { transform: e.target.value })}
                placeholder="scale(1.05)"
                className="mt-2"
              />
              <Input
                label="Hover Shadow"
                value={element.hoverStyles?.boxShadow || ''}
                onChange={(e) => updateHoverStyles(selectedElementId, { boxShadow: e.target.value })}
                placeholder="0 4px 12px rgba(0,0,0,0.15)"
                className="mt-2"
              />
            </PanelSection>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-surface-200 dark:border-surface-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase tracking-wider hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
      >
        {title}
        <svg
          className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
