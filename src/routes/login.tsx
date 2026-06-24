import LoginPage from '@/features/auth/login/view/LoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === 'signup' ? 'signup' : undefined,
  }),
  component: LoginPage,
})
