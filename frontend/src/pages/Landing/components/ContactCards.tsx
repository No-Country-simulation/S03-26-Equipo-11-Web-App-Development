import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import whatsAppIcon from "@/assets/landing/376416a2b7b8002d88e9a9b99ec6ed6a6a6b2c4d.png";
import qrBackground from "@/assets/landing/572e3538ab6ac834a82be39435a6848d71bedbf0.png";
import qrCode from "@/assets/landing/8a57fe02bc9d7ef06678d06e9cd1e9bbab958560.png";

export default function ContactCards() {
  const [emailData, setEmailData] = useState({ email: "", subject: "", message: "" });
  const [smsData, setSmsData] = useState({ phone: "", message: "" });
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isSmsLoading, setIsSmsLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!emailData.email || !emailData.subject || !emailData.message) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    setIsEmailLoading(true);
    try {
      const response = await fetch("/api/mensajes/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      if (response.ok) {
        toast.success("Email enviado correctamente");
        setEmailData({ email: "", subject: "", message: "" });
      } else {
        toast.error("Error al enviar email");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSmsSubmit = async () => {
    if (!smsData.phone || !smsData.message) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    setIsSmsLoading(true);
    try {
      const response = await fetch("/api/mensajes/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smsData),
      });
      if (response.ok) {
        toast.success("SMS enviado correctamente");
        setSmsData({ phone: "", message: "" });
      } else {
        toast.error("Error al enviar SMS");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsSmsLoading(false);
    }
  };

  const handleWhatsAppOpen = () => {
    window.open("https://wa.me/", "_blank");
  };

  return (
    <section id="contacto" className="bg-muted py-8 md:py-12 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary p-4">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" />
                WHATSAPP
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <img src={qrBackground} alt="QR Background" className="w-[100px] h-[100px] object-contain" />
                  <img src={qrCode} alt="QR Code" className="absolute top-[7px] left-[7px] w-[86px] h-[86px] object-contain" />
                </div>
              </div>
              <Button onClick={handleWhatsAppOpen} className="w-full bg-primary hover:bg-primary/90">
                Escanear
              </Button>
              <Button variant="outline" onClick={handleWhatsAppOpen} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Abrir Chat
              </Button>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#3b82f6] p-4">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                EMAIL
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tu email:</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={emailData.email}
                  onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Asunto:</label>
                <Input
                  type="text"
                  placeholder="Asunto"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Mensaje:</label>
                <Textarea
                  placeholder="Tu mensaje"
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleEmailSubmit}
                disabled={isEmailLoading}
                className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90"
              >
                {isEmailLoading ? "Enviando..." : "ENVIAR"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* SMS Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#64748b] p-4">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Teléfono:</label>
                <Input
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={smsData.phone}
                  onChange={(e) => setSmsData({ ...smsData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Mensaje:</label>
                <Textarea
                  placeholder="Tu mensaje"
                  value={smsData.message}
                  onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleSmsSubmit}
                disabled={isSmsLoading}
                className="w-full bg-[#64748b] hover:bg-[#64748b]/90"
              >
                {isSmsLoading ? "Enviando..." : "ENVIAR"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
