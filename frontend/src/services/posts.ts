import http from '@/lib/http'

// ── Types correspondant aux réponses réelles de l'API Express ──────────────
export interface ApiPost {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  user_id: string
  created_at: string
  updated_at: string
  author?: {
    id: string
    username: string
  }
}

export interface CreatePostData {
  title: string
  content: string
  published?: boolean
}

export interface UpdatePostData {
  title?: string
  content?: string
  published?: boolean
}

// ── Service ────────────────────────────────────────────────────────────────
export const postsService = {
  getAll: (params?: { published?: boolean }) =>
    http.get<ApiPost[]>('/posts', { params }).then(r => r.data),

  getBySlug: (slug: string) =>
    http.get<ApiPost>(`/posts/slug/${slug}`).then(r => r.data),

  getById: (id: string) =>
    http.get<ApiPost>(`/posts/${id}`).then(r => r.data),

  create: (data: CreatePostData) =>
    http.post<ApiPost>('/posts', data).then(r => r.data),

  update: (id: string, data: UpdatePostData) =>
    http.put<ApiPost>(`/posts/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    http.delete(`/posts/${id}`).then(r => r.data),
}
