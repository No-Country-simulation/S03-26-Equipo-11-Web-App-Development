"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Bell as BellIcon,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Search,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/contacts", icon: Users, label: "Contactos" },
  { href: "/whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { href: "/email", icon: Mail, label: "Email" },
  { href: "/reminders", icon: BellIcon, label: "Recordatorios" },
  { href: "/settings", icon: Settings, label: "Configuracion" },
];

interface SessionUser {
  user: { id: string; email: string; name: string; role: string } | null;
}

function getRoleLabel(role: string): string {
  if (role === "admin") {
    return "Administrador";
  }

  if (role === "agent") {
    return "Agente";
  }

  return "Usuario";
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountPanelOpen, setAccountPanelOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const accountPanelRef = useRef<HTMLDivElement | null>(null);
  const logoutButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/get-session", {
          method: "GET",
          credentials: "include",
        });
        const data: SessionUser = await res.json();

        if (!data.user) {
          router.push("/login");
        } else {
          setSession(data.user);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (!accountPanelOpen) {
      return;
    }

    logoutButtonRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountPanelRef.current?.contains(event.target as Node)) {
        setAccountPanelOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountPanelOpen]);

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Signout error:", e);
    } finally {
      setAccountPanelOpen(false);
      setSigningOut(false);
    }

    setSession(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const displayName = session.name || session.email;
  const roleLabel = getRoleLabel(session.role);
  const userInitials = session.name
    ? session.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : session.email.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-sidebar flex flex-col shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-sidebar-accent-foreground font-semibold text-lg tracking-tight">
              StartupCRM
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="relative" ref={accountPanelRef}>
            <button
              type="button"
              aria-expanded={accountPanelOpen}
              aria-haspopup="dialog"
              aria-controls="account-panel"
              onClick={() => setAccountPanelOpen((open) => !open)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-primary ${
                accountPanelOpen
                  ? "border-sidebar-accent bg-sidebar-accent text-sidebar-primary"
                  : "border-sidebar-border/80 bg-transparent text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  accountPanelOpen
                    ? "bg-sidebar text-sidebar-primary"
                    : "bg-sidebar-accent text-sidebar-accent-foreground"
                }`}
              >
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    accountPanelOpen ? "text-sidebar-accent-foreground" : "text-sidebar-foreground"
                  }`}
                >
                  {displayName}
                </p>
                <p
                  className={`truncate text-xs ${
                    accountPanelOpen ? "text-sidebar-primary" : "text-sidebar-foreground/55"
                  }`}
                >
                  {roleLabel}
                </p>
              </div>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${
                  accountPanelOpen ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                } ${
                  accountPanelOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            {accountPanelOpen ? (
              <div
                id="account-panel"
                role="dialog"
                aria-label="Panel de cuenta"
                className="absolute bottom-full left-0 z-30 mb-3 w-full rounded-2xl border border-sidebar-border bg-card p-3 shadow-2xl"
              >
                <div className="mb-3 flex items-start gap-3 rounded-xl bg-muted/60 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{session.email}</p>
                    <p className="mt-1 inline-flex rounded-full bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
                      {roleLabel}
                    </p>
                  </div>
                </div>

                <button
                  ref={logoutButtonRef}
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center justify-between rounded-xl border border-sidebar-border bg-sidebar-accent px-3 py-2.5 text-sm font-medium text-sidebar-primary transition-all duration-200 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{signingOut ? "Cerrando sesion..." : "Cerrar sesion"}</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-14 border-b bg-card flex items-center justify-between px-6 shrink-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Buscar contactos, conversaciones..."
              className="w-full pl-9 h-9 bg-secondary border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-muted rounded-md transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-auto p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
