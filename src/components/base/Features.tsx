import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, PieChart, Target, Bell, FileDown, Repeat } from "lucide-react"

const FEATURES = [
    { icon: Wallet, title: "Contas e carteiras", desc: "Cadastre carteira, banco e cartões e acompanhe o saldo de cada conta separadamente." },
    { icon: PieChart, title: "Categorias e relatórios", desc: "Classifique receitas e despesas por categoria e veja para onde seu dinheiro está indo." },
    { icon: Target, title: "Orçamentos e metas", desc: "Defina limites mensais por categoria e metas financeiras para alcançar seus objetivos." },
    { icon: Repeat, title: "Lançamentos recorrentes", desc: "Registre receitas e despesas que se repetem todo mês sem retrabalho." },
    { icon: Bell, title: "Lembretes de contas", desc: "Receba avisos de contas a pagar por e-mail e nunca mais perca um vencimento." },
    { icon: FileDown, title: "Exportação", desc: "Exporte seus lançamentos em CSV/Excel para analisar onde e como quiser." },
]

const Features = () => {
    return (
        <div className="container py-16 text-center" id="features">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium">Simples de usar, completo de verdade</h2>
            <p className="mt-5 mb-12 text-lg font-normal text-muted-foreground">
                Tudo o que você precisa para organizar a sua vida financeira com o <span className="font-medium text-emerald-500">FinControl</span>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {FEATURES.map((f) => (
                    <Card key={f.title} className="text-start">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 grid place-items-center text-emerald-500 mb-2">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <CardTitle>{f.title}</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">{f.desc}</p></CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Features
