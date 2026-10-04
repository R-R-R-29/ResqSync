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
        // Primary Warm Coral Palette (from reference design)
        coral: {
          DEFAULT: '#E85B4A',
          dark: '#C94336',
          light: '#FDE3DF',
          hover: '#D44C3B',
          soft: '#FFF1EF',
        },
        // Surfaces & Backgrounds
        canvas: '#F8F7F5',       // Soft off-white page background
        surface: {
          DEFAULT: '#FFFFFF',    // Crisp white card surface
          secondary: '#F3F1EF',  // Secondary surface / inputs / chips
          tint: '#FAFAF9',
        },
        // Typography & Lines
        ink: {
          DEFAULT: '#171717',    // Primary text
          secondary: '#66615D',  // Secondary text
          muted: '#8A8580',      // Muted text
          light: '#A8A29E',
        },
        outline: {
          DEFAULT: '#E6E1DD',    // Card & input border
          subtle: '#EFECE9',
        },
        // Semantic High-Contrast Triage Tokens
        semantic: {
          success: '#4F9D69',
          warning: '#E5A33D',
          critical: '#D94343',
          info: '#5C83B6',
        },
        // Compatibility Aliases for AidConnect
        aid: {
          primary: '#E85B4A',
          hover: '#C94336',
          light: '#FDE3DF',
          border: '#FBCBC4',
          surface: '#F8F7F5',
          card: '#FFFFFF',
          borderLight: '#E6E1DD',
          darkSurface: '#171717',
          darkCard: '#242424',
          darkBorder: '#383838',
        },
        triage: {
          immediate: {
            DEFAULT: '#D94343',
            hover: '#C94336',
            bg: '#FDE3DF',
            border: '#FBCBC4',
            text: '#C94336',
          },
          delayed: {
            DEFAULT: '#E5A33D',
            hover: '#B45309',
            bg: '#FEF3C7',
            border: '#FDE68A',
            text: '#92400E',
          },
          minor: {
            DEFAULT: '#4F9D69',
            hover: '#047857',
            bg: '#ECFDF5',
            border: '#A7F3D0',
            text: '#065F46',
          },
          expectant: {
            DEFAULT: '#475569',
            hover: '#1E293B',
            bg: '#F3F1EF',
            border: '#E6E1DD',
            text: '#171717',
          },
        },
        resq: {
          dark: '#171717',
          card: '#FFFFFF',
          border: '#E6E1DD',
          immediate: '#D94343',
          delayed: '#E5A33D',
          minor: '#4F9D69',
          expectant: '#475569',
        },
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'soft-md': '0 4px 16px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.03)',
        'aid-card': '0 1px 4px rgba(0, 0, 0, 0.04)',
        'aid-raised': '0 4px 14px rgba(232, 91, 74, 0.25)',
        'emergency-glow': '0 0 15px rgba(232, 91, 74, 0.35)',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '56px',
      },
    },
  },
  plugins: [],
};
