/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        disney: {
          bg: '#040714',
          card: '#0e1329',
          blue: '#0063e5',
          hover: '#0483ee',
          accent: '#f9f9f9',
        },
      },
      fontFamily: {
        sans: ['Avenir Next', 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
