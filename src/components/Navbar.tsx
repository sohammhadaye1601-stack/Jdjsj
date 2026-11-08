import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Dumbbell, Phone, Instagram, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { content, isAdmin } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);

  const { businessInfo } = content;
  const primaryPhone = businessInfo.phoneNumbers[0] || '98868 22368';
  const secondaryPhone = businessInfo.phoneNumbers[1] || '7676965555';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Plans', href: '#memberships' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090909]/95 backdrop-blur-md border-b border-neutral-800 shadow-xl py-3'
          : 'bg-gradient-to-b from-black/90 via-black/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#E32636] flex items-center justify-center text-white shadow-lg shadow-[#E32636]/30 group-hover:scale-105 transition-transform shrink-0">
              <Dumbbell className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-white flex items-center gap-1.5 whitespace-nowrap">
                HR PRO <span className="text-[#E32636]">FITNESS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-neutral-400 tracking-wider hidden sm:block">
                Managed by {businessInfo.managedBy || '@redrapidrush_group'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-[#E32636] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E32636] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & CTAs */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Instagram link */}
            <a
              href={businessInfo.instagramUrl || 'https://instagram.com/hrprofitness'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram @hrprofitness"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#E32636] transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E32636]" />
              <span className="hidden xl:inline">{businessInfo.instagramHandle || '@hrprofitness'}</span>
            </a>

            {/* Quick Call Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPhoneMenuOpen(!phoneMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#E32636] transition-all"
                aria-label="Call HR PRO FITNESS"
              >
                <Phone className="w-3.5 h-3.5 text-[#E32636]" />
                <span>Call Us</span>
              </button>
              {phoneMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setPhoneMenuOpen(false)}
                >
                  <p className="text-[11px] font-semibold text-neutral-400 px-3 py-1.5 uppercase tracking-wider">
                    Call Gym Reception
                  </p>
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#E32636]" />
                    <span>{primaryPhone}</span>
                  </a>
                  <a
                    href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#E32636]" />
                    <span>{secondaryPhone}</span>
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp Quick Action */}
            <a
              href={formatWhatsAppLink(primaryPhone, 'Hello HR PRO FITNESS! I want to enquire about gym memberships and personal training.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enquire on WhatsApp"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-xs font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500 hover:text-black'
                  : 'bg-neutral-800/80 text-neutral-300 hover:text-white border border-neutral-700 hover:border-[#E32636]'
              }`}
              title="Open Manual Editing & Management Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-[#E32636]" />
              <span>{isAdmin ? 'Admin Mode' : 'Admin'}</span>
            </button>

            {/* Join CTA */}
            <a
              href="#enquiry"
              className="px-4 py-2 rounded-lg bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E32636]/25 hover:shadow-[#E32636]/40 hover:-translate-y-0.5"
            >
              Join Now
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border ${
                isAdmin ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
              aria-label="Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-[#E32636]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:text-[#E32636]"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 border-b border-neutral-800 px-6 py-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase tracking-wider font-semibold text-neutral-200 hover:text-[#E32636] py-1 border-b border-neutral-900"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Direct Reception Calls:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-white hover:border-[#E32636]"
              >
                <Phone className="w-3.5 h-3.5 text-[#E32636]" />
                <span>{primaryPhone}</span>
              </a>
              <a
                href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-white hover:border-[#E32636]"
              >
                <Phone className="w-3.5 h-3.5 text-[#E32636]" />
                <span>{secondaryPhone}</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <a
                href={businessInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-200"
              >
                <Instagram className="w-4 h-4 text-[#E32636]" />
                <span>@hrprofitness</span>
              </a>
              <a
                href={formatWhatsAppLink(primaryPhone, 'Hi HR PRO FITNESS! Please send me membership details.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 text-xs font-bold text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <a
              href="#enquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-3 rounded-lg bg-[#E32636] text-white text-center text-sm font-bold uppercase tracking-wider shadow-lg"
            >
              Start Your Fitness Journey
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
