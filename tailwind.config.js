/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Primary
        primary: {
          base: 'hsl(var(--primary-base))',
          lighter: 'hsl(var(--primary-lighter))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))',
        },
        // Text
        text: {
          'strong-950': 'hsl(var(--text-strong-950))',
          'sub-600': 'hsl(var(--text-sub-600))',
          'soft-400': 'hsl(var(--text-soft-400))',
          'disabled-300': 'hsl(var(--text-disabled-300))',
          'white-0': 'hsl(var(--text-white-0))',
        },
        // Background
        bg: {
          'white-0': 'hsl(var(--bg-white-0))',
          'weak-50': 'hsl(var(--bg-weak-50))',
          'soft-200': 'hsl(var(--bg-soft-200))',
          'sub-300': 'hsl(var(--bg-sub-300))',
          'strong-950': 'hsl(var(--bg-strong-950))',
        },
        // Stroke
        stroke: {
          'white-0': 'hsl(var(--stroke-white-0))',
          'soft-200': 'hsl(var(--stroke-soft-200))',
          'sub-300': 'hsl(var(--stroke-sub-300))',
          'strong-950': 'hsl(var(--stroke-strong-950))',
        },
        // Status colors
        success: {
          base: 'hsl(var(--success-base))',
          lighter: 'hsl(var(--success-lighter))',
          light: 'hsl(var(--success-light))',
        },
        error: {
          base: 'hsl(var(--error-base))',
          lighter: 'hsl(var(--error-lighter))',
          light: 'hsl(var(--error-light))',
        },
        warning: {
          base: 'hsl(var(--warning-base))',
          lighter: 'hsl(var(--warning-lighter))',
          light: 'hsl(var(--warning-light))',
        },
        information: {
          base: 'hsl(var(--information-base))',
          lighter: 'hsl(var(--information-lighter))',
          light: 'hsl(var(--information-light))',
        },
        verified: {
          base: 'hsl(var(--verified-base))',
          lighter: 'hsl(var(--verified-lighter))',
        },
        feature: {
          base: 'hsl(var(--feature-base))',
          lighter: 'hsl(var(--feature-lighter))',
        },
        faded: {
          base: 'hsl(var(--faded-base))',
          lighter: 'hsl(var(--faded-lighter))',
        },
        highlighted: {
          base: 'hsl(var(--highlighted-base))',
          lighter: 'hsl(var(--highlighted-lighter))',
        },
        away: {
          base: 'hsl(var(--away-base))',
          lighter: 'hsl(var(--away-lighter))',
        },
      },
      boxShadow: {
        'regular-xs': '0px 1px 2px 0px rgba(10, 13, 20, 0.04)',
        'regular-sm':
          '0px 1px 2px 0px rgba(10, 13, 20, 0.04), 0px 2px 4px 0px rgba(10, 13, 20, 0.04)',
        'regular-md':
          '0px 2px 4px 0px rgba(10, 13, 20, 0.04), 0px 4px 8px 0px rgba(10, 13, 20, 0.06)',
        'regular-lg':
          '0px 4px 8px 0px rgba(10, 13, 20, 0.04), 0px 8px 16px 0px rgba(10, 13, 20, 0.06)',
      },
      fontSize: {
        'subheading-2xs': ['10px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '500' }],
        'subheading-xs': ['11px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '500' }],
        'subheading-sm': ['12px', { lineHeight: '20px', letterSpacing: '0.04em', fontWeight: '500' }],
        'paragraph-xs': ['12px', { lineHeight: '20px' }],
        'paragraph-sm': ['14px', { lineHeight: '20px' }],
        'paragraph-md': ['16px', { lineHeight: '24px' }],
        'paragraph-lg': ['18px', { lineHeight: '28px' }],
        'label-xs': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-sm': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-md': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'label-lg': ['18px', { lineHeight: '28px', fontWeight: '500' }],
        'title-h4': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'title-h5': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-h6': ['20px', { lineHeight: '28px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
}
