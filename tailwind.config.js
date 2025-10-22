/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury brand palette
        ink: {
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2A2A2A',
        },
        cream: {
          50: '#FAFAF8',
          100: '#F5F5F0',
          200: '#EBEBDE',
        },
        gold: {
          400: '#D4AF37',
          500: '#C5A028',
          600: '#B8941F',
        },
        sage: {
          400: '#9CAF88',
          500: '#8B9E7D',
          600: '#7A8D6C',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
