import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, getUser, admin, isAdminEmail } from "./_saas.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: "unauthorized" })
  if (!isAdminEmail(user.email)) return res.status(403).json({ error: "forbidden" })
  const db = admin()
  const view = (req.query.view as string) || "overview"

  if (view === "users") {
    const [{ data: profiles }, { data: subs }] = await Promise.all([
      db.from("profiles").select("id,email,full_name,trial_ends_at,plan_slug,created_at").order("created_at", { ascending: false }).limit(500),
      db.from("app_subscriptions").select("*"),
    ])
    const byUser = new Map((subs || []).map((s: any) => [s.user_id, s]))
    const users = (profiles || []).map((p: any) => ({ ...p, subscription: byUser.get(p.id) || null }))
    return res.status(200).json({ users })
  }

  const [profiles, paid, events, tx, accounts] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("app_subscriptions").select("plan_slug", { count: "exact" }).neq("plan_slug", "inicial").in("status", ["active", "trialing"]),
    db.from("app_payment_events").select("id", { count: "exact", head: true }),
    db.from("transactions").select("id", { count: "exact", head: true }),
    db.from("accounts").select("id", { count: "exact", head: true }),
  ])
  const { data: planRows } = await db.from("app_subscriptions").select("plan_slug").neq("plan_slug", "inicial").in("status", ["active", "trialing"])
  const byPlan: Record<string, number> = {}
  for (const s of planRows || []) byPlan[s.plan_slug] = (byPlan[s.plan_slug] || 0) + 1
  res.status(200).json({
    totals: { users: profiles.count || 0, paid: paid.count || 0, events: events.count || 0, transactions: tx.count || 0, accounts: accounts.count || 0 },
    byPlan,
  })
}
