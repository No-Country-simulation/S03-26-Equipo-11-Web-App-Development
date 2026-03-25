import type { ReactNode } from "react";
import Navbar from "@/pages/Landing/components/Navbar";
import Footer from "@/pages/Landing/components/Footer";

interface AuthShellProps {
  children: ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 bg-[linear-gradient(180deg,rgba(232,243,236,0.6)_0%,rgba(243,247,251,1)_45%,rgba(248,250,252,1)_100%)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
