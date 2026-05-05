/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF2EB',
          100: '#FFE0CC',
          200: '#FFC499',
          300: '#FFA866',
          400: '#FD9A60',
          500: '#FC782E',
          600: '#E05C15',
          700: '#B84610',
          800: '#8F3310',
          900: '#6B240A',
        },
        primary: {
          50: '#EEF2FD',
          100: '#D5E0FA',
          200: '#ABBCF5',
          300: '#7D96EF',
          400: '#5E83EE',
          500: '#2255E8',
          600: '#1A44C0',
          700: '#133294',
          800: '#0E2471',
          900: '#091855',
        },
      },
    },
  },
  plugins: [],
};
