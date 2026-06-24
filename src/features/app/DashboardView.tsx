import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "@/context/authContext"
import { authFetch, money } from "@/lib/supabaseClient"
import { AppShell } from "./AppShell"
import { TrendingUp, TrendingDown, Wallet, Gift, ArrowRight } from "lucide-react"

export default function DashboardView() {
  const { user, sub, isAdmin, hasAccess } = useAuth()
  const [tx, setTx] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      authFetch("/api/fin?type=transactions").then((r) => r.json()),
      authFetch("/api/fin?type=accounts").then((r) => r.json()),
    ]).then(([t, a]) => { setTx(t.items || []); setAccounts(a.items || []); setLoaded(true) }).catch(() => setLoaded(true))
  }, [])

  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0)
  const monthTx = tx.filter((t) => new Date(t.occurred_at) >= monthStart)
  const receitas = monthTx.filter((t) => t.kind === "receita").reduce((s, t) => s + Number(t.amount || 0), 0)
  const despesas = monthTx.filter((t) => t.kind === "despesa").reduce((s, t) => s + Number(t.amount || 0), 0)
  const saldo = accounts.reduce((s, a) => s + Number(a.initial_balance || 0), 0) + tx.reduce((s, t) => s + (t.kind === "receita" ? 1 : -1) * Number(t.amount || 0), 0)
  const greeting = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0]

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Olá, {greeting} 👋</h1>
          <p className="text-slate-400 mt-1">Resumo das suas finanças — plano {isAdmin ? "Admin" : sub?.plan?.name || "Inicial"}.</p>
        </div>

        {!hasAccess && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><p className="text-amber-300 font-medium">Seu período grátis terminou</p><p className="text-sm text-slate-400 mt-1">Assine um plano para continuar registrando e liberar tudo.</p></div>
            <Link to="/app/billing" className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600">Ver planos</Link>
          </div>
        )}
        {hasAccess && sub?.trial_active && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-400 flex items-center gap-2">
            <Gift className="size-4 shrink-0" /> Teste grátis ativo até <strong>{sub?.trial_ends_at ? new Date(sub.trial_ends_at).toLocaleDateString("pt-BR") : ""}</strong> — acesso nível Pro.
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide"><Wallet className="size-4" /> Saldo total</div>
            <p className="text-2xl font-semibold text-white mt-2">{loaded ? money(saldo) : "…"}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs uppercase tracking-wide"><TrendingUp className="size-4" /> Receitas (mês)</div>
            <p className="text-2xl font-semibold text-emerald-400 mt-2">{loaded ? money(receitas) : "…"}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-red-400 text-xs uppercase tracking-wide"><TrendingDown className="size-4" /> Despesas (mês)</div>
            <p className="text-2xl font-semibold text-red-400 mt-2">{loaded ? money(despesas) : "…"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Últimos lançamentos</h2>
            <Link to="/app/transactions" className="text-sm text-emerald-400 hover:underline flex items-center gap-1">Ver todos <ArrowRight className="size-3.5" /></Link>
          </div>
          {!loaded ? <p className="text-slate-500 text-sm">Carregando…</p> : tx.length === 0 ? (
            <div className="text-center py-8">
              <ArrowRight className="size-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">Nenhum lançamento ainda.</p>
              <Link to="/app/transactions" className="inline-block mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600">Adicionar lançamento</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {tx.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5">
                  <div>
                    <p className="text-white text-sm font-medium">{t.description || t.category_name || "Lançamento"}</p>
                    <p className="text-xs text-slate-500">{t.category_name || "—"} · {new Date(t.occurred_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <span className={`text-sm font-medium ${t.kind === "receita" ? "text-emerald-400" : "text-red-400"}`}>{t.kind === "receita" ? "+" : "−"} {money(Number(t.amount))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
