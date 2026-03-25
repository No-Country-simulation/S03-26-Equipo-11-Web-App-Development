import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section id="inicio" className="bg-card border-b border-border py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-extrabold text-xl md:text-2xl lg:text-3xl mb-2">
          <span className="text-foreground">LÁCTEOS FRESCOS </span>
          <span className="text-primary">DIRECTO DEL CAMPO</span>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mb-6">
          Calidad premium, entrega a domicilio en 24 horas
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
            Contáctanos
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}>
            Ver Productos
          </Button>
        </div>
      </div>
    </section>
  );
}
