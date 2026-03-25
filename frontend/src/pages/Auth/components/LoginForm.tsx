import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("El email es obligatorio.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Ingresa un email valido.");
      return;
    }

    if (!password.trim()) {
      setError("La contrasena es obligatoria.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  };

  return (
    <section className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hidden pr-6 lg:block">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Acceso CRM</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              Bienvenido de nuevo
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
              Ingresa a tu panel para gestionar contactos, mensajes, recordatorios y el flujo del CRM
              con la misma identidad visual de la landing.
            </p>
          </div>

          <div className="auth-card mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-[24px] font-extrabold leading-8 text-foreground">Bienvenido de nuevo</h2>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                Accede a tu panel de control.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="login-email" className="form-label text-foreground">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  className="form-input border-input px-3 py-2.5 text-foreground focus:ring-ring"
                  placeholder="usuario@correo.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="form-label text-foreground">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  className={`form-input px-3 py-2.5 text-foreground focus:ring-ring ${
                    error ? "border-destructive" : "border-input"
                  }`}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="animate-fadeIn flex items-center gap-2 text-sm text-destructive">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 14 14">
                    <path
                      d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0Z"
                      fill="currentColor"
                      fillOpacity="0.15"
                    />
                    <path
                      d="M7 3.5C6.63906 3.5 6.34375 3.79531 6.34375 4.15625V7.65625C6.34375 8.01719 6.63906 8.3125 7 8.3125C7.36094 8.3125 7.65625 8.01719 7.65625 7.65625V4.15625C7.65625 3.79531 7.36094 3.5 7 3.5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7 9.1875C6.63906 9.1875 6.34375 9.48281 6.34375 9.84375V10.0625C6.34375 10.4234 6.63906 10.7187 7 10.7187C7.36094 10.7187 7.65625 10.4234 7.65625 10.0625V9.84375C7.65625 9.48281 7.36094 9.1875 7 9.1875Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[6px] bg-primary py-3 text-[16px] font-semibold leading-7 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[14px] leading-6">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#2b3a87] transition-colors hover:text-primary hover:underline"
                >
                  Registrarse
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
        </div>
      </div>
    </section>
  );
}
