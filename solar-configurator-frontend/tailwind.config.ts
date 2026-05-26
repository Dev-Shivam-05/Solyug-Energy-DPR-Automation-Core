import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'system-ui', 'sans-serif']
      },
      colors: {
        solar: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-delay': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'border-rotate': 'borderRotate 4s linear infinite',
        'counter-spin': 'counterSpin 8s linear infinite',
        'beam': 'beam 2s ease-in-out infinite',
        'tilt-in': 'tiltIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 30px -5px rgba(6, 182, 212, 0.15), 0 0 60px -10px rgba(59, 130, 246, 0.08)' },
          '50%': { boxShadow: '0 0 50px -5px rgba(6, 182, 212, 0.35), 0 0 100px -10px rgba(59, 130, 246, 0.2)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(40px) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        borderRotate: {
          '0%': { '--angle': '0deg' },
          '100%': { '--angle': '360deg' }
        },
        counterSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' }
        },
        beam: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleX(0.8)' },
          '50%': { opacity: '1', transform: 'scaleX(1)' }
        },
        tiltIn: {
          '0%': { transform: 'perspective(1200px) rotateX(8deg) rotateY(-4deg) translateY(60px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'perspective(1200px) rotateX(2deg) rotateY(-1deg) translateY(0) scale(1)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
} satisfies Config;
