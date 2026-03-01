'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const footerLinks = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Resources: [
    { href: '#', label: 'Documentation' },
    { href: '#', label: 'API Reference' },
    { href: '#', label: 'Templates' },
    { href: '#', label: 'Community' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '#', label: 'Careers' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
  Support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '#', label: 'Help Center' },
    { href: '#', label: 'Status' },
    { href: '#', label: 'Report a Bug' },
  ],
};

export function SiteHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SW
          </div>
          <span className="text-lg font-bold text-surface-900">Samya Web</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
            Sign In
          </Link>
          <Link
            href="/auth?mode=register"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface-900 text-surface-400 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                SW
              </div>
              <span className="text-lg font-bold text-white">Samya Web</span>
            </Link>
            <p className="text-sm leading-relaxed">
              The ultimate JAMStack website builder. Build faster, deploy globally, scale effortlessly.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Samya Web Builder. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
