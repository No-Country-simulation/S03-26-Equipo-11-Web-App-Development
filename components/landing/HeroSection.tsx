"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="bg-[#f7f9fb] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex">
              <div className="bg-[rgba(111,251,190,0.2)] px-4 py-1.5 rounded-full">
                <p className="text-[#006c49] text-xs font-bold tracking-wider uppercase">
                  EL FUTURO DE LAS VENTAS
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#191c1e] leading-tight tracking-tight">
                🏢 CRM
                <br />
                PROFESIONAL
                <br />
                PARA TU
                <br />
                NEGOCIO
              </h1>
            </div>

            <div className="max-w-[540px]">
              <p className="text-[#3c4a42] text-lg md:text-xl leading-relaxed">
                Gestiona clientes, ventas y relaciones de forma inteligente.
                Transforma tus datos en una narrativa de crecimiento
                sostenible.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 108, 73) 0%, rgb(16, 185, 129) 100%)" }}
              >
                🚀 COMENZAR AHORA
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-[#e6e8ea] text-[#191c1e] font-bold text-lg hover:bg-[#d4d6d8] transition-all"
              >
                Ver Demo
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-20 -top-16 w-96 h-96 bg-[rgba(16,185,129,0.1)] rounded-full blur-3xl" />

            <div className="relative transform rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100">
                <div className="rounded-xl overflow-hidden shadow-inner">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Dashboard Preview"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 max-w-[280px] transform -rotate-2 transition-transform hover:rotate-0 duration-300 hidden md:block">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="bg-[#d1fae5] rounded-xl p-2.5 flex items-center justify-center w-10 h-10">
                    <svg className="w-5 h-3" fill="none" viewBox="0 0 20 12">
                      <path
                        d="M19.375 0.625H17.125V11.375H19.375V0.625ZM13 0.625H10.75V11.375H13V0.625ZM6.625 0.625H4.375V11.375H6.625V0.625ZM0.25 0.625V11.375H2.5V0.625H0.25Z"
                        fill="#059669"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] text-xs font-bold uppercase tracking-wide">
                      Ventas Mensuales
                    </p>
                    <p className="text-[#064e3b] text-xl font-bold">
                      +24.8%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full w-[78%] bg-[#10b981] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
