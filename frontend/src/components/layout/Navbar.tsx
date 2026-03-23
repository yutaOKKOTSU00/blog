// ─────────────────────────────────────────────
// Navbar.tsx — Navigation principale
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { PenLine, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { initials } from '@/lib/utils'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <span className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-black">B</span>
          Blogs
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[{ to: '/', label: 'Accueil' }, { to: '/blog', label: 'Articles' }].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Bouton Écrire — visible uniquement pour auteurs/admins */}
              {(user.role === 'author' || user.role === 'admin') && (
                <Link to="/dashboard/editor">
                  <Button size="sm" className="hidden sm:inline-flex">
                    <PenLine size={14} />
                    Écrire
                  </Button>
                </Link>
              )}

              {/* Avatar + dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all"
                  aria-label="Menu utilisateur"
                >
                  {initials(user.username)}
                </button>

                {dropdownOpen && (
                  <>
                    {/* Overlay invisible pour fermer le dropdown */}
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                      {/* Infos utilisateur */}
                      <div className="px-3 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">@{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Liens */}
                      <div className="py-1">
                        <DropdownLink to="/dashboard" icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink to="/profile"   icon={<User size={14} />}            label="Mon profil"  onClick={() => setDropdownOpen(false)} />
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">S'inscrire</Button>
              </Link>
            </div>
          )}

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Nav mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col py-2 px-4 gap-1">
            {[{ to: '/', label: 'Accueil' }, { to: '/blog', label: 'Articles' }].map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

// ── Lien dans le dropdown ──────────────────────────────────
function DropdownLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
