import { useEffect, useState } from "react"
import { useAuth } from "@/context/authContext"
import { authFetch, brl } from "@/lib/supabaseClient"
import { AppShell } from "./AppShell"
import { Check, ShieldCheck } from "lucide-react"

const FALLBACK = [
  { slug: "inicial", name: "Inicial", price_month: 0, price_year: 0, highlighted: false, features: ["2 contas", "Até 50 transações/mês", "5 categorias", "Relatórios básicos"] },
  { slug: "starter", name: "Starter", price_month: 1200, price_year: 11500, highlighted: false, features: ["Até 5 contas", "500 transações/mês", "Categorias ilimitadas", "Orçamentos e metas", "Exportação CSV"] },
  { slug: "pro", name: "Pro", price_month: 2400, price_year: 23000, highlighted: true, features: ["Contas ilimitadas", "Transações ilimitadas", "Orçamentos ilimitados", "Relatórios avançados", "Exportação Excel"] },
  { slug: "familia", name: "Família", price_month: 3900, price_year: 37400, highlighted: false, features: ["Tudo do Pro", "Até 5 membros", "Orçamento compartilhado", "Visão consolidada"] },
]

export default function BillingView() {
  const { sub, isAdmin, reload } = useAuth()
  const [cycle, setCycle] = useState<"month" | "year">("month")
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get("success")) { setMsg("✅ Assinatura ativada! Pode levar alguns segundos para atualizar."); reload() }
    if (q.get("canceled")) setMsg("Pagamento cancelado.")
  }, [reload])

  const checkout = async (slug: string) => {
    if (slug === "inicial") return
    setBusy(slug)
    const res = await authFetch("/api/checkout", { method: "POST", body: JSON.stringify({ slug, cycle }) })
    const data = await res.json(); setBusy(null)
    if (data.url) window.location.href = data.url; else setMsg(data.error || "Erro ao iniciar checkout")
  }
  const portal = async () => {
    setBusy("portal")
    const res = await authFetch("/api/portal", { method: "POST" })
    const data = await res.json(); setBusy(null)
    if (data.url) window.location.href = data.url; else setMsg(data.error || "Nenhuma assinatura para gerenciar")
  }

  const plans = sub?.plans?.length ? sub.plans : FALLBACK
  const currentSlug = isAdmin ? "familia" : sub?.subscription?.plan_slug || "inicial"
  const subscription = sub?.subscription
  const refundUntil = subscription?.refund_eligible_until ? new Date(subscription.refund_eligible_until) : null
  const refundActive = refundUntil && refundUntil > new Date()
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR") : null

  return (
    <AppShell>
      <div className="space-y-8">
        <div><h1 className="text-2xl font-semibold text-white">Assinatura</h1><p className="text-slate-400 mt-1 text-sm">Gerencie seu plano, pagamentos e reembolso.</p></div>
        {msg && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-400">{msg}</div>}

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Plano atual</p>
            <p className="text-xl font-semibold text-white mt-1">{isAdmin ? "Admin (acesso total)" : sub?.plan?.name || "Inicial"}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
              {subscription?.status && <span>Status: <span className="text-slate-300">{subscription.status}</span></span>}
              {periodEnd && <span>Renova em: <span className="text-slate-300">{periodEnd}</span></span>}
              {sub?.trial_active && sub?.trial_ends_at && <span className="text-emerald-400">Teste Pro até {new Date(sub.trial_ends_at).toLocaleDateString("pt-BR")}</span>}
            </div>
          </div>
          {subscription?.stripe_customer_id && <button onClick={portal} disabled={busy === "portal"} className="shrink-0 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition disabled:opacity-50">{busy === "portal" ? "Abrindo…" : "Gerenciar pagamento"}</button>}
        </div>

        {refundActive && <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm text-sky-300 flex items-center gap-2"><ShieldCheck className="size-4 shrink-0" /> Garantia de reembolso ativa até <strong>{refundUntil!.toLocaleDateString("pt-BR")}</strong> (7 dias).</div>}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-white">Escolha seu plano</h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5">
            <button onClick={() => setCycle("month")} className={`px-4 py-1.5 rounded-full text-sm transition ${cycle === "month" ? "bg-emerald-500 text-white font-medium" : "text-slate-400"}`}>Mensal</button>
            <button onClick={() => setCycle("year")} className={`px-4 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${cycle === "year" ? "bg-emerald-500 text-white font-medium" : "text-slate-400"}`}>Anual <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">−20%</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p: any) => {
            const price = cycle === "year" ? p.price_year : p.price_month
            const free = p.slug === "inicial"; const isCurrent = currentSlug === p.slug
            return (
              <div key={p.slug} className={`relative flex flex-col rounded-2xl border p-6 ${p.highlighted ? "border-emerald-500/50 bg-emerald-500/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
                {p.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-500 text-white">Mais popular</span>}
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-3 flex items-end gap-1"><span className="text-3xl font-bold text-white">{free ? "R$ 0" : brl(cycle === "year" ? Math.round(price / 12) : price)}</span>{!free && <span className="text-slate-500 text-sm mb-1">/mês</span>}</div>
                {!free && cycle === "year" && <p className="text-xs text-slate-500 mt-1">{brl(price)}/ano</p>}
                <button onClick={() => checkout(p.slug)} disabled={free || isCurrent || busy === p.slug} className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed ${isCurrent ? "bg-white/5 text-slate-400" : p.highlighted ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white/10 text-white hover:bg-white/20"}`}>{busy === p.slug ? "Aguarde…" : isCurrent ? "Plano atual" : free ? "Incluído" : "Assinar"}</button>
                <ul className="mt-6 space-y-2.5 text-sm flex-1">{(p.features || []).map((f: string, i: number) => (<li key={i} className="flex gap-2 text-slate-300"><Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /><span>{f}</span></li>))}</ul>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-600">Pagamentos via Stripe. Cancele quando quiser. Reembolso de 7 dias. Sem cobrança por armazenamento.</p>
      </div>
    </AppShell>
  )
}
