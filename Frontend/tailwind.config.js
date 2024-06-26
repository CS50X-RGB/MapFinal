import { nextui } from '@nextui-org/react';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        back: "#000000",
        text: "#82AAFF",
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        poppins : ['Poppins','sans-serif']
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
