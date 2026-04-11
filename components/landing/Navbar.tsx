"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push("/#" + sectionId);
      // Wait for navigation to finish before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/logo-scrm.png"
              alt="Startup CRM"
              width={36}
              height={36}
              className="h-9 w-auto"
              style={{ width: "auto", height: "auto" }}
            />            <span className="text-xl font-bold text-[#191c1e] tracking-tight">StartupCRM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("productos")}
              className="text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors"
            >
              Productos
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors"
            >
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-[#191c1e] hover:text-[#10b981] transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold text-white px-6 py-2.5 rounded-xl transition-all hover:shadow-lg"
              style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 108, 73) 0%, rgb(16, 185, 129) 100%)" }}
            >
              Empezar
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-[#191c1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav id="mobile-menu-modern" className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-left text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors py-2"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("productos")}
                className="text-left text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors py-2"
              >
                Productos
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors py-2"
              >
                FAQ
              </button>
              <Link
                href="/login"
                className="text-left text-sm font-medium text-[#3c4a42] hover:text-[#10b981] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
