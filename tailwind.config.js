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
      colors: {
        primary: {
          500: '#1C6731', // Dark Logo Green
          600: '#144d24',
        },
        success: {
          500: '#46A34A', // Light Leaf Green
        },
        warning: {
          500: '#EAB308', // Warm Sun Yellow / Accent
        },
        dark: {
          800: '#1E293B',
          900: '#0F172A', // Navy/Black
        },
        light: {
          50: '#F8FAFC',
          100: '#F1F5F9',
        }
      },
    },
  },
  plugins: [],
}
