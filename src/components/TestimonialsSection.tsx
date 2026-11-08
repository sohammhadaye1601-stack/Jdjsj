import React from 'react';
import { useContent } from '../context/ContentContext';
import { Star, Quote, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { content } = useContent();
  const { testimonials } = content;

  return (
    <section id="testimonials" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Real Results</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            MEMBER TRANSFORMATIONS
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            Hear From Everyday People Who Committed To The Process And Achieved Their Strongest Self
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="relative p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E32636]/60 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <Quote className="w-10 h-10 text-neutral-800 group-hover:text-[#E32636]/20 transition-colors absolute top-6 right-6" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                  "{test.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80">
                {/* Result Pill */}
                {test.results && (
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-[#E32636]/10 border border-[#E32636]/30 text-[11px] font-bold text-[#E32636]">
                      🏆 {test.results}
                    </span>
                  </div>
                )}

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                  />
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">
                      {test.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      {test.program}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
