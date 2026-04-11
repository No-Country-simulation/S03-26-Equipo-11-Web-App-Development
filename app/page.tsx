"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeDoSection from "@/components/landing/WhatWeDoSection";
import OurClientsSection from "@/components/landing/OurClientsSection";
import OurProductsSection from "@/components/landing/OurProductsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <div id="inicio">
          <HeroSection />
        </div>

        <div id="que-hacemos">
          <WhatWeDoSection />
        </div>

        <div id="clientes">
          <OurClientsSection />
        </div>

        <div id="productos">
          <OurProductsSection />
        </div>

        <div id="como-funciona">
          <HowItWorksSection />
        </div>

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="faq">
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
