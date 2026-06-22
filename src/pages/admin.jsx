import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppContext } from '../context/AppContext';
import {
  Calendar, Camera, IndianRupee, Video, MessageCircle, Info, DollarSign,
  Trash2, Edit, Save, Plus, Check, Clock, X, AlertTriangle, ShieldAlert,
  Users, TrendingUp, Search, Filter, ShieldCheck, Eye
} from 'lucide-react';

const Admin = () => {
  const router = useRouter();
  const {
    user, token, isAdmin, isSuperAdmin, isStaff, authLoading,
    gallery, fetchGallery,
    pricing, fetchPricing,
    videos, fetchVideos,
    testimonials, fetchTestimonials,
    about, fetchAbout,
    admins, fetchAdmins, createAdminAccount, updateAdminAccount, deleteAdminAccount,
    showToast
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('overview');
  
  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [bookingsFilter, setBookingsFilter] = useState('All');

  // Form states for adding items
  const [newGallery, setNewGallery] = useState({ title: '', description: '', price: '', category: 'Gel', imageUrl: '' });
  const [galleryFile, setGalleryFile] = useState(null);
  
  const [newPricing, setNewPricing] = useState({ serviceName: '', price: '', features: '', description: '', category: 'Basic' });
  const [newVideo, setNewVideo] = useState({ title: '', video: '', thumbnail: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', review: '', rating: 5, image: '' });

  // Admins CRUD state (Super Admin only)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editAdminData, setEditAdminData] = useState({ name: '', email: '', password: '', role: 'Admin' });

  // Pricing edit state (Super Admin only)
  const [editingPricingId, setEditingPricingId] = useState(null);
  const [editPricingData, setEditPricingData] = useState({ serviceName: '', price: '', features: '', description: '', category: 'Basic' });

  // About Content Form state
  const [editAbout, setEditAbout] = useState({
    salonIntro: '',
    mission: '',
    experienceYears: '',
    whyChooseUs: '',
    address: '',
    phone: '',
    email: '',
    hours: ''
  });

  // Load Bookings & Admins when page boots
  const loadBookings = async () => {
    if (!token) return;
    setBookingsLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (token && isStaff) {
      loadBookings();
      if (isSuperAdmin) {
        fetchAdmins();
      }
    }
  }, [token, isStaff, isSuperAdmin]);

  // Load current About contents into form fields
  useEffect(() => {
    if (about) {
      setEditAbout({
        salonIntro: about.salonIntro || '',
        mission: about.mission || '',
        experienceYears: about.experienceYears || '8',
        whyChooseUs: about.whyChooseUs ? about.whyChooseUs.join(', ') : '',
        address: about.address || '',
        phone: about.phone || '',
        email: about.email || '',
        hours: about.hours || ''
      });
    }
  }, [about]);

  // Redirect to login if not authorized
  useEffect(() => {
    if (!authLoading && !isStaff) {
      router.push('/login');
    }
  }, [isStaff, authLoading, router]);

  if (authLoading) {
    return <div className="text-center py-20 text-cream/60 text-xs">Checking authorization status...</div>;
  }

  if (!user || !isStaff) {
    return null; // Handled by redirect useEffect
  }

  // --- DERIVED METRICS FOR OVERVIEW ---
  const totalBookings = bookings.length;
  const totalPhotos = gallery.length;
  const totalVideos = videos.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  
  const getBookingPrice = (bookingSvc) => {
    const match = bookingSvc.match(/\(₹?([0-9]+)\)/);
    if (match && match[1]) {
      return `₹${match[1]}`;
    }
    const matchingPackage = pricing.find(
      p => p.serviceName.toLowerCase() === bookingSvc.toLowerCase()
    );
    if (matchingPackage) {
      return `₹${matchingPackage.price}`;
    }
    return '₹1200';
  };

  // Revenue calculation: Sum of prices of Completed bookings
  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => {
      const priceStr = getBookingPrice(b.service);
      const priceVal = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 1200;
      return sum + priceVal;
    }, 0);

  // SVG CHART 1: Bookings by Status
  const statusCounts = {
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Completed: bookings.filter(b => b.status === 'Completed').length,
    Cancelled: bookings.filter(b => b.status === 'Cancelled').length
  };

  // SVG CHART 2: Bookings per Category / Service (Simple Bar representation)
  const serviceCounts = {};
  bookings.forEach(b => {
    serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
  });

  // ---- CRUD HANDLERS ----

  // BOOKINGS: Update Status
  const handleUpdateBookingStatus = async (id, newStatus) => {
    if (!isAdmin) {
      showToast('Action denied: Staff accounts have read-only access.', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        loadBookings();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating booking status', 'error');
    }
  };

  // BOOKINGS: Delete
  const handleDeleteBooking = async (id) => {
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can delete bookings.', 'error');
      return;
    }
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Booking deleted.', 'success');
        loadBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // GALLERY: Add item (with support for file uploads)
  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('title', newGallery.title);
    formData.append('description', newGallery.description);
    formData.append('price', newGallery.price);
    formData.append('category', newGallery.category);
    
    if (galleryFile) {
      formData.append('image', galleryFile);
    } else {
      formData.append('image', newGallery.imageUrl); // falls back to text URL
    }

    try {
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:5000/api/gallery' : '/api/gallery';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showToast('Gallery item added successfully!', 'success');
        setNewGallery({ title: '', description: '', price: '', category: 'Gel', imageUrl: '' });
        setGalleryFile(null);
        fetchGallery();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading gallery item', 'error');
    }
  };

  // GALLERY: Delete
  const handleDeleteGallery = async (id) => {
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can delete gallery items.', 'error');
      return;
    }
    if (!window.confirm('Remove this design from gallery?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Gallery item deleted.', 'success');
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PRICING: Add item
  const handleAddPricing = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    const parsedFeatures = newPricing.features.split(',').map(f => f.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newPricing, features: parsedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pricing package created.', 'success');
        setNewPricing({ serviceName: '', price: '', features: '', description: '', category: 'Basic' });
        fetchPricing();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PRICING: Edit Setup
  const handleStartEditPricing = (pricingItem) => {
    setEditingPricingId(pricingItem._id);
    setEditPricingData({
      serviceName: pricingItem.serviceName,
      price: pricingItem.price,
      features: pricingItem.features ? pricingItem.features.join(', ') : '',
      description: pricingItem.description || '',
      category: pricingItem.category || 'Basic'
    });
  };

  // PRICING: Save Edit
  const handleSaveEditPricing = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can edit packages.', 'error');
      return;
    }
    const parsedFeatures = editPricingData.features.split(',').map(f => f.trim()).filter(Boolean);
    try {
      const res = await fetch(`/api/pricing/${editingPricingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...editPricingData, features: parsedFeatures })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pricing package updated.', 'success');
        setEditingPricingId(null);
        fetchPricing();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating package.', 'error');
    }
  };

  // PRICING: Delete
  const handleDeletePricing = async (id) => {
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can delete packages.', 'error');
      return;
    }
    if (!window.confirm('Remove this pricing package?')) return;
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Package removed.', 'success');
        fetchPricing();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // VIDEOS: Add item
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newVideo)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Video reel added successfully!', 'success');
        setNewVideo({ title: '', video: '', thumbnail: '' });
        fetchVideos();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // VIDEOS: Delete
  const handleDeleteVideo = async (id) => {
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can delete videos.', 'error');
      return;
    }
    if (!window.confirm('Remove this video?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Video removed.', 'success');
        fetchVideos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TESTIMONIALS: Add (Moderate panel write)
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Review created successfully!', 'success');
        setNewTestimonial({ name: '', review: '', rating: 5, image: '' });
        fetchTestimonials();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TESTIMONIALS: Delete
  const handleDeleteTestimonial = async (id) => {
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Review deleted.', 'success');
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TESTIMONIALS: Toggle Visibility
  const handleToggleTestimonialVisibility = async (review) => {
    if (!isAdmin) {
      showToast('Action denied: Read-only access.', 'error');
      return;
    }
    const newVisibility = review.visible === false ? true : false;
    try {
      const res = await fetch(`/api/testimonials/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visible: newVisibility })
      });
      const data = await res.json();
      if (data.success) {
        showToast(newVisibility ? 'Review is now visible to public.' : 'Review is now hidden from public.', 'success');
        fetchTestimonials();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating visibility.', 'error');
    }
  };

  // ABOUT: Save updates
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast('Action denied: Only Super Admins can update core website details.', 'error');
      return;
    }
    const parsedPoints = editAbout.whyChooseUs.split(',').map(p => p.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...editAbout, whyChooseUs: parsedPoints })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Salon content updated!', 'success');
        fetchAbout();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ADMIN ACCOUNTS: Register admin (Super Admin only)
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const res = await createAdminAccount(newAdmin);
    if (res.success) {
      setNewAdmin({ name: '', email: '', password: '', role: 'Admin' });
    }
  };

  // ADMIN ACCOUNTS: Edit Setup
  const handleStartEditAdmin = (adminAcct) => {
    setEditingAdminId(adminAcct._id);
    setEditAdminData({
      name: adminAcct.name,
      email: adminAcct.email,
      password: '',
      role: adminAcct.role
    });
  };

  // ADMIN ACCOUNTS: Save Edit
  const handleSaveEditAdmin = async (e) => {
    e.preventDefault();
    const res = await updateAdminAccount(editingAdminId, editAdminData);
    if (res.success) {
      setEditingAdminId(null);
    }
  };

  // ADMIN ACCOUNTS: Delete
  const handleDeleteAdminAcct = async (id, roleName) => {
    if (roleName === 'Super Admin') {
      const superCount = admins.filter(a => a.role === 'Super Admin').length;
      if (superCount <= 1) {
        showToast('Cannot delete the last remaining Super Admin.', 'error');
        return;
      }
    }
    if (!window.confirm(`Delete this administrative account permanently?`)) return;
    await deleteAdminAccount(id);
  };

  // Filter & Search bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(bookingsSearch.toLowerCase()) || 
                          b.email.toLowerCase().includes(bookingsSearch.toLowerCase()) ||
                          b.phone.includes(bookingsSearch);
    const matchesStatus = bookingsFilter === 'All' || b.status === bookingsFilter;
    return matchesSearch && matchesStatus;
  });

  // Sidebar Menu Tabs config
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Catalog', icon: <Camera className="w-4 h-4" /> },
    { id: 'videos', label: 'Video Catalog', icon: <Video className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing Menu', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'about', label: 'Salon Content', icon: <Info className="w-4 h-4" /> },
  ];

  if (isSuperAdmin) {
    tabs.push({ id: 'admins', label: 'Admin Accounts', icon: <Users className="w-4 h-4" /> });
  }

  return (
    <>
      <Head>
        <title>Control Panel - Aura Nails Admin Dashboard</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Read-Only Notice banner for Staff */}
        {!isAdmin && (
          <div className="flex items-center space-x-3 bg-gold/10 border border-gold/30 text-gold p-4 rounded-xl mb-6 shadow-gold-glow animate-pulse">
            <Eye className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Viewing Mode (Staff): You have read-only access. Saving changes or updating booking status is locked.
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col space-y-2.5">
            <div className="p-4 bg-onyx-dark border border-gold/15 rounded-lg text-center space-y-1 mb-2">
              <span className="text-3xs uppercase tracking-widest text-neutral-500 font-bold block">Logged in as</span>
              <p className="text-xs font-semibold text-cream">{user.name}</p>
              <span className="text-[10px] text-rosegold-dark font-semibold block uppercase tracking-widest">{user.role}</span>
            </div>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'bookings') loadBookings();
                }}
                className={`flex items-center space-x-3 py-3.5 px-4 rounded-md text-xs font-semibold uppercase tracking-widest border transition-all duration-300 w-full text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gold/10 border-gold text-cream font-bold shadow-gold-glow'
                    : 'border-transparent text-cream/70 hover:bg-onyx-light hover:text-cream'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* RIGHT ANALYTICS/MANAGEMENT BOARD */}
          <main className="flex-grow w-full glass-card rounded-xl p-6 sm:p-8 min-h-[60vh] border-gold/15 shadow-premium">
            
            {/* TABS 1: ANALYTICS OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Dashboard Overview</h2>
                </div>

                {/* Counter Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Total Bookings', value: totalBookings, icon: <Calendar className="w-5 h-5 text-gold" /> },
                    { label: 'Pending Bookings', value: pendingBookings, icon: <Clock className="w-5 h-5 text-amber-600" /> },
                    { label: 'Gallery Photos', value: totalPhotos, icon: <Camera className="w-5 h-5 text-gold" /> },
                    { label: 'Video Catalog', value: totalVideos, icon: <Video className="w-5 h-5 text-gold" /> },
                    { label: 'Calculated Revenue', value: `₹${totalRevenue}`, icon: <IndianRupee className="w-5 h-5 text-emerald-600" /> },
                  ].map((card, index) => (
                    <div key={index} className="bg-onyx-dark/50 border border-gold/10 rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">{card.label}</span>
                        {card.icon}
                      </div>
                      <p className="font-serif font-bold text-2xl sm:text-3xl text-cream tracking-tight">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* SVG Visual Graphic Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart 1: Bookings count per Day representation */}
                  <div className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4">
                    <h3 className="font-serif text-sm font-semibold tracking-wider text-cream uppercase">Booking Status Breakdown</h3>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0 pt-4">
                      {/* Simple SVG Donut representation */}
                      <svg width="120" height="120" viewBox="0 0 40 40" className="rotate-[-90deg]">
                        <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        
                        {/* Completed count segment */}
                        <circle
                          cx="20"
                          cy="20"
                          r="15.915"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeDasharray={`${totalBookings ? (statusCounts.Completed / totalBookings) * 100 : 0} 100`}
                          strokeDashoffset="0"
                        />
                        
                        {/* Confirmed segment */}
                        <circle
                          cx="20"
                          cy="20"
                          r="15.915"
                          fill="transparent"
                          stroke="#60a5fa"
                          strokeWidth="4"
                          strokeDasharray={`${totalBookings ? (statusCounts.Confirmed / totalBookings) * 100 : 0} 100`}
                          strokeDashoffset={`-${totalBookings ? (statusCounts.Completed / totalBookings) * 100 : 0}`}
                        />
                        
                        {/* Pending segment */}
                        <circle
                          cx="20"
                          cy="20"
                          r="15.915"
                          fill="transparent"
                          stroke="#fbbf24"
                          strokeWidth="4"
                          strokeDasharray={`${totalBookings ? (statusCounts.Pending / totalBookings) * 100 : 0} 100`}
                          strokeDashoffset={`-${totalBookings ? ((statusCounts.Completed + statusCounts.Confirmed) / totalBookings) * 100 : 0}`}
                        />
                      </svg>

                      {/* Donut Chart Legend */}
                      <div className="space-y-2 text-3xs uppercase tracking-widest text-cream/70 font-semibold">
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span>Completed ({statusCounts.Completed})</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> <span>Confirmed ({statusCounts.Confirmed})</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> <span>Pending ({statusCounts.Pending})</span></div>
                        <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full bg-red-500" /> <span>Cancelled ({statusCounts.Cancelled})</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Services / Treatment Counts */}
                  <div className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4">
                    <h3 className="font-serif text-sm font-semibold tracking-wider text-cream uppercase">Booked Nail Treatments</h3>
                    
                    <div className="space-y-3.5 pt-2">
                      {Object.keys(serviceCounts).map((svc, idx) => {
                        const count = serviceCounts[svc];
                        const pct = totalBookings ? (count / totalBookings) * 100 : 0;
                        return (
                          <div key={idx} className="space-y-1.5 text-2xs">
                            <div className="flex justify-between font-medium text-cream/80">
                              <span>{svc}</span>
                              <span>{count} Bookings</span>
                            </div>
                            <div className="h-2 bg-onyx-dark rounded-full overflow-hidden border border-gold/5">
                              <div className="bg-gold h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                      {Object.keys(serviceCounts).length === 0 && (
                        <div className="text-center text-cream/40 py-10">No bookings count data.</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/10 pb-4 gap-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Booking Management</h2>
                  <button
                    onClick={loadBookings}
                    className="text-xs uppercase tracking-widest text-neutral-700 hover:bg-neutral-50 border border-neutral-300 px-3 py-1.5 rounded transition-all duration-200 cursor-pointer shrink-0 font-semibold"
                  >
                    Reload Bookings
                  </button>
                </div>

                {/* Filter and search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-onyx-dark/30 border border-gold/10 rounded-xl p-4">
                  <div className="sm:col-span-8 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                    <input
                      type="text"
                      value={bookingsSearch}
                      onChange={(e) => setBookingsSearch(e.target.value)}
                      placeholder="Search customer name, email, phone..."
                      className="premium-input py-2 pl-10 text-xs w-full"
                    />
                  </div>
                  <div className="sm:col-span-4 relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <select
                      value={bookingsFilter}
                      onChange={(e) => setBookingsFilter(e.target.value)}
                      className="premium-input py-2 pl-10 text-xs bg-onyx-dark cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231C1A17' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`, backgroundPosition: 'right 14px center', backgroundRepeat: 'no-repeat', backgroundSize: '14px' }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {bookingsLoading ? (
                  <div className="text-center py-10 text-cream/50 text-xs">Loading appointments...</div>
                ) : filteredBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gold/15 text-neutral-500 uppercase tracking-wider text-[9px] font-bold">
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Contact</th>
                          <th className="py-3 px-2 font-medium">Service Name</th>
                          <th className="py-3 px-2 text-center">Price</th>
                          <th className="py-3 px-2">Scheduled Date & Slot</th>
                          <th className="py-3 px-2 text-center">Status</th>
                          {isSuperAdmin && <th className="py-3 px-2 text-center">Action</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/5">
                        {filteredBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-onyx-dark/30 transition-colors duration-200">
                            <td className="py-3 px-2 font-semibold text-cream">{booking.name}</td>
                            <td className="py-3 px-2">
                              <p className="font-semibold text-cream/90">{booking.email}</p>
                              <p className="text-cream/50 text-[10px]">{booking.phone}</p>
                            </td>
                            <td className="py-3 px-2 text-cream font-medium">{booking.service}</td>
                            <td className="py-3 px-2 text-center font-bold text-cream">
                              {getBookingPrice(booking.service)}
                            </td>
                            <td className="py-3 px-2">
                              <p>{booking.date}</p>
                              <p className="text-cream/50 text-[10px]">{booking.slot}</p>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <select
                                disabled={!isAdmin}
                                value={booking.status}
                                onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                className="text-[10px] uppercase font-bold py-1.5 px-2.5 border border-gold/20 rounded bg-white text-cream cursor-pointer focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            {isSuperAdmin && (
                              <td className="py-3 px-2 text-center">
                                <button
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="text-red-400 hover:text-red-300 p-1.5 border border-red-500/10 hover:border-red-500/30 rounded transition-colors duration-200"
                                  aria-label="Delete booking"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-cream/40 text-xs bg-onyx-dark/10 rounded-xl">No matching appointments found.</div>
                )}
              </div>
            )}

            {/* TAB 3: GALLERY CRUD */}
            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Manage Gallery</h2>
                </div>

                {/* Add Gallery Form */}
                {isAdmin && (
                  <form onSubmit={handleAddGalleryItem} className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4 max-w-2xl">
                    <h3 className="font-serif font-semibold text-base text-cream flex items-center gap-1.5">
                      <Plus className="w-4.5 h-4.5 text-gold" /> Add New Nail Design
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={newGallery.title}
                          onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                          placeholder="e.g. Amber Glaze Chrome"
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newGallery.price}
                          onChange={(e) => setNewGallery({ ...newGallery, price: e.target.value })}
                          placeholder="65"
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Category *</label>
                        <select
                          value={newGallery.category}
                          onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                          className="premium-input py-2 text-xs bg-onyx-dark cursor-pointer"
                        >
                          <option value="Classic">Classic</option>
                          <option value="Gel">Gel</option>
                          <option value="Acrylic">Acrylic</option>
                          <option value="Bridal">Bridal</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">File Image Upload</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setGalleryFile(e.target.files[0])}
                          className="text-xs text-cream/70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold file:cursor-pointer hover:file:bg-gold/20"
                        />
                      </div>
                    </div>

                    {!galleryFile && (
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Or Copy Image URL</label>
                        <input
                          type="text"
                          value={newGallery.imageUrl}
                          onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Description *</label>
                      <textarea
                        rows="2"
                        required
                        value={newGallery.description}
                        onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                        placeholder="Short catalog description..."
                        className="premium-input resize-none py-2 text-xs"
                      />
                    </div>

                    <button type="submit" className="gold-btn py-2.5 px-6 text-xs uppercase tracking-widest font-bold cursor-pointer">
                      Add to Gallery
                    </button>
                  </form>
                )}

                {/* List Items with Delete */}
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-lg text-cream">Current Catalog Items ({gallery.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gallery.map((item) => (
                      <div key={item._id} className="border border-gold/10 rounded-lg p-3 bg-onyx-dark/30 flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover shrink-0" />
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-cream text-xs truncate">{item.title}</h4>
                            <span className="text-[9px] text-gold uppercase tracking-wider">{item.category} • ₹{item.price}</span>
                          </div>
                        </div>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteGallery(item._id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                            aria-label="Delete gallery item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VIDEOS CRUD */}
            {activeTab === 'videos' && (
              <div className="space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Manage Videos</h2>
                </div>

                {/* Add Video Form */}
                {isAdmin && (
                  <form onSubmit={handleAddVideo} className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4 max-w-2xl">
                    <h3 className="font-serif font-semibold text-base text-cream flex items-center gap-1.5">
                      <Plus className="w-4.5 h-4.5 text-gold" /> Add New Video Reel
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={newVideo.title}
                          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                          placeholder="Summer French Ombre Art"
                          className="premium-input py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">YouTube Embed URL *</label>
                        <input
                          type="text"
                          required
                          value={newVideo.video}
                          onChange={(e) => setNewVideo({ ...newVideo, video: e.target.value })}
                          placeholder="https://www.youtube.com/embed/..."
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Video Cover Thumbnail URL *</label>
                      <input
                        type="text"
                        required
                        value={newVideo.thumbnail}
                        onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="premium-input py-2 text-xs"
                      />
                    </div>

                    <button type="submit" className="gold-btn py-2.5 px-6 text-xs uppercase tracking-widest font-bold cursor-pointer">
                      Add Video
                    </button>
                  </form>
                )}

                {/* Video List */}
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-lg text-cream">Current Videos ({videos.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos.map((v) => (
                      <div key={v._id} className="border border-gold/10 rounded-lg p-3 bg-onyx-dark/30 flex justify-between items-center">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <img src={v.thumbnail} alt={v.title} className="w-12 h-8 object-cover rounded shrink-0" />
                          <h4 className="font-medium text-cream text-xs truncate">{v.title}</h4>
                        </div>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteVideo(v._id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                            aria-label="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: TESTIMONIALS CRUD */}
            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Testimonials & Reviews</h2>
                </div>

                {/* Add Review form */}
                {isAdmin && (
                  <form onSubmit={handleAddTestimonial} className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4 max-w-2xl">
                    <h3 className="font-serif font-semibold text-base text-cream flex items-center gap-1.5">
                      <Plus className="w-4.5 h-4.5 text-gold" /> Post Client Review
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Customer Name *</label>
                        <input
                          type="text"
                          required
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Rating (1 to 5 Stars) *</label>
                        <select
                          value={newTestimonial.rating}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                          className="premium-input py-2 text-xs bg-onyx-dark cursor-pointer font-semibold text-cream"
                        >
                          <option value="5">★★★★★ (5 Stars)</option>
                          <option value="4">★★★★ (4 Stars)</option>
                          <option value="3">★★★ (3 Stars)</option>
                          <option value="2">★★ (2 Stars)</option>
                          <option value="1">★ (1 Star)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gold uppercase tracking-wider block mb-1 font-semibold">Review content *</label>
                      <textarea
                        rows="3"
                        required
                        value={newTestimonial.review}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                        placeholder="Nail service details, longevity feedback..."
                        className="premium-input resize-none py-2 text-xs"
                      />
                    </div>

                    <button type="submit" className="gold-btn py-2.5 px-6 text-xs uppercase tracking-widest font-bold cursor-pointer">
                      Save Testimonial
                    </button>
                  </form>
                )}

                {/* List items with Delete */}
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-lg text-cream">Moderate Guest Reviews ({testimonials.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((review) => (
                      <div key={review._id} className="border border-gold/10 rounded-lg p-4 bg-onyx-dark/30 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-cream text-xs">{review.name}</h4>
                            <span className="text-[10px] text-gold font-bold">★ {review.rating}.0</span>
                          </div>
                          <p className="text-2xs text-cream/70 italic leading-relaxed">"{review.review}"</p>
                        </div>
                        {isAdmin && (
                          <div className="flex justify-between items-center pt-2 border-t border-gold/5">
                            <button
                              onClick={() => handleToggleTestimonialVisibility(review)}
                              className={`flex items-center space-x-1 text-[9px] font-semibold uppercase tracking-wider py-1 px-2 border rounded cursor-pointer transition-all duration-200 ${
                                review.visible !== false
                                  ? 'text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-neutral-500 border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                              }`}
                            >
                              <span>{review.visible !== false ? 'Show (Public)' : 'Hide (Hidden)'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTestimonial(review._id)}
                              className="text-red-400 hover:text-red-300 flex items-center space-x-1 text-[9px] font-semibold uppercase tracking-wider py-1 px-2 border border-red-500/5 hover:border-red-500/20 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PRICING PACKAGES CRUD */}
            {activeTab === 'pricing' && (
              <div className="space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Pricing Structure</h2>
                </div>

                {/* Add Pricing package */}
                {isAdmin && (
                  <form onSubmit={handleAddPricing} className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4 max-w-2xl">
                    <h3 className="font-serif font-semibold text-base text-cream flex items-center gap-1.5">
                      <Plus className="w-4.5 h-4.5 text-gold" /> Create Service Package
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Service Name *</label>
                        <input
                          type="text"
                          required
                          value={newPricing.serviceName}
                          onChange={(e) => setNewPricing({ ...newPricing, serviceName: e.target.value })}
                          placeholder="e.g. Deluxe Gel-X Extension"
                          className="premium-input py-2 text-xs"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={newPricing.price}
                            onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })}
                            placeholder="95"
                            className="premium-input py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Category *</label>
                          <select
                            value={newPricing.category}
                            onChange={(e) => setNewPricing({ ...newPricing, category: e.target.value })}
                            className="premium-input py-2 text-xs bg-onyx-dark cursor-pointer font-semibold"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Premium">Premium</option>
                            <option value="Bridal">Bridal</option>
                            <option value="Custom">Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Features (comma-separated list) *</label>
                      <input
                        type="text"
                        required
                        value={newPricing.features}
                        onChange={(e) => setNewPricing({ ...newPricing, features: e.target.value })}
                        placeholder="Cuticle care, Gel-X extensions, massage"
                        className="premium-input py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Brief Description *</label>
                      <textarea
                        rows="2"
                        required
                        value={newPricing.description}
                        onChange={(e) => setNewPricing({ ...newPricing, description: e.target.value })}
                        placeholder="Brief details about the package..."
                        className="premium-input resize-none py-2 text-xs"
                      />
                    </div>

                    <button type="submit" className="gold-btn py-2.5 px-6 text-xs uppercase tracking-widest font-bold cursor-pointer">
                      Create Package
                    </button>
                  </form>
                )}

                {/* List items with Delete */}
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-lg text-cream font-bold font-serif">Active Pricing Packages ({pricing.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pricing.map((p) => (
                      <div key={p._id} className="border border-gold/10 rounded-lg p-4 bg-onyx-dark/30 flex justify-between items-start space-x-3">
                        <div className="space-y-1">
                          <span className="text-[9px] bg-gold/10 text-gold font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-gold/20">
                            {p.category}
                          </span>
                          <h4 className="font-semibold text-cream text-sm pt-1">{p.serviceName}</h4>
                          <p className="text-[11px] text-gold font-bold">₹{p.price}</p>
                        </div>
                        {isSuperAdmin && (
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={() => handleStartEditPricing(p)}
                              className="text-gold hover:text-gold-light p-1.5 border border-gold/15 hover:border-gold/45 rounded transition-all duration-200 cursor-pointer"
                              aria-label="Edit package"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePricing(p._id)}
                              className="text-red-400 hover:text-red-300 p-1.5 border border-red-500/10 hover:border-red-500/30 rounded transition-all duration-200 shrink-0 cursor-pointer"
                              aria-label="Delete package"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ABOUT US EDIT */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Salon Content Editor</h2>
                </div>

                <form onSubmit={handleSaveAbout} className="space-y-5 max-w-3xl">
                  <div>
                    <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Years of Salon Experience</label>
                    <input
                      disabled={!isSuperAdmin}
                      type="number"
                      value={editAbout.experienceYears}
                      onChange={(e) => setEditAbout({ ...editAbout, experienceYears: e.target.value })}
                      placeholder="8"
                      className="premium-input py-2 text-xs w-32 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-600 uppercase tracking-wider block mb-1">Why Choose Us Points (comma-separated list)</label>
                    <textarea
                      disabled={!isSuperAdmin}
                      rows="3"
                      value={editAbout.whyChooseUs}
                      onChange={(e) => setEditAbout({ ...editAbout, whyChooseUs: e.target.value })}
                      placeholder="Certified Nail Technicians with 15+ years experience, 100% Autoclave-Sterilized tools, Cruelty-free polishes"
                      className="premium-input resize-none py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider block mb-1">Contact Phone Number</label>
                      <input
                        disabled={!isSuperAdmin}
                        type="text"
                        value={editAbout.phone}
                        onChange={(e) => setEditAbout({ ...editAbout, phone: e.target.value })}
                        placeholder="8141464492"
                        className="premium-input py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider block mb-1">Contact Email</label>
                      <input
                        disabled={!isSuperAdmin}
                        type="email"
                        value={editAbout.email}
                        onChange={(e) => setEditAbout({ ...editAbout, email: e.target.value })}
                        placeholder="rutvivasani26@gmail.com"
                        className="premium-input py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider block mb-1">Studio Hours</label>
                      <input
                        disabled={!isSuperAdmin}
                        type="text"
                        value={editAbout.hours}
                        onChange={(e) => setEditAbout({ ...editAbout, hours: e.target.value })}
                        placeholder="9AM to 9PM all days"
                        className="premium-input py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-600 uppercase tracking-wider block mb-1">Studio Address</label>
                    <textarea
                      disabled={!isSuperAdmin}
                      rows="2"
                      value={editAbout.address}
                      onChange={(e) => setEditAbout({ ...editAbout, address: e.target.value })}
                      placeholder="Pushkar valley, NewIndia Colony, Nikol"
                      className="premium-input resize-none py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Salon Introduction Intro</label>
                    <textarea
                      disabled={!isSuperAdmin}
                      rows="5"
                      value={editAbout.salonIntro}
                      onChange={(e) => setEditAbout({ ...editAbout, salonIntro: e.target.value })}
                      placeholder="Describe your studio history, values..."
                      className="premium-input resize-none py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Studio Mission Statement</label>
                    <textarea
                      disabled={!isSuperAdmin}
                      rows="3"
                      value={editAbout.mission}
                      onChange={(e) => setEditAbout({ ...editAbout, mission: e.target.value })}
                      placeholder="Describe your mission statement..."
                      className="premium-input resize-none py-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {isSuperAdmin && (
                    <button type="submit" className="gold-btn py-3 px-8 text-xs uppercase tracking-widest font-bold flex items-center space-x-2 cursor-pointer">
                      <Save className="w-4.5 h-4.5" />
                      <span>Save Content Updates</span>
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* TAB 8: ADMIN ACCOUNTS CRUD (SUPER ADMIN ONLY) */}
            {activeTab === 'admins' && isSuperAdmin && (
              <div className="space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif font-bold text-2xl text-cream">Admin User Management</h2>
                </div>

                {/* Add admin account form */}
                <form onSubmit={handleCreateAdmin} className="bg-onyx-dark/30 border border-gold/10 rounded-xl p-5 space-y-4 max-w-2xl">
                  <h3 className="font-serif font-semibold text-base text-cream flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5 text-gold" /> Create Administrative Account
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        placeholder="Marc Smith"
                        className="premium-input py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        placeholder="marc@auranails.com"
                        className="premium-input py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        placeholder="••••••••"
                        className="premium-input py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Assign Role *</label>
                      <select
                        value={newAdmin.role}
                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                        className="premium-input py-2 text-xs bg-onyx-dark cursor-pointer font-semibold text-cream"
                      >
                        <option value="Super Admin">Super Admin (Full Access)</option>
                        <option value="Admin">Admin (Limited Write)</option>
                        <option value="Staff">Staff (Read Only View)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="gold-btn py-2.5 px-6 text-xs uppercase tracking-widest font-bold cursor-pointer">
                    Register Admin
                  </button>
                </form>

                {/* Edit inline modal */}
                {editingAdminId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative w-full max-w-md glass-card rounded-xl p-6 sm:p-8 space-y-4 border-gold/20 shadow-premium">
                      <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                        <h3 className="font-serif font-bold text-lg text-cream">Edit Admin Account</h3>
                        <button onClick={() => setEditingAdminId(null)} className="text-cream/50 hover:text-cream">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditAdmin} className="space-y-4">
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editAdminData.name}
                            onChange={(e) => setEditAdminData({ ...editAdminData, name: e.target.value })}
                            className="premium-input py-2.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={editAdminData.email}
                            onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
                            className="premium-input py-2.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Update Role</label>
                          <select
                            disabled={user.id === editingAdminId}
                            value={editAdminData.role}
                            onChange={(e) => setEditAdminData({ ...editAdminData, role: e.target.value })}
                            className="premium-input py-2.5 bg-onyx-dark cursor-pointer text-xs"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Reset Password (leave blank to keep current)</label>
                          <input
                            type="password"
                            value={editAdminData.password}
                            onChange={(e) => setEditAdminData({ ...editAdminData, password: e.target.value })}
                            placeholder="New password"
                            className="premium-input py-2.5 text-xs"
                          />
                        </div>

                        <button type="submit" className="gold-btn w-full py-3 text-xs uppercase tracking-widest font-bold cursor-pointer">
                          Save Changes
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Pricing Edit inline modal */}
                {editingPricingId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative w-full max-w-md glass-card rounded-xl p-6 sm:p-8 space-y-4 border-gold/20 shadow-premium">
                      <div className="flex justify-between items-center pb-2 border-b border-gold/10">
                        <h3 className="font-serif font-bold text-lg text-cream">Edit Service Package</h3>
                        <button onClick={() => setEditingPricingId(null)} className="text-cream/50 hover:text-cream">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditPricing} className="space-y-4">
                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Service Name *</label>
                          <input
                            type="text"
                            required
                            value={editPricingData.serviceName}
                            onChange={(e) => setEditPricingData({ ...editPricingData, serviceName: e.target.value })}
                            className="premium-input py-2.5 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Price (₹) *</label>
                            <input
                              type="number"
                              required
                              value={editPricingData.price}
                              onChange={(e) => setEditPricingData({ ...editPricingData, price: e.target.value })}
                              className="premium-input py-2.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Category *</label>
                            <select
                              value={editPricingData.category}
                              onChange={(e) => setEditPricingData({ ...editPricingData, category: e.target.value })}
                              className="premium-input py-2.5 bg-onyx-dark cursor-pointer text-xs font-semibold text-cream"
                            >
                              <option value="Basic">Basic</option>
                              <option value="Premium">Premium</option>
                              <option value="Bridal">Bridal</option>
                              <option value="Custom">Custom</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Features (comma-separated list) *</label>
                          <input
                            type="text"
                            required
                            value={editPricingData.features}
                            onChange={(e) => setEditPricingData({ ...editPricingData, features: e.target.value })}
                            className="premium-input py-2.5 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block mb-1">Brief Description *</label>
                          <textarea
                            rows="3"
                            required
                            value={editPricingData.description}
                            onChange={(e) => setEditPricingData({ ...editPricingData, description: e.target.value })}
                            className="premium-input resize-none py-2 text-xs"
                          />
                        </div>

                        <button type="submit" className="gold-btn w-full py-3 text-xs uppercase tracking-widest font-bold cursor-pointer">
                          Save Changes
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Admin Lists */}
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-lg text-cream">Active Accounts ({admins.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gold/15 text-gold uppercase tracking-wider text-[9px]">
                          <th className="py-3 px-2">Name</th>
                          <th className="py-3 px-2">Email</th>
                          <th className="py-3 px-2">Role</th>
                          <th className="py-3 px-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/5">
                        {admins.map((adminAcct) => (
                          <tr key={adminAcct._id} className="hover:bg-onyx-dark/30 transition-colors duration-200">
                            <td className="py-3 px-2 font-medium text-cream">{adminAcct.name}</td>
                            <td className="py-3 px-2 text-cream/70">{adminAcct.email}</td>
                            <td className="py-3 px-2">
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                adminAcct.role === 'Super Admin' ? 'text-rosegold-light border-rosegold/30 bg-rosegold/5' :
                                adminAcct.role === 'Admin' ? 'text-neutral-700 border-neutral-300 bg-neutral-50' :
                                'text-cream/50 border-cream/20 bg-cream/5'
                              }`}>
                                {adminAcct.role}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleStartEditAdmin(adminAcct)}
                                className="text-gold hover:text-gold-light p-1.5 border border-gold/15 hover:border-gold/45 rounded transition-all duration-200 cursor-pointer"
                                aria-label="Edit account"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={user.id === adminAcct._id}
                                onClick={() => handleDeleteAdminAcct(adminAcct._id, adminAcct.role)}
                                className="text-red-400 hover:text-red-300 p-1.5 border border-red-500/10 hover:border-red-500/35 rounded transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                aria-label="Delete account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </>
  );
};

export default Admin;
