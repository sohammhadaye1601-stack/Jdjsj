import React, { useState, useEffect } from 'react';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProgramsSection } from './components/ProgramsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { GallerySection } from './components/GallerySection';
import { TrainersSection } from './components/TrainersSection';
import { MembershipPlansSection } from './components/MembershipPlansSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { EnquirySection } from './components/EnquirySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';

function MainApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Keyboard shortcut to toggle Admin Dashboard: Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans selection:bg-[#E32636] selection:text-white flex flex-col">
      {/* Sticky Navigation Bar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <WhyChooseUsSection />
        <GallerySection />
        <TrainersSection />
        <MembershipPlansSection />
        <TestimonialsSection />
        <EnquirySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating WhatsApp Action */}
      <FloatingWhatsApp />

      {/* Manual Editing System / Admin Dashboard */}
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainApp />
    </ContentProvider>
  );
}
