// ─────────────────────────────────────────────
// lib/http.ts — Instance Axios configurée
//
// ─────────────────────────────────────────────

import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Inject le token JWT dans chaque requête ──
http.interceptors.request.use((config) => {
  // Le token est lu depuis le store Zustand
  // (import direct ici évite les dépendances circulaires)
  const raw = localStorage.getItem('auth-store')
  if (raw) {
    const { state } = JSON.parse(raw)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

// ── Gère le 401 : token expiré → logout automatique ──
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Vide le store et redirige vers /login
      localStorage.removeItem('auth-store')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default http
