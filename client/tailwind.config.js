/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1e1b4b", // Deep Indigo
          light: "#312e81",
          dark: "#0f172a",
        },
        accent: {
          DEFAULT: "#10b981", // Emerald
          hover: "#059669",
        },
        muted: "#eef2ff", // Soft pastel background
        beige: "#F5F5DC",
        navy: "#0A192F",
        secondary: "#c7d2fe", // Lavender
        peach: "#ffedd5",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};

