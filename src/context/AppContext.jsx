import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State (with Next.js SSR safety)
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App Data collections
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [about, setAbout] = useState(null);
  const [admins, setAdmins] = useState([]); // Super Admin CRUD list
  const [dataLoading, setDataLoading] = useState(true);

  // Quote Modal Control
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Toast notifications helper
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync token from localStorage after component mounts in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('aura_token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        setAuthLoading(false);
      }
    }
  }, []);

  // Fetch functions
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) setGallery(data.gallery);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      if (data.success) setVideos(data.videos);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (data.success) setPricing(data.pricing);
    } catch (err) {
      console.error('Error fetching pricing:', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data.success) setAbout(data.about);
    } catch (err) {
      console.error('Error fetching about details:', err);
    }
  };

  // Fetch Admin Accounts (Super Admin only)
  const fetchAdmins = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  // Run initial data fetch
  const fetchAllData = async () => {
    setDataLoading(true);
    await Promise.all([
      fetchGallery(),
      fetchVideos(),
      fetchPricing(),
      fetchTestimonials(),
      fetchAbout()
    ]);
    setDataLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Check login status on token changes
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Check auth error:', err);
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    checkLoginStatus();
  }, [token]);

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aura_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Login request error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aura_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Account registered! Welcome, ${data.user.name}`, 'success');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Register request error:', err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_token');
    }
    setToken(null);
    setUser(null);
    showToast('Successfully logged out.', 'info');
  };

  // Admin Account Actions (Super Admin only)
  const createAdminAccount = async (accountData) => {
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accountData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchAdmins();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Network error.' };
    }
  };

  const updateAdminAccount = async (id, accountData) => {
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accountData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchAdmins();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Network error.' };
    }
  };

  const deleteAdminAccount = async (id) => {
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        fetchAdmins();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Network error.' };
    }
  };

  const isSuperAdmin = user && user.role === 'Super Admin';
  const isAdmin = user && (user.role === 'Super Admin' || user.role === 'Admin');
  const isStaff = user && ['Super Admin', 'Admin', 'Staff'].includes(user.role);

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        isAdmin,
        isSuperAdmin,
        isStaff,
        authLoading,
        login,
        register,
        logout,
        
        gallery,
        setGallery,
        fetchGallery,
        
        videos,
        setVideos,
        fetchVideos,
        
        pricing,
        setPricing,
        fetchPricing,
        
        testimonials,
        setTestimonials,
        fetchTestimonials,
        
        about,
        setAbout,
        fetchAbout,

        admins,
        setAdmins,
        fetchAdmins,
        createAdminAccount,
        updateAdminAccount,
        deleteAdminAccount,
        
        dataLoading,
        fetchAllData,

        isQuoteModalOpen,
        setIsQuoteModalOpen,

        toast,
        showToast
      }}
    >
      {children}
      {/* Dynamic Toast Element */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-onyx-light border border-gold/40 text-cream px-5 py-4 rounded-md shadow-premium animate-bounce max-w-sm">
          <div className={`w-2.5 h-2.5 rounded-full mr-3 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-gold'}`} />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </AppContext.Provider>
  );
};
