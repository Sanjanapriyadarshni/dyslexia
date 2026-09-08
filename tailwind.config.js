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
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        akshai: {
          teal: '#0D9488',
          tealLight: '#E6FFFA',
          tealDark: '#0F766E',
          coral: '#F43F5E',
          coralLight: '#FFF1F2',
          indigo: '#4F46E5',
          indigoLight: '#EEF2FF',
          yellow: '#F59E0B',
          yellowLight: '#FEF3C7',
          purple: '#8B5CF6',
          purpleLight: '#F5F3FF',
          green: '#10B981',
          greenLight: '#ECFDF5',
          dark: '#1E1B4B',
          card: '#FFFFFF',
          bg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Comic Neue"', '"Quicksand"', 'Nunito', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'tactile': '0 5px 0 0 rgba(0, 0, 0, 0.12)',
        'tactile-lg': '0 7px 0 0 rgba(0, 0, 0, 0.14)',
        'tactile-pressed': '0 2px 0 0 rgba(0, 0, 0, 0.12)',
        'glow-teal': '0 0 20px -3px rgba(13, 148, 136, 0.35)',
        'glow-coral': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'glow-yellow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
