import React from 'react';
import { ArrowLeft, CheckCircle2, Layers, Cpu, Palette, Smartphone, Heart } from 'lucide-react';

interface AboutModalProps {
  onBack: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onBack }) => {
  const highlights = [
    {
      title: 'Visual Design & Styling (Figma Match)',
      desc: 'Pixel-accurate Teal/Emerald (#00B59C) header, light gray canvas (#f3f4f6), white rounded-2xl cards, gray title & context boxes, and teal pill buttons.',
      icon: Palette,
    },
    {
      title: 'DummyJSON Integration & Mock Auth',
      desc: 'Connected to DummyJSON Posts, Users, and Comments API. Default logged-in user Emily Johnson (ID: 1) with instant author resolution and caching.',
      icon: Cpu,
    },
    {
      title: 'Smooth Infinite Scrolling Feed',
      desc: 'IntersectionObserver automated batch loading with limit & skip pagination, graceful skeleton loaders, and error states with Retry.',
      icon: Layers,
    },
    {
      title: '280-Character Post Creation',
      desc: 'Character counter (0/280) with dynamic safety warnings, asset attachments, and optimistic top-of-feed insertion.',
      icon: CheckCircle2,
    },
    {
      title: 'Optimistic Like / Unlike & Bookmarks',
      desc: 'Instant visual toggling for post likes, comments, and saved bookmarks with localStorage persistence.',
      icon: Heart,
    },
    {
      title: 'Responsive & Mobile First',
      desc: 'Full 3-column layout on Desktop (>1024px), compact navigation on Tablet (768-1023px), slide-out hamburger drawer and mobile FAB on Mobile (<767px).',
      icon: Smartphone,
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-2 py-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs font-semibold text-[#00B59C] bg-[#00B59C]/10 px-2.5 py-0.5 rounded-full">
          v1.0.0 Production Ready
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-card border border-gray-100 dark:border-slate-700/60 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00B59C] text-white flex items-center justify-center shadow-md shadow-[#00B59C]/30">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              About Chirp
            </h2>
            <p className="text-sm text-gray-500">
              Modern social web application built with React 19, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#00B59C]/10 text-[#00B59C]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {h.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-7">
                  {h.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
