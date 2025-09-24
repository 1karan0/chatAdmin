import type { Config } from 'tailwindcss';

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // ---- merged palette ----
        background: 'hsl(0, 0%, 0%)',
        foreground: 'hsl(0, 0%, 95%)',
        card: {
          DEFAULT: 'hsl(0, 0%, 5%)',
          foreground: 'hsl(0, 0%, 95%)',
        },
        popover: {
          DEFAULT: 'hsl(0, 0%, 8%)',
          foreground: 'hsl(0, 0%, 95%)',
        },
        primary: {
          DEFAULT: 'hsl(255, 100%, 50%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(0, 0%, 15%)',
          foreground: 'hsl(0, 0%, 95%)',
        },
        muted: {
          DEFAULT: 'hsl(0, 0%, 10%)',
          foreground: 'hsl(0, 0%, 65%)',
        },
        accent: {
          DEFAULT: 'hsl(255, 100%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        border: 'hsl(0, 0%, 20%)',
        input: 'hsl(0, 0%, 10%)',
        ring: 'hsl(255, 100%, 50%)',
        // ✅ keep extra custom color here too
        'electric-blue': '#ff0080',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

