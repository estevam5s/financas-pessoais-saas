import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ = [
    { q: "Como funciona o teste grátis?", a: "Toda conta nova começa com 7 dias grátis no nível Pro, sem precisar de cartão. Depois desse período, se você não escolher um plano, a conta passa para o nível Inicial com recursos reduzidos." },
    { q: "Qual é a política de reembolso?", a: "Em qualquer plano pago, você tem 7 dias após a primeira cobrança para solicitar o reembolso integral, direto pelo portal de pagamento." },
    { q: "Posso mudar de plano depois?", a: "Sim. Você pode fazer upgrade ou downgrade a qualquer momento na página de Assinatura, e o ajuste é aplicado na hora." },
    { q: "Meus dados financeiros estão seguros?", a: "Sim. Cada conta tem os dados isolados (RLS) e o FinControl não movimenta dinheiro nem acessa seus bancos — você registra e organiza suas finanças. Estamos em conformidade com a LGPD." },
    { q: "O FinControl cobra por armazenamento?", a: "Não. Os planos são por recursos (contas, transações, orçamentos, membros) — nunca por GB de armazenamento." },
];

const FAQSection = () => {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32" id="faq">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">
                    Perguntas frequentes
                </h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
                    {FAQ.map((item, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-lg font-medium text-gray-900 dark:text-gray-100 text-left">{item.q}</AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-400">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
