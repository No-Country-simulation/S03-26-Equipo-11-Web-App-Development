import { CheckCircle2, Clock, AlertTriangle, Mail, MessageCircle, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  contacts,
  priorityLabels,
  priorityColors,
  type Reminder,
  type ReminderStatus,
  type NotificationChannel,
} from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const statusConfig: Record<ReminderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pendiente", icon: Clock, className: "text-funnel-contacted" },
  completed: { label: "Completado", icon: CheckCircle2, className: "text-primary" },
  overdue: { label: "Vencido", icon: AlertTriangle, className: "text-destructive" },
};

const channelIcons: Record<NotificationChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  internal: Bell,
};

const channelLabels: Record<NotificationChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  internal: "Notificación interna",
};

const targetLabels: Record<string, string> = {
  user: "→ Tú",
  contact: "→ Contacto",
  both: "→ Ambos",
};

function formatMinutes(min: number) {
  if (min >= 60) return `${min / 60}h antes`;
  return `${min}min antes`;
}

export default function ReminderCard({
  reminder,
  onToggle,
}: {
  reminder: Reminder;
  onToggle: (id: string) => void;
}) {
  const contact = contacts.find((c) => c.id === reminder.contactId);
  const statusInfo = statusConfig[reminder.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-4 flex items-start gap-4 transition-all hover:shadow-md",
        reminder.status === "completed" && "opacity-60"
      )}
    >
      <button
        onClick={() => onToggle(reminder.id)}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          reminder.status === "completed"
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        {reminder.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm", reminder.status === "completed" && "line-through")}>
          {reminder.title}
        </p>
        {reminder.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {contact && (
            <span className="text-xs text-muted-foreground">👤 {contact.name}</span>
          )}
          <span className={cn("flex items-center gap-1 text-xs", statusInfo.className)}>
            <StatusIcon className="w-3 h-3" />
            {format(new Date(reminder.dueDate), "d MMM yyyy", { locale: es })}
            {reminder.dueTime && ` · ${reminder.dueTime}`}
          </span>
          <span className={cn("funnel-badge text-[10px]", priorityColors[reminder.priority])}>
            {priorityLabels[reminder.priority]}
          </span>
        </div>

        {/* Notification badges */}
        {reminder.notifications.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {reminder.notifications.map((n, i) => {
              const Icon = channelIcons[n.channel];
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                        n.sent
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {formatMinutes(n.minutesBefore)}
                      {n.sent && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {channelLabels[n.channel]} · {formatMinutes(n.minutesBefore)} · {targetLabels[n.target]}
                    {n.sent && " ✓ Enviado"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
