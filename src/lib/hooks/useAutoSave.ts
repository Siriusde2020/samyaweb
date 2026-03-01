import { useEffect, useRef, useCallback } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { debounce } from '@/lib/utils';

/**
 * Auto-save hook for the builder
 * Saves page content to the API on changes with debouncing
 */
export function useAutoSave(siteId: string, pageId: string) {
  const {
    elements,
    rootElementIds,
    isDirty,
    setSaving,
    setDirty,
    setLastSaved,
  } = useBuilderStore();

  const saveRef = useRef<ReturnType<typeof debounce>>();

  const save = useCallback(async () => {
    if (!isDirty) return;

    setSaving(true);
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          pageId,
          elements,
          rootElementIds,
        }),
      });

      if (response.ok) {
        setDirty(false);
        setLastSaved(new Date().toISOString());
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  }, [siteId, pageId, elements, rootElementIds, isDirty, setSaving, setDirty, setLastSaved]);

  useEffect(() => {
    saveRef.current = debounce(save, 2000);
  }, [save]);

  useEffect(() => {
    if (isDirty && saveRef.current) {
      saveRef.current();
    }
  }, [isDirty, elements, rootElementIds]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, save]);

  return { save };
}
