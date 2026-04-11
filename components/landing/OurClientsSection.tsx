"use client";

import { ArrowRight } from "lucide-react";

const clients = [
  {
    name: "La Vaquería",
    description: "Partner Destacado",
    website: "https://vaqueria.vercel.app",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Financiera Global",
    description: "",
    website: "https://gfmag.com/",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Nova Tech",
    description: "",
    website: "https://nteglobal.com/",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    name: "Eco Market",
    description: "",
    website: "https://www.ecomarketshop.com/",
    gradient: "from-green-400 to-teal-500",
  },
  {
    name: "Urban Space",
    description: "",
    website: "https://urbansportsclub.com/es",
    gradient: "from-orange-500 to-red-500",
  },
];

export default function OurClientsSection() {
  return (
    <section id="clientes" className="bg-white py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-slate-900 mb-4">
            NUESTROS CLIENTES
          </h2>
          <p className="text-lg text-slate-600">
            Empresas que ya confían en nosotros
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
          {clients.map((client, index) => (
            <a
              key={index}
              href={client.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${client.gradient} flex items-center justify-center mb-3`}>
                <span className="text-white font-bold text-xl">
                  {client.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 text-center">
                {client.name}
              </h3>
              {client.description && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {client.description}
                </p>
              )}
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://vaqueria.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            Ver sitio de La Vaquería
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
