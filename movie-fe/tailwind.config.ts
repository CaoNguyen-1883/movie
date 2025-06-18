import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
    darkMode: 'class',
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
      extend: {
        colors: {
          // --- Cấu trúc màu đã được tổ chức lại và cập nhật ---
          border: {
            DEFAULT: 'hsl(220 13% 91%)',
            dark: 'hsl(224 32.6% 17.5%)', // Xanh đậm cho viền
          },
          input: {
            DEFAULT: 'hsl(220 13% 91%)',
            dark: 'hsl(224 32.6% 17.5%)', // Xanh đậm cho input
          },
          ring: {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(47.9 95.8% 53.1%)', // Vòng sáng màu vàng khi focus
          },
          background: {
            DEFAULT: 'hsl(0 0% 100%)',
            dark: 'hsl(224 71.4% 10.2%)', // <-- NỀN XANH NAVY ĐẬM
          },
          foreground: {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(210 20% 98%)', // <-- CHỮ TRẮNG NGÀ
          },
          primary: {
            DEFAULT: 'hsl(222.2 47.4% 11.2%)',
            dark: 'hsl(210 40% 98%)', // Nút chính trong dark mode có nền sáng
          },
          'primary-foreground': {
            DEFAULT: 'hsl(210 40% 98%)',
            dark: 'hsl(222.2 47.4% 11.2%)', // Chữ trên nút chính trong dark mode
          },
          secondary: {
            DEFAULT: 'hsl(210 40% 96.1%)',
            dark: 'hsl(224 32.6% 17.5%)',
          },
          'secondary-foreground': {
            DEFAULT: 'hsl(222.2 47.4% 11.2%)',
            dark: 'hsl(210 20% 98%)',
          },
          destructive: {
            DEFAULT: 'hsl(0 84.2% 60.2%)',
            dark: 'hsl(0 62.8% 30.6%)',
          },
          'destructive-foreground': {
            DEFAULT: 'hsl(210 40% 98%)',
            dark: 'hsl(0 0% 100%)',
          },
          muted: {
            DEFAULT: 'hsl(210 40% 96.1%)',
            dark: 'hsl(224 32.6% 17.5%)',
          },
          'muted-foreground': {
            DEFAULT: 'hsl(215.4 16.3% 46.9%)',
            dark: 'hsl(215 20.2% 65.1%)',
          },
          accent: {
            DEFAULT: 'hsl(47.9 95.8% 53.1%)', // <-- MÀU NHẤN VÀNG KIM
            dark: 'hsl(47.9 95.8% 53.1%)',
          },
          'accent-foreground': {
            DEFAULT: 'hsl(26 83.3% 14.1%)', // <-- Chữ trên nền vàng
            dark: 'hsl(26 83.3% 14.1%)',
          },
          popover: {
            DEFAULT: 'hsl(0 0% 100%)',
            dark: 'hsl(224 71.4% 10.2%)',
          },
          'popover-foreground': {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(210 20% 98%)',
          },
          card: {
            DEFAULT: 'hsl(0 0% 100%)',
            dark: 'hsl(224 71.4% 11.2%)', // Card có nền hơi khác background một chút
          },
          'card-foreground': {
            DEFAULT: 'hsl(222.2 84% 4.9%)',
            dark: 'hsl(210 20% 98%)',
          },
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
        },
      },
    },
    plugins: [tailwindcssAnimate],
  } satisfies Config;
  
  

export default config; 