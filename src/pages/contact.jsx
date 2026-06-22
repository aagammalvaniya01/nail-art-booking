import React, { useState, useContext } from 'react';
import Head from 'next/head';
import { Phone, Mail, MapPin, Clock, Send, Sparkles, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Contact = () => {
  const { about, showToast } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
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
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (formData.phone.trim()) {
      const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-]/g, ''))) {
        tempErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

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
      const apiUrl = isDev ? 'http://localhost:5000/api/contacts' : '/api/contacts';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        showToast(data.message || 'Message sent! We will reply shortly.', 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setErrorMsg(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us - Aura Nails</title>
        <meta name="description" content="Reach our nail design studio: call, email, or send custom nail art references directly to our team." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Connect</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide">
            Contact Us
          </h1>
          <p className="text-xs text-cream/70 font-light leading-relaxed">
            Have any questions about custom extensions or pricing? Shoot us a message or call our studio directly.
          </p>
        </div>

        {/* Grid: Info + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Contact Info Card Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-onyx-dark/45 border border-gold/15 rounded-xl p-6 sm:p-8 space-y-6">
              <h3 className="font-serif font-semibold text-xl text-cream tracking-wide">Studio Info</h3>

              <ul className="space-y-6 text-sm text-cream/80">
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-cream text-xs uppercase tracking-widest mb-1">Our Location</h4>
                    <p className="text-xs font-light leading-relaxed">{about?.address || 'Pushkar valley, NewIndia Colony, Nikol'}</p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-cream text-xs uppercase tracking-widest mb-1">Call Us</h4>
                    <p className="text-xs font-light">{about?.phone || '8141464492'}</p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-cream text-xs uppercase tracking-widest mb-1">Email Us</h4>
                    <p className="text-xs font-light">{about?.email || 'rutvivasani26@gmail.com'}</p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-cream text-xs uppercase tracking-widest mb-1">Studio Hours</h4>
                    <p className="text-xs font-light">{about?.hours || '9AM to 9PM all days'}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Message Form Right */}
          <div className="lg:col-span-7 bg-onyx-dark/45 border border-gold/15 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif font-semibold text-xl text-cream tracking-wide">Send Inquiry</h3>
            
            {errorMsg && (
              <div className="flex items-center space-x-2.5 bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-md text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Name *</label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Phone</label>
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

                <div className="space-y-1.5 w-full">
                  <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Subject *</label>
                  <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
                    errors.subject ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                  }`}>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Custom design inquiry"
                      className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
                    />
                  </div>
                  {errors.subject && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.subject}</p>}
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Message *</label>
                <div className={`relative flex items-start bg-white border rounded-md transition-all duration-300 ${
                  errors.message ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                }`}>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What can we help you with?"
                    className="text-xs w-full py-3 px-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none resize-none font-medium"
                  />
                </div>
                {errors.message && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-btn px-8 py-3.5 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold shadow-md w-full sm:w-auto cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending message...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </>
  );
};

export default Contact;
