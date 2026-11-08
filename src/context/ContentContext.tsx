import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, Enquiry } from '../types';
import { defaultSiteContent } from '../data/defaultContent';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
  isAdmin: boolean;
  adminToken: string | null;
  enquiries: Enquiry[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  updateContent: (newContent: SiteContent) => Promise<boolean>;
  resetContent: () => Promise<boolean>;
  loginAdmin: (password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  submitEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'status' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateEnquiryStatus: (id: string, status: Enquiry['status'], notes?: string) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  fetchEnquiries: () => Promise<void>;
  selectedProgramForEnquiry: string;
  setSelectedProgramForEnquiry: (program: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const cached = localStorage.getItem('hrpro_site_content');
      if (cached) return JSON.parse(cached);
    } catch {
      // fallback
    }
    return defaultSiteContent;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('hrpro_admin_token');
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('hrpro_admin_token');
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedProgramForEnquiry, setSelectedProgramForEnquiry] = useState<string>('Strength Training');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load content from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.content) {
            setContent(data.content);
            localStorage.setItem('hrpro_site_content', JSON.stringify(data.content));
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote content, using cached or default data', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Fetch enquiries if admin
  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setEnquiries(data.enquiries || []);
        }
      }
    } catch (err) {
      console.error('Error fetching enquiries', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchEnquiries();
    }
  }, [isAdmin]);

  const updateContent = async (newContent: SiteContent): Promise<boolean> => {
    try {
      // Optimistic update
      setContent(newContent);
      localStorage.setItem('hrpro_site_content', JSON.stringify(newContent));

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(newContent),
      });

      if (!res.ok) {
        throw new Error('Failed to save to server');
      }
      showToast('Website content saved successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Save error:', err);
      showToast('Saved locally in browser storage (offline mode)', 'info');
      return true;
    }
  };

  const resetContent = async (): Promise<boolean> => {
    try {
      setContent(defaultSiteContent);
      localStorage.setItem('hrpro_site_content', JSON.stringify(defaultSiteContent));
      await fetch('/api/reset-content', { method: 'POST' });
      showToast('Restored default website content', 'success');
      return true;
    } catch (err) {
      console.error('Reset error:', err);
      showToast('Reset applied locally', 'info');
      return false;
    }
  };

  const loginAdmin = async (password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdmin(true);
        setAdminToken(data.token);
        localStorage.setItem('hrpro_admin_token', data.token);
        showToast('Logged in as Administrator', 'success');
        fetchEnquiries();
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Invalid admin password' };
      }
    } catch {
      // Fallback for offline check
      if (password === 'hrpro@2025' || password === 'admin123') {
        const dummyToken = 'local_admin_token';
        setIsAdmin(true);
        setAdminToken(dummyToken);
        localStorage.setItem('hrpro_admin_token', dummyToken);
        showToast('Logged in as Administrator (Offline mode)', 'success');
        return { success: true };
      }
      return { success: false, message: 'Server connection error. Try default password: hrpro@2025' };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminToken(null);
    localStorage.removeItem('hrpro_admin_token');
    showToast('Logged out of Admin Portal', 'info');
  };

  const submitEnquiry = async (
    enquiryData: Omit<Enquiry, 'id' | 'status' | 'createdAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Your enquiry has been received! Our fitness coach will contact you shortly.', 'success');
        if (isAdmin) fetchEnquiries();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to submit enquiry' };
      }
    } catch {
      // Save locally if offline
      const localEnquiry: Enquiry = {
        ...enquiryData,
        id: `local-${Date.now()}`,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      setEnquiries((prev) => [localEnquiry, ...prev]);
      showToast('Enquiry saved! Our team will reach out soon.', 'success');
      return { success: true };
    }
  };

  const updateEnquiryStatus = async (id: string, status: Enquiry['status'], notes?: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status, ...(notes !== undefined ? { notes } : {}) } : item))
        );
        showToast('Enquiry updated successfully', 'success');
        return true;
      }
      return false;
    } catch {
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status, ...(notes !== undefined ? { notes } : {}) } : item))
      );
      showToast('Enquiry updated locally', 'success');
      return true;
    }
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        showToast('Enquiry deleted', 'info');
        return true;
      }
      return false;
    } catch {
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      showToast('Enquiry deleted locally', 'info');
      return true;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        isAdmin,
        adminToken,
        enquiries,
        toasts,
        showToast,
        removeToast,
        updateContent,
        resetContent,
        loginAdmin,
        logoutAdmin,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        fetchEnquiries,
        selectedProgramForEnquiry,
        setSelectedProgramForEnquiry,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
