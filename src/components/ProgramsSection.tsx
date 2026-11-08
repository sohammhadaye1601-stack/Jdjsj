import React from 'react';
import { useContent } from '../context/ContentContext';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const ProgramsSection: React.FC = () => {
  const { content, setSelectedProgramForEnquiry } = useContent();
  const { programs } = content;

  const handleEnquireForProgram = (programTitle: string) => {
    setSelectedProgramForEnquiry(programTitle);
    const element = document.getElementById('enquiry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="programs" className="py-24 bg-[#090909] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeted Training Disciplines</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            OUR PROGRAMS
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            Engineered For Every Fitness Level — From Day-1 Rookies To Elite Athletes
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* 6 Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="group flex flex-col rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden hover:border-[#E32636]/80 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[#E32636]/10"
            >
              {/* Image with Dark Gradient */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                
                {prog.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#E32636] text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                    {prog.badge}
                  </span>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E32636]">
                    {prog.subtitle}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white tracking-wide mt-0.5">
                    {prog.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {prog.description}
                </p>

                {/* Key Benefits */}
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Key Highlights:
                  </p>
                  {prog.benefits.slice(0, 4).map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-[#E32636]/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#E32636]" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action */}
                <button
                  onClick={() => handleEnquireForProgram(prog.title)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-[#E32636] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-[#E32636] group-hover:shadow-lg group-hover:shadow-[#E32636]/25"
                >
                  <span>Enquire For This Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
