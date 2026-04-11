"use client";

import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿En qué se diferencia de otros CRM?",
      answer: "Nuestro CRM combina simplicidad con potencia. Diseñado específicamente para startups y pequeñas empresas, ofrece automatización inteligente sin la complejidad de sistemas empresariales costosos."
    },
    {
      question: "¿Cuánto tiempo toma implementarlo?",
      answer: "La mayoría de nuestros clientes están operando completamente en menos de 48 horas. Ofrecemos migración asistida de datos y capacitación personalizada para tu equipo."
    },
    {
      question: "¿Trabaja con mi stack existente?",
      answer: "Sí, nos integramos con las herramientas que ya usas: Slack, Google Workspace, Microsoft 365, Zapier y más de 50 plataformas populares mediante API REST documentada."
    },
    {
      question: "¿Cuántos canales puedo conectar?",
      answer: "Canales ilimitados. Conecta WhatsApp, Email, SMS, Facebook Messenger, Instagram DMs y más. Todos gestionados desde una sola interfaz unificada."
    }
  ];

  return (
    <section id="faq" className="bg-white py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-[#3c4a42] text-lg md:text-xl max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre nuestro CRM
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-[#f7f9fb] rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? "shadow-lg" : "shadow-sm hover:shadow-md"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg md:text-xl font-bold text-[#191c1e] pr-4 group-hover:text-[#10b981] transition-colors">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                  <svg className="w-6 h-6 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 md:px-8 pb-5 md:pb-6">
                  <p className="text-[#3c4a42] text-base md:text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
