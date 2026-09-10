/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          hover: '#0D5F59',
          light: '#CCFBF1',
          dark: '#0D655D',
        },
        secondary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#DBEAFE',
        },
        background: {
          DEFAULT: '#F8FAFC',
          secondary: '#F1F5F9',
        },
        surface: '#FFFFFF',
        card: '#FFFFFF',
        text: {
          DEFAULT: '#0F172A',
          secondary: '#475569',
          muted: '#64748B',
          white: '#FFFFFF',
        },
        // Backward-compatibility aliases for existing starter pages & index.html
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#CBD5E1',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#2563EB',
        risk: {
          low: '#16A34A',
          medium: '#D97706',
          high: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      fontSize: {
        h1: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['30px', { lineHeight: '1.25', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08)',
        elevated: '0 4px 12px rgba(15, 23, 42, 0.10)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
      },
    },
  },
  plugins: [],
}
