/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto','sans-serif'],
      },
      colors: {
        rigelBlack: '#000000',
        rigelSalmon: '#E9806E',
        rigelIcon: '#3e4144'
      },
    },
  },
  plugins: [],
}