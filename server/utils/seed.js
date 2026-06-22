import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db.js';

// Models
import User from '../models/User.js';
import Gallery from '../models/Gallery.js';
import Pricing from '../models/Pricing.js';
import Video from '../models/Video.js';
import Testimonial from '../models/Testimonial.js';
import About from '../models/About.js';

// Load config from unified root .env
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
  console.log('Starting Phase 3 database seeding...');
  await connectDB();

  try {
    // 1. Seed Accounts (Super Admin, Admin, Staff)
    await User.deleteMany({}); // Delete all users to re-seed clean hierarchical roles
    
    const salt = await bcrypt.genSalt(10);
    const superAdminPassword = await bcrypt.hash('SuperAdminPassword123', salt);
    const adminPassword = await bcrypt.hash('AdminPassword123', salt);
    const staffPassword = await bcrypt.hash('StaffPassword123', salt);
    
    // Super Admin
    await User.create({
      name: 'Jane (Super Admin)',
      email: 'superadmin@auranails.com',
      password: superAdminPassword,
      role: 'Super Admin'
    });

    // Admin
    await User.create({
      name: 'Marc (Admin)',
      email: 'admin@auranails.com',
      password: adminPassword,
      role: 'Admin'
    });

    // Staff
    await User.create({
      name: 'Clara (Staff)',
      email: 'staff@auranails.com',
      password: staffPassword,
      role: 'Staff'
    });

    console.log('[Seed] User role accounts (Super Admin, Admin, Staff) seeded.');

    // 2. Seed Gallery Items
    await Gallery.deleteMany({});
    const galleryData = [
      {
        title: 'Classic Blush Gel',
        description: 'Sleek, minimalist solid blush pink gel overlay. Perfect for everyday elegance.',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop',
        category: 'Gel'
      },
      {
        title: 'Emerald Luxury Chrome',
        description: 'Deep forest green shellac with reflective gold-metallic chrome dust.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1610992015732-2449b76344cc?q=80&w=600&auto=format&fit=crop',
        category: 'Acrylic'
      },
      {
        title: 'Wedding Grace Accent',
        description: 'Semi-sheer nude base featuring hand-painted floral lace and micro pearls.',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop',
        category: 'Bridal'
      },
      {
        title: 'Celestial Gold Moon',
        description: 'Matte dark indigo background with elegant hand-painted golden stars and moon phase details.',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600&auto=format&fit=crop',
        category: 'Custom'
      },
      {
        title: 'Velvet Ruby Ombre',
        description: 'Rich dark red transitioning to soft crimson with velvet shimmer texture.',
        price: 1600,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
        category: 'Classic'
      }
    ];

    for (const item of galleryData) {
      await Gallery.create(item);
    }
    console.log('[Seed] Gallery items seeded.');

    // 3. Seed Pricing Packages
    await Pricing.deleteMany({});
    const pricingData = [
      {
        serviceName: 'Basic Gel Overlay',
        price: 1200,
        features: [
          'Gentle cuticle care and nail shaping',
          'Single tone premium gel polish',
          'UV-cured top coat sealer',
          'Nourishing almond oil massage'
        ],
        description: 'An elegant, long-lasting solid gel overlay that provides natural strength and high gloss finish.',
        category: 'Basic'
      },
      {
        serviceName: 'Gel Polish Master',
        price: 1800,
        features: [
          'Medical-grade Russian manicure cuticle prep',
          'Premium double gel coating',
          'Up to 2 custom accent nails (foils, glitter, stickers)',
          'Hydrating organic hand scrub'
        ],
        description: 'For nail lovers seeking premium care combined with subtle accent designs. Lasts up to 4 weeks.',
        category: 'Premium'
      },
      {
        serviceName: 'Luxury Bridal Set',
        price: 3500,
        features: [
          'Full-set tips or hard builder gel extension',
          'Bespoke bridal styling session',
          'Genuine Swarovski crystals and pearl details',
          'Paraffin wax hand treatment'
        ],
        description: 'The ultimate nail transformation package for your special wedding day. Styled custom to match your gown.',
        category: 'Bridal'
      },
      {
        serviceName: 'Premium Artistic Custom',
        price: 2800,
        features: [
          'Full builder gel or gel-x extension',
          'Unlimited custom hand-painted art',
          'Specialty chrome, magnetic velvet, or cat-eye effects',
          'Reinforcing structural top layer'
        ],
        description: 'Turn your nails into a canvas. Bring any concept and let our expert nail artists paint it to perfection.',
        category: 'Custom'
      }
    ];

    for (const p of pricingData) {
      await Pricing.create(p);
    }
    console.log('[Seed] Pricing packages seeded.');

    // 4. Seed Videos
    await Video.deleteMany({});
    const videoData = [
      {
        title: 'Summer Florals hand-painted tutorial',
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop'
      },
      {
        title: 'Applying Perfect Velvet Cat-eye Polish',
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1632345031435-8797b2d58045?q=80&w=600&auto=format&fit=crop'
      }
    ];

    for (const v of videoData) {
      await Video.create(v);
    }
    console.log('[Seed] Video listings seeded.');

    // 5. Seed Testimonials
    await Testimonial.deleteMany({});
    const testimonialData = [
      {
        name: 'Sophie Vance',
        review: 'Absolutely loved the custom celestial gold nail art! The details were hand-painted to absolute perfection and the polish lasted for 4 weeks without chipping.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
      },
      {
        name: 'Jessica Miller',
        review: 'The Russian manicure prep is incredible. My cuticles have never looked so clean and healthy. The salon ambiance feels very premium and luxurious!',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
      },
      {
        name: 'Gabriella Thorne',
        review: 'I booked the Luxury Bridal Set for my wedding and it was the best decision. The crystals stayed glued through the entire honeymoon and I received countless compliments.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
      }
    ];

    for (const t of testimonialData) {
      await Testimonial.create(t);
    }
    console.log('[Seed] Testimonials seeded.');

    // 6. Seed About
    await About.deleteMany({});
    await About.create({
      salonIntro: 'Welcome to Aura Nails, a premium nail artistry studio where creativity meets luxury. We believe nail styling is more than just maintenance—it is a form of self-expression and personal styling. Our studio blends high-quality ingredients with cutting-edge artistry to deliver stunning, personalized results.',
      mission: 'To deliver client-focused luxury nail treatments that prioritize safety, hygiene, and creativity. We use only premium non-toxic, vegan polishes and builder gels to keep your natural nails healthy and beautiful.',
      experienceYears: 8,
      whyChooseUs: [
        'Certified Nail Technicians with over 15 combined years of art experience',
        '9-Free, Vegan, and Cruelty-Free products only',
        '100% Autoclave-Sterilized tools & hygienic, relaxing studio environment',
        'Completely customizable hand-painted art, chrome, and embellishments'
      ]
    });
    console.log('[Seed] About content seeded.');

    console.log('Phase 3 database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
