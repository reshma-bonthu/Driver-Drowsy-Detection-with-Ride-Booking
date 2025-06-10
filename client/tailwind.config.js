/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],  // Make sure this includes the correct path to your pages
  theme: {
    extend: {
      colors: {
        brandOrange: '#f7b42c',
      },
    },
  },
  plugins: [],
}