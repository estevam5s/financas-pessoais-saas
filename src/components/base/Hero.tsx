import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
    return (
        <div className="pt-40 md:pt-48 container px-5 md:px-7" id="home">
            <div className="flex flex-col w-full justify-center items-center">
                <Badge variant="outline" className="mb-6 px-4 py-2 text-center gap-2 bg-gray-100/70 backdrop-blur-sm dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                    Novo: 7 dias grátis no nível Pro, sem cartão
                    <ChevronRight className="h-4 w-4" />
                </Badge>

                <h1 className="sm:text-5xl md:text-5xl lg:text-6xl text-4xl text-center font-bold pb-6 leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">Suas finanças pessoais</span> <br />
                    <span className="dark:text-white">sob controle, de verdade</span>
                </h1>

                <p className="text-base text-center md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mb-8">
                    Organize contas, registre receitas e despesas, crie orçamentos e
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent font-semibold"> acompanhe seu saldo em tempo real</span>.
                </p>

                <div className="button-group mt-2 mb-8 flex flex-col gap-y-4 md:gap-y-0 md:flex-row w-full justify-center items-center">
                    <Link to="/login" search={{ mode: "signup" }} className="w-full md:w-auto md:mr-4">
                        <Button variant="default" className="w-full md:w-auto px-6 py-6 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 border-0 group text-white">
                            Começar grátis
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <a href="#pricing" className="w-full md:w-auto">
                        <Button variant="outline" className="w-full md:w-auto px-6 py-6 text-base md:text-lg rounded-xl border-gray-300 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all">
                            Ver planos
                        </Button>
                    </a>
                </div>

                <p className="text-xs md:text-sm text-center text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Não pedimos cartão de crédito
                </p>

                <div className="relative w-full max-w-4xl rounded-2xl border border-gray-200/30 dark:border-gray-800/30 bg-white/5 backdrop-blur p-6 shadow-xl">
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { label: "Saldo total", value: "R$ 8.420,00", color: "text-emerald-400" },
                            { label: "Receitas (mês)", value: "R$ 6.200,00", color: "text-emerald-400" },
                            { label: "Despesas (mês)", value: "R$ 3.180,00", color: "text-red-400" },
                        ].map((c) => (
                            <div key={c.label} className="rounded-xl border border-white/10 bg-black/20 p-4 text-left">
                                <p className="text-[11px] uppercase tracking-wide text-gray-400">{c.label}</p>
                                <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-2 text-left">
                        {[
                            { d: "Salário", v: "+ R$ 6.200,00", up: true },
                            { d: "Mercado", v: "− R$ 540,00", up: false },
                            { d: "Aluguel", v: "− R$ 1.800,00", up: false },
                        ].map((t) => (
                            <div key={t.d} className="flex items-center justify-between rounded-lg bg-black/10 px-4 py-2 text-sm">
                                <span className="text-gray-300">{t.d}</span>
                                <span className={t.up ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>{t.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
