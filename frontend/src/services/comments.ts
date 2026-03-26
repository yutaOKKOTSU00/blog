import http from '@/lib/http'

// ── Types correspondant à la réponse de l'API (le backend utilise "body") ──
export interface ApiComment {
  id: string
  body: string        // le backend appelle ce champ "body"
  post_id: string
  user_id: string
  created_at: string
  updated_at: string
  author?: {
    id: string
    username: string
  }
}

// ── Service ────────────────────────────────────────────────────────────────
export const commentsService = {
  getByPost: (postId: string) =>
    http.get<ApiComment[]>(`/posts/${postId}/comments`).then(r => r.data),

  create: (postId: string, body: string) =>
    http.post<ApiComment>(`/posts/${postId}/comments`, { body }).then(r => r.data),

  delete: (commentId: string) =>
    http.delete(`/comments/${commentId}`).then(r => r.data),
}
