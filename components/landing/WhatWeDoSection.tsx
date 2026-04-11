"use client";

import { Users, MessageCircle, Zap, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestión integral",
    description: "Centraliza toda la información de tus prospectos en un solo lugar con campos personalizados.",
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: MessageCircle,
    title: "Omnicanalidad",
    description: "Interactúa vía WhatsApp, Email y SMS desde una consola unificada y fluida.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Zap,
    title: "Automatización",
    description: "Crea flujos de trabajo inteligentes que cierren ventas mientras tú te enfocas en crecer.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Analítica Real",
    description: "Datos en tiempo real que permiten tomar decisiones basadas en evidencia, no intuición.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export default function WhatWeDoSection() {
  return (
    <section id="que-hacemos" className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-slate-900 mb-4">
            ¿QUE HACEMOS?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ayudamos a empresas a gestionar sus clientes de forma inteligente.
            Centraliza conversaciones, automatiza seguimientos y aumenta ventas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
