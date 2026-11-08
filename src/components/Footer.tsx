import React from 'react';
import { useContent } from '../context/ContentContext';
import { Dumbbell, Instagram, Phone, Mail, MapPin, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { content } = useContent();
  const { businessInfo } = content;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-neutral-400 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E32636] flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-heading text-2xl font-black tracking-wider text-white">
                HR PRO <span className="text-[#E32636]">FITNESS</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-400">
              {businessInfo.tagline || 'Your Fitness Journey Starts With Us.'} High-end international fitness standards, Olympic strength equipment, and certified transformation coaching.
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300">
                Managed by <span className="text-[#E32636] font-bold">{businessInfo.managedBy || '@redrapidrush_group'}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-[#E32636] transition-colors">About HR PRO</a></li>
              <li><a href="#programs" className="hover:text-[#E32636] transition-colors">Training Programs</a></li>
              <li><a href="#why-us" className="hover:text-[#E32636] transition-colors">Why Choose Us</a></li>
              <li><a href="#gallery" className="hover:text-[#E32636] transition-colors">Gym Gallery</a></li>
              <li><a href="#trainers" className="hover:text-[#E32636] transition-colors">Certified Trainers</a></li>
              <li><a href="#memberships" className="hover:text-[#E32636] transition-colors">Membership Packages</a></li>
              <li><a href="#testimonials" className="hover:text-[#E32636] transition-colors">Transformations</a></li>
            </ul>
          </div>

          {/* Col 3: Programs Offered */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Strength & Conditioning</li>
              <li>Weight Loss & Fat Management</li>
              <li>Muscle Building & Hypertrophy</li>
              <li>Certified 1-on-1 Personal Training</li>
              <li>Functional Movement & Mobility</li>
              <li>Beginner Orientation Programs</li>
              <li>Postural Assessment & Rehab</li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              Connect With Us
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E32636] shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${(businessInfo.phoneNumbers[0] || '98868 22368').replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {businessInfo.phoneNumbers[0] || '98868 22368'}
                  </a>
                  <a href={`tel:${(businessInfo.phoneNumbers[1] || '7676965555').replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {businessInfo.phoneNumbers[1] || '7676965555'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Instagram className="w-3.5 h-3.5 text-[#E32636] shrink-0" />
                <a
                  href={businessInfo.instagramUrl || 'https://instagram.com/hrprofitness'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {businessInfo.instagramHandle || '@hrprofitness'}
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E32636] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {businessInfo.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} HR PRO FITNESS. All Rights Reserved. Managed by @redrapidrush_group.</p>

          <div className="flex items-center gap-4">
            {/* Admin Management portal button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#E32636] transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-[#E32636]" />
              <span>Owner Admin Portal</span>
            </button>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#E32636] hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
