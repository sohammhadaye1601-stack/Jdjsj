import React from 'react';
import { useContent } from '../context/ContentContext';
import { ChevronRight, Dumbbell, Shield, Trophy, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { content } = useContent();
  const { hero, businessInfo } = content;

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Image with Dark Vignette & Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.backgroundImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop'}
          alt="HR PRO FITNESS Gym Floor"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-125 scale-105 transform motion-safe:animate-pulse [animation-duration:12s]"
        />
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-black/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#090909]/50 to-[#090909]" />
        {/* Gym Grid Overlay Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-[#E32636]/40 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg shadow-[#E32636]/10">
          <Flame className="w-3.5 h-3.5 fill-[#E32636]" />
          <span>{businessInfo.tagline || 'Your Fitness Journey Starts With Us.'}</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] max-w-5xl uppercase drop-shadow-2xl">
          {hero.mainHeading ? (
            hero.mainHeading
          ) : (
            <>
              BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E32636] to-red-500">STRONGEST</span> VERSION.
            </>
          )}
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl font-normal leading-relaxed">
          {hero.subHeading || 'Train harder. Get stronger. Become better. Your fitness journey starts at HR PRO FITNESS.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#enquiry"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-base uppercase tracking-wider transition-all duration-200 shadow-2xl shadow-[#E32636]/40 hover:shadow-[#E32636]/60 hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            <span>{hero.ctaPrimaryText || 'START YOUR FITNESS JOURNEY'}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#programs"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-neutral-500 font-heading font-bold text-base uppercase tracking-wider transition-all duration-200 backdrop-blur-md hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>{hero.ctaSecondaryText || 'EXPLORE OUR GYM'}</span>
          </a>
        </div>

        {/* Key Credibility Bar / Stats */}
        <div className="mt-16 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-md">
          {hero.stats && hero.stats.length > 0 ? (
            hero.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center py-3 px-2 border-r last:border-r-0 border-neutral-800/60">
                <span className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E32636]">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-neutral-400 mt-1 uppercase tracking-wider text-center">
                  {stat.label}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col items-center justify-center py-2 px-2 border-r border-neutral-800">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#E32636]">750+</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Active Members</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 px-2 border-r border-neutral-800">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#E32636]">12+</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Certified Trainers</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 px-2 border-r border-neutral-800">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#E32636]">7,500 Sq Ft</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Modern Floor</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 px-2">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#E32636]">1,500+</span>
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Transformations</span>
              </div>
            </>
          )}
        </div>

        {/* Managed By Credit Badge */}
        <div className="mt-8 text-xs text-neutral-500 font-medium flex items-center gap-2">
          <span>Managed by</span>
          <span className="text-neutral-300 font-semibold">{businessInfo.managedBy || '@redrapidrush_group'}</span>
          <span>•</span>
          <span>Direct Contact:</span>
          <span className="text-[#E32636] font-semibold">{businessInfo.phoneNumbers[0] || '98868 22368'}</span>
        </div>
      </div>
    </section>
  );
};
