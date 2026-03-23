#  Blog — Full-Stack Blog Platform

> A modern, performant, and scalable blog platform built with **React** + **Express.js**

![Stack](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)
![Stack](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express)
![Stack](https://img.shields.io/badge/Auth-JWT-FF6B6B?style=for-the-badge)
![Stack](https://img.shields.io/badge/Styling-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)

---

##  Table des Matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-api-endpoints)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

##  Aperçu

**Blog** est une plateforme de blog full-stack pensée pour les développeurs et créateurs de contenu. Elle offre une expérience d'écriture fluide, une gestion des utilisateurs robuste et une API REST bien documentée.

---

## Fonctionnalités

###  Utilisateurs
- Inscription / Connexion avec JWT (access + refresh tokens)
- Profil personnalisable (avatar, bio, réseaux sociaux)
- Rôles : `reader`, `author`, `admin`

###  Articles
- Éditeur de texte riche (Markdown / WYSIWYG)
- Catégories & Tags
- Articles en brouillon / publiés / archivés
- Slug SEO-friendly auto-généré
- Image de couverture avec upload

### Engagement
- Système de commentaires (avec modération)
- Likes / Réactions sur les articles
- Bookmarks / Favoris

### Découverte
- Recherche full-text
- Filtrage par catégorie, tag, auteur
- Pagination & infinite scroll
- Trending articles

###  Admin Dashboard
- Gestion des utilisateurs
- Modération des commentaires
- Analytics (vues, likes, commentaires)
- Gestion des catégories/tags

---

## Stack Technique

| Couche | Technologie | Rôle |
|---|---|---|
| Frontend | React 18 | UI Library |
| State Management | Zustand | Global state |
| Routing | React Router v6 | Client-side routing |
| Styling | Tailwind CSS | Utility-first CSS |
| HTTP Client | Axios | Requêtes API |
| Éditeur | TipTap | Rich text editor |
| Backend | Express.js | REST API Server |
| Base de données | MySql | Persistance des données |
| Auth | JWT (access + refresh) | Authentification |
| Upload | Multer + Cloudinary | Gestion des fichiers |
| Validation | Joi / Zod | Validation des inputs |
| Sécurité | Helmet, CORS, Rate Limit | Hardening |
| Tests | Jest + Supertest | Tests unitaires & API |

---

##  Architecture

```
blogforge/
├── frontend/                    # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/            # Images, fonts, icons
│       ├── components/        # Composants réutilisables
│       │   ├── ui/            # Design system (Button, Card, Modal…)
│       │   ├── layout/        # Header, Footer, Sidebar
│       │   └── shared/        # Composants métier partagés
│       ├── features/          # Feature-based modules
│       │   ├── auth/
│       │   ├── posts/
│       │   ├── comments/
│       │   ├── profile/
│       │   └── admin/
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utilitaires, helpers
│       ├── pages/             # Page components (routing)
│       ├── routes/            # Route definitions & guards
│       ├── services/          # API calls (axios instances)
│       ├── store/             # Zustand stores
│       ├── styles/            # Global styles
│       └── types/             # TypeScript types/interfaces
│
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── config/            # DB, env, cloudinary config
│   │   ├── controllers/       # Route handlers (thin layer)
│   │   ├── middlewares/       # Auth, error, validation, rate-limit
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routers
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Helpers (slug, pagination, mail…)
│   │   └── validators/        # Joi/Zod schemas
│   ├── tests/                 # Tests Jest + Supertest
│   └── app.js / server.js
│
├── .env.example
├── docker-compose.yml
├── README.md
└── package.json (workspace root)
```

---

## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x ou **pnpm** >= 8.x
- **Mysql**

---

##  Installation

### 1. Cloner le repo

```bash
git clone https://github.com/yutaOKKOTSU00/blog.git
cd blog
```

### 2. Installer les dépendances

```bash
# Depuis la racine (workspaces)
npm install

# Ou séparément
cd frontend && npm install
cd ../backend && npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
# Remplir les variables dans .env
```

### 4. Lancer en développement

```bash
# Lancer les deux (frontend + backend) depuis la racine
npm run dev

# Ou séparément
npm run dev:frontend   # http://localhost:5173
npm run dev:backend   # http://localhost:5000
```

---

## Scripts Disponibles

### Racine

```bash
npm run dev           # Lance frontend + backend en parallèle
npm run build         # Build frontend + backend
npm run test          # Lance tous les tests
npm run lint          # Lint l'ensemble du code
```

### backend

```bash
npm run dev           # Nodemon watch mode
npm run start         # Production
npm run test          # Jest + Supertest
npm run test:watch    # Watch mode
npm run seed          # Seed la base de données
```

### Frontend

```bash
npm run dev           # Vite dev server
npm run build         # Build production
npm run preview       # Preview build
npm run lint          # ESLint
```

---

##  API Endpoints

```
Auth
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout
  POST   /api/v1/auth/refresh-token
  POST   /api/v1/auth/forgot-password
  POST   /api/v1/auth/reset-password/:token

Users
  GET    /api/v1/users/me
  PUT    /api/v1/users/me
  GET    /api/v1/users/:username
  GET    /api/v1/users/:username/posts
  DELETE /api/v1/users/me          (soft delete)

Posts
  GET    /api/v1/posts             (list, filter, paginate)
  POST   /api/v1/posts             (auth required)
  GET    /api/v1/posts/:slug
  PUT    /api/v1/posts/:slug       (owner ou admin)
  DELETE /api/v1/posts/:slug       (owner ou admin)
  POST   /api/v1/posts/:slug/like
  POST   /api/v1/posts/:slug/bookmark

Comments
  GET    /api/v1/posts/:slug/comments
  POST   /api/v1/posts/:slug/comments
  PUT    /api/v1/comments/:id
  DELETE /api/v1/comments/:id

Categories & Tags
  GET    /api/v1/categories
  POST   /api/v1/categories        (admin)
  GET    /api/v1/tags

Upload
  POST   /api/v1/upload/image

Admin
  GET    /api/v1/admin/users
  GET    /api/v1/admin/stats
  PUT    /api/v1/admin/users/:id/role
  DELETE /api/v1/admin/posts/:id
```

---

## Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'feat: add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

> Convention de commit : [Conventional Commits](https://www.conventionalcommits.org/)

---

##  Licence

Distribué sous licence **MIT**. Voir `LICENSE` pour plus d'informations.

<div align="center">
  Made with ❤️ and ☕ by the BlogForge team
</div>
