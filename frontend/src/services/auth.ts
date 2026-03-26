import http from '@/lib/http'
import { Role } from '@/types'

// ── Types correspondant aux réponses réelles de l'API ─────────────────────
export interface ApiUser {
  id: string
  username: string
  email: string
  role: Role
  bio?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  user: ApiUser
  token: string
}

// ── Service ────────────────────────────────────────────────────────────────
export const authService = {
  login: (email: string, password: string) =>
    http.post<LoginResponse>('/users/auth/login', { email, password }).then(r => r.data),

  register: (data: { username: string; email: string; password: string }) =>
    http.post<ApiUser>('/users', data).then(r => r.data),

  me: () =>
    http.get<ApiUser>('/users/me').then(r => r.data),
}
