import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Social Media */}
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Términos
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacidad
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contacto
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Lácteos Fresh. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
