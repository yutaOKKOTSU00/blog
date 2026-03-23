import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Heart, Bookmark, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MOCK_POSTS, MOCK_COMMENTS } from '@/lib/mock'
import { formatDate, timeAgo, initials } from '@/lib/utils'

export default function Post() {
  const { slug } = useParams()
  const post = MOCK_POSTS.find(p => p.slug === slug)

  // 404 si l'article n'existe pas
  if (!post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h1>
        <p className="text-gray-500 mb-6">Cet article n'existe pas ou a été supprimé.</p>
        <Link to="/blog"><Button variant="outline">Retour aux articles</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Retour */}
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft size={14} />
        Retour aux articles
      </Link>

      {/* En-tête de l'article */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge color={post.category.color}>{post.category.name}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {post.readingTime} min de lecture
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

        {/* Auteur + date */}
        <div className="flex items-center justify-between mt-6 pb-6 border-b border-gray-100">
          <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {initials(post.author.username)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{post.author.username}</p>
              <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
            </div>
          </Link>

          {/* Actions */}
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

      {/* Contenu de l'article — prose Tailwind */}
      <article className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-code:text-red-600 prose-code:bg-red-50 prose-code:px-1 prose-code:rounded">
        {/* Le vrai rendu Markdown viendra avec react-markdown ou similar */}
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('# '))    return <h1 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(2)}</h1>
          if (line.startsWith('## '))   return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(3)}</h2>
          if (line.startsWith('### '))  return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-5 mb-2">{line.slice(4)}</h3>
          if (line.startsWith('```'))   return <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 my-4 font-mono text-sm text-gray-800">{line.slice(3)}</div>
          if (line.trim() === '')       return <br key={i} />
          return <p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>
        })}
      </article>

      {/* ── Section commentaires ───────────────────── */}
      <section className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {post.commentsCount} commentaires
        </h2>

        {/* Formulaire rapide */}
        <div className="mb-8">
          <textarea
            placeholder="Laisser un commentaire…"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button size="sm">Publier</Button>
          </div>
        </div>

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {MOCK_COMMENTS.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {initials(comment.author.username)}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{comment.author.username}</span>
                  <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
