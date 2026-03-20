import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-1">Personaliza tu CRM</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="kpi-card space-y-4">
            <h3 className="font-semibold">Perfil de empresa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nombre de empresa</Label>
                <Input defaultValue="Startup Co." />
              </div>
              <div className="space-y-1.5">
                <Label>Email principal</Label>
                <Input defaultValue="contacto@startup.co" />
              </div>
            </div>
            <Button size="sm">Guardar cambios</Button>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="kpi-card space-y-4">
            <h3 className="font-semibold">WhatsApp Cloud API</h3>
            <p className="text-sm text-muted-foreground">Conecta tu cuenta de WhatsApp Business para enviar y recibir mensajes.</p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Token de acceso</Label>
                <Input placeholder="EAAx..." type="password" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number ID</Label>
                <Input placeholder="123456789" />
              </div>
            </div>
            <Button size="sm">Conectar WhatsApp</Button>
          </div>

          <div className="kpi-card space-y-4">
            <h3 className="font-semibold">Email (SMTP / Brevo)</h3>
            <p className="text-sm text-muted-foreground">Configura el envío de correos electrónicos.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Servidor SMTP</Label>
                <Input placeholder="smtp.brevo.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Puerto</Label>
                <Input placeholder="587" />
              </div>
              <div className="space-y-1.5">
                <Label>Usuario</Label>
                <Input placeholder="tu@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Contraseña</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button size="sm">Conectar Email</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="kpi-card space-y-4">
            <h3 className="font-semibold">Preferencias de notificación</h3>
            <div className="space-y-3">
              {[
                "Nuevo lead asignado",
                "Respuesta de WhatsApp",
                "Nuevo email recibido",
                "Recordatorio de seguimiento",
                "Resumen diario de actividad",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-sm">{item}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
