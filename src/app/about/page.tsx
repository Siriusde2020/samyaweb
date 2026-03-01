'use client';

import Link from 'next/link';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';

const teamMembers = [
  {
    name: 'Samya Patel',
    role: 'Founder & CEO',
    bio: 'Former Google engineer with 12 years building web platforms. Passionate about democratizing website creation.',
    initials: 'SP',
    color: 'bg-brand-600',
  },
  {
    name: 'Marcus Chen',
    role: 'CTO',
    bio: 'Ex-Vercel architect who helped build the JAMStack movement. Leads our engineering team of 40+.',
    initials: 'MC',
    color: 'bg-emerald-600',
  },
  {
    name: 'Aisha Rahman',
    role: 'VP of Design',
    bio: 'Award-winning designer from Figma. Oversees product design, templates, and user experience.',
    initials: 'AR',
    color: 'bg-violet-600',
  },
  {
    name: 'David Okonkwo',
    role: 'VP of Engineering',
    bio: 'Distributed systems expert from AWS. Leads our global CDN and infrastructure team.',
    initials: 'DO',
    color: 'bg-amber-600',
  },
  {
    name: 'Elena Vasquez',
    role: 'Head of AI',
    bio: 'PhD in NLP from Stanford. Pioneering AI-powered website generation and content optimization.',
    initials: 'EV',
    color: 'bg-rose-600',
  },
  {
    name: 'James Hartley',
    role: 'Head of Growth',
    bio: 'Scaled two SaaS startups to $50M ARR. Drives go-to-market strategy and partnerships.',
    initials: 'JH',
    color: 'bg-cyan-600',
  },
];

const timeline = [
  {
    year: '2021',
    title: 'The Idea',
    description:
      'Samya Patel envisioned a website builder that combined the power of JAMStack with the simplicity of no-code tools. The first prototype was built in a garage in San Francisco.',
  },
  {
    year: '2022',
    title: 'Seed Round & Beta Launch',
    description:
      'Raised $4M seed round led by Accel Partners. Launched private beta with 500 early adopters who helped shape the core visual builder experience.',
  },
  {
    year: '2023',
    title: 'Public Launch & Series A',
    description:
      'Opened to the public and reached 10,000 users within 3 months. Secured $18M Series A from Andreessen Horowitz. Launched headless CMS and e-commerce features.',
  },
  {
    year: '2024',
    title: 'AI & Global Expansion',
    description:
      'Introduced AI-powered website generation. Expanded CDN to 80+ edge locations. Crossed 50,000 active users and 200,000 websites built on the platform.',
  },
  {
    year: '2025',
    title: 'Enterprise & Series B',
    description:
      'Launched enterprise tier with white-label capabilities. Raised $45M Series B. Team grew to 120 employees across 4 offices worldwide.',
  },
  {
    year: '2026',
    title: 'The Future',
    description:
      'Pushing boundaries with AI-first website creation, advanced collaboration features, and expanding into new markets. Our mission to empower 1 million creators is just beginning.',
  },
];

const coreValues = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'Innovation First',
    description:
      'We push the boundaries of what is possible on the web. From AI-powered generation to edge-first architecture, we embrace the cutting edge.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community Driven',
    description:
      'Our users are our co-creators. Every major feature starts as community feedback. We build in public and share our roadmap openly.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Performance Obsessed',
    description:
      'Speed is not a feature, it is a requirement. Every site built on Samya Web scores 95+ on Lighthouse by default with zero configuration.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Globally Accessible',
    description:
      'The web belongs to everyone. We support multi-language sites, WCAG accessibility standards, and deploy to 80+ edge locations worldwide.',
  },
];

const stats = [
  { value: '200K+', label: 'Websites Built' },
  { value: '50K+', label: 'Active Users' },
  { value: '120+', label: 'Countries' },
  { value: '99.99%', label: 'Uptime' },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
            About Samya Web
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-surface-900 leading-tight mb-6">
            We are on a mission to{' '}
            <span className="text-brand-600">empower every creator</span> on the web
          </h1>
          <p className="text-xl text-surface-500 max-w-2xl mx-auto leading-relaxed">
            Samya Web is building the next generation of website creation tools. We believe everyone
            deserves a beautiful, fast, and powerful web presence -- without needing to write a single
            line of code.
          </p>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Company Story / Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Our Story</h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              From a garage prototype to a platform powering hundreds of thousands of websites worldwide.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-surface-200 -translate-x-1/2" />
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col md:flex-row items-start gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <div className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-bold mb-2">
                      {event.year}
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 mb-2">{event.title}</h3>
                    <p className="text-surface-500 leading-relaxed">{event.description}</p>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 top-1 w-4 h-4 bg-brand-600 rounded-full border-4 border-white shadow -translate-x-1/2" />
                  {/* Spacer for the other side */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 bg-surface-50 border-y border-surface-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="p-8 bg-white rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">{value.title}</h3>
                <p className="text-surface-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              A world-class team of engineers, designers, and builders united by the goal of making the web accessible to everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group p-6 rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg transition-all text-center"
              >
                {/* Photo Placeholder */}
                <div
                  className={`w-24 h-24 ${member.color} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-brand-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-surface-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-24 px-6 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Join Our Team</h2>
          <p className="text-lg text-brand-100 mb-4 leading-relaxed">
            We are a remote-first company with team members across 15 countries. We offer competitive
            compensation, equity, unlimited PTO, and the chance to shape the future of the web.
          </p>
          <p className="text-brand-200 mb-8">
            Currently hiring for Engineering, Design, Sales, and Marketing roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white text-brand-600 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
            >
              View Open Positions
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors"
            >
              Send Us Your Resume
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
