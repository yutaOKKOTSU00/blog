import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?:   string  // hex custom pour les catégories
  variant?: 'blue' | 'red' | 'gray' | 'green'
  className?: string
}

// Variantes prédéfinies + support de couleur custom (pour les catégories)
export function Badge({ children, color, variant = 'gray', className }: BadgeProps) {
  const variantStyles = {
    blue:  'bg-blue-50  text-blue-700  ring-1 ring-blue-200',
    red:   'bg-red-50   text-red-700   ring-1 ring-red-200',
    gray:  'bg-gray-100 text-gray-700  ring-1 ring-gray-200',
    green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        !color && variantStyles[variant],
        className,
      )}
      style={color ? {
        backgroundColor: `${color}18`,
        color,
        boxShadow: `0 0 0 1px ${color}40`,
      } : undefined}
    >
      {children}
    </span>
  )
}
