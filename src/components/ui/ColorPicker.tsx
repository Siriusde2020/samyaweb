'use client';

import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presets?: string[];
}

const defaultPresets = [
  '#000000', '#ffffff', '#f8f9fa', '#dee2e6', '#868e96', '#212529',
  '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6',
  '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14',
];

export function ColorPicker({ value, onChange, label, presets = defaultPresets }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
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

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="flex items-center gap-2 builder-input cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-5 h-5 rounded border border-surface-300"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono">{value}</span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 p-3 w-60 animate-scale-in">
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {presets.map(color => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-lg border border-surface-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => { onChange(color); setInputValue(color); }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => { onChange(e.target.value); setInputValue(e.target.value); }}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1 builder-input font-mono text-xs"
                placeholder="#000000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
