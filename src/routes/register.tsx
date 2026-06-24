import { createFileRoute, redirect } from '@tanstack/react-router'

// Cadastro unificado em /login (abas Login/Registro).
export const Route = createFileRoute('/register')({
  beforeLoad: () => { throw redirect({ to: '/login', search: { mode: 'signup' } }) },
})
