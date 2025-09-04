/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wealth-ink': '#0B0B0E',
        'wealth-paper': '#F7F6F3',
        'wealth-gold': '#E0B15C',
        'wealth-green': '#00A56A',
        'wealth-slate': '#6B7280'
      }
    }
  },
  plugins: []
}
