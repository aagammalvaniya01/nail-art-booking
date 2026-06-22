import React from 'react';
import Head from 'next/head';
import BookingForm from '../components/BookingForm';
import { Sparkles, Shield, Clock, Heart } from 'lucide-react';

const Booking = () => {
  return (
    <>
      <Head>
        <title>Book Session - Aura Nails Appointments</title>
        <meta name="description" content="Reserve a luxury nail art session online. Check date availability and select your preferred timeslot." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Easy Scheduler</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide">
            Book Appointment
          </h1>
          <p className="text-xs text-cream/70 font-light leading-relaxed">
            Reserve your customized slot below. Simply choose a date, pick an open time slot, and fill out your details.
          </p>
        </div>

        {/* Main Grid: Form + Trust factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Booking Form Left */}
          <div className="lg:col-span-7">
            <BookingForm />
          </div>

          {/* Appointment policies & indicators Right */}
          <div className="lg:col-span-5 space-y-6 lg:pt-4">
            <div className="bg-onyx-dark/45 border border-gold/15 p-6 rounded-xl space-y-6">
              <h3 className="font-serif font-semibold text-lg text-cream tracking-wide">Booking Policies</h3>
              
              <ul className="space-y-4 text-xs text-cream/70">
                <li className="flex items-start space-x-3.5">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-cream mb-0.5">Appointment Hold</p>
                    <p className="font-light leading-relaxed">We hold slots for up to 15 minutes. If you are running late, please call us to retain your slot.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3.5">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-cream mb-0.5">Cancellation Policy</p>
                    <p className="font-light leading-relaxed">Please notify us at least 24 hours in advance to cancel or reschedule your session.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3.5">
                  <Heart className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-cream mb-0.5">Custom Art Consultancy</p>
                    <p className="font-light leading-relaxed">If booking a custom hand-painted art slot, feel free to send us inspiration images in advance via email.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default Booking;
