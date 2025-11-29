/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'cw-blue': '#007CBE',
        'cw-yellow': '#FFF7AE',
        'cw-teal': '#02C3BD',
        'cw-purple': '#4E148C',
      },
    },
  },
  plugins: [require("nativewind/gradients")],
};