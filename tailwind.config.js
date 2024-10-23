/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telegramBlue: '#0088cc',
        telegramGray: '#f9f9f9',
      },
    },
  },
  plugins: [],
}

