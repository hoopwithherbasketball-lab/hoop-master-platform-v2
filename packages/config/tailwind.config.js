/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/features/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
        // Primary brand colors
        brand: {
          blue: '#0134BD',
          orange: '#FB6C1D',
          gold: '#C8A24A',
          navy: '#121B47',
          royal: '#0134BD',
        },
        // Navy scale
        navy: {
          50: '#eef0f8',
          100: '#d4d8ed',
          200: '#a8b1db',
          300: '#7c8ac9',
          400: '#5063b7',
          600: '#1d2f7e',
          700: '#16235f',
          800: '#0e173f',
          900: '#121B47',
          950: '#0a1030',
        },
        // Royal blue scale
        royal: {
          50: '#e6eeff',
          100: '#c0d2ff',
          200: '#99b4ff',
          300: '#6694ff',
          500: '#0134BD',
          600: '#012aa0',
          700: '#012183',
          800: '#011866',
        },
        // Dark mode surface colors (from lightblueportal palette)
        surface: {
          dark: '#0b0b0b',
          card: '#121212',
          input: '#1a1a1a',
          'input-focus': '#222222',
        },
        // Semantic colors
        success: { 50: '#edfdf6', 500: '#10b981', 600: '#059669' },
        warning: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706' },
        error: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626' },
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        'brand-blue': '0 8px 20px rgba(1, 52, 189, 0.3)',
        'brand-orange': '0 4px 12px rgba(251, 108, 29, 0.3)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0134BD 0%, #0152DB 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #0152DB 0%, #0168FF 100%)',
        'title-gradient': 'linear-gradient(135deg, #0134BD 0%, #FB6C1D 100%)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
      },
    },
  },
  plugins: [],
};
