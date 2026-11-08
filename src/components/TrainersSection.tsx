import React from 'react';
import { useContent } from '../context/ContentContext';
import { Award, Instagram, MessageSquare, Dumbbell, ShieldCheck } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';

export const TrainersSection: React.FC = () => {
  const { content, setSelectedProgramForEnquiry } = useContent();
  const { trainers, businessInfo } = content;
  const primaryPhone = businessInfo.phoneNumbers[0] || '98868 22368';

  const handleConsult = (trainerName: string) => {
    setSelectedProgramForEnquiry(`Certified Personal Training (with ${trainerName})`);
    const el = document.getElementById('enquiry');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="trainers" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#E32636]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Elite Mentors</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            CERTIFIED TRAINERS
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            Mentored By Athletes, Kinesiologists & Certified Personal Transformation Specialists
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Trainer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="group flex flex-col rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden hover:border-[#E32636] transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-neutral-950">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />

                {/* Experience Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs font-extrabold text-[#E32636] tracking-wider shadow-lg">
                    {trainer.experience}
                  </span>
                </div>

                {trainer.instagram && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-[#E32636]" />
                      <span>{trainer.instagram}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#E32636] transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-xs font-bold text-[#E32636] uppercase tracking-wider mt-1">
                    {trainer.specialization}
                  </p>

                  <p className="text-neutral-400 text-xs leading-relaxed mt-3 line-clamp-3">
                    {trainer.bio}
                  </p>
                </div>

                {/* Certifications badges */}
                <div className="pt-2 border-t border-neutral-800 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold text-neutral-300"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-[#E32636]" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>

                  {/* Consult Button */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleConsult(trainer.name)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-[#E32636] text-white text-xs font-bold uppercase tracking-wider transition-colors text-center"
                    >
                      Book Session
                    </button>
                    <a
                      href={formatWhatsAppLink(
                        primaryPhone,
                        `Hi HR PRO FITNESS! I want to train under Coach ${trainer.name}. Please share details.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                      title={`Chat on WhatsApp about ${trainer.name}`}
                      aria-label={`Chat about ${trainer.name}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
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
