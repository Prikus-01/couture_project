/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for StoreAdmin Portal
        primary: {
          blue: '#2c8cfb',      // Primary Blue (44, 140, 251)
          light: '#5cacfa',      // Light Blue (92, 172, 250)
        },
        dark: {
          blue: '#2c4c71',       // Dark Blue (44, 76, 113)
          mid: '#446285',        // Mid Blue (68, 98, 133)
        },
        neutral: {
          light: '#a5b8cc',      // Light Gray (165, 184, 204)
          dark: '#5c6468',       // Dark Gray (92, 100, 104)
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}