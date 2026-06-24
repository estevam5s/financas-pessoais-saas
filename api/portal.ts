import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, getUser, admin, stripeReq, siteUrl } from "./_saas.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" })
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: "unauthorized" })
  const { data: sub } = await admin().from("app_subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle()
  if (!sub?.stripe_customer_id) return res.status(400).json({ error: "Nenhuma assinatura encontrada" })
  const session = await stripeReq("billing_portal/sessions", { customer: sub.stripe_customer_id, return_url: `${siteUrl()}/app/billing` })
  res.status(200).json({ url: session.url })
}
