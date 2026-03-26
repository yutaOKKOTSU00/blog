import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsService, type ApiPost, type UpdatePostData } from '@/services/posts'
import type { Post, User } from '@/types'
import { MOCK_CATEGORIES } from '@/lib/mock'

// ── Utilitaires ────────────────────────────────────────────────────────────

/** Calcule le temps de lecture (200 mots / minute) */
export function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))
}

/** Extrait un résumé propre depuis le contenu markdown */
export function excerpt(content: string, maxLen = 200): string {
  const cleaned = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '…' : cleaned
}

/** Adapte un post API vers le type Post du frontend */
export function adaptApiPost(p: ApiPost): Post {
  const author: User = p.author
    ? { id: p.author.id, username: p.author.username, email: '', role: 'author', createdAt: p.created_at }
    : { id: p.user_id, username: 'Auteur', email: '', role: 'author', createdAt: p.created_at }

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: excerpt(p.content),
    content: p.content,
    author,
    category: MOCK_CATEGORIES[0],
    readingTime: readingTime(p.content),
    publishedAt: p.created_at,
    likesCount: 0,
    commentsCount: 0,
  }
}

// ── Clés de cache ──────────────────────────────────────────────────────────
export const postsKeys = {
  all:    ()           => ['posts'] as const,
  list:   (p?: object) => ['posts', 'list', p] as const,
  detail: (slug: string) => ['posts', 'detail', slug] as const,
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Récupère tous les posts (optionnellement filtrés) */
export function usePosts(params?: { published?: boolean }) {
  return useQuery({
    queryKey: postsKeys.list(params),
    queryFn:  () => postsService.getAll(params),
  })
}

/** Récupère un post par son slug */
export function usePost(slug: string) {
  return useQuery({
    queryKey: postsKeys.detail(slug),
    queryFn:  () => postsService.getBySlug(slug),
    enabled:  !!slug,
  })
}

/** Posts de l'utilisateur connecté */
export function useMyPosts(userId?: string) {
  const query = usePosts()
  return {
    ...query,
    data: userId ? (query.data ?? []).filter(p => p.user_id === userId) : [],
  }
}

/** Crée un article */
export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postsService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: postsKeys.all() }),
  })
}

/** Met à jour un article */
export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdatePostData) =>
      postsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: postsKeys.all() }),
  })
}

/** Supprime un article */
export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: postsService.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: postsKeys.all() }),
  })
}
