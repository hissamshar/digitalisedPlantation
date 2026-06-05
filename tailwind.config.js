/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      },
      colors: {
        // Dark Logo Green — full ramp anchored on 500/600
        primary: {
          50: '#ECF5EE',
          100: '#D0E6D6',
          200: '#A6D0B1',
          300: '#74B385',
          400: '#45925C',
          500: '#1C6731', // Dark Logo Green
          600: '#144d24',
          700: '#103E1D',
          800: '#0C2F16',
          900: '#07200F',
        },
        // Light Leaf Green — full ramp anchored on 500
        success: {
          50: '#EDF7EE',
          100: '#D2ECD3',
          200: '#A8DAAA',
          300: '#7BC57E',
          400: '#5AB45D',
          500: '#46A34A', // Light Leaf Green
          600: '#388340',
          700: '#2E6834',
          800: '#27532B',
          900: '#1F4423',
        },
        // Warm Sun Yellow / Accent — full ramp anchored on 500
        warning: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308', // Warm Sun Yellow / Accent
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        // Navy/Black slate ramp anchored on 800/900
        dark: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Navy/Black
        },
        light: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
        }
      },
    },
  },
  plugins: [],
}
