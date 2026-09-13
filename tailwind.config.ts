import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lillyum Fragrance Studio — refined light luxury palette
        brand: {
          // Backgrounds
          white:   '#FFFFFF',
          cream:   '#FAF7F2',
          ivory:   '#F4EFE6',
          parchment: '#EDE5D8',

          // Text
          charcoal: '#1C1C1E',
          dark:    '#2D2D2D',
          mid:     '#6B6B6B',
          muted:   '#9E9E9E',
          light:   '#DEDEDE',
          subtle:  '#F0EBE3',

          // Gold accents (from logo)
          gold:       '#B8892A',
          'gold-light': '#D4A94E',
          'gold-lighter': '#EDD590',
          'gold-dark':  '#8A6415',
          'gold-soft':  '#F5E9CE',

          // Accent
          rose:    '#D4869A',
          teal:    '#2D6E6E',
          blush:   '#F9EEE8',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient':    'linear-gradient(135deg, #8A6415 0%, #B8892A 40%, #D4A94E 70%, #EDD590 100%)',
        'cream-gradient':   'linear-gradient(180deg, #FAF7F2 0%, #F4EFE6 100%)',
        'hero-gradient':    'linear-gradient(135deg, #1C1C1E 0%, #2D2D2D 50%, #3D3020 100%)',
      },
      animation: {
        'fade-in':        'fadeIn 0.5s ease-in-out',
        'slide-up':       'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-subtle':   'pulseSubtle 2s infinite',
        'float':          'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        gold:        '0 4px 24px rgba(184, 137, 42, 0.20)',
        'gold-lg':   '0 8px 40px rgba(184, 137, 42, 0.30)',
        card:        '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.12)',
        soft:        '0 2px 12px rgba(0,0,0,0.04)',
        'soft-lg':   '0 4px 24px rgba(0,0,0,0.08)',
        inset:       'inset 0 0 0 1px rgba(184, 137, 42, 0.20)',
      },
      screens: {
        xs: '375px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
