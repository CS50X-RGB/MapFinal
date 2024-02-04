/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        back: "#000000",
        text: "#82AAFF",
      },
      fontFamily:{
        mono: ['JetBrains Mono', 'monospace'],
        poppins : ['Poppins','sans-serif']
      }
    },
  },
  plugins: [],
}