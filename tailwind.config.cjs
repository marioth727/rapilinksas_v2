/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1A3A5C",
          action: "#0072CE",
          hover: "#005AA8",
          charcoal: "#1A1A2E",
          light: "#F5F7FA",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'brand': '8px',
      }
    },
  },
  plugins: [],
}
