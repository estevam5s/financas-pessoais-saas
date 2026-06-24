import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Plan = {
  slug: string; name: string; description?: string;
  price_month: number; price_year: number; features: string[]; highlighted: boolean;
};

const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

const FALLBACK: Plan[] = [
  { slug: "inicial", name: "Inicial", description: "Começar / testar", price_month: 0, price_year: 0, highlighted: false, features: ["2 contas", "Até 50 transações/mês", "5 categorias", "Relatórios básicos"] },
  { slug: "starter", name: "Starter", description: "Controle pessoal", price_month: 1200, price_year: 11500, highlighted: false, features: ["Até 5 contas", "500 transações/mês", "Categorias ilimitadas", "Orçamentos e metas", "Exportação CSV"] },
  { slug: "pro", name: "Pro", description: "Quem leva a sério", price_month: 2400, price_year: 23000, highlighted: true, features: ["Contas ilimitadas", "Transações ilimitadas", "Orçamentos e metas ilimitados", "Relatórios avançados", "Exportação CSV/Excel"] },
  { slug: "familia", name: "Família", description: "Casais e famílias", price_month: 3900, price_year: 37400, highlighted: false, features: ["Tudo do Pro", "Até 5 membros", "Orçamento compartilhado", "Visão consolidada"] },
];

const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>(FALLBACK);
  const [cycle, setCycle] = useState<"month" | "year">("month");

  useEffect(() => {
    fetch("/api/plans").then((r) => r.json()).then((d) => { if (d.plans?.length) setPlans(d.plans); }).catch(() => {});
  }, []);

  return (
    <div id="pricing" className="py-16 px-5">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium text-center mt-6">Planos e preços</h3>
      <p className="text-center mt-4 mb-6 text-lg font-normal text-muted-foreground">
        Comece com 7 dias grátis no nível Pro. Cancele quando quiser — reembolso de 7 dias. Sem cobrança por armazenamento.
      </p>

      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full border bg-card">
          <button onClick={() => setCycle("month")} className={`px-5 py-1.5 rounded-full text-sm transition ${cycle === "month" ? "bg-emerald-500 text-white font-medium" : "text-muted-foreground"}`}>Mensal</button>
          <button onClick={() => setCycle("year")} className={`px-5 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${cycle === "year" ? "bg-emerald-500 text-white font-medium" : "text-muted-foreground"}`}>Anual <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">−20%</span></button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plans.map((p) => {
          const price = cycle === "year" ? p.price_year : p.price_month;
          const free = p.slug === "inicial";
          return (
            <div key={p.slug} className={`relative flex flex-col rounded-2xl border p-6 ${p.highlighted ? "border-emerald-500/50 bg-emerald-500/[0.05] shadow-lg" : "bg-card"}`}>
              {p.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-500 text-white">Mais popular</span>}
              <h4 className="text-lg font-bold">{p.name}</h4>
              {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
              <div className="mt-3 flex items-end gap-1">
                <span className="text-3xl font-bold">{free ? "R$ 0" : brl(cycle === "year" ? Math.round(price / 12) : price)}</span>
                {!free && <span className="text-muted-foreground text-sm mb-1">/mês</span>}
              </div>
              {!free && cycle === "year" && <p className="text-xs text-muted-foreground mt-1">{brl(price)}/ano</p>}
              <Link to="/login" search={{ mode: "signup" }} className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition text-center ${p.highlighted ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-muted hover:bg-muted/70"}`}>
                {free ? "Começar grátis" : "Assinar"}
              </Link>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {p.features.map((f, i) => (<li key={i} className="flex gap-2"><CheckIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /><span>{f}</span></li>))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">Pagamento seguro via Stripe · Nota fiscal automática · Garantia de reembolso de 7 dias</p>
    </div>
  );
};

export default Pricing;
