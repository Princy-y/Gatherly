/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDFB',
          100: '#FFF9F5', // Milky cream primary background
          200: '#FFF0E5',
          300: '#FFE4D1',
        },
        lavender: {
          50: '#F5F0FF',
          100: '#ECE2FF',
          200: '#DCCEFF', // Dreamy lavender
          300: '#C7B1FF',
          border: '#B7A3D6', // Gentle lavender outline
        },
        iceBlue: {
          50: '#F0F8FF',
          100: '#E1F2FF',
          200: '#CDEBFF', // Icy baby blue
          300: '#B0DCFF',
        },
        blush: {
          50: '#FFF2F7',
          100: '#FFE5F0',
          200: '#FFD9E8', // Blush pink
          300: '#FFB8D5',
        },
        butter: {
          50: '#FFFAEB',
          100: '#FFF6D1',
          200: '#FFF0B8', // Butter yellow
          300: '#FFE68A',
        },
        mint: {
          50: '#F0FAF3',
          100: '#E2F7E9',
          200: '#D5F3DF', // Soft mint
          300: '#B3E8C4',
        },
        plum: {
          light: '#7A678D',
          DEFAULT: '#554564', // Muted plum text / strong outline
          dark: '#3A2E46',
        },
      },
      boxShadow: {
        'kawaii-sm': '2px 2px 0px #B7A3D6',
        'kawaii': '3px 3px 0px #B7A3D6',
        'kawaii-plum': '3px 3px 0px #554564',
        'kawaii-lg': '5px 5px 0px #554564',
        'kawaii-hover': '1px 1px 0px #554564',
      },
      borderRadius: {
        'kawaii': '1rem',
        'kawaii-lg': '1.5rem',
        'kawaii-xl': '2rem',
      },
      fontFamily: {
        sans: ['"Quicksand"', '"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
        handwritten: ['"Comfortaa"', '"Quicksand"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
