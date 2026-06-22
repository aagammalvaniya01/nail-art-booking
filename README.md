# 💅 Nail Art Booking App

A premium, full-stack website designed for nail art businesses, featuring a seamless booking system, dynamic showcase gallery, custom quote requests, and an administrative dashboard to manage clients, bookings, and services.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20URL-ff69b4?style=for-the-badge&logo=vercel)](https://nail-art-booking.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8-880000?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)

---

## 🔗 Live Deployment

The application is deployed and live at:
👉 **[https://nail-art-booking.vercel.app/](https://nail-art-booking.vercel.app/)**

---

## ✨ Features

### 🌟 Client-Facing Pages
* **Interactive Booking System:** Multi-step client booking wizard (`BookingForm.jsx`, `DatePicker.jsx`) with real-time service selection, customizable date-time slot picker, and automatic validations.
* **Showcase Gallery:** Beautifully filtered portfolio grid demonstrating categories of nail designs, enhanced by `framer-motion` for fluid transitions.
* **Pricing Catalog:** Detailed price lists and tier structures displayed on elegant interactive pricing cards.
* **Custom Quote Request:** Popup consultation modal (`QuoteModal.jsx`) for clients seeking personalized designs or custom art sessions.
* **Customer Testimonials & Contact Form:** Real-time user reviews and feedback section alongside fully functional messaging channels.

### 🛡️ Admin Dashboard (`/admin`)
* **Secure Authorization:** JWT-based user login (`login.jsx`) with hashed passwords using `bcryptjs`.
* **Booking Management:** Complete control to view, update, approve, or cancel upcoming nail art appointments.
* **Live Statistics:** Quick overview metrics showing appointment volumes, pending approvals, and calendar updates.

---

## 📂 Project Structure

```text
nail-art-booking/
├── server/                    # Express Backend API
│   ├── config/                # Database and service configurations
│   ├── controllers/           # API controllers (bookings, auth, services)
│   ├── middleware/            # JWT authorization and request parsers
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Backend API endpoints
│   ├── utils/                 # Email templates, helpers & database seeders
│   ├── db.json                # Local fallback mock data
│   └── server.js              # Express main entry point
├── src/                       # Next.js Client
│   ├── components/            # Reusable UI elements (Hero, Forms, Cards, Modals)
│   │   ├── BookingForm.jsx
│   │   ├── DatePicker.jsx
│   │   ├── QuoteModal.jsx
│   │   └── ...
│   ├── context/               # Global state contexts
│   ├── layouts/               # Shared page layout templates
│   ├── pages/                 # Next.js Pages (Routing)
│   │   ├── admin.jsx          # Admin Dashboard
│   │   ├── booking.jsx        # Scheduling Page
│   │   ├── gallery.jsx        # Portfolio Showcase
│   │   ├── pricing.jsx        # Service list & prices
│   │   ├── login.jsx          # Admin Login
│   │   └── index.jsx          # Main Landing Page
│   └── index.css              # Main tailwind styles
├── package.json               # Scripts and project dependencies
└── vercel.json                # Vercel deployment configuration
```

---

## 🛠️ Tech Stack & Dependencies

* **Frontend:** Next.js (Pages Router), React 18, Tailwind CSS, Lucide React (Icons), Framer Motion (Animations).
* **Backend:** Node.js, Express, Mongoose (MongoDB ODM), JWT (Authentication), BcryptJS (Password Hashing), Nodemailer (Email Notifications).
* **Development Tools:** Concurrently, PostCSS, Autoprefixer.

---

## 🚀 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aagammalvaniya01/nail-art-booking.git
   cd nail-art-booking
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Initialize/Seed Database (Optional):**
   ```bash
   npm run seed
   ```

5. **Run the Development Server:**
   This command starts the backend Express server and the Next.js client concurrently:
   ```bash
   npm run dev
   ```
   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:5000](http://localhost:5000)
