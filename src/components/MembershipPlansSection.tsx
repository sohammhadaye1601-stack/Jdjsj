import React from 'react';
import { useContent } from '../context/ContentContext';
import { Check, Flame, MessageCircle, ArrowRight } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';

export const MembershipPlansSection: React.FC = () => {
  const { content, setSelectedProgramForEnquiry } = useContent();
  const { membershipPlans, businessInfo } = content;
  const primaryPhone = businessInfo.phoneNumbers[0] || '98868 22368';

  const handleSelectPlan = (planName: string) => {
    setSelectedProgramForEnquiry(`Membership Plan: ${planName}`);
    const el = document.getElementById('enquiry');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="memberships" className="py-24 bg-[#090909] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <Flame className="w-3.5 h-3.5 fill-[#E32636]" />
            <span>Membership Packages</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            CHOOSE YOUR COMMITMENT
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            Flexible Membership Plans Tailored For Beginners And Committed Athletes
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl bg-neutral-900/90 border transition-all duration-300 hover:-translate-y-2 flex-1 justify-between ${
                plan.popular
                  ? 'border-[#E32636] shadow-2xl shadow-[#E32636]/20 ring-1 ring-[#E32636]'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Popular / Best Value Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-[#E32636] text-white text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>{plan.badge || 'Most Popular'}</span>
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-white uppercase">
                    {plan.name}
                  </h3>
                  {!plan.popular && plan.badge && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-neutral-400 mt-1">
                  {plan.duration}
                </p>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  {plan.originalPrice && (
                    <span className="text-sm font-semibold text-neutral-500 line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>

                {/* Offer text */}
                {plan.offerText && (
                  <p className="mt-2 text-xs font-medium text-[#E32636] bg-[#E32636]/10 px-3 py-1.5 rounded-lg border border-[#E32636]/20">
                    {plan.offerText}
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="p-6 space-y-3 flex-1 border-t border-neutral-800/80 mt-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Included Amenities:
                </p>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-[#E32636] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-[#E32636] hover:bg-[#c91e2d] text-white shadow-lg shadow-[#E32636]/30'
                      : 'bg-neutral-800 hover:bg-[#E32636] text-white'
                  }`}
                >
                  <span>Select Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={formatWhatsAppLink(
                    primaryPhone,
                    `Hi HR PRO FITNESS! I am interested in the ${plan.name} (${plan.price}). Please share more details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-xs text-neutral-500">
          * Plans and special seasonal offers can be added, modified or updated anytime via the Admin Dashboard.
        </div>
      </div>
    </section>
  );
};
