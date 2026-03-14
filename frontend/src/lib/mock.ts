// ─────────────────────────────────────────────
// lib/mock.ts — Données de démo
//
// Ce fichier sera supprimé quand l'API Express sera prête.
// Chaque feature/*/api.ts a une version mock et une version réelle.
// ─────────────────────────────────────────────

import type { User, Post, Category, Comment } from '@/types'

export const MOCK_USER: User = {
  id: '1',
  username: 'alice',
  email: 'alice@example.com',
  role: 'author',
  bio: 'Développeuse passionnée par le web et l\'open source.',
  createdAt: '2024-01-15T10:00:00Z',
}

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Technologie', slug: 'technologie', color: '#2563EB' },
  { id: '2', name: 'Design',      slug: 'design',      color: '#DC2626' },
  { id: '3', name: 'Tutoriels',   slug: 'tutoriels',   color: '#16A34A' },
  { id: '4', name: 'Actualités',  slug: 'actualites',  color: '#9333EA' },
]

const author: User = {
  id: '2',
  username: 'bob',
  email: 'bob@example.com',
  role: 'author',
  createdAt: '2024-02-01T09:00:00Z',
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Débuter avec React 18 : tout ce que vous devez savoir',
    slug: 'debuter-avec-react-18',
    excerpt: 'React 18 apporte des fonctionnalités révolutionnaires comme le concurrent rendering. Voici un guide complet pour bien démarrer.',
    content: `
# Débuter avec React 18

React 18 introduit le **concurrent rendering**, une approche qui permet à React de préparer plusieurs versions de l'UI en même temps.

## Les nouveautés clés

### 1. useTransition
Ce nouveau hook permet de marquer certaines mises à jour d'état comme non urgentes :

\`\`\`tsx
const [isPending, startTransition] = useTransition()

startTransition(() => {
  setFilteredList(computeExpensiveList(input))
})
\`\`\`

### 2. Suspense amélioré
Suspense fonctionne maintenant avec les requêtes de données, pas seulement le lazy loading.

### 3. Batching automatique
Toutes les mises à jour d'état sont maintenant groupées automatiquement, même dans les callbacks async.

## Conclusion

React 18 est une mise à jour majeure qui améliore significativement les performances des applications complexes.
    `.trim(),
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    author,
    category: MOCK_CATEGORIES[0],
    readingTime: 6,
    publishedAt: '2025-03-01T08:00:00Z',
    likesCount: 142,
    commentsCount: 18,
  },
  {
    id: '2',
    title: 'Les principes du bon design d\'interface en 2025',
    slug: 'principes-design-interface-2025',
    excerpt: 'Le design UI évolue vite. Ces 5 principes fondamentaux restent cependant toujours d\'actualité pour créer des interfaces mémorables.',
    content: `
# Les principes du bon design d'interface

Un bon design n'est pas une question d'opinion, c'est une question de **clarté** et d'**intention**.

## 1. La hiérarchie visuelle

L'œil suit un chemin naturel. Guide-le avec la taille, le poids, la couleur et l'espacement.

## 2. L'espace négatif

L'espace vide n'est pas du gaspillage. Il donne de la respiration et met en valeur ce qui compte.

## 3. La cohérence

Un système de design cohérent réduit la charge cognitive de l'utilisateur.

## 4. Le feedback

Chaque action doit avoir une réponse visuelle claire et immédiate.

## 5. L'accessibilité d'abord

Concevoir pour les contraintes (daltonisme, lecteurs d'écran) produit un meilleur design pour tous.
    `.trim(),
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    author: MOCK_USER,
    category: MOCK_CATEGORIES[1],
    readingTime: 4,
    publishedAt: '2025-02-20T10:00:00Z',
    likesCount: 89,
    commentsCount: 7,
  },
  {
    id: '3',
    title: 'Construire une API REST avec Express.js et MongoDB',
    slug: 'api-rest-express-mongodb',
    excerpt: 'Guide pas-à-pas pour créer une API REST robuste avec Express.js, MongoDB et les meilleures pratiques de sécurité.',
    content: `
# API REST avec Express.js et MongoDB

Dans ce tutoriel, nous allons construire une API REST complète.

## Prérequis

- Node.js 18+
- MongoDB installé ou un compte Atlas
- Connaissance basique de JavaScript

## Structure du projet

\`\`\`
server/
  src/
    routes/
    controllers/
    models/
    middlewares/
  app.js
  server.js
\`\`\`

## Créer le serveur

\`\`\`js
const express = require('express')
const app = express()

app.use(express.json())
app.listen(5000, () => console.log('Server running'))
\`\`\`
    `.trim(),
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    author,
    category: MOCK_CATEGORIES[2],
    readingTime: 10,
    publishedAt: '2025-02-10T14:00:00Z',
    likesCount: 213,
    commentsCount: 31,
  },
  {
    id: '4',
    title: 'TypeScript 5.4 : les nouvelles fonctionnalités expliquées',
    slug: 'typescript-5-4-nouveautes',
    excerpt: 'TypeScript 5.4 arrive avec des améliorations importantes. Découvrons ensemble ce que cette version apporte à notre quotidien.',
    content: 'Contenu complet de l\'article TypeScript...',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    author: MOCK_USER,
    category: MOCK_CATEGORIES[0],
    readingTime: 5,
    publishedAt: '2025-01-28T09:30:00Z',
    likesCount: 76,
    commentsCount: 9,
  },
  {
    id: '5',
    title: 'Tailwind CSS v4 : ce qui change pour les développeurs',
    slug: 'tailwind-css-v4-changements',
    excerpt: 'Tailwind v4 repense complètement son approche. Voici un résumé des changements qui vont impacter votre workflow.',
    content: 'Contenu complet de l\'article Tailwind...',
    author,
    category: MOCK_CATEGORIES[2],
    readingTime: 7,
    publishedAt: '2025-01-15T11:00:00Z',
    likesCount: 155,
    commentsCount: 22,
  },
  {
    id: '6',
    title: 'L\'état du web en 2025 : tendances et prédictions',
    slug: 'etat-du-web-2025',
    excerpt: 'IA générative, Web Components, edge computing... Le développement web évolue à toute vitesse. Voici où on en est.',
    content: 'Contenu complet de l\'article sur l\'état du web...',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    author: MOCK_USER,
    category: MOCK_CATEGORIES[3],
    readingTime: 8,
    publishedAt: '2025-01-05T16:00:00Z',
    likesCount: 301,
    commentsCount: 45,
  },
]

export const MOCK_COMMENTS: Comment[] = [
  { id: '1', content: 'Article très clair, merci beaucoup !', author, createdAt: '2025-03-02T10:00:00Z' },
  { id: '2', content: 'J\'aurais aimé plus d\'exemples pratiques, mais c\'est un bon point de départ.', author: MOCK_USER, createdAt: '2025-03-03T14:30:00Z' },
  { id: '3', content: 'Le point sur Suspense est particulièrement intéressant.', author, createdAt: '2025-03-04T09:15:00Z' },
]
