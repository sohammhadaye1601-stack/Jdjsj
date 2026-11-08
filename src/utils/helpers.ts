import { Enquiry } from '../types';

/**
 * Clean and format Indian phone number for tel: or display
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Generate standard WhatsApp click-to-chat URL with encoded pre-filled text
 */
export function formatWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  // Default to India country code 91 if 10 digits
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${fullPhone}?text=${encodedText}`;
}

/**
 * Sanitize Instagram handle to ensure @ prefix and full URL
 */
export function sanitizeInstagram(handle: string): { handle: string; url: string } {
  const clean = handle.replace(/^@+/, '').trim();
  return {
    handle: `@${clean}`,
    url: `https://instagram.com/${clean}`,
  };
}

/**
 * Validate customer membership enquiry submission
 */
export function validateEnquiry(data: {
  fullName?: string;
  phone?: string;
  fitnessGoal?: string;
  preferredProgram?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const phoneDigits = (data.phone || '').replace(/[^\d]/g, '');
  if (!phoneDigits || phoneDigits.length < 10) {
    errors.phone = 'Please enter a valid 10-digit mobile number.';
  }

  if (!data.fitnessGoal || data.fitnessGoal.trim() === '') {
    errors.fitnessGoal = 'Please select your primary fitness goal.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filter and sort enquiries by status and date
 */
export function filterEnquiries(
  enquiries: Enquiry[],
  filter: 'all' | 'new' | 'contacted' | 'enrolled' | 'archived',
  searchTerm = ''
): Enquiry[] {
  return enquiries
    .filter((item) => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.fullName.toLowerCase().includes(term) ||
        item.phone.includes(term) ||
        item.fitnessGoal.toLowerCase().includes(term) ||
        item.preferredProgram.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
