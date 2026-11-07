/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#04060f',
        navy: '#070b1d',
        deep: '#0a1029',
        panel: '#0e1530',
        raised: '#141c3d',
        line: '#232d55',
        mist: '#9aa6d4',
        neon: {
          DEFAULT: '#22d3ee',
          soft: '#7dd3fc',
          dim: '#0e7490',
        },
        plum: {
          DEFAULT: '#a78bfa',
          soft: '#c4b5fd',
          dim: '#6d28d9',
        },
        gold: '#f5c451',
        danger: '#fb7185',
        success: '#34d399',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.25), 0 0 40px -8px rgba(34,211,238,0.45)',
        'glow-violet':
          '0 0 0 1px rgba(167,139,250,0.25), 0 0 40px -8px rgba(167,139,250,0.45)',
        card: '0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
        'radial-fade':
          'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.16), transparent 60%)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(500%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-44px,-44px,0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        scan: 'scan 4s linear infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        blink: 'blink 1.1s step-end infinite',
        drift: 'drift 18s linear infinite',
      },
    },
  },
  plugins: [],
}
