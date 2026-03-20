import { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  reminders as initialReminders,
  contacts,
  type Reminder,
  type ReminderPriority,
  type ReminderStatus,
  type ReminderNotification,
} from "@/data/mockData";
import ReminderCard from "@/components/reminders/ReminderCard";
import NotificationConfigurator from "@/components/reminders/NotificationConfigurator";

const statusFilters: { value: ReminderStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "overdue", label: "Vencido" },
  { value: "completed", label: "Completado" },
];

export default function Reminders() {
  const [remindersList, setRemindersList] = useState<Reminder[]>(initialReminders);
  const [filter, setFilter] = useState<ReminderStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPriority, setNewPriority] = useState<ReminderPriority>("medium");
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState("10:00");
  const [newNotifications, setNewNotifications] = useState<ReminderNotification[]>([
    { channel: "email", minutesBefore: 60, target: "both" },
    { channel: "whatsapp", minutesBefore: 15, target: "contact" },
    { channel: "internal", minutesBefore: 5, target: "user" },
  ]);

  const toggleReminder = (id: string) => {
    setRemindersList((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "completed" ? "pending" : "completed" }
          : r
      )
    );
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewContact("");
    setNewPriority("medium");
    setNewDate(undefined);
    setNewTime("10:00");
    setNewNotifications([
      { channel: "email", minutesBefore: 60, target: "both" },
      { channel: "whatsapp", minutesBefore: 15, target: "contact" },
      { channel: "internal", minutesBefore: 5, target: "user" },
    ]);
  };

  const addReminder = () => {
    if (!newTitle || !newDate || !newContact) return;
    const reminder: Reminder = {
      id: `r${Date.now()}`,
      contactId: newContact,
      title: newTitle,
      description: newDesc || undefined,
      dueDate: format(newDate, "yyyy-MM-dd"),
      dueTime: newTime || undefined,
      priority: newPriority,
      status: "pending",
      notifications: newNotifications,
      createdAt: format(new Date(), "yyyy-MM-dd"),
    };
    setRemindersList((prev) => [reminder, ...prev]);
    resetForm();
    setDialogOpen(false);

    const contact = contacts.find((c) => c.id === newContact);
    const channelSummary = newNotifications.map((n) => n.channel).join(", ");
    toast.success("Recordatorio creado", {
      description: `${contact?.name} — Notificaciones: ${channelSummary || "ninguna"}`,
    });
  };

  const filtered = remindersList.filter((r) => filter === "all" || r.status === filter);
  const pendingCount = remindersList.filter((r) => r.status === "pending").length;
  const overdueCount = remindersList.filter((r) => r.status === "overdue").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recordatorios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pendingCount} pendientes · {overdueCount} vencidos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo recordatorio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear recordatorio</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input
                placeholder="Título del recordatorio"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Descripción (opcional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
              />
              <Select value={newContact} onValueChange={setNewContact}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contacto" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Select value={newPriority} onValueChange={(v) => setNewPriority(v as ReminderPriority)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Baja</SelectItem>
                    <SelectItem value="medium">🟡 Media</SelectItem>
                    <SelectItem value="high">🔴 Alta</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("flex-1 justify-start text-left font-normal", !newDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {newDate ? format(newDate, "d MMM yyyy", { locale: es }) : "Fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newDate}
                      onSelect={setNewDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Hora</label>
                <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-32" />
              </div>

              {/* Notification configurator */}
              <NotificationConfigurator
                notifications={newNotifications}
                onChange={setNewNotifications}
              />

              <Button className="w-full" onClick={addReminder} disabled={!newTitle || !newDate || !newContact}>
                Guardar recordatorio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {statusFilters.map((s) => (
          <Button
            key={s.value}
            variant={filter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((r) => (
          <ReminderCard key={r.id} reminder={r} onToggle={toggleReminder} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No hay recordatorios en esta categoría
          </div>
        )}
      </div>
    </div>
  );
}
