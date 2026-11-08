import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Send, MessageCircle, CheckCircle2, Flame, Phone } from 'lucide-react';
import { formatWhatsAppLink, validateEnquiry } from '../utils/helpers';

export const EnquirySection: React.FC = () => {
  const { content, submitEnquiry, selectedProgramForEnquiry } = useContent();
  const { businessInfo } = content;
  const primaryPhone = businessInfo.phoneNumbers[0] || '98868 22368';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('Weight Loss & Fat Burn');
  const [preferredProgram, setPreferredProgram] = useState('Strength Training');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (selectedProgramForEnquiry) {
      setPreferredProgram(selectedProgramForEnquiry);
    }
  }, [selectedProgramForEnquiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEnquiry({ fullName, phone, fitnessGoal });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const result = await submitEnquiry({
      fullName,
      phone,
      email: email || undefined,
      fitnessGoal,
      preferredProgram,
      message,
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmittedSuccess(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }
  };

  const currentWhatsAppText = `Hi HR PRO FITNESS! My name is ${fullName || 'a fitness enthusiast'}. I am looking for ${fitnessGoal} under the ${preferredProgram} program. Please provide enrollment and membership details.`;

  return (
    <section id="enquiry" className="py-24 bg-[#090909] relative overflow-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E32636]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Motivational Copy & Direct WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 fill-[#E32636]" />
              <span>Take Action Now</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              YOUR FIRST STEP <span className="text-[#E32636]">STARTS HERE.</span>
            </h2>

            <p className="text-neutral-300 text-base leading-relaxed">
              Stop putting your physical health on hold. Send us a quick enquiry or chat directly with our head trainers. We will customize your roadmap based on your lifestyle, schedule, and physique goals.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-5 h-5 rounded-full bg-[#E32636]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E32636]" />
                </div>
                <span>Free In-Depth Body Composition Analysis (BCA)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-5 h-5 rounded-full bg-[#E32636]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E32636]" />
                </div>
                <span>Complimentary 1-on-1 Fitness Consultation</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-200">
                <div className="w-5 h-5 rounded-full bg-[#E32636]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E32636]" />
                </div>
                <span>Guided Gym Tour & Machine Walkthrough</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-white uppercase">
                    Prefer Instant Chat?
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Connect directly with the management team on WhatsApp.
                  </p>
                </div>
              </div>

              <a
                href={formatWhatsAppLink(primaryPhone, currentWhatsAppText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat On WhatsApp Now ({primaryPhone})</span>
              </a>
            </div>

            {/* Direct Reception numbers */}
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E32636]" />
              <span>Or Call Us Directly: </span>
              <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="text-white hover:text-[#E32636] font-semibold underline">
                {primaryPhone}
              </a>
              <span>/</span>
              <a href={`tel:${(businessInfo.phoneNumbers[1] || '7676965555').replace(/\s+/g, '')}`} className="text-white hover:text-[#E32636] font-semibold underline">
                {businessInfo.phoneNumbers[1] || '7676965555'}
              </a>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl backdrop-blur-md">
              {submittedSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase">
                    ENQUIRY RECEIVED!
                  </h3>
                  <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you! Your fitness journey with HR PRO FITNESS has officially begun. Our head trainer will reach out via call/WhatsApp within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-neutral-800 pb-4">
                    <h3 className="font-heading text-2xl font-black text-white uppercase tracking-wide">
                      MEMBERSHIP ENQUIRY FORM
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Fill out your goals and preferred training schedule.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="enquiry-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Full Name <span className="text-[#E32636]">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-950 border text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all ${
                        errors.fullName ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Phone & Email in Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="enquiry-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Phone Number <span className="text-[#E32636]">*</span>
                      </label>
                      <input
                        id="enquiry-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        placeholder="e.g. 98868 22368"
                        className={`w-full px-4 py-3 rounded-xl bg-neutral-950 border text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all ${
                          errors.phone ? 'border-red-500' : 'border-neutral-800'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="enquiry-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all"
                      />
                    </div>
                  </div>

                  {/* Fitness Goal & Preferred Training Program */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="enquiry-goal" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Primary Fitness Goal <span className="text-[#E32636]">*</span>
                      </label>
                      <select
                        id="enquiry-goal"
                        value={fitnessGoal}
                        onChange={(e) => setFitnessGoal(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all"
                      >
                        <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
                        <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                        <option value="Strength & Powerlifting">Strength & Powerlifting</option>
                        <option value="General Physical Fitness">General Physical Fitness</option>
                        <option value="1-on-1 Personal Training">1-on-1 Personal Training</option>
                        <option value="Beginner Conditioning">Beginner Conditioning</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="enquiry-program" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Preferred Program
                      </label>
                      <select
                        id="enquiry-program"
                        value={preferredProgram}
                        onChange={(e) => setPreferredProgram(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all"
                      >
                        <option value="Strength Training">Strength Training</option>
                        <option value="Weight Loss & Fat Burn">Weight Loss & Fat Burn</option>
                        <option value="Muscle Building & Hypertrophy">Muscle Building</option>
                        <option value="Certified Personal Training">Certified Personal Training</option>
                        <option value="Functional Fitness & Conditioning">Functional Fitness</option>
                        <option value="Beginner Fitness Programs">Beginner Training</option>
                        <option value="Custom Membership Plan">Custom Membership Plan</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="enquiry-message" className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Your Message or Preferred Time Slot
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Interested in morning 6 AM batch. Looking for 3-month membership with personal trainer."
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#E32636]/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Your Enquiry...</span>
                      ) : (
                        <>
                          <span>Submit Membership Enquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
