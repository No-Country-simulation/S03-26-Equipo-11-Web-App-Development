import { Plus, X, Mail, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReminderNotification, NotificationChannel } from "@/data/mockData";

const channelOptions: { value: NotificationChannel; label: string; icon: typeof Mail }[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "internal", label: "Interna", icon: Bell },
];

const timingOptions = [
  { value: "5", label: "5 min antes" },
  { value: "15", label: "15 min antes" },
  { value: "30", label: "30 min antes" },
  { value: "60", label: "1 hora antes" },
  { value: "120", label: "2 horas antes" },
  { value: "1440", label: "1 día antes" },
];

const targetOptions = [
  { value: "user", label: "Solo tú" },
  { value: "contact", label: "Solo contacto" },
  { value: "both", label: "Ambos" },
];

interface Props {
  notifications: ReminderNotification[];
  onChange: (notifications: ReminderNotification[]) => void;
}

export default function NotificationConfigurator({ notifications, onChange }: Props) {
  const addNotification = () => {
    onChange([...notifications, { channel: "email", minutesBefore: 60, target: "both" }]);
  };

  const removeNotification = (index: number) => {
    onChange(notifications.filter((_, i) => i !== index));
  };

  const updateNotification = (index: number, patch: Partial<ReminderNotification>) => {
    onChange(notifications.map((n, i) => (i === index ? { ...n, ...patch } : n)));
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Notificaciones automáticas</p>
      {notifications.map((n, i) => {
        const ChannelIcon = channelOptions.find((c) => c.value === n.channel)?.icon || Mail;
        return (
          <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
            <Select
              value={n.channel}
              onValueChange={(v) => updateNotification(i, { channel: v as NotificationChannel })}
            >
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <div className="flex items-center gap-1.5">
                  <ChannelIcon className="w-3 h-3" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    <span className="flex items-center gap-1.5">
                      <o.icon className="w-3 h-3" /> {o.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(n.minutesBefore)}
              onValueChange={(v) => updateNotification(i, { minutesBefore: Number(v) })}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timingOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={n.target}
              onValueChange={(v) => updateNotification(i, { target: v as "user" | "contact" | "both" })}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {targetOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeNotification(i)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      })}
      <Button variant="outline" size="sm" className="w-full text-xs" onClick={addNotification}>
        <Plus className="w-3 h-3 mr-1" /> Agregar notificación
      </Button>
    </div>
  );
}
