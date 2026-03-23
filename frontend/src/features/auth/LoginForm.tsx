// ─────────────────────────────────────────────
// LoginForm.tsx — Formulaire de connexion
//
// Actuellement : simule une connexion avec les données mock.
// Pour brancher l'API : remplacer la ligne marquée "TODO API"
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/store/auth'
import { MOCK_USER } from '@/lib/mock'

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
      // ── TODO API ──────────────────────────────────────────
      // Remplacer le bloc mock par :
      //
      // import http from '@/lib/http'
      // const { data } = await http.post('/auth/login', { email, password })
      // login(data.data.user, data.data.token)
      // ─────────────────────────────────────────────────────

      // Simulation d'appel réseau (500ms)
      await new Promise(res => setTimeout(res, 500))

      // Vérification basique avec les données mock
      if (email === 'alice@example.com' && password === 'password') {
        login(MOCK_USER, 'mock-token-xyz')
        navigate('/')
      } else {
        setError('Email ou mot de passe incorrect.')
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

      {/* Message d'erreur global */}
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
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline self-end">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Se connecter
        </Button>
      </form>

      {/* Indicateur pour le dev — à retirer en prod */}
      <p className="mt-6 text-xs text-center text-gray-400">
        Demo : alice@example.com / password
      </p>
    </div>
  )
}
