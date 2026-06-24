import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, getUser, admin, stripeReq, siteUrl } from "./_saas.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" })
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: "unauthorized" })
  const { slug, cycle } = req.body || {}
  if (!slug || slug === "inicial") return res.status(400).json({ error: "Plano inválido" })

  const db = admin()
  const { data: plan } = await db.from("app_plans").select("*").eq("slug", slug).single()
  if (!plan) return res.status(400).json({ error: "Plano não encontrado" })
  const price = cycle === "year" ? plan.stripe_price_year : plan.stripe_price_month
  if (!price) return res.status(400).json({ error: "Preço não configurado" })

  const { data: sub } = await db.from("app_subscriptions").select("stripe_customer_id,plan_slug").eq("user_id", user.id).maybeSingle()
  let customer = sub?.stripe_customer_id as string | undefined
  if (!customer) {
    const c = await stripeReq("customers", { email: user.email, metadata: { user_id: user.id } })
    customer = c.id
    await db.from("app_subscriptions").upsert({ user_id: user.id, plan_slug: sub?.plan_slug || "inicial", stripe_customer_id: customer }, { onConflict: "user_id" })
  }
  const session = await stripeReq("checkout/sessions", {
    mode: "subscription", customer,
    "line_items[0][price]": price, "line_items[0][quantity]": 1,
    success_url: `${siteUrl()}/app/billing?success=1`,
    cancel_url: `${siteUrl()}/app/billing?canceled=1`,
    allow_promotion_codes: true,
    "subscription_data[metadata][user_id]": user.id, "subscription_data[metadata][slug]": slug,
    "metadata[user_id]": user.id, "metadata[slug]": slug, "metadata[cycle]": cycle || "month",
  })
  res.status(200).json({ url: session.url })
}
