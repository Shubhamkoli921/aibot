/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'signinbg': "url('/src/assets/signin.jpg')",
        
      }
    },
  },
  plugins: [],
}