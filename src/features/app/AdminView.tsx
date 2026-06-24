import { useEffect, useState } from "react"
import { useAuth } from "@/context/authContext"
import { authFetch } from "@/lib/supabaseClient"
import { AppShell } from "./AppShell"
import { Users, CreditCard, ArrowLeftRight, Wallet, Shield } from "lucide-react"

export default function AdminView() {
  const { isAdmin, loading } = useAuth()
  const [overview, setOverview] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (!isAdmin) return
    authFetch("/api/admin?view=overview").then((r) => r.json()).then(setOverview).catch(() => {})
    authFetch("/api/admin?view=users").then((r) => r.json()).then((d) => setUsers(d.users || [])).catch(() => {})
  }, [isAdmin])

  if (loading) return <AppShell><div /></AppShell>
  if (!isAdmin) return <AppShell><div className="text-center py-20"><Shield className="size-10 text-slate-700 mx-auto mb-3" /><p className="text-foreground font-medium">Acesso restrito</p><p className="text-sm text-muted-foreground mt-1">Esta área é exclusiva do administrador.</p></div></AppShell>

  const t = overview?.totals || {}
  const cards = [
    { label: "Usuários", value: t.users ?? "—", icon: Users },
    { label: "Assinantes pagos", value: t.paid ?? "—", icon: CreditCard },
    { label: "Transações", value: t.transactions ?? "—", icon: ArrowLeftRight },
    { label: "Contas", value: t.accounts ?? "—", icon: Wallet },
  ]

  return (
    <AppShell>
      <div className="space-y-8">
        <div><h1 className="text-2xl font-semibold text-foreground flex items-center gap-2"><Shield className="size-6 text-emerald-400" /> Painel admin</h1><p className="text-muted-foreground mt-1 text-sm">Visão geral do SaaS: usuários, assinaturas e uso.</p></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide"><c.icon className="size-4" /> {c.label}</div>
              <p className="text-2xl font-semibold text-foreground mt-2">{c.value}</p>
            </div>
          ))}
        </div>

        {overview?.byPlan && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-3">Assinantes por plano</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(overview.byPlan).map(([slug, n]) => (<span key={slug} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-muted-foreground capitalize">{slug}: <strong className="text-emerald-400">{n as number}</strong></span>))}
              {Object.keys(overview.byPlan).length === 0 && <span className="text-sm text-muted-foreground">Nenhum assinante pago ainda.</span>}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between"><h2 className="font-semibold text-foreground">Usuários</h2><span className="text-xs text-muted-foreground">{users.length}</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-[10px] uppercase tracking-widest text-muted-foreground"><th className="text-left font-bold px-5 py-3">E-mail</th><th className="text-left font-bold px-5 py-3">Nome</th><th className="text-left font-bold px-5 py-3">Plano</th><th className="text-left font-bold px-5 py-3">Status</th><th className="text-left font-bold px-5 py-3">Trial até</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-card">
                    <td className="px-5 py-3 text-foreground">{u.email}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.full_name || "—"}</td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{u.subscription?.plan_slug || u.plan_slug || "inicial"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.subscription?.status || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{u.trial_ends_at ? new Date(u.trial_ends_at).toLocaleDateString("pt-BR") : "—"}</td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Sem usuários ainda.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
