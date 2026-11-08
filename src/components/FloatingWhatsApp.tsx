import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { MessageCircle, Phone, X } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/helpers';

export const FloatingWhatsApp: React.FC = () => {
  const { content } = useContent();
  const { businessInfo } = content;
  const [isOpen, setIsOpen] = useState(false);

  const phone1 = businessInfo.phoneNumbers[0] || '98868 22368';
  const phone2 = businessInfo.phoneNumbers[1] || '7676965555';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-72 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 backdrop-blur-md animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading text-xs font-bold text-white uppercase">
                  HR PRO Chat
                </h4>
                <p className="text-[10px] text-emerald-400">Online • Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
              aria-label="Close chat window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 py-3 leading-relaxed">
            Need pricing, personal trainer slots, or gym location details? Click below to start chatting on WhatsApp:
          </p>

          <div className="space-y-2">
            <a
              href={formatWhatsAppLink(
                phone1,
                'Hi HR PRO FITNESS! I want to enquire about gym memberships and training programs.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on {phone1}</span>
            </a>

            <a
              href={formatWhatsAppLink(
                phone2,
                'Hi HR PRO FITNESS! I would like to book a free gym visit and consultation.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on {phone2}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-105 group relative"
        aria-label="Open WhatsApp Chat Support"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E32636] rounded-full flex items-center justify-center text-[9px] font-black text-white animate-pulse">
          1
        </span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
};
