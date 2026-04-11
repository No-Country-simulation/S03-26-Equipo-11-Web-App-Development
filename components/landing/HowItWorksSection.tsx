"use client";

import { User, MessageCircle, LayoutDashboard, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: User,
    title: "Cliente",
    description: "Cliente visita web",
    example: "(ej: La Vaquería)",
    number: "1",
    color: "bg-blue-500",
  },
  {
    icon: MessageCircle,
    title: "Contacto",
    description: "Cliente contacta",
    example: "por WA/Email",
    number: "2",
    color: "bg-green-500",
  },
  {
    icon: LayoutDashboard,
    title: "CRM Dashboard",
    description: "Entra al CRM",
    example: "desde cualquier dispositivo",
    number: "3",
    color: "bg-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Gestión Activa",
    description: "Gestiona clientes",
    example: "en tiempo real",
    number: "4",
    color: "bg-emerald-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-slate-900 mb-4">
            CÓMO FUNCIONA: DEL CLIENTE AL CRM
          </h2>
          <p className="text-lg text-slate-600">
            Un flujo simple para gestionar tus clientes
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`${step.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-lg relative`}>
                    <Icon className="w-10 h-10 text-white" />
                    <div className="bg-white rounded-lg px-3 py-1 text-xs font-bold text-slate-400 absolute -mt-2 ml-14">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 text-center">
                    {step.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {step.example}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-slate-300 mx-2 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="font-bold text-xl mb-4">EJEMPLO: LA VAQUERÍA</h3>
            <p className="text-emerald-100 mb-4 leading-relaxed">
              El CRM permite que negocios como La Vaquería gestionen a sus clientes 
              desde un solo lugar. Cuando un cliente contacta por WhatsApp o Email, 
              el vendedor recibe la notificación en el dashboard del CRM y puede 
              gestionar la relación de forma profesional.
            </p>
            <a
              href="https://vaqueria.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <span>vaqueria.vercel.app</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
