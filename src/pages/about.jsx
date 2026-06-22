import React, { useContext } from 'react';
import Head from 'next/head';
import { AppContext } from '../context/AppContext';
import { Sparkles, Shield, Heart, Medal, Check } from 'lucide-react';

const About = () => {
  const { about } = useContext(AppContext);

  const salonIntro = about?.salonIntro || 'Welcome to Aura Nails, a premium nail artistry studio where creativity meets luxury. We believe nail styling is more than just maintenance—it is a form of self-expression and personal styling. Our studio blends high-quality ingredients with cutting-edge artistry to deliver stunning, personalized results.';
  const mission = about?.mission || 'To deliver client-focused luxury nail treatments that prioritize safety, hygiene, and creativity. We use only premium non-toxic, vegan polishes and builder gels to keep your natural nails healthy and beautiful.';
  const experienceYears = about?.experienceYears || 8;
  const whyChooseUs = about?.whyChooseUs || [
    'Certified Nail Technicians with over 15 combined years of art experience',
    '9-Free, Vegan, and Cruelty-Free products only',
    '100% Autoclave-Sterilized tools & hygienic, relaxing studio environment',
    'Completely customizable hand-painted art, chrome, and embellishments'
  ];

  const stats = [
    { value: `${experienceYears}+`, label: 'Years of Artistry' },
    { value: '5k+', label: 'Happy Clients Served' },
    { value: '99%', label: 'Hygiene & Clean Rate' },
    { value: '150+', label: 'Unique Art Styles' }
  ];

  const values = [
    {
      icon: <Shield className="w-6 h-6 text-gold" />,
      title: 'Hygienic Excellence',
      description: 'Your health is our priority. All metal tools are autoclave-sterilized, and files/buffers are single-use only.'
    },
    {
      icon: <Heart className="w-6 h-6 text-gold" />,
      title: 'Eco-Friendly / Vegan',
      description: 'We exclusively use 9-free, vegan, and cruelty-free polishes, builder gels, and moisturizing treatments.'
    },
    {
      icon: <Medal className="w-6 h-6 text-gold" />,
      title: 'Certified Professionals',
      description: 'Our team comprises certified masters of nail care, with ongoing education in high-end Russian manicure preps.'
    }
  ];

  return (
    <>
      <Head>
        <title>About Us - Aura Nails Luxury Artistry</title>
        <meta name="description" content="Learn about the standards of service, sterilization methods, team credentials, and core values of Aura Nails." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* 1. Header Hero Intro */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Since 2018</span>
            </div>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide leading-tight">
              Elevating Nail Styling <br />
              Into Fine Artistry
            </h1>
            <p className="text-sm text-cream/80 font-light leading-relaxed">
              {salonIntro}
            </p>
            <div className="border-l-2 border-gold pl-5 py-2">
              <h3 className="font-serif italic font-semibold text-lg text-cream mb-1">Our Mission</h3>
              <p className="text-xs text-cream/70 leading-relaxed font-light">{mission}</p>
            </div>
          </div>

          {/* Brand Image Area */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden shadow-premium">
              <div className="absolute inset-0 border border-gold/30 rounded-2xl m-3 pointer-events-none z-10" />
              <img
                src="https://images.unsplash.com/photo-1632345031435-8797b2d58045?q=80&w=600&auto=format&fit=crop"
                alt="Premium Russian Manicure Prep"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx-dark/80 via-transparent to-transparent z-10" />
            </div>
          </div>

        </section>

        {/* 2. Counter Stats bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-6 glass-card rounded-xl border-gold/15 text-center shadow-lg">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-serif font-bold text-3xl sm:text-4xl text-gold">{stat.value}</div>
              <div className="text-[10px] text-cream/50 uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* 3. Core Values Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-gold uppercase tracking-widest font-semibold">Salon Standards</span>
            <h2 className="font-serif font-bold text-3xl text-cream tracking-wide">Our Core Values</h2>
            <p className="text-xs text-cream/60 max-w-lg mx-auto font-light leading-relaxed">
              Every file shape, polish coat, and customer greeting is guided by our professional principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6 border-gold/10 hover:border-gold/30 hover:shadow-premium transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                  {v.icon}
                </div>
                <h3 className="font-serif font-semibold text-lg text-cream">{v.title}</h3>
                <p className="text-xs text-cream/70 font-light leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Why Choose Us list checklist */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
          
          {/* Decor image */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gold/10">
              <img
                src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop"
                alt="Bridal Nail Embellishments"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif font-bold text-3xl text-cream tracking-wide">
              Why Client Select Aura Nails
            </h2>
            <p className="text-xs text-cream/70 font-light leading-relaxed">
              We deliver details that generic salons ignore. See why nail art lovers choose our premium treatments.
            </p>

            <ul className="space-y-4 pt-2">
              {whyChooseUs.map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-cream/90">
                  <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/35 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <span className="font-light">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

      </div>
    </>
  );
};

export default About;
