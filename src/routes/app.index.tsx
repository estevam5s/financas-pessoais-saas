import { createFileRoute } from '@tanstack/react-router'
import DashboardView from '@/features/app/DashboardView'
export const Route = createFileRoute('/app/')({ component: DashboardView })
