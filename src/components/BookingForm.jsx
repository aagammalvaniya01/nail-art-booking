import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import Select from './Select';
import DatePicker from './DatePicker';

const BookingForm = () => {
  const router = useRouter();
  const { pricing, showToast } = useContext(AppContext);
  const { service, message: queryMessage } = router.query;

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    slot: '',
    message: ''
  });

  const [busySlots, setBusySlots] = useState([]);
  const [loadingBusySlots, setLoadingBusySlots] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Predefined time slots
  const allTimeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  // Pre-fill service & message from query parameters
  useEffect(() => {
    if (service) {
      setFormData(prev => ({ ...prev, service: decodeURIComponent(service) }));
    }
    if (queryMessage) {
      setFormData(prev => ({ ...prev, message: decodeURIComponent(queryMessage) }));
    }
  }, [service, queryMessage]);

  // Fetch busy slots when date changes
  useEffect(() => {
    const fetchBusySlots = async () => {
      if (!formData.date) {
        setBusySlots([]);
        return;
      }

      setLoadingBusySlots(true);
      try {
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const apiUrl = isDev ? `http://localhost:5000/api/bookings/busy-slots?date=${formData.date}` : `/api/bookings/busy-slots?date=${formData.date}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.success) {
          setBusySlots(data.busySlots || []);
        }
      } catch (err) {
        console.error('Error loading busy slots:', err);
      } finally {
        setLoadingBusySlots(false);
      }
    };

    fetchBusySlots();
  }, [formData.date]);

  const [errors, setErrors] = useState({});

  // Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errorMsg) setErrorMsg('');
  };

  // Validation Logic
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

    if (!formData.service) tempErrors.service = 'Please select a service';
    if (!formData.date) tempErrors.date = 'Please select a date';
    if (!formData.slot) tempErrors.slot = 'Please select a time slot';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrors({});

    if (!validateForm()) {
      setErrorMsg('Please correct the validation errors below.');
      return;
    }

    setSubmitLoading(true);
    try {
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:5000/api/bookings' : '/api/bookings';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        showToast('Appointment booked successfully!', 'success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: '',
          date: '',
          slot: '',
          message: ''
        });
      } else {
        setErrorMsg(data.message || 'Failed to submit booking. Slot may have been taken.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Restrict calendar selection to today and future dates (using local timezone)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDateStr = `${year}-${month}-${day}`;

  if (isSuccess) {
    return (
      <div className="bg-onyx-dark/45 border border-gold/15 rounded-xl p-8 text-center max-w-lg mx-auto shadow-premium animate-fade-in space-y-6">
        <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto text-gold">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-2xl text-cream">Appointment Requested</h3>
          <p className="text-xs text-cream/70 leading-relaxed font-light leading-relaxed">
            Thank you for booking with Aura Nails! We have received your booking request. Our team will review the details and email/text you with a confirmation shortly.
          </p>
        </div>
        <button
          onClick={() => setIsSuccess(false)}
          className="gold-btn w-full py-3.5 cursor-pointer"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-onyx-dark/45 border border-gold/15 rounded-xl p-6 sm:p-8 max-w-xl mx-auto space-y-5 shadow-premium" noValidate>
      
      <div className="space-y-1 mb-2">
        <h3 className="font-serif font-bold text-xl text-cream tracking-wide">Schedule Session</h3>
        <p className="text-[11px] text-cream/50">Reserve your customized nail art slot below.</p>
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2.5 bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-md text-xs">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1.5 w-full">
        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Full Name *</label>
        <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
          errors.name ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
        }`}>
          <User className="absolute left-4 w-4.5 h-4.5 text-cream/30 pointer-events-none" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="text-xs w-full py-3 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
          />
        </div>
        {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.name}</p>}
      </div>

      {/* Phone and Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 w-full">
          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Mobile Number *</label>
          <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
            errors.phone ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
          }`}>
            <Phone className="absolute left-4 w-4.5 h-4.5 text-cream/30 pointer-events-none" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="81414 64492"
              className="text-xs w-full py-3 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
            />
          </div>
          {errors.phone && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5 w-full">
          <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Email Address *</label>
          <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
            errors.email ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
          }`}>
            <Mail className="absolute left-4 w-4.5 h-4.5 text-cream/30 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="text-xs w-full py-3 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.email}</p>}
        </div>
      </div>

      {/* Service Dropdown */}
      <Select
        label="Select Service"
        name="service"
        required
        value={formData.service}
        onChange={handleChange}
        error={errors.service}
        placeholder="-- Choose a Nail Treatment --"
        options={pricing.length > 0 ? pricing.map(p => ({
          value: p.serviceName,
          label: `${p.serviceName} (₹${p.price})`
        })) : [
          { value: "Basic Gel Overlay", label: "Basic Gel Overlay (₹1200)" },
          { value: "Gel Polish Master", label: "Gel Polish Master (₹1800)" },
          { value: "Luxury Bridal Set", label: "Luxury Bridal Set (₹3500)" },
          { value: "Premium Artistic Custom", label: "Premium Artistic Custom (₹2800)" }
        ]}
      />

      {/* Date and Time slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePicker
          label="Preferred Date"
          name="date"
          required
          min={todayDateStr}
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
        />

        <Select
          label="Time Slot"
          name="slot"
          required
          disabled={!formData.date || loadingBusySlots}
          value={formData.slot}
          onChange={handleChange}
          error={errors.slot}
          placeholder={!formData.date ? 'Select a date first' : loadingBusySlots ? 'Loading slots...' : '-- Choose Time --'}
          options={allTimeSlots.map((timeOption) => {
            const isTaken = busySlots.includes(timeOption);
            return {
              value: timeOption,
              label: timeOption + (isTaken ? ' (Reserved)' : ''),
              disabled: isTaken
            };
          })}
        />
      </div>

      {/* Note / Message */}
      <div className="space-y-1.5 w-full">
        <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Special Requests / Message</label>
        <div className="relative flex items-start bg-white border rounded-md border-gold/20 hover:border-gold/40 transition-all duration-300">
          <MessageSquare className="absolute left-4 top-3.5 w-4.5 h-4.5 text-cream/30 pointer-events-none" />
          <textarea
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="Add any specific design request, length preferences, extensions, etc."
            className="text-xs w-full py-3 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none resize-none font-medium"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitLoading}
          className="gold-btn w-full py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-50 cursor-pointer"
        >
          {submitLoading ? 'Sending Booking Request...' : 'Confirm Appointment'}
        </button>
      </div>

    </form>
  );
};

export default BookingForm;
