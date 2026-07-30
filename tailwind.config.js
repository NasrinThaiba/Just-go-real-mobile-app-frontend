/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: '#F0442D',
        primarySoft: '#FFF0EC',
        textMain: '#121826',
        textMuted: '#667085',
        borderSoft: '#E5E7EB',
      },
    },
  },

  plugins: [],
};