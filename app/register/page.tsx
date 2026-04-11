"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });
  const [isNameValid, setIsNameValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.password) {
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      return;
    }

    if (formData.password.length < 1) {
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.nombre,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({ ...formData, nombre: value });
    setIsNameValid(value.length >= 3);
    setShowError(false);
  };

  const isNameValidLocal = formData.nombre.length >= 3;
  const isEmailValid = formData.email.length > 0 && EMAIL_REGEX.test(formData.email);
  const isPasswordValid = formData.password.length >= 1;
  const isFormValid = isNameValidLocal && isEmailValid && isPasswordValid;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4fa]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-[448px] p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="font-extrabold text-[#1e2a3b] text-xl md:text-2xl leading-8 mb-2">
              Crear una cuenta
            </h1>
            <p className="font-normal text-[#6b7280] text-sm md:text-base leading-6">
              Únete al sistema hoy mismo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block font-semibold text-[#2b3a57] text-sm leading-5 mb-2">
                Nombre
              </label>
              <div className="relative">
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-[#222] text-sm md:text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#4e8b2f] focus:border-transparent transition-all pr-12"
                  placeholder="Ingresar Nombres"
                />
                {isNameValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <g clipPath="url(#clip0_5_244)">
                        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.5 11.5L3 8L4.06 6.94L6.5 9.38L11.94 3.94L13 5L6.5 11.5Z" fill="#22C55E" />
                      </g>
                      <defs>
                        <clipPath id="clip0_5_244">
                          <rect fill="white" height="16" width="16" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold text-[#2b3a57] text-sm leading-5 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setShowError(false);
                    setEmailError(false);
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val.length > 0 && !EMAIL_REGEX.test(val)) {
                      setEmailError(true);
                    }
                  }}
                  className={`w-full bg-white border rounded-md px-3 py-2.5 text-[#222] text-sm md:text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#4e8b2f] focus:border-transparent transition-all pr-12 ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {isEmailValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <g clipPath="url(#clip0_email_ok)">
                        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.5 11.5L3 8L4.06 6.94L6.5 9.38L11.94 3.94L13 5L6.5 11.5Z" fill="#22C55E" />
                      </g>
                      <defs>
                        <clipPath id="clip0_email_ok">
                          <rect fill="white" height="16" width="16" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-[13px] leading-5 mt-1">
                  Email inválido
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block font-semibold text-[#2b3a57] text-sm leading-5 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setShowError(false);
                }}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-[#222] text-sm md:text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#4e8b2f] focus:border-transparent transition-all"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full font-normal text-sm md:text-base leading-6 py-2.5 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e8449] focus:ring-offset-2 flex items-center justify-center gap-2 ${
                isFormValid 
                  ? "bg-[#1e8449] text-white hover:bg-[#196e3c]" 
                  : "bg-[#e1e7ed] text-[#6b7280] cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 23.7223 23.7223">
                <g clipPath="url(#clip0_5_240)">
                  <path d="M11.8612 3.74463C7.36866 3.74463 3.74463 7.36866 3.74463 11.8612C3.74463 16.3537 7.36866 19.9777 11.8612 19.9777C16.3537 19.9777 19.9777 16.3537 19.9777 11.8612C19.9777 7.36866 16.3537 3.74463 11.8612 3.74463Z" stroke="currentColor" strokeWidth="4" />
                  <path d="M11.8612 7.48926C11.179 7.48926 10.6299 8.03835 10.6299 8.72058V10.6299H8.72058C8.03835 10.6299 7.48926 11.179 7.48926 11.8612C7.48926 12.5434 8.03835 13.0925 8.72058 13.0925H10.6299V15.0018C10.6299 15.684 11.179 16.2331 11.8612 16.2331C12.5434 16.2331 13.0925 15.684 13.0925 15.0018V13.0925H15.0018C15.684 13.0925 16.2331 12.5434 16.2331 11.8612C16.2331 11.179 15.684 10.6299 15.0018 10.6299H13.0925V8.72058C13.0925 8.03835 12.5434 7.48926 11.8612 7.48926Z" fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="clip0_5_240">
                    <rect fill="white" height="23.7223" width="23.7223" />
                  </clipPath>
                </defs>
              </svg>
              {isSubmitting ? "Creando..." : "Crear cuenta"}
            </button>

            {showSuccess && (
              <div className="bg-green-100 border border-green-300 rounded-md p-3 flex items-center gap-3 animate-fadeIn">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.5 11.5L3 8L4.06 6.94L6.5 9.38L11.94 3.94L13 5L6.5 11.5Z" fill="#22C55E" />
                </svg>
                <p className="font-semibold text-green-600 text-sm md:text-base leading-6">
                  ¡Cuenta creada exitosamente!
                </p>
              </div>
            )}

            {showError && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 14 14">
                  <g clipPath="url(#clip0_error)">
                    <path d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM7 12.6875C3.85937 12.6875 1.3125 10.1406 1.3125 7C1.3125 3.85937 3.85937 1.3125 7 1.3125C10.1406 1.3125 12.6875 3.85937 12.6875 7C12.6875 10.1406 10.1406 12.6875 7 12.6875Z" fill="#E03E3E" />
                    <path d="M7 3.5C6.63906 3.5 6.34375 3.79531 6.34375 4.15625V7.65625C6.34375 8.01719 6.63906 8.3125 7 8.3125C7.36094 8.3125 7.65625 8.01719 7.65625 7.65625V4.15625C7.65625 3.79531 7.36094 3.5 7 3.5Z" fill="#E03E3E" />
                    <path d="M7 9.1875C6.63906 9.1875 6.34375 9.48281 6.34375 9.84375V10.0625C6.34375 10.4234 6.63906 10.7187 7 10.7187C7.36094 10.7187 7.65625 10.4234 7.65625 10.0625V9.84375C7.65625 9.48281 7.36094 9.1875 7 9.1875Z" fill="#E03E3E" />
                  </g>
                  <defs>
                    <clipPath id="clip0_error">
                      <rect fill="white" height="14" width="14" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-red-500 text-[13px] leading-5">
                  Error al crear la cuenta. Verifica los datos.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs md:text-sm leading-6">
              <button type="button" onClick={() => router.push("/login")} className="text-[#1e2a3b] hover:underline focus:outline-none">
                Iniciar sesión
              </button>
              <span className="text-[#6b7280]">•</span>
              <button type="button" onClick={() => router.push("/")} className="text-[#2b3a87] hover:underline focus:outline-none">
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
