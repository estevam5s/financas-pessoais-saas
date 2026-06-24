import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ThemeToggle";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Wallet } from "lucide-react";

const NAV = [
    { label: "Início", to: "#top" },
    { label: "Recursos", to: "#features" },
    { label: "Preços", to: "#pricing" },
    { label: "FAQ", to: "#faq" },
];

function scrollTo(hash: string) {
    if (hash === "#top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

const Logo = () => (
    <Link to="/" className="flex items-center gap-2 group">
        <span className="size-8 rounded-lg bg-emerald-500 grid place-items-center"><Wallet className="size-5 text-white" /></span>
        <span className="text-2xl font-bold dark:text-white group-hover:text-primary transition-colors">FinControl</span>
    </Link>
);

const Header = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const AuthButtons = ({ full }: { full?: boolean }) => (
        user ? (
            <Button asChild variant="default" className={`rounded-full ${full ? "w-full" : "px-8"} py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors`}>
                <Link to="/app">Ir para o painel</Link>
            </Button>
        ) : (
            <>
                <Button asChild variant="outline" className={`rounded-full ${full ? "w-full" : "px-6"} py-2 border-gray-300 hover:border-primary hover:bg-primary/10 dark:border-gray-700`}>
                    <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild variant="default" className={`rounded-full ${full ? "w-full" : "px-8"} py-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors`}>
                    <Link to="/login" search={{ mode: "signup" }}>Criar conta</Link>
                </Button>
            </>
        )
    );

    const renderLinks = (onClick?: () => void) => (
        <>
            {NAV.map((n) => (
                <button key={n.label} onClick={() => { scrollTo(n.to); onClick?.(); }} className="text-base font-medium hover:text-primary transition-colors dark:text-[#ECECEC] bg-transparent">
                    {n.label}
                </button>
            ))}
            <Link to="/contact" onClick={onClick} className="text-base font-medium hover:text-primary transition-colors dark:text-[#ECECEC]">Contato</Link>
        </>
    );

    if (isDesktop) {
        return (
            <div className={`w-full h-20 fixed z-[999] transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-header/80 backdrop-blur-lg shadow-md top-0 border-b border-gray-200/30 dark:border-gray-800/30" : "bg-transparent top-6"}`}
                style={{ width: scrolled ? "100%" : "calc(100% - 48px)", borderRadius: scrolled ? "0" : "16px", margin: scrolled ? "0" : "0 24px" }}>
                <div className="container mx-auto flex justify-between items-center h-full">
                    <Logo />
                    <div className="flex space-x-7 items-center">{renderLinks()}</div>
                    <div className="flex items-center space-x-3">
                        <AuthButtons />
                        <ModeToggle />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Sheet>
            <div className={`flex container py-4 gap-x-3 justify-between items-center fixed z-[998] transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-header/80 backdrop-blur-lg shadow-md top-0 border-b border-gray-200/30 dark:border-gray-800/30" : "bg-transparent top-4"}`}
                style={{ width: scrolled ? "100%" : "calc(100% - 32px)", borderRadius: scrolled ? "0" : "12px", margin: scrolled ? "0" : "0 16px" }}>
                <Logo />
                <div className="flex justify-center items-center gap-x-4">
                    <ModeToggle />
                    <SheetTrigger>
                        <div className="p-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-colors">
                            <svg className="w-7 h-7 dark:text-white" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </SheetTrigger>
                </div>
            </div>
            <SheetContent side="top" className="dark:bg-header/95 bg-white/95 border-b-0 z-[998]">
                <SheetHeader className="flex justify-center items-center"><Logo /><SheetClose /></SheetHeader>
                <SheetDescription className="flex flex-col justify-center items-center mx-auto space-y-4 mt-4">
                    {renderLinks()}
                </SheetDescription>
                <SheetFooter className="gap-y-3 mt-6 flex-col"><AuthButtons full /></SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default Header;
