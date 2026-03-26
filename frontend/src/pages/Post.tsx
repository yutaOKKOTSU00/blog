// ─────────────────────────────────────────────
// Post.tsx — Page article avec commentaires réels
// ─────────────────────────────────────────────
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Heart, Bookmark, Share2, Loader2, AlertCircle, Send, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { usePost, adaptApiPost, readingTime } from '@/hooks/usePosts'
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments'
import { useAuth } from '@/store/auth'
import { MOCK_POSTS, MOCK_COMMENTS } from '@/lib/mock'
import { formatDate, timeAgo, initials } from '@/lib/utils'
import type { Post, Comment } from '@/types'

// Rendu Markdown basique (mutualisé avec l'éditeur si besoin)
function renderLine(line: string, i: number): React.ReactNode {
  if (line.startsWith('# '))   return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(2)}</h1>
  if (line.startsWith('## '))  return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(3)}</h2>
  if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-5 mb-2">{line.slice(4)}</h3>
  if (line.startsWith('> '))   return <blockquote key={i} className="border-l-4 border-blue-300 pl-4 text-gray-600 italic my-4 bg-blue-50 rounded-r-lg py-1">{line.slice(2)}</blockquote>
  if (line.startsWith('```'))  return <div key={i} className="bg-gray-900 text-gray-100 rounded-lg px-4 py-3 my-4 font-mono text-sm">{line.slice(3)}</div>
  if (line.startsWith('- '))   return <li key={i} className="ml-5 list-disc text-gray-700">{line.slice(2)}</li>
  if (line.trim() === '---')   return <hr key={i} className="border-gray-200 my-6" />
  if (line.trim() === '')      return <br key={i} />
  return <p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>
}

export default function Post() {
  const { slug } = useParams()
  const { user }  = useAuth()
  const [commentBody, setCommentBody] = useState('')

  // ── Données du post ───────────────────────────────────────
  const { data: apiPost, isLoading: postLoading } = usePost(slug ?? '')

  // Adapte l'API ou utilise le mock comme fallback
  const post: Post | undefined = apiPost
    ? adaptApiPost(apiPost)
    : MOCK_POSTS.find(p => p.slug === slug)

  // ── Commentaires (requête activée seulement quand on a l'ID du post) ──────
  const postId = apiPost?.id ?? ''
  const { data: apiComments, isLoading: commentsLoading } = useComments(postId)
  const createComment = useCreateComment(postId)
  const deleteComment = useDeleteComment(postId)

  // Fallback vers mock si l'API n'est pas dispo
  const comments: Comment[] = apiComments ?? (apiPost ? [] : MOCK_COMMENTS)

  // ── Handlers ──────────────────────────────────────────────
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!commentBody.trim() || !postId) return
    await createComment.mutateAsync(commentBody.trim())
    setCommentBody('')
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm('Supprimer ce commentaire ?')) return
    await deleteComment.mutateAsync(commentId)
  }

  // ── États de chargement / erreur ──────────────────────────
  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 gap-2">
        <Loader2 size={20} className="animate-spin" />
        Chargement de l'article…
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h1>
        <p className="text-gray-500 mb-6">Cet article n'existe pas ou a été supprimé.</p>
        <Link to="/blog"><Button variant="outline">Retour aux articles</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Retour */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        Retour aux articles
      </Link>

      {/* ── En-tête ─────────────────────────────────────── */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge color={post.category.color}>{post.category.name}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {readingTime(post.content)} min de lecture
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

        {/* Auteur + actions */}
        <div className="flex items-center justify-between mt-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {initials(post.author.username)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{post.author.username}</p>
              <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
              <Heart size={15} /> {post.likesCount}
            </Button>
            <Button variant="ghost" size="sm"><Bookmark size={15} /></Button>
            <Button variant="ghost" size="sm"><Share2 size={15} /></Button>
          </div>
        </div>
      </header>

      {/* Image de couverture */}
      {post.coverImage && (
        <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-gray-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* ── Contenu ─────────────────────────────────────── */}
      <article className="mb-12">
        {post.content.split('\n').map((line, i) => renderLine(line, i))}
      </article>

      {/* ── Commentaires ───────────────────────────────── */}
      <section className="pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          Commentaires
          {!commentsLoading && (
            <span className="text-sm font-normal text-gray-400">({comments.length})</span>
          )}
        </h2>

        {/* Formulaire (uniquement si connecté et post réel depuis l'API) */}
        {user && postId ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentBody}
              onChange={e => setCommentBody(e.target.value)}
              placeholder="Laisser un commentaire…"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition-colors"
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                size="sm"
                loading={createComment.isPending}
                disabled={!commentBody.trim()}
              >
                <Send size={13} />
                Publier
              </Button>
            </div>
          </form>
        ) : !user ? (
          <p className="text-sm text-gray-500 mb-8 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Connectez-vous</Link>
            {' '}pour laisser un commentaire.
          </p>
        ) : null}

        {/* Chargement des commentaires */}
        {commentsLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
            <Loader2 size={14} className="animate-spin" /> Chargement des commentaires…
          </div>
        )}

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {initials(comment.author.username)}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{comment.author.username}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  {/* Supprimer seulement ses propres commentaires */}
                  {user && (user.id === comment.author.id) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {!commentsLoading && comments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            Aucun commentaire pour l'instant. Soyez le premier !
          </p>
        )}
      </section>
    </div>
  )
}
