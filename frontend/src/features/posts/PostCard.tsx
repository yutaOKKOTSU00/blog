import { Link } from 'react-router-dom'
import { Clock, Heart, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { timeAgo, initials } from '@/lib/utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white">

      {/* Image de couverture */}
      {post.coverImage && (
        <Link to={`/blog/${post.slug}`}>
          <div className="aspect-video overflow-hidden bg-gray-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
      )}

      <div className="p-5 space-y-3">

        {/* Catégorie + temps de lecture */}
        <div className="flex items-center justify-between">
          <Badge color={post.category.color}>{post.category.name}</Badge>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {post.readingTime} min
          </span>
        </div>

        {/* Titre */}
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Extrait */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Footer : auteur + stats */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Avatar textuel si pas d'image */}
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {initials(post.author.username)}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800">{post.author.username}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.publishedAt)}</p>
            </div>
          </div>

          {/* Likes et commentaires */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              {post.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
