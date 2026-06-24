import { ShieldCheck, Lock, RefreshCw, Headphones } from "lucide-react";

const ITEMS = [
    { icon: ShieldCheck, label: "Conformidade com a LGPD" },
    { icon: Lock, label: "Dados isolados por conta" },
    { icon: RefreshCw, label: "Reembolso de 7 dias" },
    { icon: Headphones, label: "Suporte em português" },
];

const Brands = () => {
    return (
        <div className="container py-10">
            <p className="text-center text-base text-gray-600 dark:text-gray-400 mb-8">
                Feito para organizar a vida financeira de quem fala português — com segurança e transparência.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
                {ITEMS.map((it) => (
                    <div key={it.label} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <it.icon className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium">{it.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Brands;
