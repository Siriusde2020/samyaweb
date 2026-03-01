'use client';

import { useState } from 'react';
import Link from 'next/link';

const features = [
  {
    icon: '🎨',
    title: 'Visual Drag & Drop Builder',
    description: 'Build beautiful websites with our intuitive visual editor. No coding required.',
  },
  {
    icon: '⚡',
    title: 'JAMStack Performance',
    description: 'Static site generation with edge deployment for blazing-fast load times.',
  },
  {
    icon: '📝',
    title: 'Built-in Headless CMS',
    description: 'Dynamic content management with collections, rich text editor, and media manager.',
  },
  {
    icon: '🛒',
    title: 'E-Commerce Ready',
    description: 'Full store with products, cart, checkout, Stripe payments, and inventory tracking.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Features',
    description: 'Generate entire websites from prompts. AI copywriting, SEO, and image generation.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'SSL by default, DDoS protection, 2FA, GDPR compliance tools, and role-based access.',
  },
  {
    icon: '🌍',
    title: 'Global CDN Deployment',
    description: 'One-click deploy to edge locations worldwide. Custom domains and free SSL.',
  },
  {
    icon: '📊',
    title: 'Marketing Suite',
    description: 'Built-in analytics, A/B testing, popups, email capture, and conversion tracking.',
  },
  {
    icon: '🏷️',
    title: 'White Label',
    description: 'Rebrand the entire platform. Custom domain, logo, pricing, and reseller dashboard.',
  },
];

const stats = [
  { value: '10x', label: 'Faster than traditional builders' },
  { value: '99.9%', label: 'Uptime on edge CDN' },
  { value: '100', label: 'Lighthouse performance score' },
  { value: '50+', label: 'Industry templates' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              JS
            </div>
            <span className="text-lg font-bold text-surface-900">JAMStack Builder</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">Features</a>
            <a href="#templates" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">Templates</a>
            <a href="#pricing" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">Pricing</a>
            <Link href="/auth" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">Sign In</Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Now in Beta - Free to use
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 leading-tight mb-6">
            Build Websites<br />
            <span className="text-brand-600">10x Faster</span>
          </h1>
          <p className="text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate JAMStack website builder. Visual drag-and-drop editor,
            built-in CMS, e-commerce, AI features, and global edge deployment.
            No coding required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30"
            >
              Start Building for Free
            </Link>
            <Link
              href="/builder/demo"
              className="px-8 py-3.5 bg-surface-100 text-surface-700 font-semibold rounded-xl hover:bg-surface-200 transition-colors"
            >
              Try Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Builder Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-surface-200 shadow-2xl overflow-hidden bg-surface-50">
            <div className="h-10 bg-surface-100 border-b border-surface-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4">
                <div className="w-64 h-6 bg-white rounded-md border border-surface-200 mx-auto flex items-center justify-center text-xs text-surface-400">
                  builder.jamstack.app
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 h-[500px]">
              {/* Left Panel */}
              <div className="col-span-2 bg-white border-r border-surface-200 p-3">
                <div className="text-xs font-semibold text-surface-400 uppercase mb-3">Elements</div>
                {['Section', 'Container', 'Heading', 'Text', 'Image', 'Button', 'Form', 'Video'].map(el => (
                  <div key={el} className="px-3 py-2 text-sm text-surface-600 hover:bg-brand-50 hover:text-brand-600 rounded-lg cursor-pointer mb-1 transition-colors">
                    {el}
                  </div>
                ))}
              </div>
              {/* Canvas */}
              <div className="col-span-7 bg-white p-8 flex flex-col items-center">
                <div className="w-full max-w-lg">
                  <div className="border-2 border-dashed border-brand-300 rounded-xl p-8 bg-brand-50/50 text-center mb-4">
                    <div className="text-3xl font-bold text-surface-900 mb-2">Welcome to Our Site</div>
                    <div className="text-surface-500 mb-4">Build amazing websites with JAMStack</div>
                    <div className="inline-block px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
                      Get Started
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-surface-100 rounded-lg border border-surface-200" />
                    ))}
                  </div>
                </div>
              </div>
              {/* Right Panel */}
              <div className="col-span-3 bg-white border-l border-surface-200 p-3">
                <div className="text-xs font-semibold text-surface-400 uppercase mb-3">Style</div>
                {['Layout', 'Typography', 'Background', 'Border', 'Spacing', 'Effects'].map(prop => (
                  <div key={prop} className="flex items-center justify-between py-2 px-2 text-sm text-surface-600 border-b border-surface-100">
                    <span>{prop}</span>
                    <div className="w-20 h-6 bg-surface-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface-50 border-y border-surface-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold text-brand-600 mb-1">{stat.value}</div>
              <div className="text-sm text-surface-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">
              Everything You Need to Build Amazing Websites
            </h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              A complete ecosystem for website creation, content management, e-commerce, and marketing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-lg text-brand-100 mb-8">
            Join thousands of creators using JAMStack Builder to create stunning, fast websites.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="w-full sm:w-auto whitespace-nowrap px-8 py-3 bg-surface-900 text-white font-semibold rounded-xl hover:bg-surface-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-surface-900 text-surface-400">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                JS
              </div>
              <span className="text-lg font-bold text-white">JAMStack Builder</span>
            </div>
            <p className="text-sm">The ultimate website builder powered by JAMStack architecture.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-surface-800 text-sm text-center">
          &copy; {new Date().getFullYear()} JAMStack Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
