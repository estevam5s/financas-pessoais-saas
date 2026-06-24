import { createFileRoute } from '@tanstack/react-router'
import AdminView from '@/features/app/AdminView'
export const Route = createFileRoute('/app/admin')({ component: AdminView })
