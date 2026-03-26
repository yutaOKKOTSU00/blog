import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PostCard } from '@/features/posts/PostCard'
import { Button } from '@/components/ui/Button'
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/lib/mock'

export default function Home() {
  // On affiche les 3 derniers articles en featured
  const featured = MOCK_POSTS.slice(0, 5)

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Plateforme de publication
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Des idées qui méritent<br />
            <span className="text-blue-600">d'être partagées.</span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            BlogForge est une plateforme pour les développeurs et créateurs de contenu.
            Lisez, écrivez, partagez.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button size="lg">Commencer à écrire</Button>
            </Link>
            <Link to="/blog">
              <Button variant="ghost" size="lg">
                Explorer les articles
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Catégories ─────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 overflow-x-auto">
          <span className="text-sm font-medium text-gray-500 shrink-0">Catégories :</span>
          {MOCK_CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/blog?category=${cat.slug}`}
              className="shrink-0 px-3 py-1 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Articles récents ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Articles récents</h2>
          <Link to="/blog" className="text-sm text-blue-600 hover:underline font-medium flex items-center gap-1">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* ── CTA bas ──────────────────────────────────── */}
      <section className="bg-blue-600 mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Prêt à partager vos idées ?
          </h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto">
            Rejoignez la communauté et publiez votre premier article dès aujourd'hui.
          </p>
          <Link to="/register">
            <Button variant="outline" size="lg" className="bg-white text-blue-700 border-white hover:bg-blue-50">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
