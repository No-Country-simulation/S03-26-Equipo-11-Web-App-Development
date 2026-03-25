import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Entregan a domicilio?",
    answer: "Sí, entregamos en 24-48 horas en toda la ciudad. Contamos con servicio de entrega a domicilio sin costo adicional para pedidos mayores a S/50.",
  },
  {
    question: "¿Los productos son frescos?",
    answer: "Sí, todos nuestros productos son 100% frescos. Trabajamos directamente con productores locales para garantizar la mejor calidad.",
  },
  {
    question: "¿Tienen productos sin lactosa?",
    answer: "Sí, contamos con una línea completa de productos sin lactosa para personas con intolerancia a la lactosa.",
  },
  {
    question: "¿Cuál es el monto mínimo de compra?",
    answer: "El monto mínimo de compra para delivery es de S/30. Para pedidos menores, puede retirar en nuestro punto de venta.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-8 md:py-12 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
