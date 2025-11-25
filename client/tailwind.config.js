/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sudan-green': '#007229',
        'sudan-red': '#D21034',
        'sudan-white': '#FFFFFF',
        'sudan-black': '#000000',
        'sudan-blue': '#0033A0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}

