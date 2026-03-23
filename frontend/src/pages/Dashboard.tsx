// ─────────────────────────────────────────────
// Dashboard.tsx — Espace auteur
// Accessible uniquement si connecté (voir App.tsx)
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, Eye, Heart, MessageCircle, Trash2, Edit } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MOCK_POSTS } from '@/lib/mock'
import { formatDate } from '@/lib/utils'

export default function Dashboard() {
  const { user } = useAuth()

  // On filtre les articles de l'utilisateur connecté (par username ici, par ID en prod)
  // const myPosts = MOCK_POSTS.filter(p => p.author.username === user?.username)
  const allPosts = MOCK_POSTS // Pour la démo on affiche tout

  const [tab, setTab] = useState<'posts' | 'editor'>('posts')

  // ── Statistiques rapides ───────────────────────────────
  const stats = {
    total:    allPosts.length,
    views:    allPosts.reduce((acc, p) => acc + p.likesCount * 12, 0), // estimé
    likes:    allPosts.reduce((acc, p) => acc + p.likesCount, 0),
    comments: allPosts.reduce((acc, p) => acc + p.commentsCount, 0),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Bienvenue, {user?.username} </p>
        </div>
        <Button onClick={() => setTab('editor')}>
          <PenLine size={15} />
          Nouvel article
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Articles',     value: stats.total,    icon: <PenLine size={16} />,      color: 'text-blue-600' },
          { label: 'Vues',         value: stats.views,    icon: <Eye size={16} />,          color: 'text-gray-600' },
          { label: 'Likes',        value: stats.likes,    icon: <Heart size={16} />,        color: 'text-red-500' },
          { label: 'Commentaires', value: stats.comments, icon: <MessageCircle size={16} />, color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className={`flex items-center gap-1.5 text-sm font-medium mb-2 ${stat.color}`}>
              {stat.icon}
              {stat.label}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([['posts', 'Mes articles'], ['editor', 'Éditeur']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
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

      {/* ── Liste des articles ───────────────────────── */}
      {tab === 'posts' && (
        <div className="divide-y divide-gray-100">
          {allPosts.map(post => (
            <div key={post.id} className="flex items-start gap-4 py-4">
              {/* Cover miniature */}
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="w-20 h-14 rounded-lg object-cover shrink-0 bg-gray-100" />
              ) : (
                <div className="w-20 h-14 rounded-lg bg-blue-50 shrink-0 flex items-center justify-center">
                  <PenLine size={18} className="text-blue-300" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/blog/${post.slug}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm line-clamp-1">
                    {post.title}
                  </Link>
                  <Badge variant="blue" className="shrink-0 text-xs">Publié</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.publishedAt)}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Heart size={11} />{post.likesCount}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11} />{post.commentsCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Éditeur simplifié ─────────────────────── */}
      {tab === 'editor' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            L'éditeur complet (TipTap / rich text) sera intégré une fois l'API Express connectée.
            Pour l'instant, voici la structure de base.
          </p>

          <input
            placeholder="Titre de l'article…"
            className="w-full text-2xl font-bold text-gray-900 border-0 border-b border-gray-200 pb-3 focus:outline-none focus:border-blue-600 placeholder:text-gray-300 transition-colors"
          />

          <textarea
            placeholder="Écrivez votre article ici…"
            rows={14}
            className="w-full text-gray-700 leading-relaxed border border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
          />

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline">Sauvegarder brouillon</Button>
            <Button>Publier</Button>
          </div>
        </div>
      )}
    </div>
  )
}
