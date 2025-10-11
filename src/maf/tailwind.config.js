import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        chalk: ['"Caveat"', '"Patrick Hand"', 'cursive'],
      },
      colors: {
        chalkboard: {
          dark: '#0f1e0f',
          green: '#1a331a',
          DEFAULT: '#1e3a1e',
          light: '#2d4f2d',
        },
        chalk: {
          white: '#f5f5dc',
          yellow: '#ffeb99',
          red: '#ff6b6b',
          green: '#90ee90',
          'dark-green': '#166534', // Dark green for correct answers
          blue: '#87ceeb',
        }
      },
      backgroundImage: {
        'chalkboard-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"/%3E')",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}
