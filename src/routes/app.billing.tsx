import { createFileRoute } from '@tanstack/react-router'
import BillingView from '@/features/app/BillingView'
export const Route = createFileRoute('/app/billing')({ component: BillingView })
