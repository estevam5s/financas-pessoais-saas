import type { VercelRequest, VercelResponse } from "@vercel/node"
import { cors, admin } from "./_saas.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const { data } = await admin().from("app_plans")
    .select("slug,name,description,price_month,price_year,features,highlighted,sort_order")
    .eq("active", true).order("sort_order")
  res.status(200).json({ plans: data || [] })
}
