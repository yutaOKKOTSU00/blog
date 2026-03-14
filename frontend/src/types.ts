// ─────────────────────────────────────────────
// types.ts — Tous les types du projet
// ─────────────────────────────────────────────

export type Role = 'reader' | 'author' | 'admin'

export interface User {
  id: string
  username: string
  email: string
  role: Role
  avatar?: string
  bio?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: User
  category: Category
  readingTime: number  // en minutes
  publishedAt: string
  likesCount: number
  commentsCount: number
  isLiked?: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
}

// ── Réponses API standard (à utiliser quand l'API Express sera prête) ──
export interface ApiSuccess<T> {
  status: 'success'
  data: T
}

export interface ApiError {
  status: 'error'
  message: string
}
