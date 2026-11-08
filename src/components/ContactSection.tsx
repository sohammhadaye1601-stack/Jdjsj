import React from 'react';
import { useContent } from '../context/ContentContext';
import {
  Phone,
  Instagram,
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';

export const ContactSection: React.FC = () => {
  const { content } = useContent();
  const { businessInfo } = content;

  const phone1 = businessInfo.phoneNumbers[0] || '98868 22368';
  const phone2 = businessInfo.phoneNumbers[1] || '7676965555';

  return (
    <section id="contact" className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#E32636] text-xs font-bold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Or Call Us</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            CONTACT & LOCATION
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold text-neutral-400 max-w-2xl uppercase tracking-wider">
            HR PRO FITNESS • Managed by {businessInfo.managedBy || '@redrapidrush_group'}
          </p>
          <div className="w-20 h-1 bg-[#E32636] mt-4 rounded-full" />
        </div>

        {/* Contact Info Cards & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Phone Card with Click to Call */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E32636]/15 text-[#E32636] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white uppercase">
                    Call Gym Reception
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Instant inquiries and appointment scheduling
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${phone1.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-[#E32636] text-white font-bold text-sm transition-colors border border-neutral-700 hover:border-[#E32636]"
                >
                  <Phone className="w-4 h-4 text-[#E32636] group-hover:text-white" />
                  <span>{phone1}</span>
                </a>
                <a
                  href={`tel:${phone2.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-[#E32636] text-white font-bold text-sm transition-colors border border-neutral-700 hover:border-[#E32636]"
                >
                  <Phone className="w-4 h-4 text-[#E32636] group-hover:text-white" />
                  <span>{phone2}</span>
                </a>
              </div>
            </div>

            {/* Social & WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white uppercase">
                    Instagram & WhatsApp
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Daily workout stories, reels, and direct support
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={businessInfo.instagramUrl || 'https://instagram.com/hrprofitness'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm transition-all border border-neutral-700"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{businessInfo.instagramHandle || '@hrprofitness'}</span>
                </a>

                <a
                  href={formatWhatsAppLink(phone1, 'Hello HR PRO FITNESS! Please send me gym admission details.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Location & Timings Details Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 text-[#E32636] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white uppercase">
                    Gym Location
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {businessInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 text-[#E32636] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-white uppercase">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    {businessInfo.openingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed with Directions Link */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 min-h-[460px]">
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E32636] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Interactive Gym Location Map
                </span>
              </div>
              <a
                href={businessInfo.googleMapsDirectionsUrl || 'https://maps.google.com/?q=HR+PRO+FITNESS'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E32636] hover:underline"
              >
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex-1 w-full relative min-h-[380px]">
              <iframe
                title="HR PRO FITNESS Location Map"
                src={
                  businessInfo.googleMapsEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124414.28822091494!2d77.51268616110998!3d12.975416049282302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
                }
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(95%)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
