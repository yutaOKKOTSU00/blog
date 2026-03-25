import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PenLine, Globe, Lock, Trash2, Edit, Loader2,
  AlertCircle, RefreshCw, Send,
} from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Editor } from '@/features/posts/Editor'
import {
  useMyPosts, useCreatePost, useUpdatePost, useDeletePost, excerpt,
} from '@/hooks/usePosts'
import { formatDate } from '@/lib/utils'
import type { ApiPost } from '@/services/posts'

type Tab = 'posts' | 'editor'

interface EditorForm {
  title:     string
  content:   string
  published: boolean
}

const EMPTY_FORM: EditorForm = { title: '', content: '', published: true }

export default function Dashboard() {
  const { user } = useAuth()

  const [tab, setTab]               = useState<Tab>('posts')
  const [editingPost, setEditingPost] = useState<ApiPost | null>(null)
  const [form, setForm]             = useState<EditorForm>(EMPTY_FORM)
  const [formError, setFormError]   = useState('')

  // ── Hooks de données ──────────────────────────────────────
  const { data: myPosts = [], isLoading, error, refetch } = useMyPosts(user?.id)
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()

  // ── Remplir l'éditeur quand on édite un article existant ──
  useEffect(() => {
    if (editingPost) {
      setForm({ title: editingPost.title, content: editingPost.content, published: editingPost.published })
      setTab('editor')
    }
  }, [editingPost])

  // ── Réinitialise le formulaire ─────────────────────────────
  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingPost(null)
    setFormError('')
  }

  // ── Soumission (création ou mise à jour) ───────────────────
  async function handleSubmit(asDraft = false) {
    setFormError('')
    if (!form.title.trim()) { setFormError('Le titre est requis.'); return }
    if (form.content.trim().length < 10) { setFormError('Le contenu doit faire au moins 10 caractères.'); return }

    const data = { ...form, published: asDraft ? false : form.published }

    try {
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, ...data })
      } else {
        await createPost.mutateAsync(data)
      }
      resetForm()
      setTab('posts')
    } catch {
      setFormError('Erreur lors de la sauvegarde. Réessayez.')
    }
  }

  // ── Suppression ───────────────────────────────────────────
  async function handleDelete(post: ApiPost) {
    if (!confirm(`Supprimer "${post.title}" définitivement ?`)) return
    await deletePost.mutateAsync(post.id)
  }

  // ── Stats rapides ─────────────────────────────────────────
  const stats = [
    { label: 'Total',       value: myPosts.length,                         icon: <PenLine size={15} />, color: 'text-blue-600'  },
    { label: 'Publiés',     value: myPosts.filter(p => p.published).length, icon: <Globe size={15} />,   color: 'text-green-600' },
    { label: 'Brouillons',  value: myPosts.filter(p => !p.published).length, icon: <Lock size={15} />,   color: 'text-amber-600' },
  ]

  const isSaving = createPost.isPending || updatePost.isPending

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* ── En-tête ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Bienvenue, {user?.username} 👋</p>
        </div>
        <Button onClick={() => { resetForm(); setTab('editor') }}>
          <PenLine size={15} />
          Nouvel article
        </Button>
      </div>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className={`flex items-center gap-1.5 text-sm font-medium mb-1 ${s.color}`}>
              {s.icon}
              {s.label}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Onglets ─────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([
          ['posts',  'Mes articles'],
          ['editor', editingPost ? 'Modifier l\'article' : 'Éditeur'],
        ] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => { if (id === 'posts') resetForm(); setTab(id) }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Liste des articles ──────────────────────────── */}
      {tab === 'posts' && (
        <>
          {/* Chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" />
              Chargement de vos articles…
            </div>
          )}

          {/* Erreur API */}
          {!isLoading && error && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <AlertCircle size={32} className="text-red-400" />
              <p className="text-sm text-gray-600">Impossible de charger les articles.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw size={13} /> Réessayer
              </Button>
            </div>
          )}

          {/* Aucun article */}
          {!isLoading && !error && myPosts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <PenLine size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-600">Aucun article pour l'instant</p>
              <p className="text-sm mt-1">Cliquez sur "Nouvel article" pour commencer.</p>
            </div>
          )}

          {/* Liste */}
          <div className="divide-y divide-gray-100">
            {myPosts.map(post => (
              <div key={post.id} className="flex items-start gap-4 py-4 group">
                {/* Icône */}
                <div className="w-14 h-10 rounded-lg bg-blue-50 shrink-0 flex items-center justify-center border border-blue-100">
                  <PenLine size={14} className="text-blue-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 text-sm truncate transition-colors"
                    >
                      {post.title}
                    </Link>
                    <Badge variant={post.published ? 'green' : 'gray'} className="text-xs shrink-0">
                      {post.published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.created_at)}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{excerpt(post.content, 120)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingPost(post)}
                    title="Modifier"
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={deletePost.isPending}
                    title="Supprimer"
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Éditeur ─────────────────────────────────────── */}
      {tab === 'editor' && (
        <div className="space-y-4">

          {/* Titre */}
          <Input
            placeholder="Titre de l'article…"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="text-base font-semibold h-12 border-gray-300"
          />

          {/* Éditeur Markdown */}
          <Editor
            value={form.content}
            onChange={content => setForm(f => ({ ...f, content }))}
            placeholder="Rédigez votre article en Markdown…&#10;&#10;Utilisez # pour les titres, **gras**, *italique*, `code`…"
          />

          {/* Erreur de validation */}
          {formError && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle size={14} />
              {formError}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
            {/* Toggle Publié / Brouillon */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  form.published ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.published ? 'translate-x-4' : ''
                }`} />
              </div>
              <span className="text-sm text-gray-600">
                {form.published ? 'Publier immédiatement' : 'Sauvegarder comme brouillon'}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                loading={isSaving}
                type="button"
              >
                Brouillon
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                loading={isSaving}
                type="button"
              >
                <Send size={13} />
                {editingPost ? 'Mettre à jour' : 'Publier'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
