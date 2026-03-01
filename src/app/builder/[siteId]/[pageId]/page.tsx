'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useBuilderStore } from '@/lib/store/builder-store';
import { TEMPLATE_GENERATORS, generateFromPrompt } from '@/lib/templates/generators';
import { BuilderLayout } from '@/components/builder/BuilderLayout';

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const siteId = params.siteId as string;
  const pageId = params.pageId as string;
  const templateParam = searchParams.get('template');
  const promptParam = searchParams.get('prompt');
  const { loadPage } = useBuilderStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages?siteId=${siteId}&pageId=${pageId}`);
        const data = await res.json();

        if (data.page?.elements && Object.keys(data.page.elements).length > 0) {
          loadPage(data.page.elements, data.page.rootElementIds || []);
        } else {
          // No saved data - load the selected template
          let generated = null;

          // Try AI prompt first
          if (promptParam) {
            generated = generateFromPrompt(promptParam);
          }
          // Try specific template
          else if (templateParam && TEMPLATE_GENERATORS[templateParam]) {
            generated = TEMPLATE_GENERATORS[templateParam]();
          }
          // Default to SaaS template
          else {
            const generator = TEMPLATE_GENERATORS['saas-1'];
            if (generator) generated = generator();
          }

          if (generated) {
            loadPage(generated.elements, generated.rootIds);
          }
        }
      } catch {
        // Offline/demo mode - load selected or default template
        let generated = null;
        if (templateParam && TEMPLATE_GENERATORS[templateParam]) {
          generated = TEMPLATE_GENERATORS[templateParam]();
        } else {
          const generator = TEMPLATE_GENERATORS['saas-1'];
          if (generator) generated = generator();
        }
        if (generated) loadPage(generated.elements, generated.rootIds);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [siteId, pageId, templateParam, promptParam, loadPage]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-500">Loading builder...</p>
        </div>
      </div>
    );
  }

  return <BuilderLayout />;
}
