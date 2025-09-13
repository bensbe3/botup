/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cursor: {
          dark: '#0D0A1F',
          gray: '#1A162E',
          lightgray: '#2D2651',
          text: '#F7F8F8',
          muted: '#A9A9B1',
          accent: '#9D4EDD',
          accentHover: '#7B2CBF',
        },
        space: {
          purple: '#9D4EDD',   // Main purple
          darkPurple: '#3C096C', // Dark purple
          deepPurple: '#240046', // Deeper purple for backgrounds
          midnight: '#10002B',  // Almost black purple for backgrounds
          indigo: '#6A4C93',   // Indigo accent
          violet: '#C77DFF',   // Bright violet accent
          pink: '#F72585',     // Neon pink accent
          blue: '#4CC9F0',     // Bright blue accent
          teal: '#00F5D4',     // Teal/cyan accent
          nebula: '#8338EC',   // Nebula purple
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.1)',
          heavy: 'rgba(255, 255, 255, 0.2)',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(157, 78, 221, 0.5)',
        'neon': '0 0 5px rgba(157, 78, 221, 0.2), 0 0 20px rgba(157, 78, 221, 0.2)',
        'space-glow': '0 0 15px rgba(157, 78, 221, 0.5)',
        'star-glow': '0 0 20px rgba(76, 201, 240, 0.8)',
        'nebula-glow': '0 0 25px rgba(131, 56, 236, 0.6)',
        'pink-glow': '0 0 15px rgba(247, 37, 133, 0.5)',
        'teal-glow': '0 0 15px rgba(0, 245, 212, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glassmorphism': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'slide-in-left': 'slideInLeft 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-in-out',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 1s infinite',
        'blur-in': 'blurIn 0.5s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-gentle': 'bounceGentle 3s infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'gradual-glow': 'gradualGlow 2.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'orbit': 'orbit 15s linear infinite',
        'shooting-star': 'shootingStar 6s ease-out infinite',
        'nebula-pulse': 'nebulaPulse 8s ease-in-out infinite',
        'space-drift': 'spaceDrift 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(to bottom right, #10002B, #240046)',
        'gradient-space': 'linear-gradient(to bottom right, #10002B, #3C096C)',
        'gradient-nebula': 'linear-gradient(135deg, #3C096C, #7B2CBF)',
        'gradient-cosmos': 'radial-gradient(circle at center, #7B2CBF, #10002B)',
        'gradient-galaxy': 'linear-gradient(135deg, #10002B, #3C096C, #240046)',
        'gradient-aurora': 'linear-gradient(135deg, #4CC9F0, #9D4EDD, #3C096C)',
        'gradient-glow': 'radial-gradient(circle, rgba(157, 78, 221, 0.15) 0%, rgba(10, 10, 10, 0) 70%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blurIn: {
          '0%': { filter: 'blur(8px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(157, 78, 221, 0.2), 0 0 20px rgba(157, 78, 221, 0.2)' },
          '50%': { boxShadow: '0 0 10px rgba(157, 78, 221, 0.5), 0 0 30px rgba(157, 78, 221, 0.3)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 50% 70% / 40% 40% 60% 50%' },
          '75%': { borderRadius: '60% 40% 30% 60% / 60% 50% 70% 40%' },
        },
        gradualGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(157, 78, 221, 0.2), 0 0 10px rgba(157, 78, 221, 0.1)',
            borderColor: 'rgba(157, 78, 221, 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(157, 78, 221, 0.5), 0 0 30px rgba(157, 78, 221, 0.3)',
            borderColor: 'rgba(157, 78, 221, 0.8)'
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(157, 78, 221, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(157, 78, 221, 0.8)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(10px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(10px) rotate(-360deg)' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(0) translateY(0)', opacity: 0 },
          '10%': { transform: 'translateX(-20px) translateY(20px)', opacity: 1 },
          '100%': { transform: 'translateX(-200px) translateY(200px)', opacity: 0 },
        },
        nebulaPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
          '50%': { transform: 'scale(1.1)', opacity: 1 },
        },
        spaceDrift: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      zIndex: {
        '-10': '-10',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
        'blur-sm': 'blur(4px)',
        'blur-md': 'blur(10px)',
        'blur-lg': 'blur(16px)',
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}