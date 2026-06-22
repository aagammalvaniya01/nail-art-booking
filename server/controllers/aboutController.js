import About from '../models/About.js';

// @desc    Get salon about information
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne({});
    if (!about) {
      // Create a default document
      const defaultAbout = {
        salonIntro: 'Welcome to Aura Nails, a premium nail artistry studio where creativity meets luxury. We believe nail styling is more than just maintenance—it is a form of self-expression and personal styling. Our studio blends high-quality ingredients with cutting-edge artistry to deliver stunning, personalized results.',
        mission: 'To deliver client-focused luxury nail treatments that prioritize safety, hygiene, and creativity. We use only premium non-toxic, vegan polishes and builder gels to keep your natural nails healthy and beautiful.',
        experienceYears: 8,
        whyChooseUs: [
          'Certified Nail Technicians with over 15 combined years of art experience',
          '9-Free, Vegan, and Cruelty-Free products only',
          '100% Autoclave-Sterilized tools & hygienic, relaxing studio environment',
          'Completely customizable hand-painted art, chrome, and embellishments'
        ],
        address: 'Pushkar valley, NewIndia Colony, Nikol',
        phone: '8141464492',
        email: 'rutvivasani26@gmail.com',
        hours: '9AM to 9PM all days'
      };
      about = await About.create(defaultAbout);
    } else {
      // Check if address, phone, email, or hours are missing and update
      let updated = false;
      const updateData = {};
      
      if (!about.address) { updateData.address = 'Pushkar valley, NewIndia Colony, Nikol'; updated = true; }
      if (!about.phone) { updateData.phone = '8141464492'; updated = true; }
      if (!about.email) { updateData.email = 'rutvivasani26@gmail.com'; updated = true; }
      if (!about.hours) { updateData.hours = '9AM to 9PM all days'; updated = true; }
      
      if (updated) {
        about = await About.findByIdAndUpdate(about._id, { $set: updateData }, { new: true });
      }
    }
    return res.status(200).json({ success: true, about });
  } catch (error) {
    console.error('Get about error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching about details' });
  }
};

// @desc    Create or update salon about information (Admin only)
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = async (req, res) => {
  const { salonIntro, mission, experienceYears, whyChooseUs, address, phone, email, hours } = req.body;

  try {
    let about = await About.findOne({});
    
    const updateData = {
      salonIntro,
      mission,
      experienceYears: Number(experienceYears),
      whyChooseUs: Array.isArray(whyChooseUs) ? whyChooseUs : [],
      address: address || 'Pushkar valley, NewIndia Colony, Nikol',
      phone: phone || '8141464492',
      email: email || 'rutvivasani26@gmail.com',
      hours: hours || '9AM to 9PM all days'
    };

    if (about) {
      about = await About.findByIdAndUpdate(
        about._id,
        { $set: updateData },
        { new: true }
      );
    } else {
      about = await About.create(updateData);
    }

    return res.status(200).json({
      success: true,
      message: 'About content updated successfully!',
      about
    });
  } catch (error) {
    console.error('Update about error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating about details' });
  }
};
