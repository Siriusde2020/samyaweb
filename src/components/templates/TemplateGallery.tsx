'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TemplatePreview {
  id: string;
  name: string;
  category: string;
  industry: string;
  thumbnail: string;
  description: string;
  featured: boolean;
}

const templates: TemplatePreview[] = [
  { id: 'saas-1', name: 'SaaS Pro', category: 'saas', industry: 'Technology', thumbnail: '', description: 'Modern SaaS landing page with pricing and features', featured: true },
  { id: 'portfolio-1', name: 'Creative Portfolio', category: 'portfolio', industry: 'Design', thumbnail: '', description: 'Minimal portfolio for designers and creators', featured: true },
  { id: 'ecom-1', name: 'Shop Modern', category: 'ecommerce', industry: 'Retail', thumbnail: '', description: 'Full e-commerce store with product catalog', featured: true },
  { id: 'blog-1', name: 'Blog Standard', category: 'blog', industry: 'Media', thumbnail: '', description: 'Clean blog layout with CMS integration', featured: false },
  { id: 'agency-1', name: 'Agency Bold', category: 'agency', industry: 'Marketing', thumbnail: '', description: 'Bold agency website with case studies', featured: true },
  { id: 'corp-1', name: 'Corporate Plus', category: 'corporate', industry: 'Finance', thumbnail: '', description: 'Professional corporate website template', featured: false },
  { id: 'startup-1', name: 'Launch Pad', category: 'startup', industry: 'Technology', thumbnail: '', description: 'Startup landing page with waitlist', featured: true },
  { id: 'rest-1', name: 'Bistro', category: 'restaurant', industry: 'Food', thumbnail: '', description: 'Restaurant website with menu and reservations', featured: false },
  { id: 'travel-1', name: 'Wanderlust', category: 'travel', industry: 'Travel', thumbnail: '', description: 'Travel blog and booking site', featured: false },
  { id: 'law-1', name: 'Legal Pro', category: 'law', industry: 'Legal', thumbnail: '', description: 'Law firm website with practice areas', featured: false },
  { id: 'medical-1', name: 'MediCare', category: 'medical', industry: 'Healthcare', thumbnail: '', description: 'Medical practice website with appointment booking', featured: false },
  { id: 'edu-1', name: 'EduPlatform', category: 'education', industry: 'Education', thumbnail: '', description: 'Online course platform template', featured: false },
  { id: 'landing-1', name: 'ConvertMax', category: 'landing', industry: 'Marketing', thumbnail: '', description: 'High-converting landing page', featured: true },
  { id: 'onepage-1', name: 'OneScroll', category: 'onepage', industry: 'General', thumbnail: '', description: 'Single-page scrolling website', featured: false },
  { id: 'nonprofit-1', name: 'CauseForward', category: 'nonprofit', industry: 'Nonprofit', thumbnail: '', description: 'Nonprofit organization website', featured: false },
  { id: 'personal-1', name: 'PersonalBrand', category: 'personal', industry: 'Personal', thumbnail: '', description: 'Personal branding website', featured: false },
];

// Unique visual previews for each template: colored gradient + wireframe SVG
const TEMPLATE_PREVIEWS: Record<string, { gradient: string; svg: JSX.Element }> = {
  'saas-1': {
    gradient: 'from-purple-600 to-indigo-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Dashboard wireframe */}
        <rect x="8" y="6" width="104" height="8" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="10" y="8" width="16" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="80" y="8" width="10" height="4" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="94" y="8" width="14" height="4" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="8" y="18" width="30" height="36" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="12" y="22" width="22" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="12" y="27" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="12" y="32" width="20" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="12" y="37" width="16" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="42" y="18" width="34" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="46" y="22" width="12" height="9" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="62" y="25" width="10" height="6" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="80" y="18" width="32" height="17" rx="2" fill="currentColor" opacity="0.12" />
        <circle cx="96" cy="26" r="5" fill="currentColor" opacity="0.2" />
        <rect x="42" y="38" width="70" height="16" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="46" y="42" width="62" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="46" y="47" width="62" height="2" rx="1" fill="currentColor" opacity="0.15" />
      </svg>
    ),
  },
  'portfolio-1': {
    gradient: 'from-gray-800 to-gray-950',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Gallery wireframe */}
        <rect x="14" y="6" width="92" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="30" y="12" width="60" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="8" y="18" width="33" height="24" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="44" y="18" width="33" height="24" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="80" y="18" width="33" height="24" rx="2" fill="currentColor" opacity="0.15" />
        <rect x="14" y="26" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="50" y="26" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="86" y="26" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="14" y="30" width="14" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="50" y="30" width="14" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="86" y="30" width="14" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="8" y="46" width="50" height="8" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="62" y="46" width="50" height="8" rx="2" fill="currentColor" opacity="0.08" />
      </svg>
    ),
  },
  'ecom-1': {
    gradient: 'from-teal-500 to-teal-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Product grid wireframe */}
        <rect x="8" y="4" width="16" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="70" y="5" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="82" y="5" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="96" y="4" width="16" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="12" width="32" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="44" y="12" width="32" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="80" y="12" width="32" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="12" y="14" width="24" height="10" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="48" y="14" width="24" height="10" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="84" y="14" width="24" height="10" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="12" y="26" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="48" y="26" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="84" y="26" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="12" y="30" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="48" y="30" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="84" y="30" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="8" y="38" width="32" height="18" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="44" y="38" width="32" height="18" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="80" y="38" width="32" height="18" rx="2" fill="currentColor" opacity="0.08" />
      </svg>
    ),
  },
  'blog-1': {
    gradient: 'from-green-500 to-emerald-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Article layout wireframe */}
        <rect x="8" y="4" width="14" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="60" y="5" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="72" y="5" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="84" y="5" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="8" y="12" width="76" height="28" rx="2" fill="currentColor" opacity="0.06" />
        <rect x="12" y="14" width="68" height="10" rx="1" fill="currentColor" opacity="0.12" />
        <rect x="12" y="27" width="50" height="3" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="12" y="33" width="68" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="12" y="37" width="64" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="88" y="12" width="26" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="90" y="14" width="22" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="88" y="24" width="26" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="90" y="26" width="22" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="88" y="36" width="26" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="8" y="44" width="76" height="12" rx="2" fill="currentColor" opacity="0.06" />
        <rect x="12" y="47" width="40" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="12" y="51" width="68" height="2" rx="1" fill="currentColor" opacity="0.15" />
      </svg>
    ),
  },
  'agency-1': {
    gradient: 'from-gray-900 to-black',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Showcase wireframe */}
        <rect x="8" y="4" width="20" height="4" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="90" y="5" width="22" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="20" y="14" width="80" height="5" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="30" y="22" width="60" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="8" y="30" width="50" height="24" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="62" y="30" width="50" height="11" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="62" y="43" width="50" height="11" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="66" y="33" width="30" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="66" y="37" width="20" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="66" y="46" width="30" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="66" y="50" width="20" height="2" rx="1" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  'corp-1': {
    gradient: 'from-blue-600 to-blue-800',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Corporate layout wireframe */}
        <rect x="0" y="4" width="120" height="8" rx="0" fill="currentColor" opacity="0.08" />
        <rect x="8" y="6" width="18" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="50" y="7" width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="62" y="7" width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="74" y="7" width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="96" y="6" width="16" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="16" width="104" height="18" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="20" y="20" width="44" height="4" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="28" y="26" width="28" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="32" y="30" width="20" height="3" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="8" y="38" width="24" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="36" y="38" width="24" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="64" y="38" width="24" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="92" y="38" width="20" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="12" y="42" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="40" y="42" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="68" y="42" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="96" y="42" width="12" height="2" rx="1" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  'startup-1': {
    gradient: 'from-violet-500 to-violet-800',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Waitlist / launch wireframe */}
        <rect x="20" y="6" width="80" height="5" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="30" y="14" width="60" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="32" y="18" width="56" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="24" y="26" width="48" height="7" rx="3" fill="currentColor" opacity="0.1" />
        <rect x="28" y="28" width="40" height="3" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="74" y="26" width="22" height="7" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="20" y="40" width="16" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="40" y="40" width="16" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="60" y="40" width="16" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="80" y="40" width="16" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <circle cx="28" cy="44" r="3" fill="currentColor" opacity="0.25" />
        <circle cx="48" cy="44" r="3" fill="currentColor" opacity="0.25" />
        <circle cx="68" cy="44" r="3" fill="currentColor" opacity="0.25" />
        <circle cx="88" cy="44" r="3" fill="currentColor" opacity="0.25" />
        <rect x="22" y="49" width="12" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="42" y="49" width="12" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="62" y="49" width="12" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="82" y="49" width="12" height="2" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'rest-1': {
    gradient: 'from-orange-500 to-amber-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Menu wireframe */}
        <rect x="30" y="4" width="60" height="5" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="40" y="11" width="40" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="8" y="18" width="50" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <line x1="8" y1="22" x2="58" y2="22" stroke="currentColor" opacity="0.15" strokeWidth="0.5" />
        <rect x="8" y="25" width="34" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="25" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="8" y="30" width="30" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="30" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="8" y="35" width="36" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="35" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="66" y="18" width="46" height="20" rx="3" fill="currentColor" opacity="0.12" />
        <circle cx="89" cy="28" r="6" fill="currentColor" opacity="0.15" />
        <rect x="8" y="42" width="50" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <line x1="8" y1="46" x2="58" y2="46" stroke="currentColor" opacity="0.15" strokeWidth="0.5" />
        <rect x="8" y="49" width="32" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="49" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="8" y="54" width="28" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="54" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  'travel-1': {
    gradient: 'from-sky-400 to-sky-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Travel wireframe */}
        <rect x="8" y="4" width="104" height="24" rx="3" fill="currentColor" opacity="0.1" />
        <rect x="20" y="10" width="80" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="30" y="17" width="60" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="38" y="22" width="18" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="64" y="22" width="18" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="32" width="26" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="38" y="32" width="26" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="68" y="32" width="26" height="22" rx="2" fill="currentColor" opacity="0.12" />
        <rect x="98" y="32" width="14" height="22" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="12" y="34" width="18" height="8" rx="1" fill="currentColor" opacity="0.12" />
        <rect x="42" y="34" width="18" height="8" rx="1" fill="currentColor" opacity="0.12" />
        <rect x="72" y="34" width="18" height="8" rx="1" fill="currentColor" opacity="0.12" />
        <rect x="12" y="45" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="42" y="45" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="72" y="45" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="12" y="49" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="42" y="49" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="72" y="49" width="10" height="2" rx="1" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  'law-1': {
    gradient: 'from-blue-900 to-slate-900',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Legal wireframe */}
        <rect x="0" y="4" width="120" height="10" rx="0" fill="currentColor" opacity="0.08" />
        <rect x="8" y="7" width="24" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="70" y="8" width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="82" y="8" width="8" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="96" y="7" width="16" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="18" width="50" height="5" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="8" y="26" width="80" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="8" y="30" width="76" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="8" y="38" width="32" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="44" y="38" width="32" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="80" y="38" width="32" height="16" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="12" y="40" width="8" height="8" rx="4" fill="currentColor" opacity="0.15" />
        <rect x="48" y="40" width="8" height="8" rx="4" fill="currentColor" opacity="0.15" />
        <rect x="84" y="40" width="8" height="8" rx="4" fill="currentColor" opacity="0.15" />
        <rect x="24" y="42" width="12" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="60" y="42" width="12" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="96" y="42" width="12" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="24" y="46" width="10" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="60" y="46" width="10" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="96" y="46" width="10" height="2" rx="1" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  'medical-1': {
    gradient: 'from-green-500 to-teal-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Medical wireframe */}
        <rect x="0" y="4" width="120" height="8" rx="0" fill="currentColor" opacity="0.08" />
        <rect x="8" y="6" width="20" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <path d="M16 7 L16 11 M14 9 L18 9" stroke="currentColor" opacity="0.5" strokeWidth="1" />
        <rect x="96" y="6" width="16" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="8" y="16" width="60" height="20" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="14" y="20" width="40" height="4" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="14" y="27" width="30" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="14" y="31" width="20" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="72" y="16" width="40" height="20" rx="2" fill="currentColor" opacity="0.1" />
        <circle cx="92" cy="26" r="6" fill="currentColor" opacity="0.12" />
        <rect x="8" y="40" width="25" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="37" y="40" width="25" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="66" y="40" width="25" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="95" y="40" width="17" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <circle cx="20" cy="45" r="2" fill="currentColor" opacity="0.25" />
        <circle cx="49" cy="45" r="2" fill="currentColor" opacity="0.25" />
        <circle cx="78" cy="45" r="2" fill="currentColor" opacity="0.25" />
        <rect x="12" y="49" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="41" y="49" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="70" y="49" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'edu-1': {
    gradient: 'from-purple-500 to-purple-800',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Course wireframe */}
        <rect x="8" y="4" width="20" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="80" y="5" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="94" y="4" width="18" height="4" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="20" y="12" width="80" height="5" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="30" y="20" width="60" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="8" y="28" width="34" height="26" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="12" y="30" width="26" height="12" rx="1" fill="currentColor" opacity="0.12" />
        <polygon points="22,33 22,39 28,36" fill="currentColor" opacity="0.3" />
        <rect x="12" y="44" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="12" y="48" width="26" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="46" y="28" width="34" height="26" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="50" y="30" width="26" height="12" rx="1" fill="currentColor" opacity="0.12" />
        <polygon points="60,33 60,39 66,36" fill="currentColor" opacity="0.3" />
        <rect x="50" y="44" width="20" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <rect x="50" y="48" width="26" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="84" y="28" width="28" height="26" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="88" y="30" width="20" height="12" rx="1" fill="currentColor" opacity="0.12" />
        <polygon points="96,33 96,39 102,36" fill="currentColor" opacity="0.3" />
        <rect x="88" y="44" width="16" height="2" rx="1" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
  'landing-1': {
    gradient: 'from-orange-500 to-red-600',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Conversion landing wireframe */}
        <rect x="16" y="4" width="88" height="6" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="24" y="13" width="72" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="34" y="18" width="52" height="6" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="30" y="28" width="18" height="3" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="51" y="28" width="18" height="3" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="72" y="28" width="18" height="3" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="8" y="36" width="104" height="0.5" fill="currentColor" opacity="0.1" />
        <rect x="16" y="40" width="28" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="48" y="40" width="28" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="80" y="40" width="28" height="14" rx="2" fill="currentColor" opacity="0.1" />
        <circle cx="30" cy="44" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="62" cy="44" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="94" cy="44" r="2" fill="currentColor" opacity="0.3" />
        <rect x="20" y="48" width="20" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="52" y="48" width="20" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="84" y="48" width="20" height="2" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'onepage-1': {
    gradient: 'from-gray-500 to-gray-700',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Single-page scroll wireframe */}
        <rect x="8" y="2" width="104" height="10" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="30" y="5" width="60" height="4" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="8" y="14" width="104" height="8" rx="1" fill="currentColor" opacity="0.06" />
        <rect x="20" y="16" width="80" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="30" y="19" width="60" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="8" y="24" width="34" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="44" y="24" width="34" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="80" y="24" width="32" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="8" y="36" width="104" height="8" rx="1" fill="currentColor" opacity="0.06" />
        <rect x="20" y="38" width="80" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="40" y="41" width="40" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="8" y="46" width="104" height="10" rx="1" fill="currentColor" opacity="0.04" />
        <rect x="32" y="49" width="56" height="4" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="36" y="50" width="20" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="60" y="50" width="24" height="2" rx="2" fill="currentColor" opacity="0.4" />
        {/* Scroll indicator */}
        <rect x="58" y="57" width="4" height="2" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  'nonprofit-1': {
    gradient: 'from-green-600 to-emerald-800',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Charity wireframe */}
        <rect x="8" y="4" width="16" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="80" y="5" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="94" y="4" width="18" height="4" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="8" y="12" width="64" height="24" rx="3" fill="currentColor" opacity="0.08" />
        <rect x="14" y="16" width="46" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="14" y="23" width="36" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="14" y="28" width="22" height="5" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="76" y="12" width="36" height="24" rx="3" fill="currentColor" opacity="0.12" />
        {/* Heart icon suggestion */}
        <path d="M90,20 C88,16 82,16 82,20 C82,24 90,28 90,28 C90,28 98,24 98,20 C98,16 92,16 90,20Z" fill="currentColor" opacity="0.15" />
        <rect x="8" y="40" width="32" height="4" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="8" y="47" width="24" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="36" y="47" width="24" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="64" y="47" width="24" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="92" y="47" width="20" height="8" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="10" y="49" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="38" y="49" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="66" y="49" width="18" height="2" rx="1" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  'personal-1': {
    gradient: 'from-indigo-500 to-indigo-800',
    svg: (
      <svg viewBox="0 0 120 60" fill="none">
        {/* Personal brand wireframe */}
        <circle cx="60" cy="14" r="8" fill="currentColor" opacity="0.15" />
        <rect x="40" y="24" width="40" height="4" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="44" y="30" width="32" height="2" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="30" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="42" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="54" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="66" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="78" y="36" width="8" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <line x1="8" y1="42" x2="112" y2="42" stroke="currentColor" opacity="0.1" strokeWidth="0.5" />
        <rect x="8" y="46" width="32" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="44" y="46" width="32" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="80" y="46" width="32" height="10" rx="2" fill="currentColor" opacity="0.1" />
        <rect x="12" y="48" width="24" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="48" y="48" width="24" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="84" y="48" width="24" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="12" y="52" width="18" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="48" y="52" width="18" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="84" y="52" width="18" height="2" rx="1" fill="currentColor" opacity="0.15" />
      </svg>
    ),
  },
};

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'featured', label: 'Featured' },
  { id: 'saas', label: 'SaaS' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'blog', label: 'Blog' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'startup', label: 'Startup' },
  { id: 'agency', label: 'Agency' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'travel', label: 'Travel' },
  { id: 'law', label: 'Law' },
  { id: 'medical', label: 'Medical' },
  { id: 'education', label: 'Education' },
];

export function TemplateGallery({ onSelect }: { onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = templates.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.industry.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || (activeCategory === 'featured' ? t.featured : t.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="builder-input pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              activeCategory === cat.id
                ? 'bg-brand-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Blank Template */}
        <button
          onClick={() => onSelect('blank')}
          className="group border-2 border-dashed border-surface-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-400 hover:bg-brand-50 transition-colors min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center text-2xl mb-3 transition-colors">
            +
          </div>
          <span className="font-medium text-surface-700 group-hover:text-brand-600">Blank Site</span>
          <span className="text-xs text-surface-400 mt-1">Start from scratch</span>
        </button>

        {filtered.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="group border border-surface-200 rounded-xl overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all text-left"
          >
            <div className={cn(
              'h-40 bg-gradient-to-br relative',
              TEMPLATE_PREVIEWS[template.id]?.gradient || 'from-surface-100 to-surface-200'
            )}>
              {TEMPLATE_PREVIEWS[template.id]?.svg && (
                <div className="absolute inset-0 p-3 text-white">
                  {TEMPLATE_PREVIEWS[template.id].svg}
                </div>
              )}
              {template.featured && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-full">
                  Featured
                </span>
              )}
              <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 flex items-center justify-center transition-colors">
                <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-brand-600 text-sm font-medium rounded-lg shadow-lg transition-opacity">
                  Use Template
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-surface-500 mt-1">{template.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 bg-surface-100 rounded-full text-surface-500">
                  {template.industry}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
