import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  X,
  Lock,
  LogOut,
  Save,
  RotateCcw,
  Users,
  Layout,
  Dumbbell,
  Camera,
  Award,
  CreditCard,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Phone,
  MessageCircle,
  ExternalLink,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { filterEnquiries, formatWhatsAppLink } from '../../utils/helpers';
import {
  ProgramItem,
  GalleryItem,
  TrainerItem,
  MembershipPlan,
  TestimonialItem,
  SiteContent,
} from '../../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    content,
    updateContent,
    resetContent,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    showToast,
  } = useContent();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'enquiries' | 'content' | 'programs' | 'gallery' | 'trainers' | 'memberships' | 'testimonials' | 'settings'
  >('enquiries');

  // Local draft of content so user can edit and review before or auto-save
  const [draft, setDraft] = useState<SiteContent>(content);
  const [isSaving, setIsSaving] = useState(false);

  // Enquiry filters
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'new' | 'contacted' | 'enrolled' | 'archived'>('all');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwChangeMsg, setPwChangeMsg] = useState('');

  // Keep draft in sync if external content loads
  React.useEffect(() => {
    setDraft(content);
  }, [content]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await loginAdmin(passwordInput);
    if (!res.success) {
      setLoginError(res.message || 'Incorrect password.');
    } else {
      setPasswordInput('');
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await updateContent(draft);
    setIsSaving(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB. Please choose a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
        showToast('Image uploaded successfully', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwChangeMsg('');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwChangeMsg('Password updated successfully!');
        setCurrentPw('');
        setNewPw('');
      } else {
        setPwChangeMsg(`Error: ${data.error || 'Failed to update'}`);
      }
    } catch {
      setPwChangeMsg('Error contacting server.');
    }
  };

  // If not authenticated, render Login Modal
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#E32636]/20 text-[#E32636] flex items-center justify-center mb-6">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-heading text-2xl font-black text-white uppercase tracking-wide">
            ADMIN PORTAL LOGIN
          </h2>
          <p className="text-xs text-neutral-400 mt-1 mb-6">
            Sign in to manage live website content, gallery, trainers, and customer enquiries.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: hrpro@2025)"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#E32636]"
                autoFocus
              />
              {loginError && <p className="text-xs text-red-400 mt-1">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#E32636]/30"
            >
              Sign In To Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-500">
            Default preset password: <span className="text-[#E32636] font-mono font-bold">hrpro@2025</span>
          </div>
        </div>
      </div>
    );
  }

  const filteredEnquiriesList = filterEnquiries(enquiries, enquiryFilter, enquirySearch);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E32636] flex items-center justify-center text-white font-black text-sm">
            HR
          </div>
          <div>
            <h1 className="font-heading text-lg font-black text-white tracking-wide flex items-center gap-2">
              HR PRO FITNESS <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#E32636]/20 text-[#E32636] uppercase tracking-wider border border-[#E32636]/40">Admin Dashboard</span>
            </h1>
            <p className="text-[10px] text-neutral-400">
              Manual Content & Lead Management System • Changes persist live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#E32636]/30 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
            aria-label="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Tabs */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-56 bg-neutral-950 border-r border-neutral-800 p-3 space-y-1 overflow-y-auto shrink-0 hidden md:block">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'enquiries'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Enquiries / Leads</span>
            </div>
            {enquiries.filter((e) => e.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-black text-[10px] font-black">
                {enquiries.filter((e) => e.status === 'new').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'content'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Headings & Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('programs')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'programs'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Programs ({draft.programs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Gym Gallery ({draft.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('trainers')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trainers'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Trainers ({draft.trainers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'memberships'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Membership Plans ({draft.membershipPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Testimonials ({draft.testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#E32636] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site & Contact Settings</span>
          </button>
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex overflow-x-auto bg-neutral-950 border-b border-neutral-800 p-2 gap-1 shrink-0">
          {[
            { id: 'enquiries', label: 'Enquiries' },
            { id: 'content', label: 'Content' },
            { id: 'programs', label: 'Programs' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'trainers', label: 'Trainers' },
            { id: 'memberships', label: 'Plans' },
            { id: 'testimonials', label: 'Reviews' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
                activeTab === tab.id ? 'bg-[#E32636] text-white' : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#090909]">
          {/* TAB 1: ENQUIRIES CRM */}
          {activeTab === 'enquiries' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Customer Enquiries & Leads
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Live database of potential members submitted through the website form.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search name, phone, or goal..."
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 w-48 sm:w-64"
                  />
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'new', 'contacted', 'enrolled', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      enquiryFilter === st
                        ? 'bg-[#E32636] text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {st} ({st === 'all' ? enquiries.length : enquiries.filter((e) => e.status === st).length})
                  </button>
                ))}
              </div>

              {/* List */}
              {filteredEnquiriesList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 text-neutral-400">
                  <p className="text-sm font-semibold">No enquiries found under this filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnquiriesList.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-bold text-white">
                              {enq.fullName}
                            </h3>
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                enq.status === 'new'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : enq.status === 'contacted'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : enq.status === 'enrolled'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {enq.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Received on {new Date(enq.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Status Change Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-white font-semibold"
                          >
                            <option value="new">Mark New</option>
                            <option value="contacted">Mark Contacted</option>
                            <option value="enrolled">Mark Enrolled</option>
                            <option value="archived">Mark Archived</option>
                          </select>

                          <button
                            onClick={() => deleteEnquiry(enq.id)}
                            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details & Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-neutral-500">Phone: </span>
                            <span className="text-white font-bold">{enq.phone}</span>
                          </div>
                          {enq.email && (
                            <div>
                              <span className="text-neutral-500">Email: </span>
                              <span className="text-neutral-300">{enq.email}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-neutral-500">Goal: </span>
                            <span className="text-[#E32636] font-semibold">{enq.fitnessGoal}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Program: </span>
                            <span className="text-neutral-200">{enq.preferredProgram}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {enq.message && (
                            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
                              <span className="font-semibold text-neutral-400">Note: </span>
                              {enq.message}
                            </div>
                          )}

                          {/* Quick Follow-up Buttons */}
                          <div className="flex gap-2">
                            <a
                              href={`tel:${enq.phone.replace(/[^\d+]/g, '')}`}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center justify-center gap-1.5 text-center"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#E32636]" />
                              <span>Call Lead</span>
                            </a>
                            <a
                              href={formatWhatsAppLink(
                                enq.phone,
                                `Hi ${enq.fullName}, this is HR PRO FITNESS following up on your enquiry for ${enq.preferredProgram}!`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="font-heading text-xl font-black text-white uppercase">
                  Website Headings & Paragraphs
                </h2>
                <p className="text-xs text-neutral-400">
                  Update any headline, philosophy description, or tagline. Edits will show immediately on the homepage.
                </p>
              </div>

              {/* Hero Section Box */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="font-heading text-base font-bold text-[#E32636] uppercase tracking-wider">
                  Hero Section
                </h3>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Main Hero Headline
                  </label>
                  <input
                    type="text"
                    value={draft.hero.mainHeading}
                    onChange={(e) =>
                      setDraft({ ...draft, hero: { ...draft.hero, mainHeading: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Subheading / Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={draft.hero.subHeading}
                    onChange={(e) =>
                      setDraft({ ...draft, hero: { ...draft.hero, subHeading: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      CTA Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.ctaPrimaryText}
                      onChange={(e) =>
                        setDraft({ ...draft, hero: { ...draft.hero, ctaPrimaryText: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      CTA Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={draft.hero.ctaSecondaryText}
                      onChange={(e) =>
                        setDraft({ ...draft, hero: { ...draft.hero, ctaSecondaryText: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Hero Background Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draft.hero.backgroundImage}
                      onChange={(e) =>
                        setDraft({ ...draft, hero: { ...draft.hero, backgroundImage: e.target.value } })
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                    />
                    <label className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e, (url) =>
                            setDraft({ ...draft, hero: { ...draft.hero, backgroundImage: url } })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* About Us Box */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="font-heading text-base font-bold text-[#E32636] uppercase tracking-wider">
                  About Us Section ("MORE THAN JUST A GYM")
                </h3>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={draft.about.heading}
                    onChange={(e) =>
                      setDraft({ ...draft, about: { ...draft.about, heading: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Introduction Story
                  </label>
                  <textarea
                    rows={3}
                    value={draft.about.intro}
                    onChange={(e) =>
                      setDraft({ ...draft, about: { ...draft.about, intro: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Detailed Methodology / Description
                  </label>
                  <textarea
                    rows={3}
                    value={draft.about.description}
                    onChange={(e) =>
                      setDraft({ ...draft, about: { ...draft.about, description: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm resize-none"
                  />
                </div>
              </div>

              {/* Save Bar */}
              <div className="sticky bottom-4 flex justify-end">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-2xl"
                >
                  Save Text Changes
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PROGRAMS */}
          {activeTab === 'programs' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Gym Programs & Services
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Add or modify services offered (Strength, Weight Loss, Muscle Building, etc.)
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProg: ProgramItem = {
                      id: `prog-${Date.now()}`,
                      title: 'New Fitness Program',
                      subtitle: 'Specialized Program',
                      description: 'Comprehensive coaching tailored for strength, stamina, and posture.',
                      benefits: ['Expert Guidance', 'Personalized Routine', 'BCA Assessment'],
                      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
                      badge: 'New',
                    };
                    setDraft({ ...draft, programs: [newProg, ...draft.programs] });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Program</span>
                </button>
              </div>

              <div className="space-y-4">
                {draft.programs.map((prog, index) => (
                  <div
                    key={prog.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="font-heading text-sm font-bold text-white uppercase">
                        Program #{index + 1}: {prog.title}
                      </span>
                      <button
                        onClick={() => {
                          const updated = draft.programs.filter((p) => p.id !== prog.id);
                          setDraft({ ...draft, programs: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Program Title
                        </label>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={(e) => {
                            const updated = [...draft.programs];
                            updated[index].title = e.target.value;
                            setDraft({ ...draft, programs: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Subtitle / Focus
                        </label>
                        <input
                          type="text"
                          value={prog.subtitle}
                          onChange={(e) => {
                            const updated = [...draft.programs];
                            updated[index].subtitle = e.target.value;
                            setDraft({ ...draft, programs: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Badge (e.g. Most Popular)
                        </label>
                        <input
                          type="text"
                          value={prog.badge || ''}
                          onChange={(e) => {
                            const updated = [...draft.programs];
                            updated[index].badge = e.target.value;
                            setDraft({ ...draft, programs: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={prog.description}
                        onChange={(e) => {
                          const updated = [...draft.programs];
                          updated[index].description = e.target.value;
                          setDraft({ ...draft, programs: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Image URL or Upload
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={prog.image}
                            onChange={(e) => {
                              const updated = [...draft.programs];
                              updated[index].image = e.target.value;
                              setDraft({ ...draft, programs: updated });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                          />
                          <label className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (url) => {
                                  const updated = [...draft.programs];
                                  updated[index].image = url;
                                  setDraft({ ...draft, programs: updated });
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Benefits (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={prog.benefits.join(', ')}
                          onChange={(e) => {
                            const updated = [...draft.programs];
                            updated[index].benefits = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setDraft({ ...draft, programs: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Gym Gallery Photo Management
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Upload new photos, replace images, delete, or rearrange order.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const newPhoto: GalleryItem = {
                      id: `photo-${Date.now()}`,
                      title: 'Gym Floor Equipment',
                      category: 'Interiors',
                      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
                      caption: 'HR PRO FITNESS modern workout zone',
                      order: draft.gallery.length + 1,
                    };
                    setDraft({ ...draft, gallery: [newPhoto, ...draft.gallery] });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {draft.gallery.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800">
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#E32636] border border-neutral-700">
                        {photo.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">
                          Photo Title
                        </label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) => {
                            const updated = [...draft.gallery];
                            updated[index].title = e.target.value;
                            setDraft({ ...draft, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">
                          Category
                        </label>
                        <select
                          value={photo.category}
                          onChange={(e) => {
                            const updated = [...draft.gallery];
                            updated[index].category = e.target.value as any;
                            setDraft({ ...draft, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        >
                          <option value="Interiors">Interiors</option>
                          <option value="Workout">Workout</option>
                          <option value="Weight Training">Weight Training</option>
                          <option value="Personal Training">Personal Training</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Transformations">Transformations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">
                          Image URL or Replace
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={photo.imageUrl}
                            onChange={(e) => {
                              const updated = [...draft.gallery];
                              updated[index].imageUrl = e.target.value;
                              setDraft({ ...draft, gallery: updated });
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs truncate"
                          />
                          <label className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer flex items-center">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (url) => {
                                  const updated = [...draft.gallery];
                                  updated[index].imageUrl = url;
                                  setDraft({ ...draft, gallery: updated });
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Reorder and Delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            const updated = [...draft.gallery];
                            const temp = updated[index];
                            updated[index] = updated[index - 1];
                            updated[index - 1] = temp;
                            setDraft({ ...draft, gallery: updated });
                          }}
                          className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
                          title="Move Left"
                        >
                          <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          disabled={index === draft.gallery.length - 1}
                          onClick={() => {
                            if (index === draft.gallery.length - 1) return;
                            const updated = [...draft.gallery];
                            const temp = updated[index];
                            updated[index] = updated[index + 1];
                            updated[index + 1] = temp;
                            setDraft({ ...draft, gallery: updated });
                          }}
                          className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
                          title="Move Right"
                        >
                          <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const updated = draft.gallery.filter((p) => p.id !== photo.id);
                          setDraft({ ...draft, gallery: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRAINERS */}
          {activeTab === 'trainers' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Trainer Profiles
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Edit trainer credentials, photographs, experience, and bios.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTrainer: TrainerItem = {
                      id: `trainer-${Date.now()}`,
                      name: 'Coach Name',
                      specialization: 'Strength Coach',
                      experience: '5+ Years Experience',
                      bio: 'Dedicated personal coach with certifications in sports biomechanics.',
                      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
                      certifications: ['Certified Personal Trainer', 'CPR/AED'],
                      instagram: '@trainer_handle',
                    };
                    setDraft({ ...draft, trainers: [...draft.trainers, newTrainer] });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Trainer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {draft.trainers.map((tr, index) => (
                  <div
                    key={tr.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="font-heading text-sm font-bold text-white uppercase">
                        Trainer #{index + 1}: {tr.name}
                      </span>
                      <button
                        onClick={() => {
                          const updated = draft.trainers.filter((t) => t.id !== tr.id);
                          setDraft({ ...draft, trainers: updated });
                        }}
                        className="text-neutral-500 hover:text-red-400"
                        title="Delete Trainer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={tr.name}
                          onChange={(e) => {
                            const updated = [...draft.trainers];
                            updated[index].name = e.target.value;
                            setDraft({ ...draft, trainers: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Experience Badge
                        </label>
                        <input
                          type="text"
                          value={tr.experience}
                          onChange={(e) => {
                            const updated = [...draft.trainers];
                            updated[index].experience = e.target.value;
                            setDraft({ ...draft, trainers: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={tr.specialization}
                        onChange={(e) => {
                          const updated = [...draft.trainers];
                          updated[index].specialization = e.target.value;
                          setDraft({ ...draft, trainers: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Short Bio
                      </label>
                      <textarea
                        rows={2}
                        value={tr.bio}
                        onChange={(e) => {
                          const updated = [...draft.trainers];
                          updated[index].bio = e.target.value;
                          setDraft({ ...draft, trainers: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Photo URL or Upload
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tr.image}
                          onChange={(e) => {
                            const updated = [...draft.trainers];
                            updated[index].image = e.target.value;
                            setDraft({ ...draft, trainers: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs truncate"
                        />
                        <label className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer flex items-center">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e, (url) => {
                                const updated = [...draft.trainers];
                                updated[index].image = url;
                                setDraft({ ...draft, trainers: updated });
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Certifications (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={tr.certifications.join(', ')}
                        onChange={(e) => {
                          const updated = [...draft.trainers];
                          updated[index].certifications = e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean);
                          setDraft({ ...draft, trainers: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MEMBERSHIP PLANS */}
          {activeTab === 'memberships' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Membership Pricing & Offers
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Add new pricing tiers, change prices, update festive discounts, and amenity checklists.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newPlan: MembershipPlan = {
                      id: `plan-${Date.now()}`,
                      name: 'Special Package',
                      duration: '3 Months Access',
                      price: '₹4,999',
                      originalPrice: '₹6,500',
                      popular: false,
                      badge: 'Special Offer',
                      features: ['Full gym access', 'Trainer guidance', 'Locker access'],
                      offerText: 'Limited seasonal package',
                    };
                    setDraft({ ...draft, membershipPlans: [...draft.membershipPlans, newPlan] });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Plan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {draft.membershipPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="font-heading text-sm font-bold text-white uppercase">
                        Plan #{index + 1}: {plan.name}
                      </span>
                      <button
                        onClick={() => {
                          const updated = draft.membershipPlans.filter((p) => p.id !== plan.id);
                          setDraft({ ...draft, membershipPlans: updated });
                        }}
                        className="text-neutral-500 hover:text-red-400"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => {
                            const updated = [...draft.membershipPlans];
                            updated[index].name = e.target.value;
                            setDraft({ ...draft, membershipPlans: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Duration Label
                        </label>
                        <input
                          type="text"
                          value={plan.duration}
                          onChange={(e) => {
                            const updated = [...draft.membershipPlans];
                            updated[index].duration = e.target.value;
                            setDraft({ ...draft, membershipPlans: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Price (e.g. ₹5,999)
                        </label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => {
                            const updated = [...draft.membershipPlans];
                            updated[index].price = e.target.value;
                            setDraft({ ...draft, membershipPlans: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Original Price (Optional strikethrough)
                        </label>
                        <input
                          type="text"
                          value={plan.originalPrice || ''}
                          onChange={(e) => {
                            const updated = [...draft.membershipPlans];
                            updated[index].originalPrice = e.target.value;
                            setDraft({ ...draft, membershipPlans: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                        <input
                          type="checkbox"
                          checked={plan.popular}
                          onChange={(e) => {
                            const updated = [...draft.membershipPlans];
                            updated[index].popular = e.target.checked;
                            setDraft({ ...draft, membershipPlans: updated });
                          }}
                          className="rounded bg-neutral-950 border-neutral-700 text-[#E32636] focus:ring-[#E32636]"
                        />
                        <span>Featured / Most Popular Highlight</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Offer Text / Banner
                      </label>
                      <input
                        type="text"
                        value={plan.offerText || ''}
                        onChange={(e) => {
                          const updated = [...draft.membershipPlans];
                          updated[index].offerText = e.target.value;
                          setDraft({ ...draft, membershipPlans: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Features (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={plan.features.join('\n')}
                        onChange={(e) => {
                          const updated = [...draft.membershipPlans];
                          updated[index].features = e.target.value.split('\n').filter((l) => l.trim() !== '');
                          setDraft({ ...draft, membershipPlans: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-black text-white uppercase">
                    Testimonials & Transformations
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Add customer reviews, transformation achievements, and pictures.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTest: TestimonialItem = {
                      id: `rev-${Date.now()}`,
                      name: 'Member Name',
                      rating: 5,
                      program: 'Weight Loss Program',
                      text: 'Outstanding gym environment and supportive coaches. Delivered real results!',
                      results: 'Lost 10 kg',
                      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                    };
                    setDraft({ ...draft, testimonials: [...draft.testimonials, newTest] });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {draft.testimonials.map((test, index) => (
                  <div
                    key={test.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="font-heading text-sm font-bold text-white uppercase">
                        Review #{index + 1}: {test.name}
                      </span>
                      <button
                        onClick={() => {
                          const updated = draft.testimonials.filter((t) => t.id !== test.id);
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="text-neutral-500 hover:text-red-400"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Member Name
                        </label>
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => {
                            const updated = [...draft.testimonials];
                            updated[index].name = e.target.value;
                            setDraft({ ...draft, testimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                          Program / Discipline
                        </label>
                        <input
                          type="text"
                          value={test.program}
                          onChange={(e) => {
                            const updated = [...draft.testimonials];
                            updated[index].program = e.target.value;
                            setDraft({ ...draft, testimonials: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Results Milestone (e.g. Lost 15kg in 5 months)
                      </label>
                      <input
                        type="text"
                        value={test.results || ''}
                        onChange={(e) => {
                          const updated = [...draft.testimonials];
                          updated[index].results = e.target.value;
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                        Review Quote
                      </label>
                      <textarea
                        rows={3}
                        value={test.text}
                        onChange={(e) => {
                          const updated = [...draft.testimonials];
                          updated[index].text = e.target.value;
                          setDraft({ ...draft, testimonials: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: WEBSITE SETTINGS & BRAND */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="font-heading text-xl font-black text-white uppercase">
                  Website Settings & Contact Details
                </h2>
                <p className="text-xs text-neutral-400">
                  Manage phone numbers, Instagram, Google Maps embed, brand name, and security password.
                </p>
              </div>

              {/* Business Info Form */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="font-heading text-base font-bold text-[#E32636] uppercase tracking-wider">
                  Contact & Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.name}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Managed By Credit
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.managedBy}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, managedBy: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Primary Contact Number
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.phoneNumbers[0] || ''}
                      onChange={(e) => {
                        const updated = [...draft.businessInfo.phoneNumbers];
                        updated[0] = e.target.value;
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, phoneNumbers: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Secondary Contact Number
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.phoneNumbers[1] || ''}
                      onChange={(e) => {
                        const updated = [...draft.businessInfo.phoneNumbers];
                        updated[1] = e.target.value;
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, phoneNumbers: updated },
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.instagramHandle}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, instagramHandle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={draft.businessInfo.instagramUrl}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          businessInfo: { ...draft.businessInfo, instagramUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Gym Physical Address
                  </label>
                  <textarea
                    rows={2}
                    value={draft.businessInfo.address}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        businessInfo: { ...draft.businessInfo, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    value={draft.businessInfo.googleMapsEmbedUrl}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        businessInfo: { ...draft.businessInfo, googleMapsEmbedUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Password Change Box */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                  Change Admin Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        placeholder="Current password"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        New Password (Min 5 chars)
                      </label>
                      <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="New strong password"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                  {pwChangeMsg && (
                    <p className={`text-xs ${pwChangeMsg.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {pwChangeMsg}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-sm font-bold text-white uppercase">
                    Restore Default Content
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Reset all copy, gallery, and pricing back to the original HR PRO FITNESS demo setup.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to restore default content?')) {
                      await resetContent();
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-red-900/40 text-neutral-300 hover:text-red-300 text-xs font-bold border border-neutral-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Defaults</span>
                </button>
              </div>

              {/* Save Bar */}
              <div className="sticky bottom-4 flex justify-end">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 rounded-xl bg-[#E32636] hover:bg-[#c91e2d] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-2xl"
                >
                  Save Settings & Details
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
