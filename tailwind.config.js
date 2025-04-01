/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#D0FD3E',
          dark: '#0A1A2F',
          light: '#1A2F4F',
        },
        accent: {
          green: '#2ECC71',
          blue: '#3498DB',
        },
      },
      animation: {
        'marching-ants': 'marching-ants 1s linear infinite',
      },
      keyframes: {
        'marching-ants': {
          '0%': { backgroundPosition: '0 0, 0 100%, 0 0, 100% 0' },
          '100%': { backgroundPosition: '20px 0, -20px 100%, 0 -20px, 100% 20px' },
        },
      },
    },
  },
  plugins: [],
}