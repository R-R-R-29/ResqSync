/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // AidConnect & UX4G Brand Tokens
        aid: {
          primary: '#D93829',      // Terracotta Red / Crimson
          hover: '#B91C1C',        // Deep Terracotta Hover
          light: '#FDF2F1',        // Soft Coral tint
          border: '#F87171',       // Coral accent border
          surface: '#F8F9FA',      // Soft Off-White light mode
          card: '#FFFFFF',         // Pure White Card
          borderLight: '#E2E8F0',  // Subtle grey border
          darkSurface: '#0F172A',  // Operational Dark Slate
          darkCard: '#1E293B',     // Card Slate
          darkBorder: '#334155',   // High-contrast slate border
        },
        // Semantic High-Contrast Triage Tokens (WCAG AAA compliant)
        triage: {
          immediate: {
            DEFAULT: '#DC2626',    // Red 600
            hover: '#B91C1C',
            bg: '#FEF2F2',
            border: '#F87171',
            text: '#991B1B',
          },
          delayed: {
            DEFAULT: '#D97706',    // Amber 600
            hover: '#B45309',
            bg: '#FFFBEB',
            border: '#FCD34D',
            text: '#92400E',
          },
          minor: {
            DEFAULT: '#059669',    // Emerald 600
            hover: '#047857',
            bg: '#ECFDF5',
            border: '#6EE7B7',
            text: '#065F46',
          },
          expectant: {
            DEFAULT: '#334155',    // Slate 700
            hover: '#1E293B',
            bg: '#F1F5F9',
            border: '#94A3B8',
            text: '#1E293B',
          },
        },
        resq: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          immediate: '#DC2626',
          delayed: '#D97706',
          minor: '#059669',
          expectant: '#334155',
        },
      },
      boxShadow: {
        'aid-card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'aid-raised': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'emergency-glow': '0 0 15px rgba(220, 38, 38, 0.35)',
        'warning-glow': '0 0 15px rgba(217, 119, 6, 0.35)',
        'stable-glow': '0 0 15px rgba(5, 150, 105, 0.35)',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
