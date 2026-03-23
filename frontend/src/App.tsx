// ─────────────────────────────────────────────
// App.tsx — Routing principal avec React Router v6
// ─────────────────────────────────────────────

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { NotFound } from '@/pages/NotFound'
import { useAuth } from '@/store/auth'

// Lazy loading — chaque page est un chunk séparé (meilleure perf)
const Home     = lazy(() => import('@/pages/Home'))
const Blog     = lazy(() => import('@/pages/Blog'))
const Post     = lazy(() => import('@/pages/Post'))
const Login    = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))

// Spinner de chargement minimal entre les pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Guard : redirige vers /login si pas connecté
function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

// Guard : redirige vers / si déjà connecté
function Guest({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return !user ? <>{children}</> : <Navigate to="/" replace />
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>

            {/* Pages publiques */}
            <Route index       element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Post />} />

            {/* Pages réservées aux visiteurs non connectés */}
            <Route path="login"    element={<Guest><Login /></Guest>} />
            <Route path="register" element={<Guest><Register /></Guest>} />

            {/* Pages protégées — nécessitent d'être connecté */}
            <Route path="dashboard/*" element={<Protected><Dashboard /></Protected>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
