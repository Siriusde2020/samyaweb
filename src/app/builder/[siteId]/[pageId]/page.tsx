'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBuilderStore } from '@/lib/store/builder-store';
import { useSiteStore } from '@/lib/store/site-store';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { TEMPLATE_GENERATORS } from '@/lib/templates/generators';

export default function BuilderPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const pageId = params.pageId as string;
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
          // No saved data - load a default template for new sites
          const generator = TEMPLATE_GENERATORS['saas-1'];
          if (generator) {
            const { elements, rootIds } = generator();
            loadPage(elements, rootIds);
          }
        }
      } catch {
        // Offline/demo mode - load default template
        const generator = TEMPLATE_GENERATORS['saas-1'];
        if (generator) {
          const { elements, rootIds } = generator();
          loadPage(elements, rootIds);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [siteId, pageId, loadPage]);

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
