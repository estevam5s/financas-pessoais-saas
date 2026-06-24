import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, getUser, getAccess, admin } from "./_saas.js"

const TABLES = ["accounts", "categories", "transactions", "budgets"] as const
type Table = (typeof TABLES)[number]

function tableOf(req: VercelRequest): Table | null {
  const t = req.query.type as Table
  return TABLES.includes(t) ? t : null
}

const FIELDS: Record<Table, string[]> = {
  accounts: ["name", "type", "initial_balance", "color"],
  categories: ["name", "kind", "color"],
  transactions: ["account_id", "category_id", "kind", "description", "amount", "occurred_at", "notes"],
  budgets: ["category_id", "amount", "month"],
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: "unauthorized" })
  const t = tableOf(req)
  if (!t) return res.status(400).json({ error: "type inválido" })
  const db = admin()

  if (req.method === "GET") {
    let q = db.from(t).select("*").eq("user_id", user.id)
    if (t === "transactions") q = q.order("occurred_at", { ascending: false }).limit(1000)
    else q = q.order("created_at", { ascending: false }).limit(1000)
    const { data } = await q
    if (t === "transactions") {
      const [{ data: accs }, { data: cats }] = await Promise.all([
        db.from("accounts").select("id,name").eq("user_id", user.id),
        db.from("categories").select("id,name").eq("user_id", user.id),
      ])
      const am = new Map((accs || []).map((a) => [a.id, a.name]))
      const cm = new Map((cats || []).map((c) => [c.id, c.name]))
      return res.status(200).json({ items: (data || []).map((x) => ({ ...x, account_name: am.get(x.account_id) || null, category_name: cm.get(x.category_id) || null })) })
    }
    return res.status(200).json({ items: data || [] })
  }

  if (req.method === "POST") {
    const acc = await getAccess(user.id, user.email)
    if (!acc.hasAccess) return res.status(402).json({ error: "Assine um plano ou ative o teste para registrar.", code: "NO_ACCESS" })
    const limits: any = acc.limits
    if (t === "accounts" && limits.accounts !== -1) {
      const { count } = await db.from("accounts").select("id", { count: "exact", head: true }).eq("user_id", user.id)
      if ((count || 0) >= limits.accounts) return res.status(402).json({ error: `Limite de contas do plano atingido (${limits.accounts}). Faça upgrade.`, code: "LIMIT" })
    }
    if (t === "transactions" && limits.tx_month !== -1) {
      const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0)
      const { count } = await db.from("transactions").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", start.toISOString())
      if ((count || 0) >= limits.tx_month) return res.status(402).json({ error: `Limite de transações do mês atingido (${limits.tx_month}). Faça upgrade.`, code: "LIMIT" })
    }
    const b = req.body || {}
    const row: any = { user_id: user.id }
    for (const f of FIELDS[t]) if (b[f] !== undefined && b[f] !== "") row[f] = b[f]
    const { data, error } = await db.from(t).insert(row).select().single()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ item: data })
  }

  if (req.method === "PATCH") {
    const b = req.body || {}
    if (!b.id) return res.status(400).json({ error: "id obrigatório" })
    const patch: any = { updated_at: new Date().toISOString() }
    for (const f of FIELDS[t]) if (f in b) patch[f] = b[f]
    const { data, error } = await db.from(t).update(patch).eq("id", b.id).eq("user_id", user.id).select().single()
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ item: data })
  }

  if (req.method === "DELETE") {
    const id = req.query.id as string
    if (!id) return res.status(400).json({ error: "id obrigatório" })
    const { error } = await db.from(t).delete().eq("id", id).eq("user_id", user.id)
    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: "method not allowed" })
}
