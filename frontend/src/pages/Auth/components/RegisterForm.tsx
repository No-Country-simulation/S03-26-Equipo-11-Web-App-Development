import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("El nombre es obligatorio.");
      setShowSuccess(false);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Ingresa un email valido.");
      setShowSuccess(false);
      return;
    }

    if (password.trim().length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      setShowSuccess(false);
      return;
    }

    setError(null);
    setShowSuccess(true);
    setIsSubmitting(true);

    window.setTimeout(() => {
      navigate("/dashboard");
    }, 700);
  };

  return (
    <section className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="auth-card mx-auto lg:order-2">
            <div className="mb-8 text-center">
              <h2 className="text-[24px] font-extrabold leading-8 text-foreground">Crear una cuenta</h2>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Únete al sistema hoy mismo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="register-name" className="form-label text-foreground">
                  Nombre
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError(null);
                  }}
                  className="form-input border-input px-4 py-2.5 text-foreground focus:ring-ring"
                  placeholder="Ingresar nombres"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="register-email" className="form-label text-foreground">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  className="form-input border-input px-4 py-2.5 text-foreground focus:ring-ring"
                  placeholder="Ingresar email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="form-label text-foreground">
                  Contraseña
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  className={`form-input px-4 py-2.5 text-foreground focus:ring-ring ${
                    error ? "border-destructive" : "border-input"
                  }`}
                  placeholder="********"
                  autoComplete="new-password"
                />
              </div>

              {error ? (
                <div className="animate-fadeIn rounded-[6px] border border-destructive/20 bg-destructive/10 px-3 py-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              {showSuccess ? (
                <div className="animate-fadeIn flex items-center gap-3 rounded-[6px] border border-[#b7e4a3] bg-[#dff6dd] p-3">
                  <svg className="h-4 w-4 flex-shrink-0 text-[#22c55e]" fill="none" viewBox="0 0 16 16">
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM6.5 11.5L3 8L4.06 6.94L6.5 9.38L11.94 3.94L13 5L6.5 11.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="text-sm font-semibold text-[#22c55e]">¡Cuenta creada exitosamente!</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-primary py-2.5 text-[15px] font-medium leading-6 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                {isSubmitting ? "Creando..." : "Crear cuenta"}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-[14px] leading-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-foreground transition-colors hover:text-primary hover:underline"
                >
                  Iniciar sesión
                </button>
                <span className="text-muted-foreground">•</span>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-[#2b3a87] transition-colors hover:text-primary hover:underline"
                >
                  Volver al inicio
                </button>
              </div>
            </form>
          </div>

          <div className="hidden pl-6 lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Registro</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Crea tu acceso y entra al dashboard
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              Completa tus datos básicos para comenzar a gestionar contactos, seguimiento comercial y
              recordatorios dentro del CRM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
