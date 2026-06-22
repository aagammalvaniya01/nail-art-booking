import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-luxury-gradient overflow-hidden py-20 px-4">
      {/* Golden Blur Blobs for Luxury Aura */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rosegold/10 rounded-full blur-[100px] animate-pulse-slow" />
      
      {/* Decorative Gold Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copywriting Content */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-4 h-4" />
            <span>Nail Artistry & Luxury Care</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight font-bold text-cream"
          >
            Beautiful <span className="bg-gradient-to-r from-gold via-rosegold-light to-gold bg-clip-text text-transparent italic">Nail Art</span> <br />
            for Every Occasion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-cream/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
          >
            Professional nail art and stylish, long-lasting gel designs crafted with premium non-toxic materials. Discover our affordable luxury collections today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              onClick={() => router.push('/booking')}
              className="gold-btn w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 shadow-premium group"
            >
              <Calendar className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => router.push('/gallery')}
              className="gold-outline-btn w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 group"
            >
              <span>View Gallery</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Showcase Media Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden shadow-premium group">
            {/* Animated outer frame */}
            <div className="absolute inset-0 border border-gold/30 rounded-2xl m-3 group-hover:m-2 transition-all duration-500 z-10 pointer-events-none" />
            {/* Elegant Image Background */}
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop"
              alt="Luxury Nail Art Showcase"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 filter brightness-95"
            />
            {/* Dark gradient fade from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-dark/90 via-transparent to-transparent z-10" />
            
            {/* Micro card detail on top */}
            <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl z-20 flex justify-between items-center border border-gold/20 shadow-glass">
              <div>
                <p className="text-xs text-gold font-semibold uppercase tracking-wider">Trending Style</p>
                <h3 className="font-serif font-semibold text-cream text-lg">Blush Pearl Gel</h3>
              </div>
              <span className="text-sm font-semibold bg-rosegold text-cream px-3 py-1 rounded-full border border-rosegold-light/20">₹1200+</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
