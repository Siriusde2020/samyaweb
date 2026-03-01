import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'JAMStack Builder - The Ultimate Website Builder',
  description: 'Build stunning websites with our visual drag-and-drop builder. JAMStack architecture for blazing-fast performance, built-in CMS, e-commerce, and AI features.',
  keywords: ['website builder', 'jamstack', 'no-code', 'drag and drop', 'cms', 'ecommerce'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-surface-900 dark:bg-surface-900 dark:text-surface-100">
        {children}
      </body>
    </html>
  );
}
