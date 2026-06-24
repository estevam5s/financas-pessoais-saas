import { useEffect, useState } from "react"
import { authFetch, money } from "@/lib/supabaseClient"
import { AppShell } from "./AppShell"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

const EMPTY = { kind: "despesa", description: "", amount: "", occurred_at: new Date().toISOString().slice(0, 10), account_id: "", category_id: "" }

export default function TransactionsView() {
  const [items, setItems] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState("")

  const load = () => Promise.all([
    authFetch("/api/fin?type=transactions").then((r) => r.json()),
    authFetch("/api/fin?type=accounts").then((r) => r.json()),
    authFetch("/api/fin?type=categories").then((r) => r.json()),
  ]).then(([t, a, c]) => { setItems(t.items || []); setAccounts(a.items || []); setCategories(c.items || []); setLoaded(true) })
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm({ ...EMPTY, account_id: accounts[0]?.id || "" }); setErr(""); setOpen(true) }
  const openEdit = (row: any) => { setEditing(row); setForm({ ...EMPTY, ...row, amount: String(row.amount), occurred_at: row.occurred_at?.slice(0, 10) }); setErr(""); setOpen(true) }

  const save = async () => {
    setSaving(true); setErr("")
    const method = editing ? "PATCH" : "POST"
    const body = editing ? { ...form, id: editing.id } : form
    const res = await authFetch("/api/fin?type=transactions", { method, body: JSON.stringify(body) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setErr(data.error || "Erro ao salvar"); return }
    setOpen(false); load()
  }
  const remove = async (id: string) => { if (!confirm("Remover este lançamento?")) return; await authFetch(`/api/fin?type=transactions&id=${id}`, { method: "DELETE" }); load() }

  const catsByKind = categories.filter((c) => c.kind === form.kind)

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><h1 className="text-2xl font-semibold text-white">Lançamentos</h1><p className="text-slate-400 mt-1 text-sm">Receitas e despesas das suas contas.</p></div>
          <button onClick={openNew} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm flex items-center gap-2"><Plus className="size-4" /> Adicionar</button>
        </div>

        {!loaded ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <p className="text-slate-400">Nenhum lançamento ainda.</p>
            <button onClick={openNew} className="inline-block mt-3 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600">+ Adicionar lançamento</button>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-600">
                    <th className="text-left font-bold px-5 py-3">Data</th>
                    <th className="text-left font-bold px-5 py-3">Descrição</th>
                    <th className="text-left font-bold px-5 py-3">Categoria</th>
                    <th className="text-left font-bold px-5 py-3">Conta</th>
                    <th className="text-right font-bold px-5 py-3">Valor</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-slate-400">{new Date(t.occurred_at).toLocaleDateString("pt-BR")}</td>
                      <td className="px-5 py-3 text-white">{t.description || "—"}</td>
                      <td className="px-5 py-3 text-slate-400">{t.category_name || "—"}</td>
                      <td className="px-5 py-3 text-slate-400">{t.account_name || "—"}</td>
                      <td className={`px-5 py-3 text-right font-medium ${t.kind === "receita" ? "text-emerald-400" : "text-red-400"}`}>{t.kind === "receita" ? "+" : "−"} {money(Number(t.amount))}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button onClick={() => openEdit(t)} className="text-slate-500 hover:text-emerald-400 mr-3"><Pencil className="size-4" /></button>
                        <button onClick={() => remove(t.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="size-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d141b] p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-4">{editing ? "Editar" : "Novo"} lançamento</h3>
              {err && <p className="mb-3 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{err}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 grid grid-cols-2 gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
                  {(["despesa", "receita"] as const).map((k) => (
                    <button key={k} type="button" onClick={() => setForm({ ...form, kind: k, category_id: "" })} className={`py-2 rounded-md text-sm font-medium transition ${form.kind === k ? (k === "receita" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "text-slate-400"}`}>{k === "receita" ? "Receita" : "Despesa"}</button>
                  ))}
                </div>
                <Field label="Descrição" full><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="inp" placeholder="Mercado, salário…" /></Field>
                <Field label="Valor (R$)"><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="inp" /></Field>
                <Field label="Data"><input type="date" value={form.occurred_at} onChange={(e) => setForm({ ...form, occurred_at: e.target.value })} className="inp" /></Field>
                <Field label="Conta"><select value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })} className="inp"><option value="">—</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
                <Field label="Categoria"><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="inp"><option value="">—</option>{catsByKind.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300">Cancelar</button>
                <button onClick={save} disabled={saving} className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm disabled:opacity-50">{saving ? "Salvando…" : "Salvar"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`.inp{width:100%;margin-top:.25rem;padding:.5rem .75rem;border-radius:.5rem;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:.875rem;outline:none}.inp:focus{border-color:rgba(16,185,129,.5)}`}</style>
    </AppShell>
  )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><label className="text-xs text-slate-400">{label}</label>{children}</div>
}
