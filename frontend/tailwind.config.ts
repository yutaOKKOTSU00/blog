import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0D0F12',
          secondary: '#161920',
          tertiary:  '#1E2330',
          elevated:  '#252B3B',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover:   '#FCD34D',
          muted:   '#92400E',
          subtle:  'rgba(245,158,11,0.1)',
        },
        text: {
          primary:   '#F8FAFC',
          secondary: '#94A3B8',
          tertiary:  '#64748B',
          disabled:  '#334155',
        },
        border: {
          subtle:  '#1E2330',
          DEFAULT: '#2D3748',
          strong:  '#4A5568',
          accent:  '#F59E0B',
        },
        semantic: {
          success:    '#10B981',
          warning:    '#F59E0B',
          error:      '#F43F5E',
          info:       '#0EA5E9',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        display: ['3.5rem',   { lineHeight: '1.1',  fontWeight: '900' }],
        h1:      ['2.5rem',   { lineHeight: '1.2',  fontWeight: '700' }],
        h2:      ['2rem',     { lineHeight: '1.25', fontWeight: '600' }],
        h3:      ['1.5rem',   { lineHeight: '1.3',  fontWeight: '600' }],
        h4:      ['1.25rem',  { lineHeight: '1.35', fontWeight: '500' }],
      },
      boxShadow: {
        glow:     '0 0 20px rgba(245,158,11,0.2)',
        'glow-lg':'0 0 40px rgba(245,158,11,0.3)',
        card:     '0 4px 16px rgba(0,0,0,0.5)',
        elevated: '0 10px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease forwards',
        'slide-up':  'slideUp 0.4s ease forwards',
        'slide-down':'slideDown 0.3s ease forwards',
        shimmer:     'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                   to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' },    to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' },    to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      transitionDuration: {
        fast:   '150',
        normal: '250',
        slow:   '400',
      },
    },
  },
  plugins: [],
}

export default config
