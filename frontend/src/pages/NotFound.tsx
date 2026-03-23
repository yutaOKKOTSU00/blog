// pages/NotFound.tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl font-black text-blue-600 mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
      <p className="text-gray-500 mb-8 max-w-sm">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/"><Button>Retour à l'accueil</Button></Link>
    </div>
  )
}
