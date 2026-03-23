// ─────────────────────────────────────────────
// lib/http.ts — Instance Axios configurée
//
// POUR BRANCHER L'API (quand Express est prêt) :
// 1. Mettre la bonne URL dans .env  → VITE_API_URL=http://localhost:5000/api
// 2. Les fonctions dans features/*/api.ts utilisent déjà ce client
// 3. Remplacer les données mock par les vrais appels
// ─────────────────────────────────────────────

import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true, // envoie le cookie refresh token automatiquement
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
