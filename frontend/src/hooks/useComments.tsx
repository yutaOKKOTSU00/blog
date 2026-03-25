import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService, type ApiComment } from '@/services/comments'
import type { Comment } from '@/types'

/** Adapte un commentaire API vers le type Comment du frontend */
export function adaptApiComment(c: ApiComment): Comment {
  return {
    id: c.id,
    content: c.body, // le backend utilise "body", le frontend "content"
    author: c.author
      ? { id: c.author.id, username: c.author.username, email: '', role: 'reader', createdAt: c.created_at }
      : { id: c.user_id, username: 'Utilisateur', email: '', role: 'reader', createdAt: c.created_at },
    createdAt: c.created_at,
  }
}

// ── Clés de cache ──────────────────────────────────────────────────────────
export const commentsKeys = {
  all:    ()             => ['comments'] as const,
  byPost: (postId: string) => ['comments', 'post', postId] as const,
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Récupère les commentaires d'un post */
export function useComments(postId: string) {
  return useQuery({
    queryKey: commentsKeys.byPost(postId),
    queryFn:  () => commentsService.getByPost(postId),
    enabled:  !!postId,
    select:   (data) => data.map(adaptApiComment),
  })
}

/** Ajoute un commentaire */
export function useCreateComment(postId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => commentsService.create(postId, body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: commentsKeys.byPost(postId) }),
  })
}

/** Supprime un commentaire */
export function useDeleteComment(postId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: commentsService.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: commentsKeys.byPost(postId) }),
  })
}
