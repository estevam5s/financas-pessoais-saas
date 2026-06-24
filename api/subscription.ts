import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, getUser, getAccess } from "./_saas.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: "unauthorized" })
  const acc = await getAccess(user.id, user.email)
  res.status(200).json({
    subscription: acc.subscription, plan: acc.plan, plans: acc.plans,
    is_admin: acc.isAdmin, trial_active: acc.trialActive, trial_ends_at: acc.trialEndsAt,
    has_access: acc.hasAccess, limits: acc.limits,
  })
}
