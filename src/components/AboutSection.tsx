import React from 'react';
import { useContent } from '../context/ContentContext';
import { Award, Flame, Target, Users, CheckCircle, ArrowUpRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { content } = useContent();
  const { about } = content;

  // Icon mapping
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'award':
        return <Award className="w-6 h-6 text-[#E32636]" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-[#E32636]" />;
      case 'target':
        return <Target className="w-6 h-6 text-[#E32636]" />;
      case 'users':
      default:
        return <Users className="w-6 h-6 text-[#E32636]" />;
    }
  };

  return (
    <section id="about" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#E32636]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header tag */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <span>Our Philosophy</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {about.heading || 'MORE THAN JUST A GYM.'}
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            {about.subheading || 'Unleash Your True Potential With World-Class Coaching & Equipment'}
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Grid: Story & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              WHERE DISCIPLINE MEETS TRANSFORMATION
            </h3>
            <p className="text-neutral-300 text-base leading-relaxed">
              {about.intro}
            </p>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              {about.description}
            </p>

            {/* Quick check points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-[#E32636] shrink-0" />
                <span>Certified Sports Kinesiologists</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-[#E32636] shrink-0" />
                <span>Olympic Lifting & Heavy Dumbbells</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-[#E32636] shrink-0" />
                <span>Bi-Weekly Body Composition (BCA)</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-200 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 text-[#E32636] shrink-0" />
                <span>100% Supportive, Zero-Ego Zone</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#E32636]/30 hover:-translate-y-0.5"
              >
                <span>Book A Free Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group">
              <img
                src={about.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop'}
                alt="HR PRO FITNESS training community"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-2xl font-black text-[#E32636]">1,500+</span>
                    <p className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                      Success Stories Built Here
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#E32636]/20 flex items-center justify-center text-[#E32636]">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Requested: Professional training environment, Certified personal trainers, Goal-oriented fitness, Supportive fitness community */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.highlights.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-[#E32636]/60 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-5 group-hover:bg-[#E32636]/20 transition-colors">
                {getIcon(item.icon)}
              </div>
              <h4 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-[#E32636] transition-colors">
                {item.title}
              </h4>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
