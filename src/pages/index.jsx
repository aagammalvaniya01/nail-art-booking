import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Hero from '../components/Hero';
import GalleryCard from '../components/GalleryCard';
import PriceCard from '../components/PriceCard';
import VideoCard from '../components/VideoCard';
import TestimonialCard from '../components/TestimonialCard';
import { ArrowRight, Sparkles, MessageCircle, Calendar } from 'lucide-react';

const Home = () => {
  const router = useRouter();
  const { gallery, pricing, videos, testimonials, dataLoading } = useContext(AppContext);

  const previewGallery = gallery.slice(0, 3);
  const previewPricing = pricing.slice(0, 3);
  const previewVideos = videos.slice(0, 2);
  const visibleTestimonials = testimonials.filter(t => t.visible !== false);
  const previewTestimonials = visibleTestimonials.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Head>
        <title>Aura Nails - Luxury Nail Art Studio & Booking</title>
        <meta name="description" content="Experience professional, premium nail art and stylish gel designs at Aura Nails. Book your session today and let your hands reflect your inner beauty." />
      </Head>

      <div className="space-y-24 pb-20">
        
        {/* 1. Hero banner */}
        <Hero />

        {/* 2. Services / Gallery Preview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="space-y-3">
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Latest Creations
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream tracking-wide">
                Trending Nail Designs
              </h2>
              <p className="text-xs text-cream/70 max-w-xl font-light">
                Explore some of our most requested nail styling sets hand-painted by our specialist artists.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-widest hover:text-gold-light mt-4 md:mt-0 transition-colors duration-200"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {dataLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card rounded-xl aspect-[4/3] animate-pulse bg-onyx-light/30" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {previewGallery.length > 0 ? (
                previewGallery.map((item) => (
                  <motion.div key={item._id} variants={itemVariants}>
                    <GalleryCard item={item} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-cream/50 py-10">No designs loaded yet. Run seeder.</div>
              )}
            </motion.div>
          )}
        </section>

        {/* 3. Pricing Tier Preview Section */}
        <section className="bg-onyx-dark/30 py-20 border-y border-gold/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold">Care Packages</span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream tracking-wide">Pricing Structure</h2>
              <p className="text-xs text-cream/70 max-w-lg mx-auto font-light leading-relaxed">
                Transparent, premium service pricing. Select standard treatment tiers or consult us for a tailored design.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {previewPricing.length > 0 ? (
                previewPricing.map((pkg) => (
                  <motion.div key={pkg._id} variants={itemVariants}>
                    <PriceCard pkg={pkg} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-cream/50 py-10">No packages loaded yet. Run seeder.</div>
              )}
            </motion.div>

            <div className="text-center pt-10">
              <button
                onClick={() => router.push('/pricing')}
                className="gold-outline-btn text-xs uppercase tracking-widest px-8 py-3.5 cursor-pointer"
              >
                View Full Price Menu
              </button>
            </div>
          </div>
        </section>

        {/* 4. Video Reels Preview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="space-y-3">
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold">Video Demos</span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream tracking-wide">Artistry in Motion</h2>
              <p className="text-xs text-cream/70 max-w-xl font-light">
                Watch step-by-step hand-painting processes, cat-eye applications, and behind-the-scenes tutorials.
              </p>
            </div>
            <Link
              href="/gallery"
              className="group flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-widest hover:text-gold-light mt-4 md:mt-0 transition-colors duration-200"
            >
              <span>Watch All Videos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {previewVideos.map((video) => (
              <motion.div key={video._id} variants={itemVariants}>
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 5. Testimonial Reviews Section */}
        <section className="bg-onyx-dark/50 py-20 border-y border-gold/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-16">
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" /> Client Reviews
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream tracking-wide">What Our Clients Say</h2>
              <p className="text-xs text-cream/70 max-w-lg mx-auto font-light leading-relaxed">
                We take pride in our meticulous work and high hygiene standards. Read reviews from our verified studio guests.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {previewTestimonials.map((testimonial) => (
                <motion.div key={testimonial._id} variants={itemVariants}>
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center pt-12">
              <Link
                href="/testimonials"
                className="gold-btn text-xs uppercase tracking-widest px-8 py-3.5 inline-block"
              >
                See All Reviews
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Booking Invitation Call-To-Action Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="glass-card rounded-2xl p-8 sm:p-12 text-center border-gold/25 relative overflow-hidden shadow-premium space-y-6">
            <div className="absolute inset-0 bg-gold-gradient opacity-[0.02] pointer-events-none" />
            
            <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block">Experience the luxury</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-cream leading-tight">Ready to pamper your nails?</h2>
            <p className="text-xs text-cream/70 max-w-lg mx-auto font-light leading-relaxed">
              Reserve your session with one of our certified nail stylists today. Spaces are limited, so reserve your spot in advance!
            </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/booking')}
              className="gold-btn px-8 py-4 flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest shadow-lg w-full sm:w-auto cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="gold-outline-btn px-8 py-4 text-xs font-bold uppercase tracking-widest w-full sm:w-auto cursor-pointer"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
