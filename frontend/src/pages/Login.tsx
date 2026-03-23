// pages/Login.tsx
import { LoginForm } from '@/features/auth/LoginForm'

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <LoginForm />
      </div>
    </div>
  )
}
