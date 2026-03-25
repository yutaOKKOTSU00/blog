import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { PostCard } from '@/features/posts/PostCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { usePosts, adaptApiPost } from '@/hooks/usePosts'
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/lib/mock'
import { cn } from '@/lib/utils'
import type { Post } from '@/types'

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const activeCategory = searchParams.get('category') ?? ''

  // ── Données réelles depuis l'API ──────────────────────────
  const { data: apiPosts, isLoading, error, refetch } = usePosts({ published: true })

  // Utilise l'API si disponible, sinon les données mock
  const allPosts: Post[] = useMemo(() => {
    if (apiPosts && apiPosts.length > 0) return apiPosts.map(adaptApiPost)
    if (!isLoading && !error) return []   // API ok mais 0 articles
    return MOCK_POSTS                      // API indisponible → mock
  }, [apiPosts, isLoading, error])

  const usingMock = !isLoading && !!error

  // ── Filtres locaux ────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchCat   = !activeCategory || post.category.slug === activeCategory
      const matchQuery = !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [allPosts, query, activeCategory])

  function setCategory(slug: string) {
    slug ? setSearchParams({ category: slug }) : setSearchParams({})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* En-tête */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? 'Chargement…' : `${allPosts.length} article${allPosts.length > 1 ? 's' : ''} publié${allPosts.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Indicateur données mock */}
        {usingMock && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle size={13} />
            Données de démo — API indisponible
            <button onClick={() => refetch()} className="ml-1 underline hover:no-underline">
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Rechercher un article…"
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategory('')}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
              !activeCategory
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
            )}
          >
            Tous
          </button>
          {MOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                activeCategory === cat.slug
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* État de chargement */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Loader2 size={20} className="animate-spin" />
          Chargement des articles…
        </div>
      )}

      {/* Erreur API sans fallback mock */}
      {!isLoading && error && allPosts.length === 0 && (
        <div className="text-center py-16">
          <AlertCircle size={36} className="mx-auto text-red-400 mb-3" />
          <p className="text-gray-700 font-medium">Impossible de charger les articles</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Vérifiez que le serveur API est démarré.</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={14} /> Réessayer
          </Button>
        </div>
      )}

      {/* Grille des articles */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {!isLoading && allPosts.length > 0 && filteredPosts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Aucun article trouvé</p>
          <p className="text-sm mt-1">Essayez d'autres mots-clés ou catégories.</p>
          {(query || activeCategory) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => { setQuery(''); setCategory('') }}
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
