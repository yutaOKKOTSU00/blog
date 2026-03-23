import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// Fusionne les classes Tailwind sans conflit
// Exemple : cn('px-4 px-2') → 'px-2'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// "12 mars 2025"
export function formatDate(date: string): string {
  return format(new Date(date), 'd MMMM yyyy', { locale: fr })
}

// "il y a 3 jours"
export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

// Premières lettres du nom pour les avatars texte
// "Jean Dupont" → "JD"
export function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
