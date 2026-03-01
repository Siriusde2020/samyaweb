'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

type AIMode = 'website' | 'copy' | 'seo' | 'image' | 'layout' | 'brand' | 'logo' | 'chatbot';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'image' | 'layout';
}

export function AIAssistant() {
  const [activeMode, setActiveMode] = useState<AIMode>('website');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const modes = [
    { id: 'website' as const, label: 'Website Generator', icon: '🌐', description: 'Generate a full website from a text prompt' },
    { id: 'copy' as const, label: 'AI Copywriting', icon: '✍️', description: 'Generate marketing copy, headlines, and content' },
    { id: 'seo' as const, label: 'SEO Optimizer', icon: '🔍', description: 'AI-powered SEO suggestions and improvements' },
    { id: 'image' as const, label: 'Image Generator', icon: '🎨', description: 'Generate images from text descriptions' },
    { id: 'layout' as const, label: 'Layout Suggestions', icon: '📐', description: 'AI-powered layout and design recommendations' },
    { id: 'brand' as const, label: 'Brand Identity', icon: '🎯', description: 'Generate brand colors, fonts, and guidelines' },
    { id: 'logo' as const, label: 'Logo Generator', icon: '⭐', description: 'Create logo designs from description' },
    { id: 'chatbot' as const, label: 'Chatbot Builder', icon: '💬', description: 'Build and train an AI chatbot for your site' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses: Record<AIMode, string> = {
      website: `I've analyzed your request and generated a website structure:\n\n**Pages Created:**\n- Home (Hero + Features + CTA)\n- About (Team + Story)\n- Services (Grid Layout)\n- Contact (Form + Map)\n\n**Design System:**\n- Primary: #4c6ef5\n- Font: Inter\n- Style: Modern, Clean\n\nThe pages are ready in the builder. You can customize each section visually.`,
      copy: `Here are some generated copy options:\n\n**Headline Options:**\n1. "Transform Your Business with Cutting-Edge Solutions"\n2. "Where Innovation Meets Simplicity"\n3. "Build Better. Scale Faster."\n\n**Subheadline:**\n"Join thousands of businesses that trust our platform to deliver exceptional digital experiences."\n\n**CTA Button:**\n"Start Your Free Trial" or "Get Started Today"`,
      seo: `**SEO Analysis Results:**\n\n✅ Title Tag: Good length (55 chars)\n⚠️ Meta Description: Missing - Add a 150-160 char description\n❌ H1 Tag: Multiple H1 tags found - Use only one\n✅ Image Alt Tags: 8/10 images have alt text\n⚠️ Page Speed: 72/100 - Optimize images\n✅ Mobile Friendly: Yes\n\n**Recommendations:**\n1. Add meta description with target keywords\n2. Fix heading hierarchy (single H1)\n3. Compress hero image (-45% size possible)\n4. Add structured data for rich snippets`,
      image: `I'll generate an image based on your description. The AI image generation is powered by our integrated model.\n\n**Generated:** 1 image at 1024x1024\n**Style:** As requested\n**Format:** WebP (optimized)\n\nThe image has been added to your media library and is ready to use in the builder.`,
      layout: `**Layout Suggestions for your page:**\n\n1. **Hero Section** - Full-width with gradient background, centered text, CTA button\n2. **Features Grid** - 3-column grid with icons, responsive to single column on mobile\n3. **Testimonials** - Carousel with customer quotes and photos\n4. **Pricing Table** - 3-tier pricing with highlighted recommended plan\n5. **FAQ Accordion** - Expandable questions section\n6. **Footer** - 4-column with links, social, newsletter\n\nWould you like me to apply any of these layouts?`,
      brand: `**Brand Identity Generated:**\n\n🎨 **Color Palette:**\n- Primary: #4c6ef5 (Trust Blue)\n- Secondary: #748ffc (Light Accent)\n- Accent: #f59f00 (Energy Gold)\n- Dark: #1a1a2e\n- Light: #f8f9fa\n\n📝 **Typography:**\n- Headings: Poppins (Bold)\n- Body: Inter (Regular)\n\n🎯 **Brand Voice:** Professional yet approachable, innovative, trustworthy\n\nShall I apply this brand identity to your site?`,
      logo: `**Logo Concepts Generated:**\n\n1. **Wordmark** - Clean typography with accent color\n2. **Icon + Text** - Abstract geometric icon with company name\n3. **Monogram** - Stylized initials with modern design\n\nEach logo comes in:\n- Full color, black, white versions\n- SVG, PNG formats\n- Square and horizontal layouts\n\nSelect a concept to refine further.`,
      chatbot: `**Chatbot Configuration:**\n\n🤖 **Bot Name:** Your AI Assistant\n\n**Trained Intents:**\n- Greeting & Welcome\n- Product/Service Information\n- Pricing Questions\n- Contact/Support\n- FAQ Responses\n- Lead Capture\n\n**Settings:**\n- Position: Bottom-right\n- Theme: Match site colors\n- Response Time: Instant\n- Fallback: Email form\n\nThe chatbot widget has been added to your site.`,
    };

    setMessages(prev => [...prev, { role: 'assistant', content: responses[activeMode] }]);
    setPrompt('');
    setIsGenerating(false);
  };

  return (
    <div className="flex h-full">
      {/* Mode Selector */}
      <div className="w-64 border-r border-surface-200 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">AI Tools</h3>
        <div className="space-y-1">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => { setActiveMode(mode.id); setMessages([]); }}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
                activeMode === mode.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:bg-surface-50'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{mode.icon}</span>
                <div>
                  <p className="text-sm font-medium">{mode.label}</p>
                  <p className="text-[10px] text-surface-400 mt-0.5">{mode.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat/Generation Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">
            {modes.find(m => m.id === activeMode)?.icon} {modes.find(m => m.id === activeMode)?.label}
          </h2>
          <p className="text-sm text-surface-500">
            {modes.find(m => m.id === activeMode)?.description}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-4">{modes.find(m => m.id === activeMode)?.icon}</span>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">
                {modes.find(m => m.id === activeMode)?.label}
              </h3>
              <p className="text-sm text-surface-400 max-w-md mb-6">
                {activeMode === 'website' && 'Describe the website you want to build and AI will generate the full structure, content, and design.'}
                {activeMode === 'copy' && 'Tell us about your business or page, and AI will generate compelling copy.'}
                {activeMode === 'seo' && 'Paste your page URL or content for AI-powered SEO analysis and suggestions.'}
                {activeMode === 'image' && 'Describe the image you need and AI will generate it for your site.'}
                {activeMode === 'layout' && 'Describe your page purpose and AI will suggest optimal layouts.'}
                {activeMode === 'brand' && 'Tell us about your business and AI will generate a complete brand identity.'}
                {activeMode === 'logo' && 'Describe your brand for AI-generated logo concepts.'}
                {activeMode === 'chatbot' && 'Configure and train an AI chatbot for your website visitors.'}
              </p>

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 max-w-lg justify-center">
                {activeMode === 'website' && ['SaaS landing page for a project management tool', 'Portfolio site for a photographer', 'E-commerce store for handmade jewelry'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
                {activeMode === 'copy' && ['Homepage hero section for a fintech startup', 'Product description for eco-friendly water bottle', 'About page for a design agency'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
                {activeMode === 'brand' && ['Tech startup focused on sustainability', 'Luxury fashion brand', 'Children\'s education platform'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 text-xs bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'max-w-2xl rounded-2xl p-4',
                msg.role === 'user'
                  ? 'ml-auto bg-brand-600 text-white'
                  : 'bg-surface-50 border border-surface-200 text-surface-800'
              )}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="max-w-2xl bg-surface-50 border border-surface-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm text-surface-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI is generating...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
              placeholder={
                activeMode === 'website' ? 'Describe the website you want to build...' :
                activeMode === 'copy' ? 'What copy do you need?' :
                activeMode === 'seo' ? 'Paste URL or describe your page...' :
                activeMode === 'image' ? 'Describe the image you need...' :
                'Enter your prompt...'
              }
              className="flex-1 builder-input"
              disabled={isGenerating}
            />
            <Button onClick={handleGenerate} loading={isGenerating} disabled={!prompt.trim()}>
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
