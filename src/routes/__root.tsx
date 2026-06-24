import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import Header from "@/components/base/Header";
import Footer from "@/components/base/Footer";
import Stars from "@/components/base/Stars";
import { useTheme } from "@/context/themeContext";
import { useState, useEffect } from "react";

// Rotas que NÃO mostram a navbar/footer do site (painel e autenticação)
const BARE_PREFIXES = ["/app", "/login", "/register", "/forgot-password", "/two-factor-auth"];

const RootComponent = () => {
  const theme = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
  const [starColor, setStarColor] = useState<string>(theme.theme === "dark" ? "#fff" : "#348AC7");

  useEffect(() => {
    setStarColor(theme.theme === "dark" ? "#fff" : "#348AC7");
  }, [theme.theme]);

  if (bare) {
    // painel/login: sem chrome do site
    return <Outlet />;
  }

  return (
    <>
      <div className="absolute inset-0 z-0">
        <Stars color={starColor} />
      </div>
      <Header />
      <div className="relative z-10">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent
})
