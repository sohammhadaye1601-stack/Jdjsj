import React from 'react';
import { useContent } from '../context/ContentContext';
import {
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Dumbbell,
  Compass,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const { content } = useContent();
  const { whyChooseUs } = content;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BadgeCheck':
        return <BadgeCheck className="w-7 h-7 text-[#E32636]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-[#E32636]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-7 h-7 text-[#E32636]" />;
      case 'Dumbbell':
        return <Dumbbell className="w-7 h-7 text-[#E32636]" />;
      case 'Compass':
        return <Compass className="w-7 h-7 text-[#E32636]" />;
      case 'HeartPulse':
      default:
        return <HeartPulse className="w-7 h-7 text-[#E32636]" />;
    }
  };

  return (
    <section id="why-us" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Subtle background red accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E32636]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The HR PRO Advantage</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {whyChooseUs.heading || 'WHY CHOOSE HR PRO FITNESS?'}
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            {whyChooseUs.subheading || 'Designed For Peak Performance, Longevity, And Unstoppable Results'}
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.features.map((feature, idx) => (
            <div
              key={feature.id || idx}
              className="relative p-8 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 hover:border-[#E32636]/70 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Feature Number Watermark */}
              <span className="absolute top-4 right-6 font-heading text-4xl font-black text-neutral-800/40 select-none group-hover:text-[#E32636]/20 transition-colors">
                0{idx + 1}
              </span>

              <div className="w-14 h-14 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center mb-6 group-hover:bg-[#E32636]/20 group-hover:border-[#E32636]/40 transition-all">
                {renderIcon(feature.icon)}
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-[#E32636] transition-colors">
                {feature.title}
              </h3>

              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Motivational Callout Strip */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-heading text-2xl font-black text-white uppercase">
              Ready To See The Facility In Person?
            </h4>
            <p className="text-neutral-400 text-sm">
              Walk into our Bengaluru center for a complimentary body assessment and guided tour.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#enquiry"
              className="px-6 py-3 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E32636]/30"
            >
              Claim Free Tour
            </a>
            <a
              href="#gallery"
              className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              View Gallery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
