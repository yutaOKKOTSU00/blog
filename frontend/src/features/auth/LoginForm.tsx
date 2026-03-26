// ─────────────────────────────────────────────
// LoginForm.tsx — Formulaire de connexion connecté à l'API
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/store/auth'
import { authService } from '@/services/auth'
import type { User } from '@/types'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user: apiUser, token } = await authService.login(email, password)
 const user: User = {
        id:        apiUser.id,
        username:  apiUser.username,
        email:     apiUser.email,
        role:      apiUser.role,
        bio:       apiUser.bio,
        avatar:    apiUser.avatar,
        createdAt: apiUser.created_at,
      }


      login(user, token)
      navigate('/')
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 401) {
        setError('Email ou mot de passe incorrect.')
      } else if (status === 422) {
        setError('Veuillez vérifier vos informations.')
      } else {
        setError('Une erreur est survenue. Réessayez plus tard.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            S'inscrire
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          autoComplete="email"
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline self-end">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Se connecter
        </Button>
      </form>
    </div>
  )
}
