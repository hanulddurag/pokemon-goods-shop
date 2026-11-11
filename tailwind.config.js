/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poke: {
          red: '#EE1515',
          darkred: '#CC0000',
          blue: '#3B4CCA',
          yellow: '#FFDE00',
          gold: '#B3A125',
          dark: '#1E232A',
          cream: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'poke': '0 8px 30px rgba(238, 21, 21, 0.12)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}
