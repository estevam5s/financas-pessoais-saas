import type { VercelRequest, VercelResponse } from "@vercel/node"
import { admin, stripeReq, verifyStripeSignature } from "./_saas.js"

export const config = { api: { bodyParser: false } }

async function rawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req as any) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks).toString("utf8")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" })
  const body = await rawBody(req)
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers["stripe-signature"] as string | undefined
  if (secret && !verifyStripeSignature(body, sig, secret)) return res.status(400).json({ error: "invalid signature" })

  let event: any
  try { event = JSON.parse(body) } catch { return res.status(400).json({ error: "bad json" }) }

  const db = admin()
  const { data: seen } = await db.from("app_payment_events").select("id").eq("id", event.id).maybeSingle()
  if (seen) return res.status(200).json({ received: true, duplicate: true })

  const REFUND_DAYS = Number(process.env.REFUND_DAYS || 7)
  const slugFromPrice = async (priceId?: string) => {
    if (!priceId) return undefined
    const { data } = await db.from("app_plans").select("slug").or(`stripe_price_month.eq.${priceId},stripe_price_year.eq.${priceId}`).maybeSingle()
    return data?.slug as string | undefined
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object
      const userId = s.metadata?.user_id, slug = s.metadata?.slug, cycle = s.metadata?.cycle || "month"
      if (userId && slug) {
        let periodEnd: string | null = null
        const subId = (s.subscription as string) || null
        if (subId) { const f: any = await stripeReq(`subscriptions/${subId}`, undefined, "GET"); if (f?.current_period_end) periodEnd = new Date(f.current_period_end * 1000).toISOString() }
        await db.from("app_subscriptions").upsert({
          user_id: userId, plan_slug: slug, status: "active", cycle,
          stripe_customer_id: s.customer, stripe_subscription_id: subId,
          current_period_end: periodEnd, cancel_at_period_end: false,
          refund_eligible_until: new Date(Date.now() + REFUND_DAYS * 864e5).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" })
        await db.from("profiles").update({ is_demo: false, plan_slug: slug }).eq("id", userId)
      }
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object, customer = sub.customer, priceId = sub.items?.data?.[0]?.price?.id
      const updates: any = {
        status: event.type === "customer.subscription.deleted" ? "canceled" : sub.status,
        current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end || false, stripe_subscription_id: sub.id, updated_at: new Date().toISOString(),
      }
      if (event.type === "customer.subscription.deleted") updates.plan_slug = "inicial"
      else { const slug = await slugFromPrice(priceId); if (slug) updates.plan_slug = slug }
      await db.from("app_subscriptions").update(updates).eq("stripe_customer_id", customer)
      const { data: row } = await db.from("app_subscriptions").select("user_id,plan_slug").eq("stripe_customer_id", customer).maybeSingle()
      if (row) await db.from("profiles").update({ plan_slug: updates.plan_slug || row.plan_slug }).eq("id", row.user_id)
    }
    await db.from("app_payment_events").insert({ id: event.id, type: event.type, payload: event })
  } catch (e) {
    console.error("webhook", e)
    return res.status(500).json({ error: "handler" })
  }
  res.status(200).json({ received: true })
}
