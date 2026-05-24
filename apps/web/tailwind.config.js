/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', '../../packages/features/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Barlow Condensed', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          50: '#eef0f8',
          100: '#d4d8ed',
          200: '#a8b1db',
          300: '#7c8ac9',
          400: '#5063b7',
          500: '#0134BD',
          600: '#012aa0',
          700: '#012183',
          800: '#011866',
          900: '#121212',
          950: '#0b0b0b',
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
          navy: '#121212',
          royal: '#0134BD',
          purple: '#8F33E6',
        },
        success: { 50: '#22c55e1a', 500: '#22c55e', 600: '#16a34a' },
        warning: { 50: '#eab3081a', 500: '#eab308', 600: '#ca8a04' },
        error: { 50: '#ef44441a', 500: '#ef4444', 600: '#dc2626' },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(1, 52, 189, 0.3)',
        'glow-orange': '0 0 20px rgba(251, 108, 29, 0.3)',
        'glow-purple': '0 0 20px rgba(143, 51, 230, 0.3)',
      },
    },
  },
  plugins: [],
}

