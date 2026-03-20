export type FunnelStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: FunnelStage;
  tags: string[];
  lastContact: string;
  avatar?: string;
  notes?: string;
}

export interface WhatsAppMessage {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sent: boolean;
}

export interface EmailMessage {
  id: string;
  contactId: string;
  subject: string;
  body: string;
  timestamp: string;
  sent: boolean;
  read: boolean;
  labels: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export type ReminderPriority = "low" | "medium" | "high";
export type ReminderStatus = "pending" | "completed" | "overdue";
export type NotificationChannel = "email" | "whatsapp" | "internal";

export interface ReminderNotification {
  channel: NotificationChannel;
  minutesBefore: number;
  target: "user" | "contact" | "both";
  sent?: boolean;
}

export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  notifications: ReminderNotification[];
  createdAt: string;
}

export const priorityLabels: Record<ReminderPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export const priorityColors: Record<ReminderPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-funnel-contacted/15 text-funnel-contacted",
  high: "bg-destructive/15 text-destructive",
};

export const reminders: Reminder[] = [
  { id: "r1", contactId: "1", title: "Llamar a María para seguimiento", description: "Revisar propuesta de pricing", dueDate: "2026-03-20", dueTime: "10:00", priority: "high", status: "pending", createdAt: "2026-03-18", notifications: [{ channel: "email", minutesBefore: 60, target: "both" }, { channel: "whatsapp", minutesBefore: 15, target: "contact" }, { channel: "internal", minutesBefore: 5, target: "user" }] },
  { id: "r2", contactId: "2", title: "Enviar contrato a Carlos", dueDate: "2026-03-21", dueTime: "14:00", priority: "medium", status: "pending", createdAt: "2026-03-17", notifications: [{ channel: "email", minutesBefore: 60, target: "contact" }, { channel: "whatsapp", minutesBefore: 15, target: "contact" }] },
  { id: "r3", contactId: "4", title: "Follow-up webinar Roberto", description: "Confirmar asistencia al webinar de AI", dueDate: "2026-03-19", dueTime: "09:00", priority: "low", status: "overdue", createdAt: "2026-03-15", notifications: [{ channel: "internal", minutesBefore: 30, target: "user" }] },
  { id: "r4", contactId: "3", title: "Presentar demo a Ana", dueDate: "2026-03-22", dueTime: "16:00", priority: "high", status: "pending", createdAt: "2026-03-19", notifications: [{ channel: "email", minutesBefore: 60, target: "both" }, { channel: "whatsapp", minutesBefore: 15, target: "both" }] },
  { id: "r5", contactId: "5", title: "Renovación contrato Laura", dueDate: "2026-03-15", priority: "medium", status: "completed", createdAt: "2026-03-10", notifications: [{ channel: "email", minutesBefore: 60, target: "contact", sent: true }] },
  { id: "r6", contactId: "7", title: "Agendar reunión con Sofía", description: "Explorar integración FinTech", dueDate: "2026-03-23", dueTime: "11:30", priority: "medium", status: "pending", createdAt: "2026-03-19", notifications: [{ channel: "email", minutesBefore: 60, target: "both" }, { channel: "whatsapp", minutesBefore: 15, target: "contact" }, { channel: "internal", minutesBefore: 5, target: "user" }] },
];

export const stageLabels: Record<FunnelStage, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};

export const stageColors: Record<FunnelStage, string> = {
  new: "bg-funnel-new/15 text-funnel-new",
  contacted: "bg-funnel-contacted/15 text-funnel-contacted",
  qualified: "bg-funnel-qualified/15 text-funnel-qualified",
  proposal: "bg-funnel-proposal/15 text-funnel-proposal",
  won: "bg-funnel-won/15 text-funnel-won",
  lost: "bg-funnel-lost/15 text-funnel-lost",
};

export const contacts: Contact[] = [
  { id: "1", name: "María García", email: "maria@techstart.io", phone: "+52 55 1234 5678", company: "TechStart", stage: "qualified", tags: ["SaaS", "B2B"], lastContact: "2026-03-18" },
  { id: "2", name: "Carlos López", email: "carlos@innovatech.mx", phone: "+52 33 9876 5432", company: "InnovaTech", stage: "proposal", tags: ["FinTech"], lastContact: "2026-03-17" },
  { id: "3", name: "Ana Martínez", email: "ana@greenlabs.co", phone: "+52 81 5555 1234", company: "GreenLabs", stage: "new", tags: ["CleanTech", "B2C"], lastContact: "2026-03-19" },
  { id: "4", name: "Roberto Sánchez", email: "roberto@datapulse.com", phone: "+52 55 7777 8888", company: "DataPulse", stage: "contacted", tags: ["AI", "Enterprise"], lastContact: "2026-03-16" },
  { id: "5", name: "Laura Hernández", email: "laura@cloudnine.io", phone: "+52 33 2222 3333", company: "CloudNine", stage: "won", tags: ["SaaS"], lastContact: "2026-03-15" },
  { id: "6", name: "Pedro Ruiz", email: "pedro@nexusai.mx", phone: "+52 81 4444 5555", company: "NexusAI", stage: "lost", tags: ["AI"], lastContact: "2026-03-10" },
  { id: "7", name: "Sofía Torres", email: "sofia@finflow.co", phone: "+52 55 6666 7777", company: "FinFlow", stage: "new", tags: ["FinTech", "B2B"], lastContact: "2026-03-19" },
  { id: "8", name: "Diego Morales", email: "diego@healthpro.mx", phone: "+52 33 8888 9999", company: "HealthPro", stage: "contacted", tags: ["HealthTech"], lastContact: "2026-03-18" },
];

export const whatsappMessages: Record<string, WhatsAppMessage[]> = {
  "1": [
    { id: "w1", contactId: "1", text: "Hola María, ¿cómo estás? Te escribo para darle seguimiento a nuestra última reunión.", timestamp: "2026-03-18T10:30:00", sent: true },
    { id: "w2", contactId: "1", text: "¡Hola! Bien, gracias. Sí, justo estaba revisando la propuesta que nos enviaron.", timestamp: "2026-03-18T10:35:00", sent: false },
    { id: "w3", contactId: "1", text: "Perfecto. ¿Tienen alguna duda sobre los términos?", timestamp: "2026-03-18T10:37:00", sent: true },
    { id: "w4", contactId: "1", text: "Nos gustaría agendar una llamada para discutir algunos puntos del pricing.", timestamp: "2026-03-18T10:40:00", sent: false },
  ],
  "2": [
    { id: "w5", contactId: "2", text: "Carlos, buenos días. Le envío el documento actualizado con los nuevos términos.", timestamp: "2026-03-17T09:00:00", sent: true },
    { id: "w6", contactId: "2", text: "Recibido, lo reviso hoy y te confirmo.", timestamp: "2026-03-17T09:15:00", sent: false },
  ],
  "3": [
    { id: "w7", contactId: "3", text: "Hola Ana, soy del equipo de StartupCRM. Nos interesa conocer más sobre GreenLabs.", timestamp: "2026-03-19T14:00:00", sent: true },
  ],
};

export const emailMessages: Record<string, EmailMessage[]> = {
  "1": [
    { id: "e1", contactId: "1", subject: "Propuesta comercial - TechStart", body: "Estimada María, adjunto la propuesta comercial actualizada...", timestamp: "2026-03-18T08:00:00", sent: true, read: true, labels: ["Propuesta"] },
    { id: "e2", contactId: "1", subject: "Re: Propuesta comercial - TechStart", body: "Gracias por enviar la propuesta. La estamos revisando internamente...", timestamp: "2026-03-18T12:00:00", sent: false, read: true, labels: ["Propuesta"] },
  ],
  "2": [
    { id: "e3", contactId: "2", subject: "Seguimiento - Demo InnovaTech", body: "Hola Carlos, ¿pudiste revisar la demo que compartimos la semana pasada?", timestamp: "2026-03-17T10:00:00", sent: true, read: true, labels: ["Seguimiento"] },
  ],
  "4": [
    { id: "e4", contactId: "4", subject: "Invitación a webinar de AI en CRM", body: "Hola Roberto, te invitamos a nuestro próximo webinar sobre inteligencia artificial...", timestamp: "2026-03-16T15:00:00", sent: true, read: false, labels: ["Marketing"] },
  ],
};

export const emailTemplates: EmailTemplate[] = [
  { id: "t1", name: "Primer contacto", subject: "Introducción - {{company}}", body: "Hola {{name}},\n\nSoy del equipo de StartupCRM. Nos encantaría conocer más sobre {{company}} y explorar cómo podemos ayudarles.\n\n¿Tendrías disponibilidad para una breve llamada esta semana?\n\nSaludos cordiales" },
  { id: "t2", name: "Seguimiento", subject: "Seguimiento - {{company}}", body: "Hola {{name}},\n\nQuería darle seguimiento a nuestra última conversación. ¿Han tenido oportunidad de revisar la información que compartimos?\n\nQuedo atento a sus comentarios.\n\nSaludos" },
  { id: "t3", name: "Propuesta", subject: "Propuesta comercial - {{company}}", body: "Estimado/a {{name}},\n\nAdjunto encontrará nuestra propuesta comercial detallada para {{company}}.\n\nQuedamos a su disposición para resolver cualquier duda.\n\nAtentamente" },
];
