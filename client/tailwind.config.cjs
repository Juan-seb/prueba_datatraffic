/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens:{
      'bk': '1150px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [],
}
