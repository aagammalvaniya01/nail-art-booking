import React, { useState, useContext } from 'react';
import { X, Sparkles, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import Select from './Select';

const QuoteModal = () => {
  const { isQuoteModalOpen, setIsQuoteModalOpen, showToast } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Custom Hand-painted Art',
    description: '',
    budget: 'Under ₹2000'
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errorMsg) setErrorMsg('');
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-]/g, ''))) {
      tempErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.description.trim()) tempErrors.description = 'Design details are required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrors({});

    if (!validateForm()) {
      setErrorMsg('Please correct the validation errors below.');
      return;
    }

    setLoading(true);

    try {
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:5000/api/quotes' : '/api/quotes';
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setIsSent(true);
        showToast(data.message || 'Custom quote request submitted!', 'success');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: 'Custom Hand-painted Art',
          description: '',
          budget: 'Under ₹2000'
        });
        
        // Close modal after delay
        setTimeout(() => {
          setIsQuoteModalOpen(false);
          setIsSent(false);
        }, 4000);
      } else {
        setErrorMsg(data.message || 'Failed to submit quote request.');
      }
    } catch (error) {
      console.error('Custom quote request submission error:', error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isQuoteModalOpen) return null;

  const serviceOptions = [
    { value: "Custom Hand-painted Art", label: "Custom Painted Art" },
    { value: "Luxury Crystal Embellished", label: "Crystal & Gems Set" },
    { value: "Chrome/Metallic Foil", label: "Chrome / Foil set" },
    { value: "Acrylic Extentions Custom", label: "Acrylic Extensions" },
    { value: "Bridal Bespoke Set", label: "Bridal Nail Set" }
  ];

  const budgetOptions = [
    { value: "Under ₹2000", label: "Under ₹2000" },
    { value: "₹2000 - ₹4000", label: "₹2000 - ₹4000" },
    { value: "₹4000 - ₹6000", label: "₹4000 - ₹6000" },
    { value: "₹6000+", label: "₹6000+ (Premium Art)" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
      
      {/* Background Overlay click to close */}
      <div className="absolute inset-0" onClick={() => setIsQuoteModalOpen(false)} />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg glass-modal rounded-xl shadow-premium p-6 sm:p-8 z-50 animate-scale-in max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsQuoteModalOpen(false)}
          className="absolute top-4 right-4 text-cream/60 hover:text-cream bg-onyx border border-gold/10 p-2 rounded-full hover:border-gold transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto text-gold animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl text-cream">Quote Request Sent!</h3>
              <p className="text-xs text-cream/70 leading-relaxed font-light px-4">
                We have received your custom styling inquiry. Our expert nail technicians will review your ideas and reply with an estimated pricing proposal within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div className="space-y-2 text-center pb-2">
              <div className="inline-flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-widest bg-gold/10 border border-gold/25 px-3.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Styling</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-cream">Request Custom Quote</h3>
              <p className="text-xs text-cream/60 leading-relaxed">
                Describe your dream nail art set. Upload inspiration or concepts, and we will send a tailored estimate.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center space-x-2.5 bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-md text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name input */}
            <div className="space-y-1.5 w-full">
              <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Your Name *</label>
              <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
                errors.name ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
              }`}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.name}</p>}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Email *</label>
                <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
                  errors.email ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                }`}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.email}</p>}
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Phone *</label>
                <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
                  errors.phone ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                }`}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="81414 64492"
                    className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Service & Budget Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Service category"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleChange}
                error={errors.serviceType}
                options={serviceOptions}
              />

              <Select
                label="Target Budget"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                error={errors.budget}
                options={budgetOptions}
              />
            </div>

            {/* Custom Design Description */}
            <div className="space-y-1.5 w-full">
              <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Design Idea / Details *</label>
              <div className={`relative flex items-start bg-white border rounded-md transition-all duration-300 ${
                errors.description ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
              }`}>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="List colors, shapes, reference details, lengths (e.g. Medium Almond coffin, lavender base, golden chrome swirls and hand-painted daisies on thumbs)."
                  className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none resize-none font-medium"
                />
              </div>
              {errors.description && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="gold-btn w-full py-3.5 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Request...' : 'Send Quote Request'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default QuoteModal;
