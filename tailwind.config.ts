import type { Config } from 'tailwindcss';

/**
 * Jibambe design tokens. Every value here is a decision documented in
 * DESIGN_SYSTEM.md. Components consume these names (bg-surface, text-ink,
 * text-2xl, p-4) — never raw hex or arbitrary pixel values. Semantic colors
 * are driven by CSS variables in globals.css so a dark theme is a variable
 * swap, not a component rewrite.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    // ---- Type scale: 1.25 (major third), 16px base. See DESIGN_SYSTEM.md ----
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.25rem', { lineHeight: '1.75rem' }],
      xl: ['1.5625rem', { lineHeight: '2rem' }],
      '2xl': ['1.9531rem', { lineHeight: '2.375rem' }],
      '3xl': ['2.4414rem', { lineHeight: '2.75rem', letterSpacing: '-0.01em' }],
      '4xl': ['3.0518rem', { lineHeight: '3.25rem', letterSpacing: '-0.02em' }],
      '5xl': ['3.8147rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],
    },
    // Spacing uses Tailwind's default 4px-based scale — a strict grid, not
    // arbitrary values. (Overriding/pruning it silently drops real utilities
    // like h-9 / h-11 / gap-1.5, so we keep the full ladder and rely on lint +
    // review to prevent one-off `mt-[13px]` escapes.)
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        // Wired to next/font CSS variables in layout.tsx.
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // --- Primitives (fixed palette) ---
        stone: {
          50: '#faf9f6',
          100: '#f3f1ec',
          200: '#e8e4da',
          300: '#d6cfc0',
          400: '#b3a893',
          500: '#8f8470',
          600: '#6f6656',
          700: '#544d41',
          800: '#3a352d',
          900: '#26221c',
          950: '#1a1713',
        },
        clay: {
          50: '#fbf3ef',
          100: '#f6e2d8',
          200: '#ecc3b0',
          300: '#e09c7f',
          400: '#d4754f',
          500: '#c0562f',
          600: '#a34424',
          700: '#83371f',
          800: '#652c1c',
          900: '#4f2518',
        },
        // --- Semantic tokens (CSS-variable driven, themeable) ---
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        'ink-subtle': 'rgb(var(--ink-subtle) / <alpha-value>)',
        'ink-inverse': 'rgb(var(--ink-inverse) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
        'accent-fg': 'rgb(var(--accent-fg) / <alpha-value>)',
        'accent-subtle': 'rgb(var(--accent-subtle) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        'danger-subtle': 'rgb(var(--danger-subtle) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-subtle': 'rgb(var(--success-subtle) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-subtle': 'rgb(var(--warning-subtle) / <alpha-value>)',
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.875rem',
        xl: '1.25rem',
        full: '9999px',
      },
      boxShadow: {
        // Warm-tinted shadows (not pure black) so they sit in the paper palette.
        xs: '0 1px 2px 0 rgb(38 34 28 / 0.05)',
        sm: '0 1px 3px 0 rgb(38 34 28 / 0.08), 0 1px 2px -1px rgb(38 34 28 / 0.06)',
        DEFAULT: '0 4px 12px -2px rgb(38 34 28 / 0.10), 0 2px 6px -2px rgb(38 34 28 / 0.06)',
        lg: '0 12px 28px -6px rgb(38 34 28 / 0.14), 0 6px 12px -6px rgb(38 34 28 / 0.08)',
        focus: '0 0 0 2px rgb(var(--surface)), 0 0 0 4px rgb(var(--accent))',
      },
      maxWidth: {
        container: '1280px',
        content: '1200px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        // Emphasized easing: decelerate on entry, standard elsewhere.
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-in': 'cubic-bezier(0.3, 0, 1, 1)',
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        micro: '120ms',
        state: '200ms',
        overlay: '320ms',
        page: '480ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms cubic-bezier(0.2, 0, 0, 1)',
        'slide-up': 'slide-up 320ms cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
