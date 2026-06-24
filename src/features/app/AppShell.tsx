import { useEffect, ReactNode } from "react"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { useAuth } from "@/context/authContext"
import { ModeToggle } from "@/components/base/ThemeToggle"
import { Wallet, LayoutDashboard, ArrowLeftRight, CreditCard, Shield, LogOut, Home } from "lucide-react"

const NAV = [
  { to: "/app", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/app/transactions", label: "Lançamentos", icon: ArrowLeftRight },
  { to: "/app/billing", label: "Assinatura", icon: CreditCard },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut, isAdmin, sub } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }) }, [loading, user, navigate])

  if (loading || !user) return <div className="min-h-screen grid place-items-center bg-background"><div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>

  const planName = isAdmin ? "Admin" : sub?.plan?.name || "Inicial"

  return (
    <div className="min-h-screen bg-background text-slate-200 flex">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-border bg-card/80 backdrop-blur p-5">
        <Link to="/app" className="flex items-center gap-2 mb-8 text-foreground font-bold">
          <div className="size-8 rounded-lg bg-emerald-500 grid place-items-center"><Wallet className="size-5 text-white" /></div> FinControl
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to)
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${active ? "bg-emerald-500/10 text-emerald-400 font-medium" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
                <n.icon className="size-5" /> {n.label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link to="/app/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${pathname.startsWith("/app/admin") ? "bg-emerald-500/10 text-emerald-400" : "text-amber-400/80 hover:text-amber-300 hover:bg-white/5"}`}>
              <Shield className="size-5" /> Painel admin
            </Link>
          )}
        </nav>
        <div className="border-t border-border pt-4 mt-4">
          <div className="px-3 mb-3">
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{planName}{!isAdmin && sub?.trial_active ? " · Teste Pro" : ""}</span>
          </div>
          <div className="flex items-center justify-between px-1">
            <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"><Home className="size-4" /> Site</a>
            <ModeToggle />
          </div>
          <button onClick={async () => { await signOut(); navigate({ to: "/" }) }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-white/5"><LogOut className="size-4" /> Sair</button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/app" className="text-foreground font-bold flex items-center gap-2"><Wallet className="size-5 text-emerald-400" /> FinControl</Link>
          <button onClick={async () => { await signOut(); navigate({ to: "/" }) }} className="text-sm text-red-400">Sair</button>
        </div>
        <div className="lg:hidden flex gap-1 p-2 overflow-x-auto border-b border-border bg-card">
          {NAV.map((n) => (<Link key={n.to} to={n.to} className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs text-muted-foreground">{n.label}</Link>))}
        </div>
        <div className="p-5 sm:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
