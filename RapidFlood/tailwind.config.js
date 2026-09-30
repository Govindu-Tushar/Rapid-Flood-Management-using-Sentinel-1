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
        space: {
          950: '#050B14', // Base deepest space midnight
          900: '#081522', // Card / panel elevated
          850: '#0A1A2B', // Hover / highlight panel
          800: '#0B1F33', // Borders / structural lines
          750: '#0E2842', // Accent surfaces
          700: '#112F4E', // Dividers
        },
        cyan: {
          glow: '#06B6D4',
          electric: '#22D3EE',
          light: '#67E8F9',
        },
        sky: {
          vivid: '#0EA5E9',
          glow: '#38BDF8',
          deep: '#0369A1',
        },
        status: {
          emergency: '#EF4444',
          amber: '#F59E0B',
          safe: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'glow-sky': '0 0 30px -4px rgba(14, 165, 233, 0.4)',
        'glow-red': '0 0 25px -4px rgba(239, 68, 68, 0.45)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'glow-green': '0 0 25px -4px rgba(34, 197, 94, 0.45)',
        'radar': '0 0 50px -10px rgba(34, 211, 238, 0.25)',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-slow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'pingSlow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.015)' },
        },
        pingSlow: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
