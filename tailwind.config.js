/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-sapphire': '#010118',
        'purity-white': '#FFFFFF',
        'electric-sapphire': '#33A7FF',
        'vivid-lemon': '#FFEA00',
        
        'surface': '#1A1A2E',
        'surface-border': 'rgba(255, 255, 255, 0.1)', 
        'text-muted': 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
  plugins: [],
}