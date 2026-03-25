import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ContactCards from "./components/ContactCards";
import ProductCards from "./components/ProductCards";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.hash.replace("#", "");

    if (!sectionId) {
      return;
    }

    const timer = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ContactCards />
        <ProductCards />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
