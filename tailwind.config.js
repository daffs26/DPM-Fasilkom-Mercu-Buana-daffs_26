import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // PDH Resmi Ormawa Fasilkom UMB:
        dpm: {
          base: '#090D16',      // Hitam Resmi DPM
          charcoal: '#1E293B',
          light: '#F8FAFC',
          gold: '#D97706',
        },
        bem: {
          base: '#0284C7',      // Biru Muda Resmi BEM (Sky Blue)
          cyan: '#0EA5E9',
          light: '#E0F2FE',
          border: '#BAE6FD',
        },
        himsisfo: {
          base: '#9A7B56',      // Krem PDH Himsisfo (Beige / Warm Sand)
          cream: '#C7B198',
          light: '#FBF9F5',
          border: '#E8DEC8',
        },
        himti: {
          base: '#172554',      // Biru Dongker Resmi HiMTI (Deep Midnight Navy)
          navy: '#1E3A8A',
          light: '#EFF6FF',
          border: '#BFDBFE',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 25px -2px rgba(15, 23, 42, 0.06)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [animate],
}
