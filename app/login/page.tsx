"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setShowError(true);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7fb]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-[448px] p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="font-extrabold text-[#1e2a3b] text-xl md:text-2xl leading-8 mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="font-normal text-[#5f6d7e] text-sm md:text-base leading-6">
              Accede a tu panel de control.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-semibold text-[#2b3a57] text-sm leading-5 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowError(false);
                }}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-[#222] text-sm md:text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#4e8b2f] focus:border-transparent transition-all"
                placeholder="usuario@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold text-[#2b3a57] text-sm leading-5 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowError(false);
                }}
                className={`w-full bg-white border rounded-md px-3 py-2.5 text-[#222] text-sm md:text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#4e8b2f] focus:border-transparent transition-all ${
                  showError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••••"
              />
            </div>

            {showError && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 14 14">
                  <g clipPath="url(#clip0_4_50)">
                    <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM7 12.6875C3.85937 12.6875 1.3125 10.1406 1.3125 7C1.3125 3.85937 3.85937 1.3125 7 1.3125C10.1406 1.3125 12.6875 3.85937 12.6875 7C12.6875 10.1406 10.1406 12.6875 7 12.6875Z" fill="#E03E3E" />
                    <path d="M7 3.5C6.63906 3.5 6.34375 3.79531 6.34375 4.15625V7.65625C6.34375 8.01719 6.63906 8.3125 7 8.3125C7.36094 8.3125 7.65625 8.01719 7.65625 7.65625V4.15625C7.65625 3.79531 7.36094 3.5 7 3.5Z" fill="#E03E3E" />
                    <path d="M7 9.1875C6.63906 9.1875 6.34375 9.48281 6.34375 9.84375V10.0625C6.34375 10.4234 6.63906 10.7187 7 10.7187C7.36094 10.7187 7.65625 10.4234 7.65625 10.0625V9.84375C7.65625 9.48281 7.36094 9.1875 7 9.1875Z" fill="#E03E3E" />
                  </g>
                  <defs>
                    <clipPath id="clip0_4_50">
                      <rect fill="white" height="14" width="14" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-red-500 text-[13px] leading-5">
                  Credenciales incorrectas.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e8449] text-white font-semibold text-base md:text-lg leading-7 py-3 rounded-md hover:bg-[#196e3c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e8449] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm md:text-base leading-6">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-[#2b3a87] hover:underline focus:outline-none"
              >
                Registrarse
              </button>
              <span className="text-[#5f6d7e]">•</span>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-[#2b3a87] hover:underline focus:outline-none"
              >
                Volver al inicio
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
