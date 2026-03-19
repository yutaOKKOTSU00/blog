import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/store/auth'
import { MOCK_USER } from '@/lib/mock'

export function RegisterForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  // Validation côté client
  function validate() {
    const e: Partial<typeof form> = {}
    if (form.username.length < 3) e.username = 'Minimum 3 caractères'
    if (!form.email.includes('@'))  e.email    = 'Email invalide'
    if (form.password.length < 8)   e.password = 'Minimum 8 caractères'
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      // ── TODO API ──────────────────────────────────────────
      // const { data } = await http.post('/auth/register', {
      //   username: form.username,
      //   email: form.email,
      //   password: form.password,
      // })
      // login(data.data.user, data.data.token)
      // ─────────────────────────────────────────────────────

      await new Promise(res => setTimeout(res, 600))
      login({ ...MOCK_USER, username: form.username, email: form.email }, 'mock-token-new')
      navigate('/')
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
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nom d'utilisateur" placeholder="johndoe" value={form.username} onChange={set('username')} error={errors.username} required autoFocus />
        <Input label="Email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={set('email')} error={errors.email} required />
        <Input label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} required />
        <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} error={errors.confirm} required />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Créer mon compte
        </Button>
      </form>
    </div>
  )
}
