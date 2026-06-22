/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#e5d5be',
          DEFAULT: '#c5a880',
          dark: '#a68759',
        },
        rosegold: {
          light: '#d4a5ab',
          DEFAULT: '#b76e79',
          dark: '#93535d',
        },
        blush: {
          light: '#fcf6f7',
          DEFAULT: '#f5e6e8',
          dark: '#e3cbd0',
        },
        cream: {
          light: '#6E6A63', // soft text
          DEFAULT: '#1C1A17', // main body text
          dark: '#0A0908', // deep headings text
        },
        onyx: {
          light: '#FFFFFF', // card & panel backgrounds
          DEFAULT: '#FAF8F5', // body background
          dark: '#F0ECE3', // inputs & active background elements
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #FAF8F5 0%, #F5ECE1 50%, #EFE6D8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #e5d5be 0%, #c5a880 50%, #a68759 100%)',
        'rose-gradient': 'linear-gradient(135deg, #fcfbfa 0%, #fcf6f7 50%, #f5e6e8 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(197, 168, 128, 0.08)',
        'premium': '0 20px 40px -15px rgba(28, 26, 23, 0.07)',
        'gold-glow': '0 0 15px rgba(197, 168, 128, 0.12)',
      }
    },
  },
  plugins: [],
}
