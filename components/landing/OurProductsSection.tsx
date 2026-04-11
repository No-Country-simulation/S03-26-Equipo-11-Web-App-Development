"use client";

import { Users, GitBranch, MessageCircle, Zap, BarChart3, Download } from "lucide-react";

const products = [
  {
    icon: Users,
    title: "Gestión de Clientes",
    description: "Segmenta por estado, tags y categorías. Perfilado 360 con historial completo de interacciones.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: GitBranch,
    title: "Seguimiento de Ventas",
    description: "Pipeline visual con estados personalizables para no perder ni una oportunidad.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Omnicanalidad",
    description: "WhatsApp + Email + SMS en un solo lugar. Conecta donde tus clientes prefieran.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Zap,
    title: "Automatización",
    description: "Recordatorios automáticos y secuencias. Reglas de negocio inteligentes.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Analítica",
    description: "KPIs en tiempo real y gráficos. Datos que permiten decisiones basadas en evidencia.",
    color: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Download,
    title: "Exportación",
    description: "Reportes en CSV y PDF. Exporta tus datos cuando y como los necesites.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
];

export default function OurProductsSection() {
  return (
    <section id="productos" className="bg-white py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-slate-900 mb-4">
            NUESTROS PRODUCTOS
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Herramientas diseñadas para cada etapa de tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
              >
                <div className={`${product.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${product.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                <button className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Ver más
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
