// ─────────────────────────────────────────────
// Button.tsx — Composant bouton
// Variantes : primary (bleu), danger (rouge), ghost (transparent)
// ─────────────────────────────────────────────

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const styles = {
  base: [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg px-4 py-2 text-sm font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),

  variant: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    danger:  'bg-red-600  text-white hover:bg-red-700  focus-visible:ring-red-600',
    ghost:   'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400',
  },

  size: {
    sm: 'h-8  px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  },
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof styles.variant
  size?:    keyof typeof styles.size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={loading || props.disabled}
      className={cn(styles.base, styles.variant[variant], styles.size[size], className)}
      {...props}
    >
      {/* Spinner affiché pendant le chargement */}
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
