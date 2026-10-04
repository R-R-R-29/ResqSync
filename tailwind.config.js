/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // High-contrast emergency response theme
        resq: {
          dark: '#0f172a',      // Primary dark slate background
          card: '#1e293b',      // Card surface slate
          border: '#334155',    // High-contrast border
          immediate: '#ef4444', // Emergency Red (Immediate Triage)
          delayed: '#f59e0b',   // Warning Yellow (Delayed Triage)
          minor: '#10b981',     // Stable Green (Minor Triage)
          expectant: '#334155', // Deceased Black / Expectant Triage
        },
        triage: {
          immediate: {
            DEFAULT: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
            bg: 'rgba(239, 68, 68, 0.15)'
          },
          delayed: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            bg: 'rgba(245, 158, 11, 0.15)'
          },
          minor: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
            bg: 'rgba(16, 185, 129, 0.15)'
          },
          expectant: {
            DEFAULT: '#334155',
            light: '#475569',
            dark: '#1e293b',
            bg: 'rgba(51, 65, 85, 0.25)'
          }
        }
      },
      boxShadow: {
        'emergency-glow': '0 0 15px rgba(239, 68, 68, 0.35)',
        'warning-glow': '0 0 15px rgba(245, 158, 11, 0.35)',
        'stable-glow': '0 0 15px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
