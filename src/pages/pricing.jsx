import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppContext } from '../context/AppContext';
import PriceCard from '../components/PriceCard';
import { Sparkles, Calendar, Calculator, ShieldCheck } from 'lucide-react';

const Pricing = () => {
  const router = useRouter();
  const { pricing, dataLoading } = useContext(AppContext);

  // Add-on state for interactive calculator
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [baseTier, setBaseTier] = useState(1200); // default basic price in INR

  const addonsList = [
    { id: 'tips', name: 'Hard Gel / Gel-X Extensions', price: 1000, desc: 'Adds length using builder gel techniques' },
    { id: 'chrome', name: 'Metallic Chrome Dust', price: 500, desc: 'Adds reflective mirrored finish' },
    { id: 'crystals', name: 'Swarovski Crystals (Accent Nails)', price: 800, desc: 'Adds luxury crystal details on 2 accent nails' },
    { id: 'french', name: 'Classic French Tips', price: 300, desc: 'Hand-painted white or colorful smiles' },
    { id: 'russian', name: 'Russian Manicure Cuticle Care', price: 700, desc: 'Advanced cuticle cleaning using electric e-files' },
    { id: 'repair', name: 'Fiberglass Structural Repair', price: 400, desc: 'Reinforcement repair for cracked natural nails' }
  ];

  const handleAddonToggle = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const calculateTotal = () => {
    const addonsTotal = addonsList
      .filter(item => selectedAddons.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
    return baseTier + addonsTotal;
  };

  const handleBookCustom = () => {
    const addonsNames = addonsList
      .filter(item => selectedAddons.includes(item.id))
      .map(item => item.name)
      .join(', ');

    const selectedBaseName = baseTier === 1200 ? 'Basic Gel Overlay' : baseTier === 1800 ? 'Gel Polish Master' : baseTier === 3500 ? 'Luxury Bridal Set' : 'Custom Art';
    const message = `Custom Estimated Set: ${selectedBaseName} with Addons: [${addonsNames || 'None'}]. Total Estimate: ₹${calculateTotal()}`;

    router.push({
      pathname: '/booking',
      query: {
        service: selectedBaseName,
        message: message
      }
    });
  };

  return (
    <>
      <Head>
        <title>Pricing & Packages - Aura Nails Luxury Menu</title>
        <meta name="description" content="Check our service rates for basic gel coatings, custom Russian manicures, Swarovski extensions, and calculate add-ons in real-time." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/25 px-4 py-1.5 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Services Menu</span>
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-cream tracking-wide">
            Pricing Structure
          </h1>
          <p className="text-xs text-cream/70 font-light leading-relaxed">
            Select one of our luxury treatment tiers below, or customize your appointment using our live add-on calculator.
          </p>
        </div>

        {/* Grid of pricing cards */}
        {dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card rounded-xl aspect-[3/4] animate-pulse bg-onyx-light/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricing.map((pkg) => (
              <PriceCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}

        {/* Premium Interactive Add-On Calculator */}
        <section className="glass-card rounded-2xl p-6 sm:p-10 border-gold/20 max-w-4xl mx-auto shadow-premium space-y-8 relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-30%] w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center space-x-3 pb-4 border-b border-gold/10">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/25 text-gold shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-cream">Custom Add-on Estimator</h2>
              <p className="text-[10px] text-cream/50">Calculate nail designs and extensions in real-time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gold uppercase tracking-wider font-semibold block">Step 1: Select Base Service Tier</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Basic (₹1200)', value: 1200 },
                    { name: 'Master (₹1800)', value: 1800 },
                    { name: 'Bridal (₹3500)', value: 3500 }
                  ].map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setBaseTier(tier.value)}
                      className={`py-3 px-2 rounded-md border text-xs tracking-wider uppercase font-semibold text-center transition-all duration-300 cursor-pointer ${
                        baseTier === tier.value
                          ? 'bg-gold/15 border-gold text-gold font-bold'
                          : 'border-gold/10 text-cream/70 hover:border-gold/30 hover:text-cream'
                      }`}
                    >
                      {tier.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gold uppercase tracking-wider font-semibold block">Step 2: Add Premium Details</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addonsList.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleAddonToggle(addon.id)}
                        className={`p-3.5 rounded-lg border flex justify-between items-center cursor-pointer transition-all duration-300 ${
                          isChecked
                            ? 'bg-rosegold/10 border-rosegold/60 text-cream'
                            : 'border-gold/5 bg-onyx-dark/30 hover:border-gold/25'
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <p className="text-xs font-semibold">{addon.name}</p>
                          <p className="text-[10px] text-cream/40 leading-normal font-light">{addon.desc}</p>
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${isChecked ? 'text-rosegold-light' : 'text-gold'}`}>
                          +₹{addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-onyx-dark/70 border border-gold/15 p-6 rounded-xl space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[10px] text-cream/40 uppercase tracking-widest font-semibold block">Estimated Total</span>
                <div className="flex items-baseline justify-center">
                  <span className="font-serif font-bold text-2xl text-gold">₹</span>
                  <span className="font-serif font-bold text-5xl text-gold tracking-tight">{calculateTotal()}</span>
                </div>
                <p className="text-[10px] text-cream/40 italic mt-1">Excludes local sales tax.</p>
              </div>

              <div className="text-left space-y-2 text-2xs text-cream/60">
                <div className="flex justify-between">
                  <span>Base Tier:</span>
                  <span>₹{baseTier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-ons:</span>
                  <span>₹{calculateTotal() - baseTier}</span>
                </div>
                <hr className="border-gold/15" />
              </div>

              <button
                onClick={handleBookCustom}
                className="gold-btn w-full py-3 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest font-bold shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4 animate-bounce" />
                <span>Book This Set</span>
              </button>
              
              <div className="flex items-center justify-center space-x-1.5 text-[9px] text-cream/40 leading-none">
                <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Includes autoclave sterilization check</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Pricing;
