import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { AppContext } from '../context/AppContext';
import TestimonialCard from '../components/TestimonialCard';
import { MessageSquare, Star, User, MessageCircle, PenTool } from 'lucide-react';

const Testimonials = () => {
  const { testimonials, fetchTestimonials, showToast } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 5
  });

  const [hoverRating, setHoverRating] = useState(0);

  const visibleTestimonials = testimonials.filter(t => t.visible !== false);

  const averageRating = visibleTestimonials.length > 0
    ? (visibleTestimonials.reduce((sum, item) => sum + item.rating, 0) / visibleTestimonials.length).toFixed(1)
    : '5.0';

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRatingClick = (val) => {
    setFormData(prev => ({ ...prev, rating: val }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.review.trim()) tempErrors.review = 'Review is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      showToast('Please correct the validation errors below.', 'error');
      return;
    }

    setLoading(true);
    try {
      const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:5000/api/testimonials' : '/api/testimonials';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        showToast('Thank you! Review added.', 'success');
        setFormData({ name: '', review: '', rating: 5 });
        fetchTestimonials(); // reload list
      } else {
        showToast(data.message || 'Error submitting review.', 'error');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      showToast('Network error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reviews & Testimonials - Aura Nails Reviews</title>
        <meta name="description" content="Read reviews from our verified guests, check overall client ratings, and post your own nail art styling review." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Page Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <MessageSquare className="w-4 h-4" />
            <span>Client Diaries</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide">
            Guest Testimonials
          </h1>
          <p className="text-xs text-cream/70 font-light leading-relaxed">
            See why we are rated {averageRating} stars. Read reviews or share your own experience in our salon below.
          </p>
        </div>

        {/* Main Stats and Submit Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Left Side: Review summary statistics */}
          <div className="lg:col-span-4 bg-onyx-dark/45 border border-gold/15 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif font-semibold text-xl text-cream">Rating Summary</h3>
            
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-gold tracking-tight">{averageRating}</div>
              <div>
                <div className="flex space-x-1 mb-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-5 h-5 fill-gold text-gold"
                    />
                  ))}
                </div>
                <p className="text-[9px] text-cream/40 uppercase tracking-wider font-semibold">Based on {visibleTestimonials.length} reviews</p>
              </div>
            </div>

            <hr className="border-gold/10" />

            <div className="space-y-3.5 text-xs text-cream/70">
              <div className="flex items-center space-x-2">
                <span className="w-12 shrink-0">5 Stars:</span>
                <div className="flex-grow h-2.5 bg-onyx-dark border border-gold/5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: '92%' }} />
                </div>
                <span className="w-8 text-right text-cream/40">92%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-12 shrink-0">4 Stars:</span>
                <div className="flex-grow h-2.5 bg-onyx-dark border border-gold/5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: '8%' }} />
                </div>
                <span className="w-8 text-right text-cream/40">8%</span>
              </div>
              <div className="flex items-center space-x-2 text-cream/30">
                <span className="w-12 shrink-0">3 Stars:</span>
                <div className="flex-grow h-2.5 bg-onyx-dark border border-gold/5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: '0%' }} />
                </div>
                <span className="w-8 text-right text-cream/20">0%</span>
              </div>
            </div>
          </div>

          {/* Right Side: Testimony Submission Form */}
          <div className="lg:col-span-8 bg-onyx-dark/45 border border-gold/15 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gold/10">
              <PenTool className="w-5 h-5 text-gold" />
              <h3 className="font-serif font-semibold text-xl text-cream">Write a Review</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Your Name *</label>
                <div className={`relative flex items-center bg-white border rounded-md transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                }`}>
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-cream/30 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="text-xs w-full py-3.5 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none font-medium"
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.name}</p>}
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Rating (1 to 5 Stars) *</label>
                <div className="flex space-x-2">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starVal = idx + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleRatingClick(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-cream/20 hover:scale-110 active:scale-95 transition-transform duration-100 cursor-pointer"
                        aria-label={`Rate ${starVal} Stars`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            (hoverRating || formData.rating) >= starVal
                              ? 'text-gold fill-gold'
                              : 'text-cream/10'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold block">Your Review *</label>
                <div className={`relative flex items-start bg-white border rounded-md transition-all duration-300 ${
                  errors.review ? 'border-red-500' : 'border-gold/20 hover:border-gold/40'
                }`}>
                  <MessageCircle className="absolute left-4 top-3.5 w-4 h-4 text-cream/30 pointer-events-none" />
                  <textarea
                    name="review"
                    rows="4"
                    value={formData.review}
                    onChange={handleChange}
                    placeholder="Tell us about your experience: cleanliness, staff friendliness, styling details..."
                    className="text-xs w-full py-3.5 pl-11 pr-4 bg-transparent text-cream placeholder-cream/45 focus:outline-none resize-none font-medium"
                  />
                </div>
                {errors.review && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.review}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-btn w-full sm:w-auto px-10 py-3.5 text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  {loading ? 'Submitting review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>

        </div>

        <hr className="border-gold/10" />

        {/* Testimonials Review Feed */}
        <section className="space-y-6">
          <h3 className="font-serif font-semibold text-2xl text-cream tracking-wide">Client Testimonial Feed</h3>
          
          {visibleTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTestimonials.map((item) => (
                <TestimonialCard key={item._id} testimonial={item} />
              ))}
            </div>
          ) : (
            <div className="text-center text-cream/40 py-10">No reviews posted yet.</div>
          )}
        </section>

      </div>
    </>
  );
};

export default Testimonials;
