/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-deep': '#0d0221',
        'cosmic-purple': '#2d1b69',
        'cosmic-blue': '#1e3a8a',
        'cosmic-teal': '#0891b2',
        'cosmic-gold': '#f59e0b',
        'cosmic-light': '#f8fafc',
        'spiritual-purple': '#8b5cf6',
        'spiritual-pink': '#ec4899',
        'spiritual-gold': '#fbbf24',
        'spiritual-sage': '#22c55e',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'breathing': 'breathing 8s ease-in-out infinite',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.002)' },
        },
      },
    },
  },
  plugins: [],
};