import { Wallet } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 relative z-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 gap-6">
        <div className="flex items-center space-x-2">
          <span className="size-8 rounded-lg bg-emerald-500 grid place-items-center"><Wallet className="h-5 w-5 text-white" /></span>
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-50">FinControl</span>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 w-full md:w-auto">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-50">Produto</h4>
            <nav className="flex flex-col space-y-1">
              <a className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" href="#features">Recursos</a>
              <a className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" href="#pricing">Preços</a>
              <a className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" href="#faq">FAQ</a>
            </nav>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-50">Conta</h4>
            <nav className="flex flex-col space-y-1">
              <Link className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" to="/login">Entrar</Link>
              <Link className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" to="/login" search={{ mode: "signup" }}>Criar conta</Link>
              <Link className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" to="/app">Painel</Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-50">Contato</h4>
            <nav className="flex flex-col space-y-1">
              <Link className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors" to="/contact">Fale conosco</Link>
              <span className="text-sm text-gray-500 dark:text-gray-500">© 2026 FinControl</span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
