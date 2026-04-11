"use client";

import { useState } from "react";
import { Plus, Clock, CheckCircle2, AlertTriangle, Mail, MessageCircle, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  reminders as initialReminders,
  contacts,
  priorityLabels,
  priorityColors,
  type Reminder,
  type ReminderPriority,
  type ReminderStatus,
  type NotificationChannel,
} from "@/lib/data/mockData";

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

function formatMinutes(min: number) {
  if (min >= 60) return `${min / 60}h antes`;
  return `${min}min antes`;
}

function ReminderCard({ reminder, onToggle }: { reminder: Reminder; onToggle: (id: string) => void }) {
  const contact = contacts.find((c) => c.id === reminder.contactId);
  const statusInfo = statusConfig[reminder.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className={cn("bg-card rounded-xl border p-4 flex items-start gap-4 transition-all hover:shadow-md", reminder.status === "completed" && "opacity-60")}>
      <button
        onClick={() => onToggle(reminder.id)}
        className={cn("mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", reminder.status === "completed" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 hover:border-primary")}
      >
        {reminder.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm", reminder.status === "completed" && "line-through")}>{reminder.title}</p>
        {reminder.description && <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {contact && <span className="text-xs text-muted-foreground">👤 {contact.name}</span>}
          <span className={cn("flex items-center gap-1 text-xs", statusInfo.className)}>
            <StatusIcon className="w-3 h-3" />
            {format(new Date(reminder.dueDate), "d MMM yyyy", { locale: es })}
            {reminder.dueTime && ` · ${reminder.dueTime}`}
          </span>
          <span className={cn("funnel-badge text-[10px]", priorityColors[reminder.priority])}>
            {priorityLabels[reminder.priority]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {reminder.notifications.map((n, i) => {
            const Icon = channelIcons[n.channel];
            return (
              <span key={i} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border", n.sent ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border")}>
                <Icon className="w-3 h-3" />
                {formatMinutes(n.minutesBefore)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const filterOptions: Array<ReminderStatus | "all"> = ["all", "pending", "overdue", "completed"];

export default function Reminders() {
  const [remindersList, setRemindersList] = useState<Reminder[]>(initialReminders);
  const [filter, setFilter] = useState<ReminderStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newContact, setNewContact] = useState(contacts[0].id);
  const [newPriority, setNewPriority] = useState<ReminderPriority>("medium");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newTime, setNewTime] = useState("10:00");

  const toggleReminder = (id: string) => {
    setRemindersList((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "completed" ? "pending" : "completed" } : r));
  };

  const addReminder = () => {
    if (!newTitle || !newDate || !newContact) return;
    const reminder: Reminder = {
      id: `r${Date.now()}`,
      contactId: newContact,
      title: newTitle,
      description: newDesc || undefined,
      dueDate: newDate,
      dueTime: newTime || undefined,
      priority: newPriority,
      status: "pending",
      notifications: [],
      createdAt: format(new Date(), "yyyy-MM-dd"),
    };
    setRemindersList((prev) => [reminder, ...prev]);
    setDialogOpen(false);
  };

  const filtered = remindersList.filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recordatorios</h1>
          <p className="text-muted-foreground text-sm mt-1">{remindersList.filter(r => r.status !== 'completed').length} pendientes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1.5" /> Nuevo recordatorio</Button>
          </DialogTrigger>
          <DialogContent description="Configura los detalles del nuevo recordatorio">
            <DialogHeader>
              <DialogTitle>Crear recordatorio</DialogTitle>
              <DialogDescription className="sr-only">
                Configura los detalles del nuevo recordatorio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Título" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Textarea placeholder="Descripción" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              <Select value={newContact} onChange={(e) => setNewContact(e.target.value)} options={contacts.map(c => ({ value: c.id, label: c.name }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={newPriority} onChange={(e) => setNewPriority(e.target.value as ReminderPriority)} options={[
                  { value: "low", label: "🟢 Baja" },
                  { value: "medium", label: "🟡 Media" },
                  { value: "high", label: "🔴 Alta" }
                ]} />
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              <Button className="w-full" onClick={addReminder}>Guardar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-1.5">
        {filterOptions.map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((r) => <ReminderCard key={r.id} reminder={r} onToggle={toggleReminder} />)}
      </div>
    </div>
  );
}
