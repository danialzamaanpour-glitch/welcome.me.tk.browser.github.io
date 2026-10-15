/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // VELORA monochrome high-key palette
        paper: '#FFFFFF',
        ink: '#111111',
        velora: '#0A0A0A',
        muted: '#666666',
        faint: '#8A8A8A',
        surface: '#F5F5F5',
        surface2: '#EEEEEE',
        line: '#E5E5E5',
        cta: '#050505',
        hover: '#F2F2F2',
        success: '#1F5132',
        danger: '#B91C1C'
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      fontSize: {
        micro: ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
        label: ['12px', { lineHeight: '18px', letterSpacing: '0.05em' }],
        meta: ['13px', { lineHeight: '20px' }],
        body: ['15px', { lineHeight: '25.6px' }],
        price: ['22px', { lineHeight: '28px' }],
        product: ['34px', { lineHeight: '1.1' }],
        section: ['22px', { lineHeight: '1.25' }],
        display: ['52px', { lineHeight: '1.05' }]
      },
      maxWidth: {
        shell: '1440px'
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px'
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem'
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        250: '250ms'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' }
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'heart-pop': {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.28)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out both',
        'fade-up': 'fade-up 250ms ease-out both',
        'slide-in-right': 'slide-in-right 250ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'slide-up': 'slide-up 250ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'slide-in-left': 'slide-in-left 250ms cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'toast-in': 'toast-in 200ms ease-out both',
        'heart-pop': 'heart-pop 300ms ease-out'
      }
    }
  },
  plugins: []
}
