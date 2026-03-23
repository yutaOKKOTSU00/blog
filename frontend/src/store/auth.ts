// ─────────────────────────────────────────────
// store/auth.ts — État global de l'authentification
//
// Zustand : simple, pas de boilerplate, accès possible hors composants.
// persist : sauvegarde user + token dans localStorage automatiquement.
// ─────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user:  User | null
  token: string | null

  // Actions
  login:  (user: User, token: string) => void
  logout: () => void
  update: (partial: Partial<User>) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user:  null,
      token: null,

      login: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      update: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-store', // clé dans localStorage
    },
  ),
)

// ── Helpers pratiques ──
// isAuthenticated : vrai si l'utilisateur est connecté
export const isAuthenticated = () => useAuth.getState().token !== null

// isAuthor : peut écrire des articles
export const isAuthor = () => {
  const role = useAuth.getState().user?.role
  return role === 'author' || role === 'admin'
}
