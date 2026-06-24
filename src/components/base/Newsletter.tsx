import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

const Newsletter = () => {
    return (
        <section className="w-full py-16 md:py-24 lg:py-32">
            <div className="container mx-auto grid items-center justify-center gap-8 px-4 text-center md:px-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100">
                        Pronto para organizar suas finanças?
                    </h2>
                    <p className="mx-auto max-w-xl text-lg text-gray-600 dark:text-gray-300">
                        Crie sua conta e comece com 7 dias grátis no nível Pro. Sem cartão de crédito, cancele quando quiser.
                    </p>
                </div>
                <div className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/login" search={{ mode: "signup" }}>
                        <Button className="w-full sm:w-auto px-8 py-3 rounded-md bg-emerald-500 text-white hover:bg-emerald-600">Criar conta grátis</Button>
                    </Link>
                    <a href="#pricing">
                        <Button variant="outline" className="w-full sm:w-auto px-8 py-3 rounded-md">Ver planos</Button>
                    </a>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Garantia de reembolso de 7 dias · Suporte em português</p>
            </div>
        </section>
    );
}

export default Newsletter;
