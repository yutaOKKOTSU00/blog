import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/store/auth'
import { authService } from '@/services/auth'
import type { User } from '@/types'

interface FormState {
  username: string
  email:    string
  password: string
  confirm:  string
}

export function RegisterForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]     = useState<FormState>({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (form.username.trim().length < 3) e.username = 'Minimum 3 caractères'
    if (!form.email.includes('@'))        e.email    = 'Email invalide'
    if (form.password.length < 6)         e.password = 'Minimum 6 caractères'
    if (form.password !== form.confirm)   e.confirm  = 'Les mots de passe ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setLoading(true)
    try {
      // 1. Inscription
      await authService.register({
        username: form.username.trim(),
        email:    form.email,
        password: form.password,
      })

      // 2. Connexion automatique
      const { user: apiUser, token } = await authService.login(form.email, form.password)

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
      if (status === 409) {
        setApiError("Ce nom d'utilisateur ou cet email est déjà utilisé.")
      } else if (status === 422) {
        setApiError('Données invalides. Vérifiez les champs ci-dessus.')
      } else {
        setApiError('Une erreur est survenue. Réessayez plus tard.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>

      {apiError && (
        <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nom d'utilisateur"
          placeholder="johndoe"
          value={form.username}
          onChange={set('username')}
          error={errors.username}
          required
          autoFocus
          autoComplete="username"
        />
        <Input
          label="Email"
          type="email"
          placeholder="vous@exemple.com"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          required
          autoComplete="email"
        />
        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          required
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Créer mon compte
        </Button>
      </form>
    </div>
  )
}
