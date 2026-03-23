import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PostCard } from '@/features/posts/PostCard'
import { Input } from '@/components/ui/Input'
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/lib/mock'
import { cn } from '@/lib/utils'

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const activeCategory = searchParams.get('category') ?? ''

  // Filtre les posts selon la recherche et la catégorie sélectionnée
  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter(post => {
      const matchesCategory = !activeCategory || post.category.slug === activeCategory
      const matchesQuery    = !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  function setCategory(slug: string) {
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <p className="text-gray-500 mt-1">{MOCK_POSTS.length} articles publiés</p>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un article…"
            className="pl-9"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Filtres catégories */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setCategory('')}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
              !activeCategory
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:border-blue-300',
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
                  : 'border-gray-200 text-gray-600 hover:border-blue-300',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grille articles */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Aucun article trouvé</p>
          <p className="text-sm mt-1">Essayez d'autres mots-clés ou catégories</p>
        </div>
      )}
    </div>
  )
}
