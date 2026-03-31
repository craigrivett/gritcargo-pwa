/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#141414',
        accent: '#00C853',
        border: '#1f1f1f',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
        'status-green': '#00C853',
        'status-yellow': '#f59e0b',
        'status-red': '#ef4444',
        'status-gray': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
