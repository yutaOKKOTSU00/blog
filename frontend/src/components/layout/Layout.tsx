import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Contenu de la page courante */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer simple */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 Blog. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Confidentialité</a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">CGU</a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
