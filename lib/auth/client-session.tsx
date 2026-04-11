"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SessionCheck {
  user: { id: string; email: string; name: string; role: string } | null;
}

export function useSession() {
  const [session, setSession] = useState<SessionCheck["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/get-session", { method: "GET" })
      .then((res) => res.json())
      .then((data: SessionCheck) => {
        setSession(data.user);
      })
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  return { session, loading };
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallback: React.ReactNode = null
) {
  return function ProtectedComponent(props: P) {
    const { session, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !session) {
        router.push("/login");
      }
    }, [session, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (!session) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}