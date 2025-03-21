/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        'hl-blue': '#9fbfdb',
        'bg-gray': '#e8effc',
        'dark-blue': '#284b74',
        'input-blue': '#bfdffd'
      },
      screens: {
        'custom-large': '1460px',
        'desktop': '1660px',
        'desktopXL': '1780px',
        'desktop2XL': '1880px',
        xs: '480px',
      },
    },
  },
  plugins: [],
}

