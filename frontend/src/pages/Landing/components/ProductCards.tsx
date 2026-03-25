import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import lecheImg from "@/assets/landing/acc81bbff988a0bb8aebb2bfeff305d348711fa2.png";
import quesoImg from "@/assets/landing/21faecc46307eb7b8ecc73700972b55b026c3df6.png";
import yogurImg from "@/assets/landing/e316173f790551f40d7479af41aa07f3c0ff3308.png";

const products = [
  {
    title: "Leche",
    subtitle: "Fresca y natural",
    image: lecheImg,
    imageAlt: "Leche fresca"
  },
  {
    title: "Quesos",
    subtitle: "Artesanales",
    image: quesoImg,
    imageAlt: "Quesos artesanales"
  },
  {
    title: "Yogur",
    subtitle: "Natural y saludable",
    image: yogurImg,
    imageAlt: "Yogur natural"
  },
];

export default function ProductCards() {
  return (
    <section id="productos" className="py-8 md:py-12 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-2">
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="mx-auto w-full h-32 sm:h-40 object-contain mb-4"
                />
                <CardTitle className="text-lg">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm mb-4">{product.subtitle}</p>
                <Button variant="outline" className="w-full">
                  Ver más
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
