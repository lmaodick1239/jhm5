import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: '#0070f3',
            foreground: '#ffffff'
          },
          focus: '#0070f3'
        }
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: '#0070f3',
            foreground: '#ffffff'
          },
          focus: '#0070f3'
        }
      }
    }
  })]
};
