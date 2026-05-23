/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', '../../packages/features/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
      },
      colors: {
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
        brand: {
          orange: '#FB6C1D',
          gold: '#C8A24A',
          navy: '#121B47',
          royal: '#0134BD',
        },
        success: { 50: '#edfdf6', 500: '#10b981', 600: '#059669' },
        warning: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706' },
        error: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626' },
      },
    },
  },
  plugins: [],
}

