"use client";

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 27 27">
          <path
            d="M13.5 0C6.05625 0 0 6.05625 0 13.5C0 20.9438 6.05625 27 13.5 27C20.9438 27 27 20.9438 27 13.5C27 6.05625 20.9438 0 13.5 0ZM13.5 5.0625C15.6938 5.0625 17.4375 6.80625 17.4375 9C17.4375 11.1938 15.6938 12.9375 13.5 12.9375C11.3062 12.9375 9.5625 11.1938 9.5625 9C9.5625 6.80625 11.3062 5.0625 13.5 5.0625ZM13.5 24.1875C10.125 24.1875 7.03125 22.5 5.0625 19.8562C6.73125 17.8875 9.16875 16.875 13.5 16.875C17.8312 16.875 20.2687 17.8875 21.9375 19.8562C19.9687 22.5 16.875 24.1875 13.5 24.1875Z"
            fill="#10B981"
          />
        </svg>
      ),
      title: "Gestión integral",
      description: "Centraliza toda la información de tus prospectos en un solo lugar con campos personalizados."
    },
    {
      icon: (
        <svg className="w-9 h-9" fill="none" viewBox="0 0 36 34.5">
          <path
            d="M34.5 0H1.5C0.671875 0 0 0.671875 0 1.5V4.5C0 5.32812 0.671875 6 1.5 6H34.5C35.3281 6 36 5.32812 36 4.5V1.5C36 0.671875 35.3281 0 34.5 0ZM34.5 12H1.5C0.671875 12 0 12.6719 0 13.5V16.5C0 17.3281 0.671875 18 1.5 18H34.5C35.3281 18 36 17.3281 36 16.5V13.5C36 12.6719 35.3281 12 34.5 12ZM34.5 24H1.5C0.671875 24 0 24.6719 0 25.5V28.5C0 29.3281 0.671875 30 1.5 30H34.5C35.3281 30 36 29.3281 36 28.5V25.5C36 24.6719 35.3281 24 34.5 24Z"
            fill="#10B981"
          />
        </svg>
      ),
      title: "Omnicanalidad",
      description: "Interactúa vía WhatsApp, Email y SMS desde una consola unificada y fluida."
    },
    {
      icon: (
        <svg className="w-6 h-8" fill="none" viewBox="0 0 24 30">
          <path
            d="M12 0C5.37188 0 0 5.37188 0 12C0 18.6281 5.37188 24 12 24C12.8281 24 13.5 23.3281 13.5 22.5V20.7187C13.5 20.3906 13.3594 20.0625 13.125 19.8281C12.8906 19.5938 12.5625 19.5 12.2344 19.5C9.89062 19.5 7.96875 17.5781 7.96875 15.2344C7.96875 12.8906 9.89062 10.9687 12.2344 10.9687H13.5V9C13.5 4.85625 9.64312 1.5 5.53125 1.5C5.34375 1.5 5.20312 1.64062 5.20312 1.82812V3.65625C5.20312 3.84375 5.34375 3.98438 5.53125 3.98438C8.29688 3.98438 10.5 6.1875 10.5 8.95312V22.5C10.5 25.5375 12.9625 28 16 28H22.5C23.3281 28 24 27.3281 24 26.5V12C24 5.37188 18.6281 0 12 0Z"
            fill="#10B981"
          />
        </svg>
      ),
      title: "Automatización",
      description: "Crea flujos de trabajo inteligentes que cierren ventas mientras tú te enfocas en crecer."
    },
    {
      icon: (
        <svg className="w-8 h-7" fill="none" viewBox="0 0 33 25.5">
          <path
            d="M31.5 0H1.5C0.671875 0 0 0.671875 0 1.5V24C0 24.8281 0.671875 25.5 1.5 25.5H31.5C32.3281 25.5 33 24.8281 33 24V1.5C33 0.671875 32.3281 0 31.5 0ZM9 21H4.5V18H9V21ZM9 15H4.5V12H9V15ZM9 9H4.5V6H9V9ZM21 21H12V18H21V21ZM21 15H12V12H21V15ZM21 9H12V6H21V9ZM28.5 21H24V18H28.5V21ZM28.5 15H24V12H28.5V15ZM28.5 9H24V6H28.5V9Z"
            fill="#10B981"
          />
        </svg>
      ),
      title: "Analítica Real",
      description: "Datos en tiempo real que permiten tomar decisiones basadas en evidencia, no intuición."
    }
  ];

  return (
    <section id="features" className="bg-[#f2f4f6] py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#191c1e] tracking-tight mb-4">
            ¿Qué hacemos?
          </h2>
          <div
            className="h-1.5 w-24 rounded-full"
            style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 108, 73) 0%, rgb(16, 185, 129) 100%)" }}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-[#191c1e] mb-4">
                {feature.title}
              </h3>

              <p className="text-[#3c4a42] text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
