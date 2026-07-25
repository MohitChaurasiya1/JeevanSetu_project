/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          dark: '#0D655D',
          light: '#14B8A6',
        },
        secondary: {
          DEFAULT: '#14B8A6',
        },
        accent: {
          DEFAULT: '#2563EB',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        background: '#F8FAFC',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        card: '#FFFFFF',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
