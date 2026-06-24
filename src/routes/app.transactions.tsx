import { createFileRoute } from '@tanstack/react-router'
import TransactionsView from '@/features/app/TransactionsView'
export const Route = createFileRoute('/app/transactions')({ component: TransactionsView })
