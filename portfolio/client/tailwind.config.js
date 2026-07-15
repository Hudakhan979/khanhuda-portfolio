/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050816',
        primary:    '#7C3AED',
        secondary:  '#06B6D4',
        accent:     '#F472B6',
        card:       'rgba(255,255,255,0.05)',
        border:     'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary':  'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'gradient-aurora':   'linear-gradient(135deg, #7C3AED 0%, #F472B6 50%, #06B6D4 100%)',
        'gradient-radial':   'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      animation: {
        'blob-float':   'blobFloat 20s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'gradient-x':   'gradientX 4s ease infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':      { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%':      { opacity: 0.6, transform: 'scale(1.05)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(124, 58, 237, 0.4)',
        'glow-cyan':    '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-pink':    '0 0 30px rgba(244, 114, 182, 0.4)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
