import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/landing/7fe956e266f7c9fa0da474f277145fd645bcf301.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "login") {
      navigate("/login");
      setIsMobileMenuOpen(false);
      return;
    }

    if (sectionId === "register") {
      navigate("/register");
      setIsMobileMenuOpen(false);
      return;
    }

    if (sectionId === "inicio") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      setIsMobileMenuOpen(false);
      return;
    }

    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-[69px] items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src={logoImg}
              alt="Lácteos Fresh"
              className="h-10 w-14 object-contain md:h-14 md:w-21"
            />
            <h1 className="hidden text-base font-semibold text-foreground sm:block md:text-lg">
              StartUp CRM
            </h1>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("productos")}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Contacto
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              FAQ
            </button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/register")} className="hidden sm:flex">
              Registrarse
            </Button>

            <button className="p-2 lg:hidden" onClick={() => setIsMobileMenuOpen((open) => !open)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="mt-2 border-t border-border pb-4 pt-4 lg:hidden">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("productos")}
                className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Productos
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Contacto
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                FAQ
              </button>
              <Button variant="ghost" className="justify-start" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")} className="w-full">
                Registrarse
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
